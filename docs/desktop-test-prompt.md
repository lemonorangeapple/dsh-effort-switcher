# DSH Effort Switcher：桌面端（Electron）真机实测提示词

把下面「提示词正文」整段交给一个能操作桌面应用并执行命令的 agent（例如带 computer use 的 Claude）。
它在**你的电脑上**安装并实测插件，最后交回一份结构化报告。

## 为什么桌面端要单独测

- 桌面端是 **Electron 外壳 + 完整 dsh Web 应用**。桌面 profile（`~/.dsh/profiles/desktop`）使用的 bundle 列表与 web profile 相同（`@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-web-app`），渲染进程加载的就是同一套 Web 客户端。
- 区别在渲染引擎：官方桌面端依赖 **Electron 44.7（Chromium 152）**，比普通浏览器新。DSH 0.1.2 起主题给所有元素加了全局 `corner-shape: superellipse(1.5)`，只有较新的 Chromium 才会生效，这正是「圆变圆角方块」只在桌面端出现的原因。
- `dsh plugin --profile desktop …` 会被命令行拒绝（desktop 由 Electron 应用独占管理），安装必须走应用内的插件面板，或手工改 profile。
- 作者的云端环境无法运行桌面端，因此此前只在真实 Web 端（Chromium 141）验证过：0.1.0-rc.6、0.1.2-rc.1、0.2.0-rc.2、0.2.1-alpha.2。**桌面端没有任何实测数据，这份提示词就是为了补上它。**

---

## 提示词正文

你是一名 QA 工程师，要在我的电脑上对 DeepSeek Harness（DSH）桌面端做一次**真机实测**，验证第三方插件 `dsh-effort-switcher`，并交回一份结构化报告。这是**只读验证任务**：不要改插件源码，不要提交或推送任何代码。

### 1. 背景

- 插件仓库：`https://github.com/lemonorangeapple/dsh-effort-switcher`，分支 `ccr-012fe003-4ij2vd`。
- 插件作用：把输入框里的模型座位（插槽 `conversation.input.model`，优先级 -100）整体替换为「模型名 + 推理强度」触发器，点开后是一个推理强度滑条（档位：Off / Low / High / Max）。滑条通过 DSH 的 `modelDirectories` 服务写入当前模型的 `reasoningEffort`。
- 已修复的两个问题，**需要在桌面端确认是否真的消失**：
  1. **圆角方块**：DSH 0.1.2 起主题为所有元素设置 `corner-shape: superellipse(1.5)`，旋钮、轨道、刻度点被画成圆角方块。插件现对这些部件显式写了 `corner-shape: round`。
  2. **滑块消失（像没装一样）**：DSH 0.1.2 起 `directoryFor()` 读取调用方的 `remote.session`，插件未声明时抛 `cannot get property "remote.session" without inject`，插槽条目崩溃，宿主退回自己的官方选择器。插件现按宿主实际提供的服务声明依赖。
- 已在真实 Web 端通过（Chromium 141）：0.1.0-rc.6、0.1.2-rc.1、0.2.0-rc.2、0.2.1-alpha.2。桌面端尚无数据。

### 2. 硬性约束

1. 不要修改、提交、推送插件仓库的任何文件。需要的话只做 `git clone` / `git pull`。
2. 不要输入、读取或泄露任何 API key。遇到「Add an API key」对话框，点 **Configure later**。
3. 不要删除 `~/.dsh`（Windows：`%USERPROFILE%\.dsh`）里的任何东西。手工改 profile 前先备份：把 `profiles/desktop/package.json` 复制为 `package.json.bak-effort-switcher`。
4. 除 DSH 桌面端和插件本身外，不要安装其他软件。需要装别的先问我。
5. 每一步都记录**实际观察到的现象**，不要凭预期填写。不确定就写「未确认」，并说明原因。
6. 遇到 DSH 弹出「致命错误恢复」对话框，不要自行选择「禁用第三方插件」，先截图并停下来告诉我。

### 3. 准备

1. 记录环境：操作系统及版本、DSH 桌面端版本（应用菜单 **About DeepSeek Harness**）、是否为正式安装包。
2. 把插件克隆到本机一个固定路径（路径里最好没有空格），切到分支并记录提交：
   ```
   git clone https://github.com/lemonorangeapple/dsh-effort-switcher <本地路径>
   cd <本地路径>
   git checkout ccr-012fe003-4ij2vd
   git rev-parse HEAD
   ```
