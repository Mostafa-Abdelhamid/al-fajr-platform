export function staggerDelay(index: number, step = 0.05, max = 0.4): string {
  return `${Math.min(index * step, max)}s`;
}
