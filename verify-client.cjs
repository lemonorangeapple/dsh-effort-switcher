const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("index.js", "utf8");
let captured = null;

// --- Minimal React shim sufficient to render EffortSliderSeat ---
const stateValues = new Map();
const refValues = new Map();
const effectSlots = new Map();
let renderSeq = 0;
let refSeq = 0;
let effectSeq = 0;
let hookCount = 0;
let renderedEffects = [];
function beginRender() {
    renderSeq = 0;
    refSeq = 0;
    effectSeq = 0;
    hookCount = 0;
    renderedEffects = [];
}
function makeState(initial) {
    const key = renderSeq++;
    if (!stateValues.has(key)) stateValues.set(key, initial);
    return [stateValues.get(key), (updater) => {
        const next = typeof updater === "function" ? updater(stateValues.get(key)) : updater;
        stateValues.set(key, next);
    }];
}
// Effects do not run on their own (the sync checks below drive state by hand).
// flushEffects() runs the effects of the last render the way React's commit
// phase would: only those whose dependencies changed, cleaning up first.
function flushEffects() {
    for (const { key, fn, deps } of renderedEffects) {
        const slot = effectSlots.get(key);
        const changed = slot === undefined
            || deps === undefined
            || slot.deps === undefined
            || deps.length !== slot.deps.length
            || deps.some((dep, index) => !Object.is(dep, slot.deps[index]));
        if (!changed) continue;
        if (slot !== undefined && typeof slot.cleanup === "function") slot.cleanup();
        const cleanup = fn();
        effectSlots.set(key, { deps, cleanup });
    }
}
function resetComponentState() {
    stateValues.clear();
    refValues.clear();
    effectSlots.clear();
}

const react = {
    createElement(type, props, ...children) {
        return { type, props: props || {}, children };
    },
    Fragment: Symbol("Fragment"),
    useEffect(fn, deps) {
        hookCount++;
        renderedEffects.push({ key: effectSeq++, fn, deps });
    },
    useRef(initial) {
        hookCount++;
        const key = refSeq++;
        if (!refValues.has(key)) refValues.set(key, { current: initial });
        return refValues.get(key);
    },
    useMemo(fn) {
        hookCount++;
        return fn();
    },
    useState(initial) {
        hookCount++;
        return makeState(initial);
    },
    useSyncExternalStore(_subscribe, getSnapshot) {
        hookCount++;
        return getSnapshot();
    }
};

let registered = null;
const directoryCalls = { load: 0, select: [] };
const listeners = new Set();
const snapshot = {
    status: "ready",
    error: null,
    current: { provider: "demo", model: "reasoning-model", reasoningEffort: "low" },
    groups: [{
        id: "demo",
        name: "Demo",
        models: [{
            id: "reasoning-model",
            name: "Reasoning Model",
            description: "demo",
            reasoning: {
                defaultEffort: "medium",
                efforts: [
                    { id: "low", name: "低" },
                    { id: "medium", name: "中" },
                    { id: "high", name: "高" }
                ]
            }
        }, {
            id: "other-model",
            name: "Other Model",
            description: "other",
            reasoning: {
                defaultEffort: "low",
                efforts: [
                    { id: "low", name: "低" },
                    { id: "medium", name: "中" }
                ]
            }
        }]
    }, {
        id: "deepseek-official",
        name: "DeepSeek",
        models: [{
            id: "DeepSeek-V4-Flash",
            name: "DeepSeek-V4-Flash",
            description: "官方 DeepSeek 路由"
        }, {
            id: "DeepSeek-V4-Pro",
            name: "DeepSeek-V4-Pro",
            description: "官方 DeepSeek 路由"
        }, {
            id: "deepseek-v4-flash-vision-exp",
            name: "DeepSeek-V4-Flash-Vision-Exp",
            description: "官方 DeepSeek 视觉路由"
        }]
    }, {
        id: "xiaomi",
        name: "Xiaomi",
        models: [{
            id: "mimo-v2.5",
            name: "MiMo-V2.5",
            description: "Xiaomi 自建路由"
        }, {
            id: "mimo-v2.5-pro",
            name: "MiMo-V2.5-Pro",
            description: "Xiaomi 自建路由"
        }]
    }]
};

const store = {
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot() {
        return snapshot;
    }
};

const directory = {
    store,
    load() {
        directoryCalls.load++;
        return Promise.resolve();
    },
    select(selection) {
        directoryCalls.select.push(selection);
        snapshot.current = { ...snapshot.current, ...selection };
        return {
            then(resolve) {
                resolve(true);
                return this;
            }
        };
    }
};

const slots = {
    inject(_name, factory) {
        const dispose = factory();
        return dispose;
    },
    register(options, component) {
        registered = { options, component };
        return () => undefined;
    }
};

