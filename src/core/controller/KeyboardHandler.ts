import { AbstractCanvasPanel } from '../models/modules/AbstractCanvasPanel';
import { Registry } from '../Registry';

export enum Platform {
    WINDOWS = 'Windows',
    LINUX = 'Linux',
    MAC = 'Mac',
    UNKNOWN = 'Unknown'
}

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}


function getPlatform(): Platform {
    if (!navigator || !navigator.appVersion) {
        return Platform.UNKNOWN;
    }

    if (navigator.appVersion.indexOf("Win") != -1) {
        return Platform.WINDOWS;
    } else if (navigator.appVersion.indexOf("Mac") != -1) {
        return Platform.MAC;
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
        return Platform.LINUX;
    }

    return Platform.UNKNOWN;
}


export enum Keyboard {
    Enter = 13,
    w = 87,
    a = 65,
    d = 68,
    s = 83,
    e = 69,
    p = 80,
    Space = 32,
    ArrowLeft = 37,
    ArrowRight = 39,
    ArrowDown = 40,
    ArrowUp = 38,
    Shift = 16,
    Ctrl = 17
}

export interface IKeyboardEvent {
    keyCode: number;
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    isKeyup: boolean;
}

export function getKeyFromKeyCode(keyCode: number) {
    const key = String.fromCharCode(keyCode).toLocaleLowerCase();

    if (key === ' ') {
        return 'Space'
    }
    return key;
}

export class KeyboardHandler<D> {
    private registry: Registry;
    private handlers: ((keyboardEvent: IKeyboardEvent) => void)[] = [];
    private canvas: AbstractCanvasPanel<D>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<D>) {
        this.registry = registry;
        this.canvas = canvas;
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }
    
    keyDown(e: KeyboardEvent): void {
        const convertedEvent = this.convertEvent(e, false);
        this.canvas.hotkey.executeHotkey(convertedEvent, this.canvas.pointer.pointer);
        this.registry.ui.helper.hoveredPanel.tool.getActiveTool()?.keydown(convertedEvent);
        this.registry.services.render.reRenderScheduled();

        this.handlers.forEach(handler => handler(convertedEvent));
        e.preventDefault();
        e.stopPropagation();
    }

    keyUp(e: KeyboardEvent): void {
        const convertedEvent = this.convertEvent(e, true);
        this.canvas.hotkey.executeHotkey(convertedEvent, null);
        this.registry.ui.helper.hoveredPanel.tool.getActiveTool()?.keyup(convertedEvent);
        this.registry.services.render.reRenderScheduled();

        e.preventDefault();
        e.stopPropagation();
    }

    onKeyDown(handler: (keyboardEvent: IKeyboardEvent) => void) {
        this.handlers.push(handler);
    }

    private convertEvent(event: KeyboardEvent, isKeyup: boolean): IKeyboardEvent {
        return {
            keyCode: event.keyCode,
            isAltDown: !!event.altKey,
            isShiftDown: !!event.shiftKey,
            isCtrlDown: !!event.ctrlKey,
            isMetaDown: !!event.metaKey,
            isKeyup
        }
    }
}

export function isCtrlOrCommandDown(event: IKeyboardEvent): boolean {
    const platform = getPlatform();

    switch (platform) {
        case Platform.MAC:
            return event.isMetaDown;
        case Platform.WINDOWS:
        case Platform.LINUX:
            return event.isCtrlDown;
        default:
            return event.isCtrlDown || event.isMetaDown;
    }
}