3. 可选：`node --version` 在 18 以上时运行 `npm test`，应输出 `all checks passed`。失败就记录输出，但**不要因此停止**桌面端实测。
4. 打开 DSH 桌面端，切到一个能创建会话的状态：
   - 如果弹出「Internal Testing Notice」，点 **Continue**。
   - 如果弹出「Add an API key to get started」，点 **Configure later**。
   - 在输入框上方的 **Choose workspace** 里选一个任意的空文件夹作为工作区（原生文件夹对话框）。只有进入「有工作区的会话」后，输入框才会出现模型座位。若输入框仍显示 `Choose a workspace to start`，再从 Choose workspace 菜单里重新选一次该工作区。

### 4. 先拍基线（插件未安装时的官方界面）

1. 在会话输入框里找到官方模型座位（形如 `DeepSeek-V4.x-Flash High ⌃`）。截图 1：输入框底部一行。
2. 点开它，截图 2：官方菜单（Model / Effort 两行）。
3. 打开 DevTools（Windows：`Ctrl+Shift+I` 或 `F12`；macOS：`Cmd+Option+I`），在 Console 执行：
   ```js
   navigator.userAgent
   ```
   **原样记录**，其中的 `Chrome/…` 与 `Electron/…` 是本次最关键的环境数据。
4. **等输入框里的座位已经显示出模型名**（不是「选择模型」之类的占位文字，目录加载需要一两秒），再在 Console 执行下面的**探针 A**，记录完整输出（此时应显示 `pluginStyleTag: false`、`nativeSeat` 非空）：
   ```js
   (() => {
     const q = (s) => document.querySelector(s);
     const m = (s) => { const e = q(s); if (!e) return null; const c = getComputedStyle(e), r = e.getBoundingClientRect();
       return { cornerShape: c.cornerShape, borderRadius: c.borderRadius, w: Math.round(r.width), h: Math.round(r.height), fontSize: c.fontSize, fontWeight: c.fontWeight }; };
     const boot = JSON.stringify(window.__DSH_BOOT__ ?? null);
     return JSON.stringify({
       userAgent: navigator.userAgent,
       hostCornerShapeToken: getComputedStyle(document.documentElement).getPropertyValue('--dsw-corner-shape').trim() || null,
       pluginStyleTag: !!q('style[data-plugin-css="dsh-effort-switcher/seat.css"]'),
       bootGraphHasPlugin: boot.includes('dsh-effort-switcher'),
       pluginRoots: document.querySelectorAll('[data-dsh-plugin="effort-switcher"]').length,
       nativeSeat: [...document.querySelectorAll('button[aria-label^="Select model"]')].map((b) => b.getAttribute('aria-label')),
       slotErrors: [...document.querySelectorAll('[data-slot-error]')].map((n) => n.getAttribute('data-slot-error')),
       trigger: m('.dsh-es-trigger'),
       nativeTrigger: (() => { const b = q('button[aria-label^="Select model"]'); if (!b) return null; const c = getComputedStyle(b), r = b.getBoundingClientRect();
         return { cornerShape: c.cornerShape, borderRadius: c.borderRadius, w: Math.round(r.width), h: Math.round(r.height), fontSize: c.fontSize, fontWeight: c.fontWeight }; })()
     }, null, 1);
   })()
   ```
   这一步的 `nativeTrigger` 是宿主原生座位的尺寸，之后用来和插件触发器对比。

### 5. 安装插件

桌面 profile 由 Electron 应用管理，命令行 `dsh plugin --profile desktop add …` 会报 `profile "desktop" is managed exclusively by the Electron application`，**不要用它**。

**方式一（优先）：应用内插件面板**
1. 进入 **设置 → 插件 → 添加插件**。
2. 填入第 3 步克隆的**本地目录路径**，安装。面板会校验这是有效插件包且声明了 `dsh.bundle.patch`，本插件都已满足。
3. 如果设置里根本没有「插件」入口，改用方式二，并在报告中注明。

**方式二（面板不可用时）：手工安装**
1. 备份：复制 `~/.dsh/profiles/desktop/package.json` 为 `package.json.bak-effort-switcher`。
2. 编辑该 `package.json`：在 `dependencies` 增加 `"dsh-effort-switcher": "link:<插件本地绝对路径>"`，在 `dsh.profile.bundles` 数组末尾追加 `"dsh-effort-switcher"`。
3. 在 `~/.dsh/profiles/desktop/node_modules/` 下建一个名为 `dsh-effort-switcher`、指向插件目录的链接（Windows 用 junction：`cmd /c mklink /J "<profile>\node_modules\dsh-effort-switcher" "<插件路径>"`；macOS 用 `ln -s`）。

