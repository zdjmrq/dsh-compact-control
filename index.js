import z from '@deepseek-ai/schemastery';

export const name = 'compact-control';
export const Config = z.object({
  thresholdPercent: z.number().min(1).max(100).step(1).default(80).volatile(),
});

// Loader owns persistence, validation and volatile updates. Engines read the
// provider through their parent context at each native policy resolution.
export function apply(ctx, config) {
  ctx.provide('compactControl', {
    percent: () => config.thresholdPercent.get(),
  });
}