const ctx = {
    inject(_services, callback) {
        callback({
            get(service) {
                if (service === "slots") return slots;
                if (service === "modelDirectories") return { directoryFor: () => directory };
                if (service === "sessions") return { subagentAddress: () => undefined };
                throw new Error(`unknown service ${service}`);
            },
            effect(fn) {
                return fn();
            }
        });
    }
};

// The plugin must not write to the console during normal operation.
const consoleCalls = [];
const consoleSpy = {
    log: (...args) => consoleCalls.push(["log", ...args]),
    info: (...args) => consoleCalls.push(["info", ...args]),
    warn: (...args) => consoleCalls.push(["warn", ...args]),
    error: (...args) => consoleCalls.push(["error", ...args])
};

const styleTags = [];
const context = vm.createContext({
    window: {
        __ModuleLoader__: {
            load({ id, factory }) {
                captured = factory((specifier) => {
                    if (specifier === "react") return react;
                    throw new Error(`unknown module ${specifier}`);
                });
            }
        }
    },
    document: {
        querySelector: () => null,
        createElement: () => ({ dataset: {}, textContent: "" }),
        head: { appendChild(node) { styleTags.push(node); } },
        addEventListener() {},
        removeEventListener() {}
    },
    console: consoleSpy
});

vm.runInContext(source, context, { filename: "index.js" });
if (!captured) throw new Error("client module did not register");

