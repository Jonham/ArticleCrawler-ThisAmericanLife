export const SECOND = 1000;
export const MINUTE = SECOND * 60;

export function throttleLogger(logConfig?: {
  timeout?: number;
  skip?: (...params) => boolean;
}) {
  let lastLogAt = 0;
  const { timeout, skip } = logConfig || {};
  return (...params: any[]) => {
    if (skip) {
      if (skip(...params)) return;
    } else if (timeout != null) {
      const now = Date.now();
      const delta = now - lastLogAt;
      if (delta < timeout) return;
      lastLogAt = now;
    }

    console.log(...params);
  };
}
