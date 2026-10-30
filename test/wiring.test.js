import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

test('all four shipped presets replace exactly one engine and keep native compact command/pruner', () => {
  for (const name of ['standard', 'minimal', 'ptc', 'cordis']) {
    const [patch] = parse(readFileSync(new URL(`../presets/${name}.patch.yml`, import.meta.url), 'utf8'), { customTags: [{ tag: 'tag:yaml.org,2002:js', resolve: value => value }] });
    assert.equal(patch.id, `preset-${name}`);
    assert.equal(patch.insert, undefined);
    const compaction = patch.config.plugins.find(p => p.id === 'compaction');
    assert.equal(compaction.isolate.compaction, true);
    assert.equal(compaction.config.filter(p => p.name === 'dsh-compact-control/engine').length, 1);
    assert.ok(compaction.config.some(p => p.name === '@deepseek-ai/dsh-command-compact'));
    // minimal intentionally has no tool-result pruner upstream.
    if (name !== 'minimal') assert.ok(compaction.config.some(p => p.name === '@deepseek-ai/dsh-compaction-tool-result-pruner'));
  }
});