// 0. Styles must be injected at module load (original bundles do this at top level)
const styleTag = styleTags.find((tag) => tag.dataset.pluginCss === "dsh-effort-switcher/seat.css");
if (!styleTag) throw new Error("style tag not injected at module load");
if (!styleTag.textContent.includes("border-radius: var(--dsw-radius-sm, 24px)")) throw new Error("trigger must follow the host radius token, falling back to 24px (the 0.1.0 seat)");
if (!styleTag.textContent.includes("--dsw-alias-label-secondary")) throw new Error("dsh tokens missing from injected css");
if (!styleTag.textContent.includes("scrollbar-width: none")) throw new Error("scrollbar must be hidden");
if (!styleTag.textContent.includes("::-webkit-scrollbar")) throw new Error("webkit scrollbar hide rule missing");
if (!styleTag.textContent.includes("-webkit-slider-thumb")) throw new Error("slider thumb style missing");
if (!styleTag.textContent.includes("::-moz-range-progress")) throw new Error("firefox slider progress style missing");
if (!styleTag.textContent.includes("dsh-es-pop")) throw new Error("pop animation missing from css");
if (!styleTag.textContent.includes("height: 26px")) throw new Error("slider track must be 26px tall");
if (!styleTag.textContent.includes("width: 30px")) throw new Error("slider thumb must be 30px wide");
if (!styleTag.textContent.includes(".dsh-es-sliderKnob")) throw new Error("custom thumb knob missing");
if (!styleTag.textContent.includes("transition: left .315s ease")) throw new Error("thumb must ease between notches at the last-notch pace");
if (!styleTag.textContent.includes("transition: width .315s ease")) {
    throw new Error("fill must ease with the thumb at the last-notch pace");
}
if (!styleTag.textContent.includes(".dsh-es-sliderBloom")) {
    throw new Error("terminal color must fade on a dedicated bloom layer");
}
if (!styleTag.textContent.includes("transition: opacity .315s ease")) {
    throw new Error("bloom color fade must be slower than the thumb travel");
}
if ((styleTag.textContent.match(/background: rgb\(255 255 255 \/ 38%\)/g) || []).length < 2) {
    throw new Error("inactive and active slider dots must share the same subdued style");
}
if (!styleTag.textContent.includes("background: #4c8dff")) throw new Error("fill must use the reference blue");
if (!styleTag.textContent.includes("linear-gradient(90deg, #4c8dff 0%, #7b6cff 52%, #b56bff 100%)")) {
    throw new Error("last notch must use the blue-to-purple reference gradient");
}
// DSH 0.1.2+ sets corner-shape: superellipse(1.5) on every element, which turns
// border-radius circles into rounded squares. Every round part of the slider must
// opt back out with corner-shape: round (pseudo-element thumbs are transparent).
const cssRules = [...styleTag.textContent.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));
const sliderRoundRules = cssRules.filter((rule) => /\.dsh-es-slider(Groove|Track|Fill|KnobFace|Tick)\b/.test(rule.selector) && !rule.selector.includes("::"));
if (sliderRoundRules.length < 4) throw new Error(`expected rules for groove/track/fill/knob/tick, found ${sliderRoundRules.length}`);
for (const rule of sliderRoundRules) {
    if (!/border-radius:\s*(13px|50%)/.test(rule.body)) continue;
    if (!/corner-shape:\s*round\s*;/.test(rule.body)) {
        throw new Error(`${rule.selector} is round but does not opt out of the host's corner-shape`);
    }
}
for (const part of ["sliderGroove", "sliderTrack", "sliderFill", "sliderKnobFace", "sliderTick"]) {
    const covered = sliderRoundRules.some((rule) => rule.selector.includes(`.dsh-es-${part}`) && /corner-shape:\s*round/.test(rule.body));
    if (!covered) throw new Error(`.dsh-es-${part} must set corner-shape: round`);
}
// The seat matches the host's own model seat (DSH 0.2: 28px tall, 13px / 400) and every
// radius follows the host's tokens, falling back to the earlier fixed values.
const triggerRule = cssRules.find((rule) => rule.selector === ".dsh-es-trigger");
if (!triggerRule) throw new Error("trigger rule missing");
for (const expected of [/height:\s*28px/, /font-size:\s*13px/, /font-weight:\s*400/, /line-height:\s*20px/, /max-width:\s*min\(360px,\s*45cqw\)/]) {
    if (!expected.test(triggerRule.body)) throw new Error(`trigger must match the host seat: ${expected}`);
}
for (const rule of cssRules) {
    const radius = rule.body.match(/border-radius:\s*([^;]+);/)?.[1];
    if (radius === undefined || /^(50%|13px|0)/.test(radius) || radius.startsWith("var(--dsw-radius-")) continue;
    if (rule.selector.startsWith("@") || !/^\.dsh-es-/.test(rule.selector)) continue;
    throw new Error(`${rule.selector} uses a fixed border-radius (${radius}); use a --dsw-radius-* token with a fallback`);
}
// Panels are opaque. DSH 0.2's --dsw-specific-menu is a translucent glass fill, so every
// panel paints it over the opaque page background instead of using it on its own.
const panelRoot = cssRules.find((rule) => rule.selector.endsWith(".dsh-es-root"));
if (!panelRoot || !/--dsh-es-panel-bg:[^;]*var\(--dsw-specific-menu\)[^;]*var\(--dsw-alias-bg-base/.test(panelRoot.body)) {
    throw new Error("the panel background must lay --dsw-specific-menu over --dsw-alias-bg-base");
}
for (const selector of [".dsh-es-menu", ".dsh-es-modelMenu", ".dsh-es-menuItemTip"]) {
    const rule = cssRules.find((candidate) => candidate.selector.endsWith(selector));
    if (!rule || !/background:\s*var\(--dsh-es-panel-bg\);/.test(rule.body)) throw new Error(`${selector} must use the opaque panel background`);
}
for (const rule of cssRules) {
    if (/(^|;)\s*background:\s*var\(--dsw-specific-menu\)/.test(rule.body)) {
        throw new Error(`${rule.selector.split("\n").pop()} uses the translucent menu fill directly`);
    }
}
// The trigger and menu keep following the host's corner style.
for (const rule of cssRules) {
    if (/\.dsh-es-(trigger|menu|modelMenu)\s*$/.test(rule.selector) && /corner-shape/.test(rule.body)) {
        throw new Error(`${rule.selector} must follow the host's corner-shape`);
    }
}
const thumbBlock = styleTag.textContent.match(/\.dsh-es-slider::-webkit-slider-thumb\s*\{[^}]*\}/)?.[0] ?? "";
if (thumbBlock.includes("border: 1px solid")) throw new Error("thumb must not have a colored ring");
if (!styleTag.textContent.includes(".dsh-es-sliderRail")) throw new Error("slider must render a dedicated rail layer");
if (!styleTag.textContent.includes(".dsh-es-sliderGroove")) throw new Error("fill must be clipped by a rounded groove");
if (!styleTag.textContent.includes(".dsh-es-sliderFill")) throw new Error("slider must render a dedicated fill layer");
if (!styleTag.textContent.includes(".dsh-es-sliderTicks")) throw new Error("slider must render embedded notch markers");
if (!styleTag.textContent.includes("z-index: 3")) throw new Error("native input must sit above the visual rail");
if (!styleTag.textContent.includes("accent-color: transparent")) throw new Error("native slider accent must not paint leftover fill");

function find(node, predicate) {
    if (node === null || node === undefined) return undefined;
    if (Array.isArray(node)) {
        for (const child of node) {
            const found = find(child, predicate);
            if (found) return found;
        }
        return undefined;
    }
    if (typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of node.children ?? []) {
        const found = find(child, predicate);
        if (found) return found;
    }
    return undefined;
}
function findRange(node) {
    return find(node, (n) => n.props?.type === "range");
}
function findSliderFill(node) {
    return find(node, (n) => String(n.props?.className ?? "").split(/\s+/).includes("dsh-es-sliderFill"));
}
function text(node) {
    if (node === null || node === undefined) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(text).join("");
    if (typeof node !== "object") return "";
    return (node.children ?? []).map(text).join("");
}

