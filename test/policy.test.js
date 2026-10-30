import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attachControl, controlledConfig, validatePercent } from '../policy.js';

const base = Object.freeze({ thresholdRatio: 0.8, retainRatio: 0.16, headroomTokens: 65536, maxTokens: 65536, auto: true, modelPolicies: Object.freeze([]) });

test('all integer slider positions retain a smaller tail and preserve native safety settings', () => {
  for (let percent = 1; percent <= 100; percent++) {
    const config = controlledConfig(base, percent);
    assert.equal(config.thresholdRatio, percent / 100);
    assert.ok(config.retainRatio < config.thresholdRatio);
    assert.equal(config.headroomTokens, 65536);
    assert.equal(config.maxTokens, 65536);
    assert.equal(config.auto, true);
  }
  assert.equal(controlledConfig(base, 80).retainRatio, base.retainRatio);
});

test('reject non-integer and out-of-range values', () => {
  for (const invalid of [0, 101, 1.5, NaN, Infinity, '80', null]) assert.throws(() => validatePercent(invalid), RangeError);
});

test('live changes do not mutate an already captured native policy or frozen base', () => {
  let value = 80;
  let control = { percent: () => value };
  const engine = { config: base };
  attachControl(engine, () => control);
  const before = engine.config;
  value = 42;
  assert.equal(engine.config.thresholdRatio, 0.42);
  assert.equal(before.thresholdRatio, 0.8);
  assert.equal(base.thresholdRatio, 0.8);
  assert.equal(engine.config, engine.config);
  control = undefined;
  assert.equal(engine.config, base);
});

test('model overrides follow global slider while keeping model-specific summary settings', () => {
  const config = controlledConfig({ ...base, modelPolicies: [{ provider: 'local', model: 'x', thresholdRatio: 0.9, retainTokens: 50000, maxTokens: 4096, headroomTokens: 2048 }] }, 5);
  assert.deepEqual(config.modelPolicies[0], { provider: 'local', model: 'x', thresholdRatio: 0.05, retainRatio: 0.01, maxTokens: 4096, headroomTokens: 2048 });
});
