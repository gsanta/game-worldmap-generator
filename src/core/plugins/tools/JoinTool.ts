import { Point } from "../../../utils/geometry/shapes/Point";
import { JoinPointView, JoinPointViewType } from "../../models/views/child_views/JoinPointView";
import { NodeConnectionView } from "../../models/views/NodeConnectionView";
import { View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { AbstractCanvasPlugin } from "../AbstractCanvasPlugin";
import { AbstractTool } from "./AbstractTool";
import { PointerTool } from "./PointerTool";
import { Cursor, ToolType } from './Tool';

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    joinPoint1: JoinPointView;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Join, plugin, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.joinPoint1 = <JoinPointView> this.registry.services.pointer.hoveredItem;
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    click() {

    }

    move() {}

    drag() {
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    draggedUp() {
        this.registry.plugins.getHoveredPlugin().toolHandler.removePriorityTool(this.id);

        if (this.checkConnectionValidity()) {
            let joinPoint1 = this.joinPoint1;
            let joinPoint2 = <JoinPointView> this.registry.services.pointer.hoveredItem;
            if (joinPoint2.isInput) {
                [joinPoint1, joinPoint2] = [joinPoint2, joinPoint1];
            }

            const connection = new NodeConnectionView();
            joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            connection.obj.joinPoint1 = this.joinPoint1.slotName;
            connection.obj.node1 = this.joinPoint1.parent.obj;
            connection.obj.joinPoint2 = joinPoint2.slotName;
            connection.obj.node2 = joinPoint2.parent.obj;

            connection.setPoint1(joinPoint1.getAbsolutePosition());
            connection.setPoint2(joinPoint2.getAbsolutePosition());
            this.joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            this.registry.stores.nodeStore.addView(connection);
            this.startPoint = undefined;
            this.endPoint = undefined;

            this.registry.services.history.createSnapshot();
        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private checkConnectionValidity() {
        const start = this.joinPoint1;
        const end = <JoinPointView> this.registry.services.pointer.hoveredItem;

        if (!end || !start) { return false; }
        if (start.viewType !== JoinPointViewType || end.viewType !== JoinPointViewType) { return false; }
        if (start.isInput === end.isInput) { return false }

        return true;
    }

    out(view: View) {
        super.out(view);
        if (!this.registry.services.pointer.isDown) {
            this.registry.plugins.getHoveredPlugin().toolHandler.removePriorityTool(this.id);
        }

    }

    getCursor() {
        return Cursor.Crosshair;
    }
}