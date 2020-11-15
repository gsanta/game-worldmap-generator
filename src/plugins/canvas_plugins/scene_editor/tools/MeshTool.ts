import { MeshViewType } from "../views/MeshView";
import { View } from "../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool<Canvas2dPanel> {
    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(MeshToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        return this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}