// 1. Config must validate (client runner check)
const cfg = captured.Config["~standard"].validate(undefined);
if (cfg.issues || JSON.stringify(cfg.value) !== "{}") throw new Error("Config validation failed");

// 2. Apply registers the slot seat with shadow priority
captured.apply(ctx);
if (!registered) throw new Error("slot not registered");
if (registered.options.name !== "conversation.input.model") throw new Error("wrong slot name");
if (registered.options.priority >= 0) throw new Error(`priority ${registered.options.priority} must be negative to shadow the original (priority 0)`);

// 3. Injected face must expose the store (subscribe/getSnapshot) like the original
const face = registered.options.inject("session-1");
if (typeof face.directory.subscribe !== "function" || typeof face.directory.getSnapshot !== "function") {
    throw new Error("injected directory must be directory.store");
}
if (face.available !== true) throw new Error("available must be true for top-level sessions");

// 4. Closed seat: trigger only, no menu/slider yet
beginRender();
let tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
if (!tree || tree.props["data-dsh-plugin"] !== "effort-switcher") throw new Error("root element missing");
if (findRange(tree)) throw new Error("slider must not render while menu is closed");
const trigger = tree.children[0];
const triggerLabel = text(trigger);
if (!triggerLabel.includes("Reasoning Model") || !triggerLabel.includes("低")) {
    throw new Error(`trigger should show model + effort, got: ${triggerLabel}`);
}
// Model name and effort must be separate spans (effort uses the caption tone)
const labelSpan = trigger.children.find((c) => c?.props?.className === "dsh-es-triggerLabel");
const effortSpan = trigger.children.find((c) => c?.props?.className === "dsh-es-triggerEffort");
if (!labelSpan) throw new Error("trigger label span missing");
if (text(labelSpan).trim() !== "Reasoning Model") throw new Error(`label span must hold only the model name, got ${JSON.stringify(text(labelSpan))}`);
if (!effortSpan) throw new Error("trigger effort span missing");
if (text(effortSpan).trim() !== "低") throw new Error(`effort span must hold the effort, got ${JSON.stringify(text(effortSpan))}`);
// Chevron must be the DSH svg icon
const chevron = trigger.children.find((c) => c?.type === "svg");
if (!chevron) throw new Error("trigger chevron svg missing");

// 5. Open the menu (click the trigger) and re-render
tree.children[0].props.onClick();
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});

const menu = find(tree, (n) => n.props?.className === "dsh-es-menu");
if (!menu) throw new Error("menu not rendered after trigger click");

// 6. The popover must float above the trigger (absolute, above), not occupy the input layout
const rootStyle = tree.props.style || {};
if (rootStyle.position !== "relative") throw new Error(`root must be position:relative, got ${JSON.stringify(rootStyle)}`);
const menuStyle = menu.props.style || {};
if (menuStyle.position !== "absolute") throw new Error("menu must be position:absolute");
if (typeof menuStyle.bottom !== "string" || !menuStyle.bottom.includes("100%")) {
    throw new Error(`menu must float above trigger (bottom: calc(100% + 8px)), got ${JSON.stringify(menuStyle)}`);
}

// 7. Model picker is a secondary floating window: closed by default, slider always visible
const modelRow = find(menu, (n) => n.props?.className === "dsh-es-modelRow");
const divider = find(menu, (n) => n.props?.className === "dsh-es-menuDivider");
const sliderWrap = find(menu, (n) => n.props?.className === "dsh-es-sliderWrap");
if (!modelRow) throw new Error("model row (secondary menu trigger) missing");
if (!divider || !sliderWrap) throw new Error("divider and slider wrap must be in menu");
const modelList = find(menu, (n) => n.props?.className === "dsh-es-modelList");
if (modelList) throw new Error("model list must not be inline in the main panel");

const menuText = text(menu);
if (!menuText.includes("模型")) throw new Error("model row label missing");
// The model row's trailing glyph must be the DSH chevron-right SVG, not text.
const modelRowChevron = find(modelRow, (n) => n.props?.className === "dsh-es-chevron");
if (!modelRowChevron || modelRowChevron.type !== "svg") {
    throw new Error("model row must use the DSH svg chevron, not a text glyph");
}
if (menuText.includes("▾") || menuText.includes("▴")) throw new Error("text chevron glyphs must not be rendered");

// 8. Open the secondary menu (click the model row) and re-render
modelRow.props.onClick();
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const menu2 = find(tree, (n) => n.props?.className === "dsh-es-menu");
const sliderWrap2 = find(menu2, (n) => n.props?.className === "dsh-es-sliderWrap");
const divider2 = find(menu2, (n) => n.props?.className === "dsh-es-menuDivider");
if (!sliderWrap2 || !divider2) throw new Error("slider must stay visible while the model list is open");

