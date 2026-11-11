# 自动压缩阈值

使用 DSH 原生上下文压缩功能，仅调整触发自动上下文压缩的阈值。

在插件详情页通过滑块设置百分比，支持方向键按 1% 微调，默认 80%。

```powershell
dsh plugin --profile desktop add dsh-compact-control
```

安装后重启 DSH。支持 DSH 0.2.2-rc.1 起的版本，已验证 0.2.2-rc.1 和 0.2.2-rc.2。插件直接接入 DSH 加载的原生压缩引擎，预设和其他压缩参数由 DSH 管理。引擎配置接口发生不兼容变化时，继续使用原生压缩配置。

维护者发布新版本：运行 `npm version patch`，再运行 `git push --follow-tags`，GitHub Actions 会自动测试并发布到 npm 和 GitHub Releases。
