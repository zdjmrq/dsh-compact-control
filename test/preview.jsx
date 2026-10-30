import React from 'react';
import { createRoot } from 'react-dom/client';
import { ControlCard } from '../src/client.jsx';

const listeners = new Set();
const stored = Number(localStorage.getItem('dcc-preview-percent') ?? 80);
let snapshot = { status: 'ready', writable: true, value: { thresholdPercent: stored }, revision: 1 };
const scope = {
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  getSnapshot: () => snapshot,
  async mutate(ops, revision) {
    await new Promise(resolve => setTimeout(resolve, 120));
    if (window.previewReject || revision !== snapshot.revision) return false;
    const value = ops[0].value;
    localStorage.setItem('dcc-preview-percent', String(value));
    snapshot = { ...snapshot, value: { thresholdPercent: value }, revision: snapshot.revision + 1 };
    listeners.forEach(fn => fn());
    return true;
  },
};
document.documentElement.style.cssText = 'font-family:system-ui,"Microsoft YaHei",sans-serif;color-scheme:dark;background:#202024;color:#eee;--dsw-alias-label-primary:#eee;--dsw-alias-label-secondary:#aaaab3;--dsw-alias-label-tertiary:#85858f;--dsw-alias-border-l3:#ffffff20;--dsw-alias-bg-module-platform:#ffffff04;--dsw-alias-state-business-primary:#568dff;--dsw-alias-bg-module-secondary:#ffffff05';
createRoot(document.getElementById('root')).render(<main style={{maxWidth:1000,margin:'32px auto',padding:'0 24px'}}>
  <div style={{fontSize:14,color:'#999'}}>‹ 插件</div>
  <img src="/icon.svg" width="64" height="64" style={{marginTop:36}} />
  <h1 style={{fontSize:26,fontWeight:600,marginBottom:10}}>自动压缩阈值 <small style={{fontSize:13,color:'#aaa',fontWeight:400}}>v0.1.0</small></h1>
  <div style={{fontSize:12,color:'#999'}}>dsh-compact-control</div>
  <p style={{color:'#bbb',fontSize:14,marginBottom:32}}>通过百分比滑块调节自动上下文压缩阈值，支持方向键按 1% 微调。</p>
  <ControlCard scope={scope} />
  <p style={{fontSize:12,color:'#777',marginTop:24}}>本地界面预览 · 使用模拟设置服务</p>
</main>);
