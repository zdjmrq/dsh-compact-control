import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Context } from '@deepseek-ai/cordis';
import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic';
import ControlledCompactionEngine from '../engine.js';
import { apply } from '../index.js';

function fixture(percent = 80) {
  let current = percent;
  let total = 0;
  let pruned = false;
  const ctx = new Context();
  ctx.provide('llm', { resolveModelInfo: async () => ({ context: { contextWindow: 1000000 }, defaultMaxTokens: 32000 }) });
  ctx.provide('sessions', {});
  ctx.provide('tokenMeter', { measure: () => ({ totalTokens: total, nodes: [] }) });
  apply(ctx, { thresholdPercent: { get: () => current } });
  const engine = new ControlledCompactionEngine(ctx, { auto: false });
  const session = { seq: 0, requestHeader: () => ({ config: { provider: 'test', model: 'model', maxTokens: 32000 } }), surface: { nodes: [] }, eventAt: () => undefined };
  const agent = { session, options: {} };
  ctx.provide('toolResultPruner', { pruneSession: () => { pruned = true; total = 0; } });
  return { ctx, engine, agent, setPercent: v => { current = v; }, setTotal: v => { total = v; pruned = false; }, wasPruned: () => pruned };
}

test('uses the actual native pressure loop: below threshold untouched, equality triggers pruning', async () => {
  const f = fixture(42);
  f.setTotal(419999);
  assert.equal(await f.engine.compactIfNeeded(f.agent, 'pressure'), null);
  assert.equal(f.wasPruned(), false);
  f.setTotal(420000);
  assert.equal(await f.engine.compactIfNeeded(f.agent, 'pressure'), null);
  assert.equal(f.wasPruned(), true);
});

test('live updates apply to an existing engine; 100% retains native output/headroom ceiling', async () => {
  const f = fixture(80);
  f.setTotal(500000);
  await f.engine.compactIfNeeded(f.agent, 'pressure');
  assert.equal(f.wasPruned(), false);
  f.setPercent(50);
  await f.engine.compactIfNeeded(f.agent, 'pressure');
  assert.equal(f.wasPruned(), true);
  f.setPercent(100);
  f.setTotal(902463);
  await f.engine.compactIfNeeded(f.agent, 'pressure');
  assert.equal(f.wasPruned(), false);
  f.setTotal(902464); // 1,000,000 - 32,000 - 65,536
  await f.engine.compactIfNeeded(f.agent, 'pressure');
  assert.equal(f.wasPruned(), true);
});

test('1% does not fail due to the original 16% retained tail', async () => {
  const f = fixture(1);
  f.setTotal(10000);
  await f.engine.compactIfNeeded(f.agent, 'pressure');
  assert.equal(f.wasPruned(), true);
});

test('manual compaction, summarization, region transactions and overflow path are inherited', () => {
  for (const method of ['compactNow', 'compactRegion', 'summarize', 'compactIfNeeded', '_registerAutomaticCompaction']) {
    assert.equal(ControlledCompactionEngine.prototype[method], BasicCompactionEngine.prototype[method]);
  }
});