**无论哪种方式，都必须完全退出并重新打开桌面端**：Windows 要在托盘图标上选 **Quit DeepSeek Harness**，macOS 用 `Cmd+Q`。只关窗口不够，宿主在启动时才读取插件。重新进入同一个工作区的会话。

### 6. 安装后的实测

**6.1 加载检查**
在输入框所在的会话页打开 DevTools，等触发器显示出模型名后，先看 Console 有没有红色错误，**原样记录**所有与 `effort`、`slot entry crashed`、`conversation.input.model`、`remote.session`、`client-modules` 相关的行。然后再执行**探针 A**，记录完整输出。

按下面的诊断树判断：

| 探针 A 的结果 | 含义 |
|---|---|
| `pluginStyleTag: false` 且 `bootGraphHasPlugin: false` | 插件 bundle 根本没被加载。检查 profile 的 `package.json` 里是否有该 bundle、链接是否有效、是否真的完全退出重开过 |
| `pluginStyleTag: true`、`pluginRoots: 0`、`nativeSeat` 非空，且 Console 有 `slot entry crashed in 'conversation.input.model'` | 插件座位渲染崩溃，宿主退回官方选择器。**记录完整错误和堆栈** |
| `pluginStyleTag: true`、`pluginRoots: 1`、`trigger` 非空 | 插件已接管座位，继续 6.2 |

**6.2 视觉检查**
1. 截图 3：输入框底部一行（插件触发器）。截图 4：点开触发器后的菜单（含滑条）。
2. 在菜单打开的状态下执行**探针 B**，记录完整输出：
   ```js
   (() => {
     const q = (s) => document.querySelector(s);
     const m = (s) => { const e = q(s); if (!e) return null; const c = getComputedStyle(e), r = e.getBoundingClientRect();
       return { cornerShape: c.cornerShape, borderRadius: c.borderRadius, w: Math.round(r.width), h: Math.round(r.height), fontSize: c.fontSize, fontWeight: c.fontWeight }; };
     return JSON.stringify({
       knobFace: m('.dsh-es-sliderKnobFace'), groove: m('.dsh-es-sliderGroove'), fill: m('.dsh-es-sliderFill'),
       tick: m('.dsh-es-sliderTick'), trigger: m('.dsh-es-trigger'), menu: m('.dsh-es-menu'),
       menuBackground: q('.dsh-es-menu') ? getComputedStyle(q('.dsh-es-menu')).backgroundColor : null,
       sliderValue: q('.dsh-es-slider')?.value ?? null,
       triggerLabel: q('.dsh-es-trigger')?.getAttribute('aria-label') ?? null,
       errorNotice: q('.dsh-es-sliderError')?.textContent ?? null
     }, null, 1);
   })()
   ```
3. 对照下表判定（**任何一项不符都要在报告里标红并写出实测值**）：

| 项目 | 期望 | 不符说明 |
|---|---|---|
| `knobFace` | `cornerShape: "round"`、`borderRadius: "50%"`、`w: 30`、`h: 30`，视觉上是**正圆** | 若 `cornerShape` 是 `superellipse(…)`，说明圆角方块问题仍在 |
| `groove` / `fill` | `cornerShape: "round"`、`borderRadius: "13px"`，轨道两端是**半圆** | 同上 |
| `tick` | `cornerShape: "round"`、`4×4` 圆点 | 同上 |
| `trigger`（宿主 0.2.x，较新引擎） | `h: 28`、`fontSize: "13px"`、`fontWeight: "400"`、`borderRadius: "8px"`、`cornerShape: "superellipse(1.5)"` | 应与 `nativeTrigger` 的高度、字号一致 |
| `trigger`（宿主 0.1.0，无全局圆角规则） | `h: 28`、`13px`、`borderRadius: "24px"`、`cornerShape: "round"` | 同上 |
| `menu` | `borderRadius` 为 `16px`（0.2.x）或 `10px`（0.1.0） | 仅供参考，不判失败 |
| `menuBackground` | **不透明**：形如 `rgb(255, 255, 255)`（浅色）或 `rgb(21, 21, 23)`（深色），**不能是** `rgba(…, 0.xx)` | 若带透明度，说明面板仍是透明的，菜单里会透出输入框内容 |
| `hostCornerShapeToken` | 0.1.2+ 且引擎支持时为 `superellipse(1.5)`，否则 `null` | **关键环境数据**，决定桌面端是否真的会触发圆角方块 |

