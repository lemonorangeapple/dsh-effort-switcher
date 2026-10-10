window.__ModuleLoader__.load({
    id: "dsh-effort-switcher",
    factory: (require) => {
        const module = { exports: {} };
        const exports = module.exports;
        const react = require("react");

        const name = "effort-switcher";
        const inject = ["slots", "modelDirectories", "sessions"];
        const slotName = "conversation.input.model";

        const css = `
.dsh-es-root {
    min-width: 0;
    position: relative;
    display: inline-flex;
}
.dsh-es-trigger {
    min-width: 0;
    max-width: min(360px, 45cqw);
    height: 28px;
    color: var(--dsw-alias-label-secondary);
    cursor: pointer;
    background: 0 0;
    border: none;
    border-radius: var(--dsw-radius-sm, 24px);
    outline: none;
    align-items: center;
    gap: 4px;
    padding: 0 4px 0 8px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    display: flex;
}
.dsh-es-trigger:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-es-trigger:focus-visible {
    box-shadow: 0 0 0 2px var(--dsw-alias-border-l3);
}
.dsh-es-trigger:disabled {
    color: var(--dsw-alias-label-dimmed);
    cursor: default;
}
.dsh-es-triggerLabel {
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    overflow: hidden;
}
.dsh-es-triggerEffort {
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    color: var(--dsw-alias-label-caption);
    flex-shrink: 1000;
    overflow: hidden;
}
.dsh-es-chevron {
    color: var(--dsw-alias-label-caption);
    flex: none;
    transition: transform .12s;
}
.dsh-es-chevronOpen {
    transform: rotate(180deg);
}
.dsh-es-menu {
    z-index: 9999;
    border: 1px solid var(--dsw-alias-border-inverted);
    background: var(--dsw-specific-menu);
    width: min(240px, calc(100vw - 32px));
    max-height: min(380px, calc(100vh - 96px));
    box-shadow: var(--dsw-shadow-lv3);
    color: var(--dsw-alias-label-primary);
    --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
    --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
    border-radius: var(--dsw-radius-lg, 10px);
    flex-direction: column;
    padding: 3px;
    display: flex;
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    overflow: hidden;
    animation: dsh-es-pop .12s ease-out;
}
.dsh-es-modelRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    border: none;
    background: 0 0;
    color: inherit;
    font: inherit;
    text-align: left;
    border-radius: var(--dsw-radius-sm, 6px);
    padding: 4px 6px;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
    color: var(--dsw-alias-label-secondary);
}
.dsh-es-modelRow:hover {
    background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-es-modelRowLabel {
    color: var(--dsw-alias-label-tertiary);
    flex: none;
    font-size: 11px;
}
.dsh-es-modelRowValue {
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    overflow: hidden;
    color: var(--dsw-alias-label-primary);
    font-weight: 500;
}
.dsh-es-modelList {
    overflow-y: auto;
    min-height: 0;
    flex: 1 1 auto;
    border-radius: var(--dsw-radius-sm, 6px);
    margin: 0 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.dsh-es-modelList::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}
.dsh-es-modelMenu {
    z-index: 10000;
    border: 1px solid var(--dsw-alias-border-inverted);
    background: var(--dsw-specific-menu);
    width: min(220px, calc(100vw - 32px));
    max-height: min(240px, calc(100vh - 96px));
    box-shadow: var(--dsw-shadow-lv3);
    color: var(--dsw-alias-label-primary);
    --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
    --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
    border-radius: var(--dsw-radius-lg, 10px);
    flex-direction: column;
    padding: 3px;
    display: flex;
    overflow: hidden;
    animation: dsh-es-pop .12s ease-out;
}
.dsh-es-modelMenu .dsh-es-modelList {
    max-height: none;
    margin: 0;
}
.dsh-es-modelMenu .dsh-es-menuGroup:first-child {
    padding-top: 6px;
}
.dsh-es-menuGroup {
    color: var(--dsw-alias-label-tertiary);
    padding: 6px 8px 2px;
    font-size: 10px;
    line-height: 14px;
}
.dsh-es-menuItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    border: none;
    background: 0 0;
    color: inherit;
    font: inherit;
    text-align: left;
    border-radius: var(--dsw-radius-sm, 6px);
    padding: 4px 6px;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
}
.dsh-es-menuItem:hover {
    background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-es-menuItemActive {
    color: var(--dsw-alias-state-info-primary);
}
.dsh-es-menuItemBlocked {
    color: var(--dsw-alias-label-tertiary);
    cursor: not-allowed;
}
.dsh-es-menuItemBlocked:hover {
    background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-es-menuItemNotice {
    position: relative;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: var(--dsw-alias-label-tertiary);
}
.dsh-es-menuItemTip {
    z-index: 10001;
    position: fixed;
    width: max-content;
    max-width: 200px;
    padding: 5px 6px;
    border: 1px solid var(--dsw-alias-border-inverted);
    border-radius: var(--dsw-radius-sm, 6px);
    background: var(--dsw-specific-menu);
    box-shadow: var(--dsw-shadow-lv3);
    color: var(--dsw-alias-label-primary);
    font-size: 11px;
    line-height: 15px;
    white-space: normal;
    pointer-events: none;
}
.dsh-es-menuItemDesc {
    color: var(--dsw-alias-label-caption);
    font-size: 11px;
    line-height: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.dsh-es-menuStatus, .dsh-es-menuEmpty {
    color: var(--dsw-alias-label-tertiary);
    padding: 8px;
    font-size: 12px;
    line-height: 18px;
}
.dsh-es-menuError {
    background: var(--dsw-alias-interactive-bg-hover-danger);
    color: var(--dsw-alias-state-error-primary);
    border-radius: var(--dsw-radius-sm, 6px);
    margin: 3px;
    padding: 5px 6px;
    font-size: 11px;
    line-height: 18px;
}
.dsh-es-menuDivider {
    height: 1px;
    margin: 4px 0;
    background: var(--dsw-alias-border-l1);
    flex: none;
}
/* DSH 0.1.2+ applies corner-shape: superellipse(1.5) to every element, which
   turns border-radius circles into rounded squares. The slider's pill and
   round parts opt back out the same way the host's own circular controls do. */
.dsh-es-sliderWrap {
    padding: 3px 8px 5px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: none;
}
.dsh-es-sliderHead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 11px;
    line-height: 16px;
    color: var(--dsw-alias-label-secondary);
}
.dsh-es-sliderHead strong {
    color: var(--dsw-alias-label-primary);
    font-weight: 600;
}
.dsh-es-sliderRail {
    position: relative;
    height: 26px;
    margin: 8px 0 10px;
}
.dsh-es-sliderGroove {
    position: absolute;
    inset: 0;
    overflow: hidden;
    corner-shape: round;
    border-radius: 13px;
    pointer-events: none;
}
.dsh-es-sliderTrack, .dsh-es-sliderFill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    corner-shape: round;
    border-radius: 13px;
    pointer-events: none;
}
.dsh-es-sliderTrack {
    right: 0;
    background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-es-sliderFill {
    z-index: 1;
    overflow: hidden;
    background: #4c8dff;
    transition: width .315s ease;
}
.dsh-es-sliderBloom {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #4c8dff 0%, #7b6cff 52%, #b56bff 100%);
    opacity: 0;
    transition: opacity .315s ease;
}
.dsh-es-sliderFillMax .dsh-es-sliderBloom {
    opacity: 1;
}
.dsh-es-sliderKnob {
    position: absolute;
    z-index: 4;
    top: 50%;
    width: 30px;
    height: 30px;
    margin-left: -15px;
    pointer-events: none;
    transform: translateY(-50%);
    transition: left .315s ease;
}
.dsh-es-sliderKnobFace {
    width: 100%;
    height: 100%;
    corner-shape: round;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: none;
}
.dsh-es-sliderTicks {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 15px;
    bottom: 0;
    left: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;
}
.dsh-es-sliderTick {
    width: 4px;
    height: 4px;
    corner-shape: round;
    border-radius: 50%;
    background: rgb(255 255 255 / 38%);
}
.dsh-es-sliderTickActive {
    background: rgb(255 255 255 / 38%);
}
.dsh-es-slider {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    z-index: 3;
    top: 50%;
    right: 0;
    bottom: auto;
    left: 0;
    width: 100%;
    height: 38px;
    transform: translateY(-50%);
    margin: 0;
    background: transparent;
    cursor: pointer;
    outline: none;
    accent-color: transparent;
    color: transparent;
}
.dsh-es-slider:disabled {
    cursor: wait;
    opacity: .6;
}
.dsh-es-slider::-webkit-slider-runnable-track {
    height: 26px;
    border: none;
    border-radius: 13px;
    background: transparent;
}
.dsh-es-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    margin-top: -2px;
    border-radius: 50%;
    background: transparent;
    border: none;
    box-shadow: none;
    cursor: pointer;
}
.dsh-es-slider::-moz-range-track, .dsh-es-slider::-moz-range-progress {
    height: 26px;
    border: none;
    border-radius: 13px;
    background: transparent;
}
.dsh-es-slider::-moz-range-thumb {
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: transparent;
    border: none;
    box-shadow: none;
    cursor: pointer;
}
.dsh-es-sliderDesc {
    margin: 2px 0 0;
    color: var(--dsw-alias-label-caption);
    font-size: 11px;
    line-height: 15px;
}
.dsh-es-sliderError {
    margin: 2px 0 0;
    padding: 4px 6px;
    border-radius: var(--dsw-radius-sm, 6px);
    background: var(--dsw-alias-interactive-bg-hover-danger);
    color: var(--dsw-alias-state-error-primary);
    font-size: 11px;
    line-height: 15px;
}
@keyframes dsh-es-pop {
    from {
        opacity: 0;
        transform: translateY(6px) scale(.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
`;

        // Inject styles at module load, exactly like the original ModelSelect
        // bundle does — the client sandbox may not run effect callbacks.
        const STYLE_TAG_ID = "dsh-effort-switcher/seat.css";
        if (typeof document !== "undefined" && document.querySelector(`style[data-plugin-css=${JSON.stringify(STYLE_TAG_ID)}]`) === null) {
            const tag = document.createElement("style");
            tag.dataset.plugin = "dsh-effort-switcher";
            tag.dataset.pluginCss = STYLE_TAG_ID;
            tag.textContent = css;
            document.head.appendChild(tag);
        }

        function effortIndex(levels, current) {
            const index = levels.findIndex((level) => level.id === current);
            return index >= 0 ? index : Math.floor((levels.length - 1) / 2);
        }

        function modelKey(provider, model) {
            return `${provider}/${model}`;
        }

        function explainSelectionError(message) {
            if (typeof message !== "string" || message.length === 0) return "无法切换模型";
            if (message.includes("does not accept image input") || message.includes("already contains images")) {
                return IMAGE_BLOCK_REASON;
            }
            if (message.includes("does not support reasoning effort")) {
                return "此模型不支持当前推理强度";
            }
            return message;
        }

        function explainEffortError(message) {
            if (typeof message !== "string" || message.length === 0) return "推理强度切换失败";
            return explainSelectionError(message);
        }

        // Every key that moves a native range input; the new value is committed on keyup.
        const COMMIT_KEYS = new Set([
            "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
            "Home", "End", "PageUp", "PageDown"
        ]);

        // Same glyphs as DSH's IconChevronDownOutline14 / IconChevronRightOutline14.
        const ICON_CHEVRON_DOWN = "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z";
        const ICON_CHEVRON_RIGHT = "M5.5 2.15137L5.92383 2.57617L8.65137 5.30273C8.90706 5.55843 9.13382 5.78438 9.29785 5.98828C9.46883 6.20088 9.61756 6.44405 9.66602 6.75C9.69222 6.91565 9.69222 7.08435 9.66602 7.25C9.61756 7.55595 9.46883 7.79912 9.29785 8.01172C9.13382 8.21561 8.90706 8.44157 8.65137 8.69727L5.92383 11.4238L5.5 11.8486L4.65137 11L5.07617 10.5762L7.80273 7.84863C8.07732 7.57405 8.24849 7.40124 8.3623 7.25977C8.46904 7.12709 8.47813 7.07728 8.48047 7.0625C8.48703 7.02105 8.48703 6.97895 8.48047 6.9375C8.47813 6.92272 8.46904 6.87291 8.3623 6.74023C8.24848 6.59876 8.07732 6.42595 7.80273 6.15137L5.07617 3.42383L4.65137 3L5.5 2.15137Z";
        const ICON_WARNING_BAR = "M6.3002 3.32843L7.69986 3.32843L7.69986 7.79657H6.3002L6.3002 3.32843Z";
        const ICON_WARNING_DOT = "M6.3002 9.01935H7.69986V10.6711H6.3002V9.01935Z";
        const ICON_WARNING_RING = "M12.6328 6.99976C12.6328 3.88874 10.111 1.36694 7 1.36694C3.88899 1.36695 1.3672 3.88875 1.36719 6.99976C1.36719 10.1108 3.88899 12.6326 7 12.6326C10.111 12.6326 12.6328 10.1108 12.6328 6.99976ZM13.8582 6.99976C13.8582 10.7873 10.7876 13.8579 7 13.8579C3.21244 13.8579 0.141846 10.7873 0.141846 6.99976C0.141857 3.2122 3.21245 0.141612 7 0.141602C10.7876 0.141602 13.8581 3.21219 13.8582 6.99976Z";
        const IMAGE_BLOCK_REASON = "当前草稿包含图片，此模型不支持图片输入";
        const DEEPSEEK_FLASH_VISION_EXP_MODEL = "deepseek-v4-flash-vision-exp";

        const chevronIcon = (path, className) => react.createElement(
            "svg",
            { className, width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            react.createElement("path", { d: path, fill: "currentColor" })
        );

        const warningIcon = (className) => react.createElement(
            "svg",
            { className, width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            react.createElement("path", { d: ICON_WARNING_BAR, fill: "currentColor" }),
            react.createElement("path", { d: ICON_WARNING_DOT, fill: "currentColor" }),
            react.createElement("path", { d: ICON_WARNING_RING, fill: "currentColor" })
        );

        function knownTextOnlyModel(provider, model) {
            return provider === "deepseek-official" && model.id !== DEEPSEEK_FLASH_VISION_EXP_MODEL;
        }

        function defaultUseInput(select) {
            return select({ draft: "", imageIds: [], draftRev: 0, phase: "plain", occurrences: [], queue: [] });
        }

        function EffortSliderSeat({ locked, available, directory, load, select, useSession, useInput }) {
            const state = react.useSyncExternalStore(
                (listener) => directory.subscribe(listener),
                () => directory.getSnapshot()
            );

            const [open, setOpen] = react.useState(false);
            const [modelsOpen, setModelsOpen] = react.useState(false);
            const [blockedModels, setBlockedModels] = react.useState({});
            const [hoveredNotice, setHoveredNotice] = react.useState(null);
            const [initialLoading, setInitialLoading] = react.useState(true);
            const [draft, setDraft] = react.useState(-1);
            const [pendingIndex, setPendingIndex] = react.useState(-1);
            // A thumb release that arrived while the store was busy; sent once it settles.
            const [queued, setQueued] = react.useState(null);
            const [sliderError, setSliderError] = react.useState(null);
            const [panelHeight, setPanelHeight] = react.useState(0);
            const rootRef = react.useRef(null);
            const triggerRef = react.useRef(null);
            const panelRef = react.useRef(null);
            // Model the store currently reports, readable from async callbacks.
            const liveModelRef = react.useRef(null);
            const inputSnapshot = (useInput ?? defaultUseInput)((s) => s);
            const draftHasImages = inputSnapshot !== null && inputSnapshot !== undefined && (inputSnapshot.imageIds?.length ?? 0) > 0;

            react.useEffect(() => {
                if (available) {
                    load().then(() => setInitialLoading(false), () => setInitialLoading(false));
                }
            }, [available, load]);

            react.useEffect(() => {
                if (!open) setHoveredNotice(null);
            }, [open]);

            react.useEffect(() => {
                if (!open) return;
                const closeOutside = (event) => {
                    if (!rootRef.current?.contains(event.target)) setOpen(false);
                };
                document.addEventListener("mousedown", closeOutside);
                return () => document.removeEventListener("mousedown", closeOutside);
            }, [open]);

            react.useEffect(() => {
                if (open && panelRef.current) {
                    setPanelHeight(panelRef.current.offsetHeight || 0);
                }
            }, [open, state.status]);

            const currentChoice = react.useMemo(() => {
                if (state.current === null) return undefined;
                for (const group of state.groups) {
                    const model = group.models.find((candidate) => candidate.id === state.current.model);
                    if (model !== undefined && group.id === state.current.provider) {
                        return { group, model };
                    }
                }
                return undefined;
            }, [state.current?.provider, state.current?.model, state.groups]);

            const busy = state.status === "selecting" || state.status === "loading";
            const currentEffort = state.current?.reasoningEffort
                ?? currentChoice?.model.reasoning?.defaultEffort
                ?? undefined;
            const levels = currentChoice?.model.reasoning?.efforts ?? [];
            const currentIndex = currentChoice === undefined ? -1 : effortIndex(levels, currentEffort);
            const currentLevel = currentChoice === undefined ? undefined : levels[currentIndex];
            const effortLabel = currentLevel === undefined
                ? undefined
                : currentLevel.name ?? currentEffort;
            const modelLabel = currentChoice === undefined
                ? "选择模型"
                : currentChoice.model.name;
            const fullLabel = effortLabel === undefined ? modelLabel : `${modelLabel} · ${effortLabel}`;
            const currentModelKey = state.current === null ? null : modelKey(state.current.provider, state.current.model);
            liveModelRef.current = currentModelKey;

            // A committed model switch replaces the effort server-side; reset the
            // local draft so the thumb follows the real selection.
            react.useEffect(() => {
                setDraft(-1);
                setPendingIndex(-1);
                setQueued(null);
                setSliderError(null);
            }, [state.current?.provider, state.current?.model]);

            // Submit a slider position as the current model's reasoning effort. If the
            // host refuses the write, drop the pinned thumb so it shows the real
            // effort again instead of a value that never took effect.
            const submitEffort = (nextIndex) => {
                const nextEffort = levels[nextIndex]?.id;
                if (nextEffort === undefined || state.current === null || nextEffort === currentEffort) {
                    setDraft(-1);
                    setPendingIndex(-1);
                    return;
                }
                const submittedKey = currentModelKey;
                setSliderError(null);
                setDraft(nextIndex);
                setPendingIndex(nextIndex);
                select({
                    provider: state.current.provider,
                    model: state.current.model,
                    reasoningEffort: nextEffort
                }).then((accepted) => {
                    if (accepted || liveModelRef.current !== submittedKey) return;
                    setDraft(-1);
                    setPendingIndex(-1);
                    setSliderError(explainEffortError(directory.getSnapshot().error));
                });
            };

            react.useEffect(() => {
                if (pendingIndex < 0) return;
                if (currentIndex === pendingIndex) {
                    setDraft(-1);
                    setPendingIndex(-1);
                }
            }, [currentIndex, pendingIndex]);

            // Send the release that was held back while the store was busy.
            react.useEffect(() => {
                if (busy || queued === null) return;
                setQueued(null);
                if (queued.key !== currentModelKey) return;
                submitEffort(queued.index);
            }, [busy, queued]);

            // Keep every hook above this line: bailing out earlier changes the hook
            // count between renders.
            if (!available) return null;

            const chooseModel = (group, model) => {
                const key = modelKey(group.id, model.id);
                if (blockedModels[key] !== undefined) return;
                if (state.current?.provider === group.id && state.current.model === model.id) {
                    setModelsOpen(false);
                    return;
                }
                const selection = {
                    provider: group.id,
                    model: model.id,
                    ...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
                };
                select(selection).then((accepted) => {
                    if (!accepted) {
                        setBlockedModels((current) => ({
                            ...current,
                            [key]: explainSelectionError(directory.getSnapshot().error)
                        }));
                        return;
                    }
                    setDraft(-1);
                    setPendingIndex(-1);
                    setModelsOpen(false);
                });
            };

            const updateDraft = (event) => {
                setDraft(Number(event.currentTarget.value));
            };

            // CSS hover on .dsh-es-sliderRail now handles knob scaling.

            // Commit the live thumb value on release. Keep the local pin until
            // the store catches up so the knob does not snap back. A release that
            // lands while the store is busy is queued, not dropped.
            const commitEffort = (event) => {
                const nextIndex = Number(event?.currentTarget?.value ?? draft);
                if (!Number.isFinite(nextIndex) || nextIndex < 0) return;
                if (busy) {
                    setQueued({ index: nextIndex, key: currentModelKey });
                    return;
                }
                submitEffort(nextIndex);
            };

            const onSliderKeyUp = (event) => {
                if (COMMIT_KEYS.has(event.key)) commitEffort(event);
            };

            // Secondary menu: model picker, shown when the model row is clicked.
            const modelList = (state.status === "loading" || initialLoading) && state.groups.length === 0
                ? react.createElement("div", { className: "dsh-es-menuStatus" }, "加载中…")
                : state.groups.length === 0
                    ? state.error
                        ? react.createElement("div", { className: "dsh-es-menuError" }, state.error)
                        : react.createElement("div", { className: "dsh-es-menuEmpty" }, "没有可用的模型。")
                    : state.groups.map((group) => react.createElement(
                        react.Fragment,
                        { key: group.id },
                        react.createElement("div", { className: "dsh-es-menuGroup" }, group.name),
                        group.models.map((model) => {
                            const active = state.current?.provider === group.id && state.current.model === model.id;
                            const failedReason = blockedModels[modelKey(group.id, model.id)];
                            const imageBlocked = draftHasImages && knownTextOnlyModel(group.id, model);
                            const warned = failedReason !== undefined || imageBlocked;
                            const blocked = failedReason !== undefined;
                            const noticeReason = failedReason ?? (imageBlocked ? IMAGE_BLOCK_REASON : undefined);
                            return react.createElement(
                                "button",
                                {
                                    key: model.id,
                                    type: "button",
                                    className: [
                                        "dsh-es-menuItem",
                                        active ? "dsh-es-menuItemActive" : "",
                                        blocked ? "dsh-es-menuItemBlocked" : ""
                                    ].filter(Boolean).join(" "),
                                    "aria-disabled": blocked,
                                    onClick: () => chooseModel(group, model)
                                },
                                react.createElement("span", { className: "dsh-es-triggerLabel" }, model.name),
                                warned
                                    ? react.createElement(
                                        "span",
                                        {
                                            className: "dsh-es-menuItemNotice",
                                            tabIndex: 0,
                                            onMouseEnter: (event) => {
                                                const box = event.currentTarget.getBoundingClientRect();
                                                setHoveredNotice({
                                                    text: noticeReason,
                                                    left: Math.round(box.right - 8),
                                                    top: Math.round(box.bottom + 6)
                                                });
                                            },
                                            onMouseLeave: () => setHoveredNotice(null)
                                        },
                                        warningIcon()
                                    )
                                    : model.description !== void 0
                                        ? react.createElement("span", { className: "dsh-es-menuItemDesc" }, model.description)
                                        : null
                            );
                        })
                    ));

            // Always-visible slider block below the model row.
            // Dragging updates only the local draft (fluid); the selection is
            // committed on release / keyboard confirm.
            const displayedIndex = draft >= 0 ? draft : pendingIndex >= 0 ? pendingIndex : currentIndex;
            const displayedLevel = levels[displayedIndex];
            const maxIndex = levels.length - 1;
            const fillPct = levels.length <= 1 ? 100 : Math.round((displayedIndex / maxIndex) * 100);
            const atMax = displayedIndex >= levels.length - 1;
            const thumbRadius = 15;
            const travel = `calc(${fillPct}% + ${Math.round(thumbRadius - (thumbRadius * 2 * fillPct) / 100)}px)`;
            const knobLeft = atMax || levels.length <= 1
                ? `calc(100% - ${thumbRadius}px)`
                : fillPct <= 0
                    ? `${thumbRadius}px`
                    : travel;
            // Fill always ends at the knob center; at max that is
            // calc(100% - 15px), never 100%, so no color bleeds past the knob.
            const fillWidth = fillPct <= 0
                ? "0px"
                : travel;

            const slider = currentChoice !== undefined && levels.length > 0
                ? react.createElement(
                    "div",
                    { className: "dsh-es-sliderWrap" },
                    react.createElement(
                        "div",
                        { className: "dsh-es-sliderHead" },
                        react.createElement("span", null, "推理强度"),
                        react.createElement("strong", null, displayedLevel?.name ?? currentEffort)
                    ),
                    react.createElement(
                        "div",
                        { className: "dsh-es-sliderRail" },
                        react.createElement(
                            "div",
                            { className: "dsh-es-sliderGroove", "aria-hidden": true },
                            react.createElement("div", { className: "dsh-es-sliderTrack" }),
                            react.createElement("div", {
                                className: atMax ? "dsh-es-sliderFill dsh-es-sliderFillMax" : "dsh-es-sliderFill",
                                style: { width: fillWidth }
                            }, react.createElement("div", { className: "dsh-es-sliderBloom" }))
                        ),
                        react.createElement(
                            "div",
                            {
                                className: "dsh-es-sliderKnob",
                                "aria-hidden": true,
                                style: { left: knobLeft }
                            },
                            react.createElement("div", { className: "dsh-es-sliderKnobFace" })
                        ),
                        react.createElement(
                            "div",
                            { className: "dsh-es-sliderTicks", "aria-hidden": true },
                            levels.map((level, index) => react.createElement("span", {
                                key: level.id,
                                className: index <= displayedIndex ? "dsh-es-sliderTick dsh-es-sliderTickActive" : "dsh-es-sliderTick"
                            }))
                        ),
                        react.createElement("input", {
                            className: "dsh-es-slider",
                            type: "range",
                            min: 0,
                            max: Math.max(levels.length - 1, 0),
                            step: 1,
                            value: displayedIndex,
                            disabled: locked,
                            onInput: updateDraft,
                            onChange: updateDraft,
                            onMouseUp: commitEffort,
                            onTouchEnd: commitEffort,
                            onKeyUp: onSliderKeyUp,
                            "aria-label": "推理强度"
                        })
                    ),
                    displayedLevel?.description
                        ? react.createElement("p", { className: "dsh-es-sliderDesc" }, displayedLevel.description)
                        : null,
                    sliderError === null
                        ? null
                        : react.createElement("div", { className: "dsh-es-sliderError", role: "status" }, sliderError)
                )
                : null;

            // Secondary floating window: model picker, anchored above the main panel.
            const modelMenu = open && modelsOpen ? react.createElement(
                "div",
                {
                    className: "dsh-es-modelMenu",
                    role: "menu",
                    style: {
                        position: "absolute",
                        right: "0",
                        bottom: `calc(100% + 8px + ${panelHeight}px)`,
                        zIndex: 10000
                    }
                },
                react.createElement("div", { className: "dsh-es-modelList" }, modelList)
            ) : null;

            // Popover window floating above the trigger; never occupies the input layout.
            const menu = open ? react.createElement(
                "div",
                {
                    ref: panelRef,
                    className: "dsh-es-menu",
                    role: "menu",
                    style: { position: "absolute", bottom: "calc(100% + 8px)", right: "0" }
                },
                react.createElement(
                    "button",
                    {
                        type: "button",
                        className: "dsh-es-modelRow",
                        "aria-haspopup": "menu",
                        "aria-expanded": modelsOpen,
                        onClick: () => setModelsOpen((value) => !value)
                    },
                    react.createElement("span", { className: "dsh-es-modelRowLabel" }, "模型"),
                    react.createElement("span", { className: "dsh-es-modelRowValue" }, currentChoice?.model.name ?? "—"),
                    chevronIcon(ICON_CHEVRON_RIGHT, "dsh-es-chevron")
                ),
                slider === null
                    ? null
                    : react.createElement(
                        react.Fragment,
                        null,
                        react.createElement("div", { className: "dsh-es-menuDivider" }),
                        slider
                    )
            ) : null;

            return react.createElement(
                "div",
                {
                    className: "dsh-es-root",
                    "data-dsh-plugin": name,
                    ref: rootRef,
                    style: { position: "relative", display: "inline-flex" }
                },
                react.createElement(
                    "button",
                    {
                        ref: triggerRef,
                        type: "button",
                        className: "dsh-es-trigger",
                        "aria-label": fullLabel,
                        "aria-haspopup": "menu",
                        "aria-expanded": open,
                        title: fullLabel,
                        disabled: locked,
                        onClick: () => {
                            setOpen((value) => !value);
                            setModelsOpen(false);
                        }
                    },
                    react.createElement("span", { className: "dsh-es-triggerLabel" }, modelLabel),
                    effortLabel !== undefined
                        ? react.createElement("span", { className: "dsh-es-triggerEffort" }, effortLabel)
                        : null,
                    chevronIcon(ICON_CHEVRON_DOWN, open ? "dsh-es-chevron dsh-es-chevronOpen" : "dsh-es-chevron")
                ),
                menu,
                modelMenu,
                hoveredNotice
                    ? react.createElement(
                        "div",
                        {
                            className: "dsh-es-menuItemTip",
                            role: "tooltip",
                            style: {
                                left: `${hoveredNotice.left}px`,
                                top: `${hoveredNotice.top}px`,
                                transform: "translateX(-100%)"
                            }
                        },
                        hoveredNotice.text
                    )
                    : null
            );
        }

        // `modelDirectories.directoryFor()` runs on the caller's context. From DSH
        // 0.1.2 it reads `ctx.remote.session`, and cordis refuses to read a service
        // the caller did not declare ("cannot get property ... without inject"),
        // which crashes the slot entry and hands the seat back to the host's own
        // selector. Older hosts (DSH 0.1.0's own model-selection plugin does not
        // declare `remote.session`) may not provide it, and a declared but missing
        // service would leave this plugin waiting forever, so declare only what the
        // running host actually provides.
        const DIRECTORY_SERVICES = ["remote", "remote.session"];

        function injectFor(ctx) {
            const extra = typeof ctx.get === "function"
                ? DIRECTORY_SERVICES.filter((name) => ctx.get(name) !== void 0)
                : [];
            return [...inject, ...extra];
        }

        const apply = (ctx) => {
            ctx.inject(injectFor(ctx), (scope) => {
                const slots = scope.get("slots");
                const models = scope.get("modelDirectories");
                const sessions = scope.get("sessions");

                return slots.inject(slotName, () => slots.register({
                    name: slotName,
                    priority: -100,
                    inject: (sessionId) => {
                        const directory = models.directoryFor(sessionId);
                        const available = sessions.subagentAddress(sessionId) === void 0;
                        // A write counts as accepted unless it rejects or resolves { ok: false }.
                        const accepted = (outcome) => !(outcome !== null && typeof outcome === "object" && outcome.ok === false);
                        return {
                            available,
                            directory: directory.store,
                            load: () => {
                                if (available) return directory.load().catch(() => {});
                                return Promise.resolve();
                            },
                            select: (selection) => available ? directory.select(selection).then(accepted, () => false) : Promise.resolve(false)
                        };
                    }
                }, EffortSliderSeat));
            });
        };

        const Config = {
            "~standard": {
                version: 1,
                vendor: "dsh-effort-switcher",
                validate(config) {
                    if (config === undefined || config === null) return { value: {} };
                    if (typeof config !== "object" || Array.isArray(config)) {
                        return {
                            issues: [{
                                message: "plugin config must be an object"
                            }]
                        };
                    }
                    return { value: config };
                }
            }
        };

        exports.name = name;
        exports.inject = inject;
        exports.apply = apply;
        exports.Config = Config;
        return module.exports;
    }
});
