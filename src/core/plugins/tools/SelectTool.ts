import { Registry } from '../../Registry';
import { PointerTool } from './PointerTool';
import { ToolType, Cursor } from "./Tool";
import { IPointerEvent } from '../../services/input/PointerService';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { createRectFromMousePointer } from './AbstractTool';
import { Polygon } from '../../../utils/geometry/shapes/Polygon';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { View } from '../../models/views/View';
import { getIntersectingViews } from '../../stores/ViewStore';

export class SelectTool extends PointerTool {
    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Select, plugin, registry);
    }

    down() {
        if (this.registry.services.pointer.hoveredItem && this.registry.services.pointer.hoveredItem.isSelected()) {
            super.down();
        }
    }

    click() {
        if (this.registry.services.pointer.hoveredItem) {
            super.click();
        } else if (this.plugin.getStore().getSelectedViews().length > 0) {
            this.plugin.getStore().clearSelection();
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    drag(e: IPointerEvent) {
        if (this.movingItem) {
            super.drag(e);
        } else {
            this.rectangleSelection = createRectFromMousePointer(this.registry.services.pointer.pointer);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            if (!this.rectangleSelection) { return }
    
            const intersectingViews = getIntersectingViews(this.plugin.getStore(), this.rectangleSelection);
            
            this.plugin.getStore().clearSelection();
            this.plugin.getStore().addSelectedView(...intersectingViews)
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.registry.services.pointer.hoveredItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}