4. 主观评价（写进报告）：旋钮是否正圆？轨道是否为胶囊形？触发器与旁边的 `Standard mode` 等官方座位是否协调？菜单和「模型」子菜单是否**不透明**（看不到底下的输入框文字）？

**6.3 浅色与深色**
在设置里切换外观（或切换系统外观），分别截图菜单：Off、High、Max 三个档位各一张，浅色深色共 6 张。留意最高档的白色旋钮在浅色菜单上是否难以辨认（这是已知的原有设计，只需描述，不算失败）。

**6.4 功能检查**
逐项操作并记录**触发器 `aria-label` 的变化**（用 DevTools 读取 `document.querySelector('.dsh-es-trigger').getAttribute('aria-label')`，或直接看触发器文字）：

| 操作 | 期望 |
|---|---|
| 点开触发器，再点一次 | 菜单打开 / 关闭；点菜单外部也能关闭 |
| 滑条获得焦点后按 `Home` | 变为 `Off` |
| 按 `End` | 变为 `Max` |
| 按 `←` / `↓` | 档位降一格 |
| 按 `→` / `↑` | 档位升一格 |
| 按 `PageDown` / `PageUp` | 档位改变并提交 |
| 点击轨道最右端 | 变为 `Max` |
| 点击轨道最左端 | 变为 `Off` |
| 按住旋钮拖动再松手 | 松手后档位提交，触发器文字更新 |
| 点开菜单里的「模型」行 | 弹出模型列表；选另一个模型后滑条档位重置为该模型的默认档 |
| 选一个没有 reasoning 档位的模型（若有） | 滑条消失，只剩触发器 |

另外：把档位设为 `Max`，**完全退出并重开**桌面端，回到同一会话，记录触发器显示的档位（是否保留）。这一项只需如实记录，不判定通过与否。

**6.5 对照组（可选，但建议做）**
暂时移除插件（面板里卸载，或手工从 `dsh.profile.bundles` 删除并重启），确认官方座位恢复，并和 6.2 的截图对比；然后重新安装插件回到安装后的状态。

### 7. 如果出了问题

- 应用启动失败或弹出致命错误恢复对话框：先截图，不要点任何破坏性选项，告诉我。
- 需要回滚：用方式二里备份的 `package.json.bak-effort-switcher` 覆盖回去，删除 `node_modules/dsh-effort-switcher` 链接（Windows 用 `cmd /c rmdir <链接>`，**不要**用 `Remove-Item -Recurse`，它可能顺着链接删除插件目录里的文件），完全退出并重开。
- 采集清单（失败时尽量全带上）：完整 Console 输出、探针 A 与 B 的原始 JSON、`~/.dsh/profiles/desktop/package.json` 的内容（**去掉任何密钥**）、`navigator.userAgent`、应用 About 页的版本号、相关截图。

### 8. 交付：报告模板

请严格按下面结构输出，Markdown 即可：

```
# DSH Effort Switcher 桌面端实测报告

## 环境
- 操作系统：
- DSH 桌面端版本：
- navigator.userAgent（原样）：
- Electron / Chromium 版本（从 userAgent 读出）：
- 插件提交（git rev-parse HEAD）：
- 安装方式（插件面板 / 手工）：
- npm test 结果（可选）：

## 结论（先写这一段）
- 圆角方块问题：已消失 / 仍存在 / 未确认
- 滑块消失（像没装一样）：已消失 / 仍存在 / 未确认
- 滑条功能：全部正常 / 部分异常（列出）
- 一句话总结：

## 实测明细
| 检查项 | 期望 | 实测 | 结果（通过/失败/未确认） |
|---|---|---|---|
（逐项填写 6.1 到 6.4；每行的「实测」写实际数值或现象）

## 原始数据
### 探针 A（安装前）
### 探针 A（安装后）
### 探针 B
### Console 相关输出（原样）

## 截图清单
（编号、文件位置、一句话说明）

## 异常与疑点
（任何与期望不符、或你觉得奇怪的现象，包括未确认项的原因）
```

做完后，把报告完整贴回给我；如果截图无法随报告一起返回，请在报告里写清楚它们保存在哪里。
