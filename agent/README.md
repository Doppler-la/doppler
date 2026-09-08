# Agente de contenido para X

Propone hilos para la cuenta de X de Doppler 3x/semana. Se aprueban por Telegram.

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
cd agent && npm install
npm test
# seguir agent/playbook.md paso a paso
```
