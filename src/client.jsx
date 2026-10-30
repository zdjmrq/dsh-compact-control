import React, { useEffect, useState, useSyncExternalStore } from 'react';

export const inject = ['slots', 'configForms'];
export function apply(ctx) {
  const scope = ctx.configForms.get('compact-control');
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config', key: 'dsh-compact-control',
  }, ({ view } = {}) => view === 'summary' ? '按百分比调整自动 Compact 的触发阈值。' : <ControlCard scope={scope} />));
}

const css = `
.dcc-card{color:var(--dsw-alias-label-primary,inherit);border:1px solid var(--dsw-alias-border-l3,#8885);border-radius:16px;background:var(--dsw-alias-bg-module-platform,transparent);overflow:hidden;font-size:14px}
.dcc-card summary{cursor:pointer;list-style:none;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.dcc-card summary::-webkit-details-marker{display:none}
.dcc-card h3{font-size:16px;margin:0 0 7px;font-weight:600}.dcc-muted{color:var(--dsw-alias-label-secondary,#888);font-size:13px;line-height:1.65;margin:0}
.dcc-chevron{transition:transform .15s}.dcc-card[open] .dcc-chevron{transform:rotate(180deg)}.dcc-body{padding:0 24px 22px}.dcc-divider{border-top:1px solid var(--dsw-alias-border-l3,#8884);padding-top:22px}
.dcc-label{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.dcc-percent{font-size:30px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.2}.dcc-range{width:100%;accent-color:var(--dsw-alias-state-business-primary,#3478f6);cursor:pointer;margin:0;height:24px;display:block}.dcc-range:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#3478f6);outline-offset:5px;border-radius:8px}.dcc-range:disabled{cursor:default;opacity:.5}
.dcc-scale{display:flex;justify-content:space-between;font-size:12px;color:var(--dsw-alias-label-tertiary,#888);margin:7px 0 15px}.dcc-note{margin-top:18px;padding:13px 16px;border-radius:10px;background:var(--dsw-alias-bg-module-secondary,#8881)}
.dcc-footer{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:22px}.dcc-button{font:inherit;border:1px solid var(--dsw-alias-border-l3,#8885);border-radius:9px;padding:8px 14px;cursor:pointer;color:inherit;background:transparent}.dcc-button:disabled{cursor:default;opacity:.45}.dcc-button-primary{background:var(--dsw-alias-state-business-primary,#3478f6);border-color:transparent;color:white}.dcc-status{font-size:12px;color:var(--dsw-alias-label-secondary,#888);margin-left:auto}.dcc-error{color:var(--dsw-alias-state-error-primary,#e55353);margin-top:12px}
@media(max-width:480px){.dcc-card summary{padding:18px}.dcc-body{padding:0 18px 18px}.dcc-status{width:100%;margin-left:0}}
`;

export function ControlCard({ scope }) {
  const snapshot = useSyncExternalStore(cb => scope.subscribe(cb), () => scope.getSnapshot());
  const accepted = snapshot.value?.thresholdPercent ?? 80;
  const [percent, setPercent] = useState(accepted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setPercent(accepted); setSaved(false); }, [accepted]);
  const writable = snapshot.status === 'ready' && snapshot.writable;
  const dirty = percent !== accepted;
  async function save(value = percent) {
    setSaving(true); setError(''); setSaved(false);
    try {
      const ok = await scope.mutate([{ op: 'set', path: ['thresholdPercent'], value }], snapshot.revision);
      if (!ok) throw new Error('保存未成功，设置可能已在其他窗口变更，请重试。');
      setPercent(value); setSaved(true);
    } catch (e) { setError(e.message || '保存失败，请重试。'); }
    finally { setSaving(false); }
  }
  return <details className="dcc-card" open>
    <style>{css}</style>
    <summary><div><h3>自动压缩阈值</h3><p className="dcc-muted">设置上下文达到模型窗口的多少百分比时，自动执行 Compact。</p></div><span className="dcc-chevron" aria-hidden="true">⌄</span></summary>
    <div className="dcc-body"><div className="dcc-divider">
      <div className="dcc-label"><label htmlFor="dcc-threshold">触发比例</label><output className="dcc-percent" htmlFor="dcc-threshold">{percent}<span style={{fontSize:18}}> %</span></output></div>
      <input id="dcc-threshold" className="dcc-range" type="range" min="1" max="100" step="1" value={percent}
        aria-label="自动压缩触发比例" aria-valuetext={`${percent}%`} disabled={!writable || saving}
        onChange={e => { setPercent(Number(e.target.value)); setSaved(false); setError(''); }} />
      <div className="dcc-scale" aria-hidden="true"><span>1%</span><span>50%</span><span>100%</span></div>
      <p className="dcc-muted">拖动滑块，或聚焦后用 ← / → / ↑ / ↓ 每次微调 1%。默认值为 80%。</p>
      <div className="dcc-note"><p className="dcc-muted">保存后，已接入插件的会话从下一次执行步骤开始使用新比例。实际触发点仍受模型输出预留与安全余量限制，可能早于滑块比例；100% 也保留原生容量保护。</p><p className="dcc-muted" style={{marginTop:8}}>较低阈值会相应缩小最近历史的保留预算。达到阈值后，DSH 可能先裁剪工具结果，再决定是否生成压缩摘要。</p></div>
      <div className="dcc-footer">
        <button type="button" className="dcc-button dcc-button-primary" disabled={!writable || saving || !dirty} onClick={() => save()}>{saving ? '保存中…' : '保存设置'}</button>
        <button type="button" className="dcc-button" disabled={!writable || saving || (percent === 80 && accepted === 80)} onClick={() => save(80)}>恢复默认 80%</button>
        <span className="dcc-status" role="status">{snapshot.status !== 'ready' ? '等待插件配置加载…' : !snapshot.writable ? '当前设置只读' : saving ? '正在保存…' : dirty ? '有未保存的修改' : saved ? '已保存，下一次检查生效' : `当前已保存 ${accepted}%`}</span>
      </div>
      {error && <p className="dcc-error" role="alert">{error}</p>}
    </div></div>
  </details>;
}