// The secondary window is a separate floating popover above the main panel.
const modelMenu = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
if (!modelMenu) throw new Error("secondary model window not rendered");
const modelMenuStyle = modelMenu.props.style || {};
if (modelMenuStyle.position !== "absolute") throw new Error("secondary window must be position:absolute");
if (typeof modelMenuStyle.bottom !== "string" || !modelMenuStyle.bottom.includes("100%")) {
    throw new Error(`secondary window must float above the panel, got ${JSON.stringify(modelMenuStyle)}`);
}
const listText = text(modelMenu);
if (!listText.includes("MiMo")) throw new Error("model list must contain the Xiaomi model group");
const deepseekItem = find(modelMenu, (n) => n.props?.type === "button" && text(n).includes("DeepSeek-V4-Flash"));
if (!deepseekItem) throw new Error("DeepSeek official model missing from list");
if (deepseekItem.props.disabled === true || deepseekItem.props["aria-disabled"] === true) {
    throw new Error("text-only models must stay clickable until the host rejects them");
}
if (find(deepseekItem, (n) => n.props?.className === "dsh-es-menuItemNotice")) {
    throw new Error("image notice must stay hidden until the current session has images");
}

function renderWithDraftImages() {
    beginRender();
    return registered.component({
        locked: false,
        available: face.available,
        directory: face.directory,
        load: face.load,
        select: face.select,
        useInput: (select) => select({
            draft: "",
            imageIds: ["draft-img-1"],
            draftRev: 0,
            phase: "plain",
            occurrences: [],
            queue: []
        })
    });
}

// Ensure menu is open for image test: render, check, open if needed
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
let menuForImageTest = find(tree, (n) => n.props?.className === "dsh-es-menu");
if (!menuForImageTest) {
    // Menu is closed, open it via trigger
    tree.children[0].props.onClick();
    beginRender();
    tree = registered.component({
        locked: false,
        available: face.available,
        directory: face.directory,
        load: face.load,
        select: face.select
    });
    menuForImageTest = find(tree, (n) => n.props?.className === "dsh-es-menu");
    if (!menuForImageTest) throw new Error("menu must open for image test");
}
// Ensure secondary model menu is open
let modelMenuForImageTest = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
if (!modelMenuForImageTest) {
    const modelRowForImageTest = find(menuForImageTest, (n) => n.props?.className === "dsh-es-modelRow");
    if (!modelRowForImageTest) throw new Error("model row must be present for image test");
    modelRowForImageTest.props.onClick();
}
// Now render with draft images (menus stay open via mock state)
tree = renderWithDraftImages();
const imagedMenu = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
const imagedVision = find(imagedMenu, (n) => n.props?.type === "button" && text(n).includes("DeepSeek-V4-Flash-Vision-Exp"));
if (!imagedVision) throw new Error("DeepSeek Flash Vision Exp model missing after draft image render");
if (find(imagedVision, (n) => n.props?.className === "dsh-es-menuItemNotice")) {
    throw new Error("DeepSeek Flash Vision Exp must not show an image incompatibility notice");
}
const imagedDeepseek = find(imagedMenu, (n) => n.props?.type === "button" && text(n).includes("DeepSeek-V4-Flash"));
if (!imagedDeepseek) throw new Error("DeepSeek official model missing after draft image render");
const deepseekNotice = find(imagedDeepseek, (n) => n.props?.className === "dsh-es-menuItemNotice");
if (!deepseekNotice || typeof deepseekNotice.props.onMouseEnter !== "function") {
    throw new Error("text-only model must show a hoverable notice icon once draft has images");
}
deepseekNotice.props.onMouseEnter({
    currentTarget: { getBoundingClientRect: () => ({ right: 120, bottom: 80 }) }
});
tree = renderWithDraftImages();
const hoverTip = find(tree, (n) => n.props?.className === "dsh-es-menuItemTip");
if (!hoverTip || !text(hoverTip).includes("当前草稿包含图片")) {
    throw new Error("hover tip must explain the image incompatibility only when draft has images");
}

