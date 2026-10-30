import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic';
import { attachControl } from './policy.js';

// Exact-version adapter: no copied pressure loop and no second event listener.
// Native methods capture an immutable policy before their first await.
export default class ControlledCompactionEngine extends BasicCompactionEngine {
  static inject = [...BasicCompactionEngine.inject];
  constructor(ctx, config = {}) {
    super(ctx, config);
    attachControl(this, () => ctx.get('compactControl'));
  }
}
