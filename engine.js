import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic';
import { attachControl } from './policy.js';

// Keep explicit engine references in existing profiles working.
export default class ControlledCompactionEngine extends BasicCompactionEngine {
  constructor(ctx, config = {}) {
    super(ctx, config);
    if (!attachControl(this, () => ctx.get('compactControl'))) {
      ctx.logger.warn('当前 DSH 压缩引擎不支持自定义阈值，继续使用原生压缩配置');
    }
  }
}