// 10. Slider: the native input sits above the reference-style rail, fill,
// and embedded tick markers. Dragging updates the draft locally.
const sliderRail = find(sliderWrap2, (n) => n.props?.className === "dsh-es-sliderRail");
const sliderTicks = find(sliderWrap2, (n) => n.props?.className === "dsh-es-sliderTicks");
const slider = findRange(sliderWrap2);
const sliderFill = findSliderFill(sliderWrap2);
if (!sliderRail || !sliderTicks || !slider || !sliderFill) throw new Error("reference-style slider layers missing");
if (Number(slider.props.value) !== 0) throw new Error("slider value should map low -> index 0");
if (sliderFill.props.style.width !== "0px") throw new Error("first notch fill must sit fully under the thumb");
const sliderKnob = find(sliderWrap2, (n) => n.props?.className === "dsh-es-sliderKnob");
if (!sliderKnob) throw new Error("custom slider knob missing");
if (sliderKnob.props.style.left !== "15px") throw new Error("first notch knob must stay inside the rail");
// Drag to the penultimate notch: it must remain fully blue, with no purple.
slider.props.onInput({ currentTarget: { value: "1" } });
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const slider2 = findRange(tree);
const fill2 = findSliderFill(tree);
if (Number(slider2.props.value) !== 1) throw new Error("draft must move the thumb to the penultimate notch");
if (fill2.props.style.width !== "calc(50% + 0px)") throw new Error("mid fill must end at the thumb center");
const knob2 = find(tree, (n) => n.props?.className === "dsh-es-sliderKnob");
if (!knob2 || knob2.props.style.left !== fill2.props.style.width) {
    throw new Error("mid fill must stay glued to the knob");
}
slider2.props.onInput({ currentTarget: { value: "2" } });
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const slider3 = findRange(tree);
const fill3 = findSliderFill(tree);
if (Number(slider3.props.value) !== 2) throw new Error("draft must move the thumb without committing");
if (fill3.props.style.width !== "calc(100% + -15px)") throw new Error("terminal fill must span the full rail");
const knob3 = find(tree, (n) => n.props?.className === "dsh-es-sliderKnob");
if (!knob3 || knob3.props.style.left !== "calc(100% - 15px)") {
    throw new Error("last notch knob must stay inside the rail");
}
if (!String(fill3.props.className).includes("dsh-es-sliderFillMax")) {
    throw new Error("last notch must reveal the bloom layer");
}
if (String(fill2.props.className).includes("dsh-es-sliderFillMax")) {
    throw new Error("penultimate notch must keep the bloom hidden");
}
if (!find(fill3, (n) => n.props?.className === "dsh-es-sliderBloom")) {
    throw new Error("bloom layer must stay mounted so color can fade");
}
if (directoryCalls.select.length !== 0) throw new Error("drag must not commit before release");
// Release commits
slider3.props.onMouseUp({ currentTarget: { value: "2" } });
const selected = directoryCalls.select[0];
if (!selected || selected.reasoningEffort !== "high") {
    throw new Error(`expected high, got ${JSON.stringify(selected)}`);
}

// 11. Model list must be scrollable (flex child with overflow-y:auto)
const modelMenu2 = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
const scrollList = find(modelMenu2, (n) => n.props?.className === "dsh-es-modelList");
if (!scrollList) throw new Error("model list node missing in secondary window");

// 12. Switching models must reset the local draft so the thumb follows the
//     real server-side effort (new model's default), not the stale drag.
slider3.props.onInput({ currentTarget: { value: "2" } });
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const draftSlider = findRange(tree);
if (Number(draftSlider.props.value) !== 2) throw new Error("draft should be at high before switching");
const modelMenu3 = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
const otherItem = find(modelMenu3, (n) => n.props?.type === "button" && text(n).includes("Other Model"));
if (!otherItem) throw new Error("second model item missing from list");
const selectBefore = directoryCalls.select.length;
otherItem.props.onClick();
if (directoryCalls.select.length !== selectBefore + 1) throw new Error("model switch must call select");
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const afterSwitch = findRange(tree);
const switchSelection = directoryCalls.select[directoryCalls.select.length - 1];
if (switchSelection.model !== "other-model" || switchSelection.reasoningEffort !== "low") {
    throw new Error(`switch must select other-model with its default low, got ${JSON.stringify(switchSelection)}`);
}
if (Number(afterSwitch.props.value) !== 0) {
    throw new Error(`after switching, thumb must show the new default (index 0), got ${afterSwitch.props.value}`);
}

