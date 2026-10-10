# DSH Effort Switcher

将 DSH Web 聊天输入区原有的模型/推理强度选择入口替换为推理强度滑动条。滑块会调用 DSH 的 `modelDirectories` 服务提交当前模型的 `reasoningEffort`，因此设置会作用于后续请求。

## 屏幕截图

![](screenshots/1.png)


![](screenshots/2.png)

## 要求

- DSH `0.1.0-rc.6` 或兼容的 Web profile。
- 当前模型必须暴露至少一个 reasoning effort 级别。普通非推理模型不会显示滑块。

## 安装

```powershell
dsh plugin --profile web add github:lemonorangeapple/dsh-effort-switcher
```

命令会把本包装进当前 Web profile，并因 `dsh.bundle` 声明自动写入 `dsh.profile.bundles`。不必再编辑 profile 的 `cordis.patch.yml`。

完全停止并重新启动 `dsh web`，然后刷新 `http://127.0.0.1:3080`。DSH 仅在 Web 进程启动时扫描 `dsh.client` 元数据；仅刷新旧页面或运行独立开发服务器不会加载本插件。

如果 profile 的 `cordis.patch.yml` 里还留着旧的手工挂载（`id: effort-switcher`），先删掉，避免双重挂载。

## 卸载

```powershell
dsh plugin --profile web remove dsh-effort-switcher
```

卸载后同样需要重启 `dsh web`。

## 验证安装

在 profile 目录中运行：

```powershell
node --input-type=module -e "const plugin=await import('dsh-effort-switcher'); console.log(plugin.name)"
```

预期输出：

```text
effort-switcher
```

启动 DSH Web 后，选择一个支持 reasoning effort 的模型。聊天输入区模型控件的位置应显示“推理强度”滑块；拖动滑块后，DSH 会重新提交当前模型及新的 `reasoningEffort`。

## 项目结构

```text
index.js           Browser client module and slider UI.
host.js            Minimal Cordis host entry used by DSH loader discovery.
cordis.patch.yml   Bundle patch that inserts the host plugin row.
package.json       Package exports, dsh.bundle, and dsh.client manifest.
README.md          Installation and operating instructions.
.gitignore         Local development exclusions.
```

## 开发

从本仓库目录把本地 checkout 链进 Web profile：

```powershell
dsh plugin --profile web add .
```

修改 `index.js` 后，必须重启 `dsh web` 并刷新现有 Web GUI，除非当前 DSH checkout 已运行针对该客户端包的 HMR 构建监视器。

可运行基础语法检查：

```powershell
npm run check
```

## 排障

- **滑块没有显示**：确认 `dsh.profile.bundles` 中存在 `dsh-effort-switcher`，完全重启 `dsh web`，并在模型选择器中选用支持 reasoning effort 的模型。
- **安装后页面未更新**：Web 启动图已经生成；停止旧 `dsh web` 进程后重新启动。
- **双重控件或重复挂载**：删掉 profile `cordis.patch.yml` 里旧的 `effort-switcher` insert，只保留 bundle 层。
- **拖动后未生效**：检查模型是否支持多个 reasoning effort 级别。对于仅有默认强度或不支持 reasoning 的模型，插件会隐藏控件。
- **滑块弹回并出现红色提示**：DSH 拒绝了这次写入（例如会话被占用、模型不支持该强度）。滑块会回到真实强度并显示原因，再拖一次即可重试。
- **在模型切换进行中松开滑块**：这次选择会被保留，待 DSH 空闲后自动提交，不会丢失。
