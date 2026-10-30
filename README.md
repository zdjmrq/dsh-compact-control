# 自动压缩阈值

使用 DSH 原生上下文压缩功能，仅调整触发自动上下文压缩的阈值。

在插件详情页通过滑块设置百分比，支持方向键按 1% 微调，默认 80%。

```powershell
dsh plugin --profile desktop add dsh-compact-control
```

安装后重启 DSH。适配 DSH 0.2.1-rc.5。

维护者发布新版本：运行 `npm version patch`，再运行 `git push --follow-tags`，GitHub Actions 会自动测试并发布到 npm 和 GitHub Releases。
