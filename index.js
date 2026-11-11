import z from '@deepseek-ai/schemastery';
import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic';
import { attachControl } from './policy.js';

export const name = 'compact-control';
export const Config = z.object({
  thresholdPercent: z.number().min(1).max(100).step(1).default(80).volatile(),
});

export function apply(ctx, config) {
  ctx.provide('compactControl', {
    percent: () => config.thresholdPercent.get(),
  });

  function attach(engine) {
    if (!attachControl(engine, () => engine.ctx.get('compactControl'))) {
      ctx.logger.warn('当前 DSH 压缩引擎不支持自定义阈值，继续使用原生压缩配置');
    }
  }

  // Preset engines provide compaction in isolated scopes. Observe those scopes
  // without replacing the engines or the preset definitions.
  ctx.on('internal/service', (name, engine) => {
    if (name === 'compaction' && engine instanceof BasicCompactionEngine) attach(engine);
  }, { global: true });

  // Cover presets that were already mounted when this plugin was enabled.
  for (const fiber of ctx.registry.get(BasicCompactionEngine)?.fibers ?? []) {
    for (const service of fiber.provisions) {
      if (service.name === 'compaction' && service.value instanceof BasicCompactionEngine) {
        attach(service.value);
      }
    }
  }
}
