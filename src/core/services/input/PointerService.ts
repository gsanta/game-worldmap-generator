import { Point } from "../../../utils/geometry/shapes/Point";
import { View, ViewTag } from "../../models/views/View";
import { Registry } from "../../Registry";
import { MousePointer } from "./MouseService";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export interface IPointerEvent {
    pointers: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
    button: 'left' | 'right';
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    droppedItemId?: string;
    preventDefault: () => void;
}

export class PointerService {
    serviceName = 'pointer-service';
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;
    prevWheelState: number = 0;
    wheelDiff: number = undefined;
    hoveredItem: View;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: MousePointer = new MousePointer();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    pointerDown(e: IPointerEvent): void {
        if (!this.registry.plugins.getHoveredView()) { return; }
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().down(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(e: IPointerEvent): void {
        if (!this.registry.plugins.getHoveredView()) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().drag(e);
        } else {
            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().move();
        }
        this.registry.services.hotkey.executeHotkey(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(e: IPointerEvent): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        if (this.isDrag) {
            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().draggedUp();
        } else {
            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().click();
        }
        
        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().up(e);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(e: IPointerEvent, data: any): void {
        if (!this.registry.plugins.getHoveredView()) { return; }
        // if (data instanceof AbstractCanvasPlugin) {
        //     const leavingPlugin = this.hoveredPlugin;
        //     this.hoveredPlugin = undefined;
        //     this.isDown = false;
        //     this.isDrag = false;

        //     this.registry.services.render.reRender(data.region);
        // } else {
            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().out(data);
            (data as View).tags.delete(ViewTag.Hovered);
            this.registry.services.render.reRender(this.registry.plugins.getHoveredView().region);
        // }
    }

    pointerOver() {
    }

    // TODO data should be type of View
    pointerEnter(e: IPointerEvent, data: View) {
        if (!this.registry.plugins.getHoveredView()) { return; }
        // if (data instanceof AbstractCanvasPlugin) {
        //     this.hoveredPlugin = data;
        // } else {
            // TODO: parent is not necessarily the root view if the hierarchy is deeper, hoveredItem should be set by pointertool anyway
            this.hoveredItem = data;
            data.tags.add(ViewTag.Hovered);
            data.parent?.tags.add(ViewTag.Hovered);

            this.registry.services.hotkey.executeHotkey({
                isHover: true
            });

            this.registry.plugins.getHoveredView().toolHandler.getActiveTool().over(data);
        // }

        this.registry.services.render.reRender(this.registry.plugins.getHoveredView().region);
    }

    pointerWheel(e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.wheelDiff = this.wheelState - this.prevWheelState;

        if (e.deltaY < 0) {
            this.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.wheel = Wheel.DOWN;
        } else {
            this.wheel = Wheel.IDLE;
        }

        this.registry.services.hotkey.executeHotkey(e);
        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().wheel();
    }

    pointerWheelEnd() {
        this.wheel = Wheel.IDLE;

        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().wheelEnd();
    }

    hover(item: View): void {
        this.hoveredItem = item;
        this.registry.services.hotkey.executeHotkey({
            isHover: true
        });
        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().over(item);
        this.registry.services.render.reRenderScheduled();
    }

    unhover(item: View): void {
        console.log('unhover: ' + item.viewType)
        this.registry.services.hotkey.executeHotkey({
            isUnhover: true
        });
        if (this.hoveredItem === item) {
            this.hoveredItem = undefined;
        }
        this.registry.plugins.getHoveredView().toolHandler.getActiveTool().out(item);
        this.registry.services.render.reRenderScheduled();
    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredView().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredView().getOffset();
        return this.registry.plugins.getHoveredView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}