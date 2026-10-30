export function validatePercent(percent) {
  if (!Number.isInteger(percent) || percent < 1 || percent > 100) {
    throw new RangeError('自动压缩阈值必须是 1 至 100 之间的整数百分比');
  }
  return percent;
}

// Keep the shipped 16% tail at the default threshold. At lower thresholds,
// reduce it to at most one fifth of the requested window fraction, so it
// cannot defeat early compaction. Never mutate the native frozen config.
function withRatio(policy, inherited, ratio) {
  const next = { ...policy, thresholdRatio: ratio };
  const tailRatio = Math.min(policy.retainRatio ?? inherited.retainRatio ?? 0.16, ratio / 5);
  // An explicit absolute tail is converted to a conservative relative tail:
  // an absolute budget cannot be validated against an arbitrary model here.
  delete next.retainTokens;
  next.retainRatio = tailRatio;
  return Object.freeze(next);
}

export function controlledConfig(base, percent) {
  const ratio = validatePercent(percent) / 100;
  return Object.freeze({
    ...withRatio(base, base, ratio),
    modelPolicies: Object.freeze(base.modelPolicies.map(policy => withRatio(policy, base, ratio))),
  });
}

// Read-only policy view. The native engine remains the sole owner of pressure
// measurement, pruning, summary transactions, locking, retries and /compact.
export function attachControl(engine, getControl) {
  const base = engine.config;
  if (!base || !Array.isArray(base.modelPolicies) || !Object.isFrozen(base)) {
    throw new Error('DSH 压缩引擎接口不兼容；此版本支持 DSH 0.2.1-rc.5');
  }
  let lastPercent;
  let resolved;
  Object.defineProperty(engine, 'config', {
    configurable: true,
    enumerable: true,
    get() {
      const control = getControl();
      if (!control) return base;
      const percent = validatePercent(control.percent());
      if (percent !== lastPercent) {
        resolved = controlledConfig(base, percent);
        lastPercent = percent;
      }
      return resolved;
    },
  });
}
