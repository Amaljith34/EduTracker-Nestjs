export const logInfo = (message: string) => console.log(`[INFO] ${message}`);
export const logError = (message: string, trace?: string) =>
  console.error(`[ERROR] ${message}`, trace ?? '');
export const logWarn = (message: string) => console.warn(`[WARN] ${message}`);
export const logDebug = (message: string) => console.debug(`[DEBUG] ${message}`);