// 13. When the host rejects a model switch, the secondary picker must stay
//     open and surface the returned error instead of silently closing.
const failingSelection = { provider: "xiaomi", model: "mimo-v2.5-pro" };
const modelRowForFail = find(tree, (n) => n.props?.className === "dsh-es-modelRow");
if (!modelRowForFail) throw new Error("model row missing before failed-switch test");
modelRowForFail.props.onClick();
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const originalSelect = face.select;
face.select = (selection) => {
    directoryCalls.select.push(selection);
    snapshot.error = `session.selectModel failed: model-unavailable: Model "${selection.model}" does not accept image input, but this session already contains images; select an image-capable model.`;
    return {
        then(resolve) {
            resolve(false);
            return this;
        }
    };
};
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const mimoItem = find(tree, (n) => n.props?.type === "button" && text(n).includes("MiMo-V2.5-Pro"));
if (!mimoItem) throw new Error("MiMo-V2.5-Pro item must be present in the model list");
mimoItem.props.onClick();
beginRender();
tree = registered.component({
    locked: false,
    available: face.available,
    directory: face.directory,
    load: face.load,
    select: face.select
});
const menuStillOpen = find(tree, (n) => n.props?.className === "dsh-es-menu");
const secondaryStillOpen = find(tree, (n) => n.props?.className === "dsh-es-modelMenu");
if (!menuStillOpen || !secondaryStillOpen) {
    throw new Error("failed model switch must keep the picker menus open");
}
const blockedItem = find(secondaryStillOpen, (n) => n.props?.type === "button" && text(n).includes("MiMo-V2.5-Pro"));
if (!blockedItem || blockedItem.props["aria-disabled"] !== true) {
    throw new Error("image-incompatible model must be marked unavailable after the host rejects it");
}
const blockedNotice = find(blockedItem, (n) => n.props?.className === "dsh-es-menuItemNotice");
if (!blockedNotice) throw new Error("blocked model must keep the notice icon");
const mimoSelection = directoryCalls.select[directoryCalls.select.length - 1];
if (mimoSelection.provider !== failingSelection.provider || mimoSelection.model !== failingSelection.model || mimoSelection.reasoningEffort !== void 0) {
    throw new Error(`MiMo selection must omit reasoningEffort, got ${JSON.stringify(mimoSelection)}`);
}
face.select = originalSelect;
snapshot.error = null;

// 7. Load must be delegated when available
face.load();
if (directoryCalls.load !== 1) throw new Error("load not delegated");

// ---------------------------------------------------------------------------
// Slider commit behaviour. These checks drive the component through
// flushEffects(), so effect-based logic (draft reset, queued release) is
// exercised too. Every scenario starts from a freshly mounted, open menu.
// ---------------------------------------------------------------------------
const realSelect = directory.select;
const tick = () => new Promise((resolve) => setImmediate(resolve));
function assert(condition, message) {
    if (!condition) throw new Error(message);
}
function renderSeat(props = {}) {
    beginRender();
    return registered.component({
        locked: false,
        available: face.available,
        directory: face.directory,
        load: face.load,
        select: face.select,
        ...props
    });
}
// Render and commit a few times so state set by effects shows up in the tree.
function settle() {
    for (let pass = 0; pass < 3; pass++) {
        renderSeat();
        flushEffects();
    }
    return renderSeat();
}
function mountOpenSeat() {
    resetComponentState();
    snapshot.current = { provider: "demo", model: "reasoning-model", reasoningEffort: "low" };
    snapshot.status = "ready";
    snapshot.error = null;
    directory.select = realSelect;
    directoryCalls.select.length = 0;
    const closed = renderSeat();
    flushEffects();
    closed.children[0].props.onClick();
    return settle();
}
function sliderValue(tree) {
    return Number(findRange(tree).props.value);
}
function sliderError(tree) {
    const node = find(tree, (n) => n.props?.className === "dsh-es-sliderError");
    return node === undefined ? null : text(node);
}
function drag(tree, value) {
    findRange(tree).props.onInput({ currentTarget: { value: String(value) } });
    return settle();
}
function release(tree, value) {
    findRange(tree).props.onMouseUp({ currentTarget: { value: String(value) } });
    return settle();
}

