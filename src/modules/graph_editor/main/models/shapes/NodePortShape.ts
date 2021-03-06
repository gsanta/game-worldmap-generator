import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../../../core/Registry";
import { NodePortObj } from "../../../../../core/models/objs/NodePortObj";
import { PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeConnectionShape } from "./NodeConnectionShape";
import { AbstractShape, ShapeJson } from "./AbstractShape";
import { ChildShape } from "./ChildShape";
import { NodeShape } from "./NodeShape";

export function isJoinPointView(view: AbstractShape) {
    return view && view.viewType === NodePortViewType;
}

export interface NoePortViewJson extends ShapeJson {
    point: string;
    connectionIds: string[];
}

export const NodePortViewType = 'NodePortViewType';
export class NodePortShape extends ChildShape {
    viewType = NodePortViewType;
    id: string;
    point: Point;
    containerShape: NodeShape;
    private connections: NodeConnectionShape[] = [];
    protected obj: NodePortObj;
    bounds: Rectangle;

    constructor(parent: NodeShape, obj: NodePortObj) {
        super(parent.canvas);
        this.containerShape = parent;
        this.obj = obj;
        this.id = obj.id;
    }

    getObj(): NodePortObj {
        return this.obj;
    }

    setObj(obj: NodePortObj) {
        this.obj = obj;
    }

    getAbsolutePosition() {
        return new Point(this.containerShape.getBounds().topLeft.x + this.point.x, this.containerShape.getBounds().topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        const portDirection = this.obj.getNodeParam().portDirection;
        this.connections.forEach(connection => {
            portDirection === PortDirection.Input ? connection.setInputPoint(this.getAbsolutePosition()) : connection.setOutputPoint(this.getAbsolutePosition());
        });
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    removeConnection(connection: NodeConnectionShape) {
        const otherPortView = connection.getOtherPortView(this);
        this.obj.removeConnectedPort(otherPortView.getObj());
        this.containerShape.deleteConstraiedViews.removeView(connection);
        this.connections = this.connections.filter(conn => conn !== connection);
    }

    addConnection(connection: NodeConnectionShape) {
        if (!this.connections.includes(connection)) {
            this.connections.push(connection);
            this.containerShape.deleteConstraiedViews.addView(connection);
        }
    }

    toString() {
        return `${this.viewType}: ${this.containerShape.id} ${this.point.toString()}`;
    }

    toJson(): NoePortViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            connectionIds: this.connections.map(connection => connection.id)
        }
    }

    fromJson(json: NoePortViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}