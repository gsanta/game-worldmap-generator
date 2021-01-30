import { NodePortViewType } from '../../models/shapes/child_views/NodePortShape';
import { AbstractShape, ShapeTag } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { IPointerEvent } from '../../controller/PointerHandler';
import { ShapeStore } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { ToolAdapter } from "./ToolAdapter";
import { ToolType } from "./Tool";
import { PointerTracker } from '../../controller/ToolHandler';

export abstract class PointerTool<P extends AbstractCanvasPanel = AbstractCanvasPanel> extends ToolAdapter<P> {
    acceptedViews: string[] = [];

    protected movingItem: AbstractShape = undefined;
    private isDragStart = true;
    protected viewStore: ShapeStore;

    constructor(type: string, panel: P, store: ShapeStore, registry: Registry) {
        super(type, panel, registry);
        this.viewStore = store;
    }

    click(): void {
        const hoveredItem = this.canvas.pointer.hoveredView;
        if (!hoveredItem) { return; }

        if (hoveredItem.isContainedView()) {
            if (!hoveredItem.containerShape.isSelected()) {
                this.viewStore.clearSelection();
                this.viewStore.addSelectedShape(hoveredItem.containerShape);
            }
            hoveredItem.containerShape.setActiveContainedView(hoveredItem);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        } else {
            this.viewStore.clearSelection();
            this.viewStore.addSelectedShape(hoveredItem);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    down() {
        this.initMove() &&  this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    drag(pointer: PointerTracker) {
        super.drag(pointer);

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
        
        this.isDragStart = false;
    }

    draggedUp(pointer: PointerTracker) {
        super.draggedUp(pointer);

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.isDragStart = true;
        
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(view: AbstractShape) {
        if (view.viewType === NodePortViewType) {
            this.canvas.tool.setPriorityTool(ToolType.Join);
        }
        
        view.tags.add(ShapeTag.Hovered);
        view.containerShape?.tags.add(ShapeTag.Hovered);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    out(view: AbstractShape) {
        if (!this.canvas.pointer.isDown && view.viewType === NodePortViewType) {
            this.canvas.tool.removePriorityTool(ToolType.Join);

        } 
        
        view.tags.delete(ShapeTag.Hovered);
        view.containerShape?.tags.delete(ShapeTag.Hovered);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private initMove(): boolean {
        const hovered = this.canvas.pointer.hoveredView;
        if (hovered) {
            this.movingItem = hovered;
            this.moveItems();
            return true;
        }
        return false;
    }

    private moveItems() {
        if (this.movingItem.isContainedView()) {
            this.movingItem.move(this.canvas.pointer.pointer.getDiff())
        } else {
            const views = this.viewStore.getSelectedShapes();
            views.filter(view => !views.includes(view.getParent())).forEach(item => item.move(this.canvas.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
}