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
    max-width: 200px;
    height: 26px;
    color: var(--dsw-alias-label-secondary);
    cursor: pointer;
    background: 0 0;
    border: none;
    border-radius: 22px;
    outline: none;
    align-items: center;
    gap: 3px;
    padding: 0 3px 0 6px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
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
    color: var(--dsw-alias-label-caption);
    flex: none;
}
/* Composer compact row (DSH >=0.1.7, incl. 0.2.0): when the control row
   cannot fit the text, the composer sets these variables and the Models
   glyph takes over, exactly like the shipped ModelSelect occupant. */
.dsh-es-triggerLabel,
.dsh-es-triggerEffort {
    display: var(--dsh-composer-model-text-display, block);
}
.dsh-es-triggerIcon {
    display: var(--dsh-composer-model-icon-display, none);
    flex: none;
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
    border-radius: 10px;
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
    border-radius: 6px;
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
    border-radius: 6px;
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
    border-radius: 10px;
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
    border-radius: 6px;
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
    border-radius: 6px;
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
    border-radius: 6px;
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
    border-radius: 13px;
    pointer-events: none;
}
.dsh-es-sliderTrack, .dsh-es-sliderFill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
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

        // DSH 0.2.0 display order shared by the shipped pickers: the account
        // route first, the official route next, everything else in catalog order.
        function groupRank(id) {
            return id === "deepseek-account" ? 0 : id === "deepseek-official" ? 1 : 2;
        }

        function orderedGroups(groups) {
            return groups
                .map((group, index) => [groupRank(group.id), index, group])
                .sort((left, right) => left[0] - right[0] || left[1] - right[1])
                .map((entry) => entry[2]);
        }

        // The shipped pickers localize the account route instead of showing the raw id.
        function groupLabel(group) {
            return group.id === "deepseek-account" ? "DeepSeek 账号" : group.name;
        }

        // Selection settlement across DSH versions: 0.2.0 (and 0.1.7+) resolve a
        // RemoteResult — rejection arrives as { ok: false, error } — while the
        // 0.1.x-era directory threw instead. A void resolution is a legacy success.
        function selectionAccepted(result) {
            return result === null || result === undefined || result.ok !== false;
        }

        function explainSelectionError(message) {
            if (typeof message !== "string" || message.length === 0) return "无法切换模型";
            if (message.includes("does not accept image input")
                || message.includes("already contains images")
                || message.includes("does not support image input")
                || message.includes("does not declare image input")) {
                return IMAGE_BLOCK_REASON;
            }
            if (message.includes("does not support reasoning effort")) {
                return "此模型不支持当前推理强度";
            }
            return message;
        }

        // Same glyphs as DSH's IconChevronDownOutline14 / IconChevronRightOutline14.
        const ICON_CHEVRON_DOWN = "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z";
        const ICON_CHEVRON_RIGHT = "M5.5 2.15137L5.92383 2.57617L8.65137 5.30273C8.90706 5.55843 9.13382 5.78438 9.29785 5.98828C9.46883 6.20088 9.61756 6.44405 9.66602 6.75C9.69222 6.91565 9.69222 7.08435 9.66602 7.25C9.61756 7.55595 9.46883 7.79912 9.29785 8.01172C9.13382 8.21561 8.90706 8.44157 8.65137 8.69727L5.92383 11.4238L5.5 11.8486L4.65137 11L5.07617 10.5762L7.80273 7.84863C8.07732 7.57405 8.24849 7.40124 8.3623 7.25977C8.46904 7.12709 8.47813 7.07728 8.48047 7.0625C8.48703 7.02105 8.48703 6.97895 8.48047 6.9375C8.47813 6.92272 8.46904 6.87291 8.3623 6.74023C8.24848 6.59876 8.07732 6.42595 7.80273 6.15137L5.07617 3.42383L4.65137 3L5.5 2.15137Z";
        const ICON_WARNING_BAR = "M6.3002 3.32843L7.69986 3.32843L7.69986 7.79657H6.3002L6.3002 3.32843Z";
        const ICON_WARNING_DOT = "M6.3002 9.01935H7.69986V10.6711H6.3002V9.01935Z";
        const ICON_WARNING_RING = "M12.6328 6.99976C12.6328 3.88874 10.111 1.36694 7 1.36694C3.88899 1.36695 1.3672 3.88875 1.36719 6.99976C1.36719 10.1108 3.88899 12.6326 7 12.6326C10.111 12.6326 12.6328 10.1108 12.6328 6.99976ZM13.8582 6.99976C13.8582 10.7873 10.7876 13.8579 7 13.8579C3.21244 13.8579 0.141846 10.7873 0.141846 6.99976C0.141857 3.2122 3.21245 0.141612 7 0.141602C10.7876 0.141602 13.8581 3.21219 13.8582 6.99976Z";
        // Same artwork as DSH's IconDataOutlineRegular: the Models glyph the compact composer row swaps in.
        const ICON_DATA_BODY = "M7.8667 0.349609C8.96906 0.349634 10.0601 0.481272 11.0317 0.735352C11.9973 0.987845 12.8453 1.362 13.4644 1.84766C14.0744 2.32629 14.507 2.95539 14.5161 3.69336H14.5171V8.53516C14.0843 8.32076 13.6108 8.17679 13.1108 8.11816C13.1831 7.96848 13.2162 7.82856 13.2163 7.70312V5.76758C12.6269 6.16618 11.8739 6.47995 11.0317 6.7002C10.0602 6.95423 8.96896 7.08494 7.8667 7.08496C6.76461 7.08493 5.67411 6.95415 4.70264 6.7002C3.85994 6.48006 3.10694 6.1662 2.51709 5.76758V7.70312L2.521 7.78418C2.56374 8.19554 2.93361 8.74414 3.91357 9.23145C4.9281 9.73585 6.35004 10.0371 7.8667 10.0371C8.26373 10.0371 8.6543 10.0141 9.03271 9.97461C8.75596 10.3799 8.54664 10.8349 8.42041 11.3232C8.23666 11.3313 8.0518 11.3369 7.8667 11.3369C6.20108 11.3369 4.57025 11.01 3.33447 10.3955C3.04163 10.2499 2.76658 10.0836 2.51709 9.90039V11.6738C2.51728 12.1379 2.88589 12.7556 3.92236 13.292C4.93457 13.8157 6.35342 14.1289 7.8667 14.1289C8.12318 14.1289 8.37694 14.1161 8.62646 14.0986C8.82021 14.5535 9.08999 14.9682 9.41943 15.3271C8.91285 15.3934 8.39149 15.4287 7.8667 15.4287C6.19761 15.4287 4.56379 15.0869 3.32568 14.4463C2.11244 13.8185 1.21649 12.8562 1.21631 11.6738V3.76367C1.21595 3.74853 1.21438 3.733 1.21436 3.71777C1.21436 2.96917 1.65103 2.33053 2.26807 1.84668C2.88747 1.36112 3.73675 0.987685 4.70264 0.735352C5.67413 0.481376 6.76457 0.349636 7.8667 0.349609ZM7.8667 1.65039C6.86269 1.65042 5.88326 1.77028 5.03076 1.99316C4.17183 2.2176 3.50421 2.52956 3.06982 2.87012C2.65043 3.19909 2.52622 3.48898 2.51709 3.69336V3.74414C2.52719 3.94845 2.65185 4.23772 3.06982 4.56543C3.50425 4.90601 4.17172 5.21795 5.03076 5.44238C5.88326 5.66527 6.8627 5.78513 7.8667 5.78516C8.8707 5.78513 9.85015 5.66525 10.7026 5.44238C11.5611 5.21787 12.2286 4.9049 12.6626 4.56445C13.0982 4.22252 13.2163 3.9231 13.2163 3.71777L13.2104 3.63574C13.1818 3.43623 13.044 3.16941 12.6626 2.87012C12.2286 2.52957 11.5614 2.21773 10.7026 1.99316C9.85009 1.77025 8.8708 1.65041 7.8667 1.65039Z";
        const ICON_DATA_GEAR = "M12.8936 10.0361L13.2061 10.5566C13.2296 10.5959 13.2651 10.6562 13.3027 10.707C13.3469 10.7666 13.4148 10.8431 13.5195 10.9023C13.6244 10.9617 13.725 10.9801 13.7988 10.9873C13.8619 10.9934 13.9318 10.9932 13.9775 10.9932H14.6162L14.8896 11.4502L14.5947 11.9443C14.5698 11.9859 14.5312 12.0483 14.5029 12.1084C14.4781 12.1611 14.4514 12.2312 14.4395 12.3164L14.4326 12.4072L14.4395 12.4971C14.4514 12.5825 14.4781 12.6532 14.5029 12.7061C14.5312 12.7661 14.5689 12.8287 14.5938 12.8701L14.8896 13.3633L14.6162 13.8213H13.9775C13.9318 13.8213 13.8619 13.821 13.7988 13.8271C13.7433 13.8326 13.6728 13.8442 13.5967 13.875L13.5195 13.9121C13.4148 13.9714 13.3469 14.0478 13.3027 14.1074C13.265 14.1583 13.2296 14.2186 13.2061 14.2578L12.8936 14.7783H12.3115L11.999 14.2578C11.9755 14.2186 11.9401 14.1583 11.9023 14.1074C11.8693 14.0628 11.823 14.0083 11.7578 13.959L11.6855 13.9121L11.6074 13.875C11.5316 13.8445 11.4615 13.8325 11.4062 13.8271C11.3432 13.821 11.2733 13.8213 11.2275 13.8213H10.5889L10.3135 13.3633L10.6104 12.8701C10.6352 12.8287 10.6739 12.7661 10.7021 12.7061C10.7352 12.6357 10.7724 12.534 10.7725 12.4072C10.7724 12.2804 10.7352 12.1788 10.7021 12.1084C10.6739 12.0483 10.6353 11.9859 10.6104 11.9443L10.3135 11.4502L10.5889 10.9932H11.2275C11.2733 10.9932 11.3432 10.9934 11.4062 10.9873C11.4801 10.9801 11.5808 10.9616 11.6855 10.9023C11.7903 10.843 11.8582 10.7666 11.9023 10.707C11.94 10.6562 11.9755 10.5959 11.999 10.5566L12.3115 10.0361H12.8936Z";
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

        const modelsIcon = (className) => react.createElement(
            "svg",
            { className, width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, strokeWidth: 1 },
            react.createElement("path", { d: ICON_DATA_BODY, fill: "currentColor" }),
            react.createElement("path", { d: ICON_DATA_GEAR, stroke: "currentColor", strokeMiterlimit: 10 })
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
            const [panelHeight, setPanelHeight] = react.useState(0);
            const rootRef = react.useRef(null);
            const triggerRef = react.useRef(null);
            const panelRef = react.useRef(null);
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

            // A committed model switch replaces the effort server-side; reset the
            // local draft so the thumb follows the real selection.
            react.useEffect(() => {
                setDraft(-1);
                setPendingIndex(-1);
            }, [state.current?.provider, state.current?.model]);

            if (!available) return null;

            const busy = state.status === "selecting" || state.status === "loading";
            const currentEffort = state.current?.reasoningEffort
                ?? currentChoice?.model.reasoning?.defaultEffort
                ?? undefined;
            const levels = currentChoice?.model.reasoning?.efforts ?? [];
            const currentIndex = currentChoice === undefined ? -1 : effortIndex(levels, currentEffort);
            const currentLevel = currentChoice === undefined ? undefined : levels[currentIndex];
            // DSH 0.2.0 retains the saved selection (and its effort caption) even
            // when the route drops out of the catalog; echo it like the shipped
            // seat instead of falling back to "选择模型".
            const retainedEffort = state.current?.reasoningEffort ?? state.retainedEffort;
            const effortLabel = currentLevel === undefined
                ? (currentChoice === undefined ? retainedEffort : undefined)
                : currentLevel.name ?? currentEffort;
            const modelLabel = currentChoice === undefined
                ? state.current?.model ?? "选择模型"
                : currentChoice.model.name;
            const fullLabel = effortLabel === undefined ? modelLabel : `${modelLabel} · ${effortLabel}`;

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
            // the store catches up so the knob does not snap back.
            const commitEffort = (event) => {
                const nextIndex = Number(event?.currentTarget?.value ?? draft);
                if (!Number.isFinite(nextIndex) || nextIndex < 0 || busy) return;
                const nextEffort = levels[nextIndex]?.id;
                if (nextEffort === undefined || nextEffort === currentEffort) {
                    setDraft(-1);
                    setPendingIndex(-1);
                    return;
                }
                setDraft(nextIndex);
                setPendingIndex(nextIndex);
                select({
                    provider: state.current.provider,
                    model: state.current.model,
                    reasoningEffort: nextEffort
                });
            };

            react.useEffect(() => {
                if (pendingIndex < 0) return;
                if (currentIndex === pendingIndex) {
                    setDraft(-1);
                    setPendingIndex(-1);
                }
            }, [currentIndex, pendingIndex]);

            const onSliderKeyUp = (event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
                    commitEffort(event);
                }
            };

            // Secondary menu: model picker, shown when the model row is clicked.
            if (state.groups.length === 0 && state.status !== "loading" && !initialLoading) {
                console.warn("[effort-switcher] no available models", {
                    status: state.status,
                    initialLoading,
                    error: state.error,
                    current: state.current
                });
            }
            const modelList = (state.status === "loading" || initialLoading) && state.groups.length === 0
                ? react.createElement("div", { className: "dsh-es-menuStatus" }, "加载中…")
                : state.groups.length === 0
                    ? state.error
                        ? react.createElement("div", { className: "dsh-es-menuError" }, state.error)
                        : react.createElement("div", { className: "dsh-es-menuEmpty" }, "没有可用的模型。")
                    : orderedGroups(state.groups).map((group) => react.createElement(
                        react.Fragment,
                        { key: group.id },
                        react.createElement("div", { className: "dsh-es-menuGroup" }, groupLabel(group)),
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
                        : null
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
                    react.createElement("span", { className: "dsh-es-triggerIcon", "aria-hidden": true }, modelsIcon()),
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

        const apply = (ctx) => {
            ctx.inject(inject, (scope) => {
                const slots = scope.get("slots");
                const models = scope.get("modelDirectories");
                const sessions = scope.get("sessions");

                return slots.inject(slotName, () => slots.register({
                    name: slotName,
                    priority: -100,
                    inject: (sessionId) => {
                        const directory = models.directoryFor(sessionId);
                        const available = sessions.subagentAddress(sessionId) === void 0;
                        const snapshot = directory.store?.getSnapshot?.();
                        console.log("[effort-switcher] directory", {
                            sessionId,
                            available,
                            status: snapshot?.status,
                            groupCount: snapshot?.groups?.length ?? 0,
                            error: snapshot?.error ?? null,
                            current: snapshot?.current ?? null
                        });
                        return {
                            available,
                            directory: directory.store,
                            load: () => {
                                if (available) return directory.load().catch(() => {});
                                return Promise.resolve();
                            },
                            select: (selection) => available
                                // 0.2.0/0.1.7+ settle rejections as a resolved
                                // RemoteResult; 0.1.x-era builds throw. Both map
                                // onto the component's accepted boolean here.
                                ? directory.select(selection).then(selectionAccepted, () => false)
                                : Promise.resolve(false)
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
