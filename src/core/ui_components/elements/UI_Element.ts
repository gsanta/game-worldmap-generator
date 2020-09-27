import { UI_Plugin } from '../../plugin/UI_Plugin';
import { UI_ElementType } from './UI_ElementType';
import { AbstractCanvasPlugin } from '../../plugin/AbstractCanvasPlugin';
import { AbstractController } from '../../plugin/controller/AbstractController';
import { Point } from '../../../utils/geometry/shapes/Point';

export const activeToolId = '__activeTool__'

export interface UI_Element_Css {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    pointerEvents?: 'none' | 'all';
    userSelect?: 'auto' | 'text' | 'none' | 'all';
}

export abstract class UI_Element {
    elementType: UI_ElementType;
    id: string;
    readonly plugin: UI_Plugin;
    controller: AbstractController;
    controllerId: string;
    prop: string;
    key: string;
    isBold: boolean;
    data: any;
    isInteractive: boolean = true;
    readonly target: string;


    css?: UI_Element_Css = {};

    constructor(plugin: UI_Plugin, target?: string) {
        this.plugin = plugin;
        this.target = target;
    }

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop ? this.prop : this.key}`;
    }

    mouseOver(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).over()
        } else {
            this.plugin.getControllerById(this.controllerId).mouseOver(this);
        }
    }

    mouseOut(e: MouseEvent) {
        if (this.controllerId !== activeToolId)
            this.plugin.getControllerById(this.controllerId).mouseOut(this);
    }

    mouseDown(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseDown(e);
        }
    }

    mouseMove(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseMove(e);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseUp(e);
        }
    }

    mouseLeave(e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseLeave(e, data);
        }
    }

    mouseEnter(e: MouseEvent, data?: any) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseEnter(e, data);
        }
    }

    mouseWheel(e: WheelEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheel(e);
        }
    }

    mouseWheelEnd() {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).mouse.mouseWheelEnd();
        }
    }

    keyDown(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyDown(e);
        }
    }

    keyUp(e: KeyboardEvent) {
        if (this.controllerId === activeToolId) {
            (this.plugin as AbstractCanvasPlugin).keyboard.onKeyUp(e);
        }
    }

    dndEnd(point: Point) {
        (this.plugin as AbstractCanvasPlugin).mouse.dndDrop(point);
        // this.plugin.getControllerById(this.controllerId).d/ndEnd(this.prop);
    }
}

