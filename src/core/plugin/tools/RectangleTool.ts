import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from '../../controller/PointerHandler';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { ShapeStore } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { createRectFromMousePointer, ToolAdapter } from './ToolAdapter';

export abstract class RectangleTool<D> extends ToolAdapter<D> {
    protected rectangleFeedback: Rectangle;
    protected tmpView: AbstractShape;
    protected viewStore: ShapeStore;
    protected rectRadius = 50;

    constructor(type: string, panel: AbstractCanvasPanel<D>, store: ShapeStore, registry: Registry) {
        super(type, panel, registry);
        this.viewStore = store;
    }

    click() {
        const pointer = this.canvas.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, this.rectRadius);

        const view = this.createView(rect);

        this.viewStore.clearSelection()
        this.viewStore.addSelectedItem(view);

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    drag(pointer: PointerTracker<D>) {
        super.drag(pointer)

        this.tmpView && this.removeTmpView();

        this.rectangleFeedback = createRectFromMousePointer(this.canvas.pointer.pointer);

        this.tmpView = this.createView(this.rectangleFeedback);

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    draggedUp(pointer: PointerTracker<D>) {
        super.draggedUp(pointer);

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();

        this.rectangleFeedback = undefined;
        if (this.tmpView) {
            this.tmpView = null;
        }
    }

    leave() {
        this.rectangleFeedback = undefined;
        return true;
    }

    protected abstract createView(rect: Rectangle): AbstractShape;
    protected abstract removeTmpView();
}