export function devLog(...args: unknown[]) {
  if (process.env.LOG_LEVEL === 'production') {
    return;
  }
  console.log(...args);
}
