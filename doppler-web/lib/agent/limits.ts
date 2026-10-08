export const MAX_USER_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 1500;
export const MIN_USER_MESSAGES_FOR_BRIEF = 4;
export const WRAP_UP_USER_MESSAGES = 6;
// El tope incluye el pensamiento del modelo y la llamada a submit_brief, que lleva el brief completo.
// Los mensajes del chat se mantienen cortos desde el prompt, no desde este tope.
export const MAX_OUTPUT_TOKENS = 3000;
