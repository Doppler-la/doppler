# Agente de contenido para X

Propone hilos para la cuenta de X de Doppler (lun/mié/vie). Se aprueban por Telegram.

La rutina corre **todos los días** (`cron: 0 12 * * *` = 12:00 UTC / 9:00 ART):
cada corrida drena las respuestas de Telegram y publica lo aprobado (si esperara
a la próxima fecha, `getUpdates` ya habría descartado la respuesta a las 24 h).
La redacción de borradores nuevos queda restringida a lun/mié/vie dentro del
`playbook.md`, no en el cron.

- `playbook.md` — qué hace la rutina en cada corrida.
- `voice.md` — tono y ejemplos. Editá esto para ajustar el estilo.
- `sources.json` — fuentes que monitorea. Agregá/sacá acá.
- `ideas.md` — anotá ideas de casos Doppler acá.
- `state/` — estado (lo maneja la rutina, no lo edites a mano).
- `publish.mjs` — publica un hilo en X. `node publish.mjs --dry-run <id>` para probar.
- `state.mjs` — transiciones de estado + dedup.

## Setup

Necesitás estas env vars en la config de la rutina:

- `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
  — de developer.x.com, app con permisos de escritura, tier Free.
- `TELEGRAM_BOT_TOKEN` — de @BotFather.
- `TELEGRAM_CHAT_ID` — de @userinfobot.

## Correr a mano

```bash
cd agent && npm ci   # node_modules está gitignoreado; la nube arranca de un clon limpio
npm test
# seguir agent/playbook.md paso a paso
```
