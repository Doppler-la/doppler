# Playbook — corrida del agente de contenido para X

Se ejecuta **todos los días a las 9:00 ART**. Seguí los pasos en orden,
trabajando desde la raíz del repo.

Los pasos 1–4 (traer estado, drenar Telegram, publicar aprobados, avisar
rechazados/podados) corren **siempre**: `getUpdates` de Telegram solo retiene
las respuestas ~24 h, así que hay que drenarlas a diario o se pierden.

El paso 5 en adelante (investigar + redactar + mandar borradores nuevos) corre
**solo los lunes, miércoles y viernes** — ver el chequeo al final del paso 4.

## 1. Traer estado e instalar deps

```bash
git pull --rebase && (cd agent && npm ci)
```

(`agent/node_modules/` está en `.gitignore`; una corrida en la nube arranca de
un clon limpio, por eso el `npm ci`.)

## 2. Leer respuestas de Telegram

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates?offset=$(node -e 'console.log(require("./agent/state/drafts.json").last_telegram_update_id + 1)')"
```

Por cada `callback_query` con `data` tipo `approve:<id>` o `reject:<id>`:
respondé el callback para que Telegram deje de mostrar el "reloj":

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/answerCallbackQuery" -d "callback_query_id=<ID>"
```

Si `answerCallbackQuery` devuelve `query is too old`, ignoralo — no es un paso
fallido, solo significa que el botón se tocó hace rato.

Aplicá los cambios de estado con un script inline (esto ya manda los rechazados
a `history`; el paso 4 es solo el aviso por Telegram):

```bash
node --input-type=module -e '
import { loadState, saveState, applyTelegramUpdates, prunePending, recordRejected } from "./agent/state.mjs";
const updates = JSON.parse(process.env.TG_UPDATES).result;
const s = loadState();
const { approved, rejected } = applyTelegramUpdates(s, updates);
rejected.forEach((id) => recordRejected(s, id));
const pruned = prunePending(s);
saveState(s);
console.log(JSON.stringify({ approved, rejected, pruned }));
'
```

(pasás el JSON de `getUpdates` en `TG_UPDATES`.)

## 3. Publicar los aprobados

Para cada id en `approved` (y cualquier draft que ya estuviera `approved` de
una corrida anterior — mirá `publishableDrafts`):

```bash
node agent/publish.mjs <id>
```

- Exit 0 con un id numérico → publicado. Mandá a Telegram:
  `✅ publicado: https://x.com/<cuenta>/status/<id>`
- Exit 1 con `⚠️ parcial: ...` → se publicaron algunos tweets del hilo y el
  estado ya quedó como publicado (no se reintenta). Reenviá ese mensaje a
  Telegram para completar los tweets que falten a mano.
- Exit 1 sin id / error de red antes del primer tweet → NO cambies el estado
  (el draft sigue `approved`). Mandá a Telegram:
  `⚠️ no pude publicar <id>, reintento la próxima corrida`. Seguí con los demás.

Cuando terminaste de publicar, commiteá el estado ya mismo para no dejar el
árbol sucio (un crash más adelante bloquearía el próximo `git pull --rebase`):

```bash
git add agent/state/ && git commit -m "chore(agent): publicados $(date +%F)" && git push
```

## 4. Avisar podados

Por cada id en `pruned`: mandá a Telegram
`🗑️ descarté el borrador <id> (7 días sin respuesta)`.

(Los rechazados ya pasaron a `history` en el script del paso 2.)

**Chequeo M/M/V:** si hoy NO es lunes, miércoles o viernes, terminá acá — no
hay que redactar borradores nuevos. (El estado ya se commiteó en el paso 3.)

## 5. Investigar fuentes

Leé `agent/sources.json`.

- **RSS**: `fetch` cada url de `rss`, parseá los items (title, link, fecha). Quedate
  con los de los últimos ~4 días.
- **GitHub releases**: para cada `owner/repo`, `fetch https://api.github.com/repos/<owner/repo>/releases/latest`.
  Relevante si salió en los últimos ~4 días.
- **Hacker News**: `fetch "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=<keyword>&numericFilters=points>50"`
  por cada `hn_keywords`.

Descartá cualquier ítem cuyo link o tema ya dé `isTopicSeen(state, {source_url, topic})` true.

Rankeá lo que queda por relevancia para el público de Doppler (gente que construye
software o automatiza procesos en su empresa). Elegí a lo sumo 2 temas tipo (a).

## 6. Revisar backlog de casos

Abrí `agent/ideas.md`. Si hay una idea en "Pendientes" sin usar, tomala para un
borrador tipo (b). Al usarla, movela a la sección "Usadas" con la fecha.

## 7. Redactar 2 borradores

Objetivo: 2 borradores por corrida. Mezcla ideal: 1 tipo (a) + 1 tipo (b) si hay
idea disponible; si no, 2 tipo (a). Si las fuentes no dieron nada relevante, usá
`open_search_topics` con WebSearch como fallback.

Seguí `agent/voice.md` al pie. Cada borrador es un objeto `Draft`:

```json
{
  "id": "2026-09-08-slug-corto",
  "type": "a",
  "topic": "frase corta que identifica el tema (para dedup)",
  "source_url": "https://... (o null para tipo b / búsqueda abierta)",
  "thread": ["1/ ... 🧵", "2/ ...", "3/ ..."],
  "telegram_message_id": null,
  "status": "pending",
  "created_at": "<ISO ahora>"
}
```

Nota: en `thread` NO pongas el `1/` `2/` — el texto es el del tweet tal cual se
publica. La numeración es solo para mostrar en Telegram.

Validá cada hilo antes de seguir:

```bash
node --input-type=module -e '
import { validateThread } from "./agent/publish.mjs";
console.log(validateThread(JSON.parse(process.env.THREAD)));
'
```

Si devuelve errores, reescribí hasta que dé `[]`.

## 8. Mandar a Telegram

Por cada borrador:

```bash
# mensaje 1: el hilo numerado
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  --data-urlencode "chat_id=$TELEGRAM_CHAT_ID" \
  --data-urlencode "text=<formatThread(thread)>"

# mensaje 2: botones
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  --data-urlencode "chat_id=$TELEGRAM_CHAT_ID" \
  --data-urlencode "text=¿Publicar este? (<id>)" \
  --data-urlencode 'reply_markup={"inline_keyboard":[[{"text":"✅ Aprobar","callback_data":"approve:<id>"},{"text":"❌ Rechazar","callback_data":"reject:<id>"}]]}'
```

Guardá el `message_id` del mensaje 2 en el draft (`telegram_message_id`) y agregá
el draft a `state/drafts.json` (`loadState` → push a `s.drafts.drafts` → `saveState`).

## 9. Commit

```bash
git add agent/state/ agent/ideas.md
git commit -m "chore(agent): run $(date +%F) — N borradores propuestos, M publicados"
git push
```

## 10. Resumen

Imprimí: fuentes caídas, temas descartados por dedup, borradores propuestos,
publicados, errores de publicación pendientes de reintento.