async function main() {
    // A. A refused write must roll the thumb back and say why.
    const failures = [
        {
            label: "resolves { ok: false }",
            hostError: `session.selectModel failed: Model "x" does not support reasoning effort "high".`,
            fail: () => Promise.resolve({ ok: false, error: { message: "refused" } }),
            message: "此模型不支持当前推理强度"
        },
        {
            label: "rejects",
            hostError: null,
            fail: () => Promise.reject(new Error("boom")),
            message: "推理强度切换失败"
        },
        {
            label: "reports a plain host error",
            hostError: "session is held by another writer",
            fail: () => Promise.resolve({ ok: false }),
            message: "session is held by another writer"
        }
    ];
    for (const failure of failures) {
        let tree = mountOpenSeat();
        directory.select = (selection) => {
            directoryCalls.select.push(selection);
            return failure.fail();
        };
        snapshot.error = failure.hostError;
        tree = drag(tree, 2);
        tree = release(tree, 2);
        assert(directoryCalls.select.length === 1 && directoryCalls.select[0].reasoningEffort === "high",
            `[${failure.label}] release must submit high once`);
        assert(sliderValue(tree) === 2, `[${failure.label}] thumb stays pinned while the write is in flight`);
        await tick();
        tree = settle();
        assert(sliderValue(tree) === 0, `[${failure.label}] refused write must roll the thumb back to the real effort`);
        assert(sliderError(tree) === failure.message,
            `[${failure.label}] expected error ${JSON.stringify(failure.message)}, got ${JSON.stringify(sliderError(tree))}`);
        // The next successful write clears the notice.
        directory.select = realSelect;
        snapshot.error = null;
        tree = drag(tree, 1);
        tree = release(tree, 1);
        assert(sliderError(tree) === null, `[${failure.label}] a new attempt must clear the error`);
        assert(sliderValue(tree) === 1, `[${failure.label}] successful write must land on the new notch`);
    }

    // B. Every key that moves a native range input must commit on keyup.
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]) {
        const tree = mountOpenSeat();
        findRange(tree).props.onKeyUp({ key, currentTarget: { value: "2" } });
        assert(directoryCalls.select.length === 1 && directoryCalls.select[0].reasoningEffort === "high",
            `${key} must commit the slider value on keyup`);
    }
    for (const key of ["Tab", "Escape", "Enter", "Shift", "a"]) {
        const tree = mountOpenSeat();
        findRange(tree).props.onKeyUp({ key, currentTarget: { value: "2" } });
        assert(directoryCalls.select.length === 0, `${key} must not commit`);
    }

    // C. A release while the store is busy is held back, then sent when it settles.
    {
        let tree = mountOpenSeat();
        snapshot.status = "selecting";
        tree = settle();
        tree = drag(tree, 2);
        tree = release(tree, 2);
        assert(directoryCalls.select.length === 0, "release while busy must not write yet");
        assert(sliderValue(tree) === 2, "thumb must stay where it was released while the write waits");
        snapshot.status = "ready";
        tree = settle();
        assert(directoryCalls.select.length === 1 && directoryCalls.select[0].reasoningEffort === "high",
            `queued release must be sent once the store is idle, got ${JSON.stringify(directoryCalls.select)}`);
        assert(sliderValue(tree) === 2, "thumb must end on the released notch");
    }
    {
        // A queued release belongs to the model it was made on. Notch 1 exists on
        // both models, so only the model check (not an out-of-range index) can stop it.
        let tree = mountOpenSeat();
        snapshot.status = "selecting";
        tree = settle();
        tree = drag(tree, 1);
        tree = release(tree, 1);
        assert(directoryCalls.select.length === 0, "release while busy must not write yet");
        snapshot.current = { provider: "demo", model: "other-model", reasoningEffort: "low" };
        snapshot.status = "ready";
        tree = settle();
        assert(directoryCalls.select.length === 0, "queued release must be dropped when the model changed");
        assert(sliderValue(tree) === 0, "thumb must follow the new model after the queued release is dropped");
    }

    // D. The hook count must not depend on `available` (no hooks after an early return).
    {
        resetComponentState();
        renderSeat({ available: true });
        const hooksWhenAvailable = hookCount;
        resetComponentState();
        const hidden = renderSeat({ available: false });
        assert(hidden === null, "unavailable seat must render nothing");
        assert(hookCount === hooksWhenAvailable,
            `hook count changed with availability: ${hooksWhenAvailable} vs ${hookCount}`);
    }

    // E. No console output, including the "no available models" state.
    {
        const savedGroups = snapshot.groups;
        resetComponentState();
        snapshot.groups = [];
        snapshot.current = null;
        snapshot.status = "ready";
        renderSeat();
        flushEffects();
        await tick();
        settle();
        snapshot.groups = savedGroups;
        assert(consoleCalls.length === 0, `plugin must not log: ${JSON.stringify(consoleCalls)}`);
    }

    // F. Declared services: DSH 0.1.2's directoryFor() reads ctx.remote.session on the
    //    caller's context, so the plugin must declare what the host provides. A declared
    //    service the host lacks (DSH 0.1.0 has no remote.session) would park the plugin.
    {
        const base = ["slots", "modelDirectories", "sessions"];
        const declared = (provided, withGet = true) => {
            const seen = [];
            const saved = registered;
            captured.apply({
                inject(services, callback) {
                    seen.push([...services]);
                    return ctx.inject(services, callback);
                },
                ...withGet ? { get: (name) => provided.includes(name) ? {} : undefined } : {}
            });
            registered = saved;
            return seen[0];
        };
        const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        assert(same(captured.inject, base), `module-level inject must stay the base list, got ${JSON.stringify(captured.inject)}`);
        assert(same(declared(["remote", "remote.session"]), [...base, "remote", "remote.session"]),
            "must declare remote and remote.session when the host provides them");
        assert(same(declared(["remote"]), [...base, "remote"]), "must declare only the services the host provides");
        assert(same(declared([]), base), "must not declare services the host lacks");
        assert(same(declared(["remote", "remote.session"], false), base), "a context without get() must fall back to the base list");
    }

    console.log("all checks passed");
    console.log("- config validation ok, priority =", registered.options.priority);
    console.log("- trigger label:", triggerLabel);
    console.log("- popover floats above trigger (absolute, bottom: calc(100% + 8px))");
    console.log("- secondary model window floats above the panel; slider submits:", JSON.stringify(selected));
    console.log("- refused writes roll back, all range keys commit, busy releases are queued");
    console.log("- hook count is stable across availability; no console output");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
