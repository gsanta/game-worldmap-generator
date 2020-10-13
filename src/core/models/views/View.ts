import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj } from "../objs/IObj";
import { Registry } from "../../Registry";
import { ChildView } from "./child_views/ChildView";
import { UI_Container } from "../../ui_components/elements/UI_Container";

export interface ViewJson {
    id: string;
    type: string;
    dimensions: string;
    objId: string;
    ownerPluginId?: string;
}

export enum ViewTag {
    Selected = 'Selected',
    Hovered = 'Hovered'
}

export interface ViewFactory {
    viewType: string;
    newInstance(): View;

    renderInto(container: UI_Container, view: View);
}

export abstract class View {
    id: string;
    viewType: string;
    tags: Set<ViewTag> = new Set();
    layer: number = 10;
    readonly ownerPluginId: string;

    parent: View;
    children: View[] = [];

    constructor(ownerPluginId: string) {
        this.ownerPluginId = ownerPluginId;
    }

    protected obj: IObj;

    protected bounds: Rectangle;
    move(delta: Point): void {}

    private activeChild: View;

    abstract getObj(): IObj;
    abstract setObj(obj: IObj);

    isHovered() {
        return this.tags.has(ViewTag.Hovered);
    }

    isSelected() {
        return this.tags.has(ViewTag.Selected);
    }

    isChildView(): boolean {
        return !!this.parent;
    }

    setActiveChild(child: ChildView) {
        this.activeChild = child;
    }

    getActiveChild() {
        return this.activeChild;
    }

    addChild(child: ChildView) {
        this.children.push(child);
        child.calcBounds();
    }

    deleteChild(child: View) {
        this.children.splice(this.children.indexOf(child), 1);    
    }

    setParent(parent: View) {
        this.parent = parent;
    }

    getScale() { return 1; }

    abstract getBounds(): Rectangle;
    abstract setBounds(rectangle: Rectangle): void;
    calcBounds(): void {}

    getYPos() { return undefined; }

    abstract dispose(): void;

    toJson(): ViewJson {
        return {
            id: this.id,
            type: this.viewType,
            dimensions: this.bounds ? this.bounds.toString() : undefined,
            objId: this.obj ? this.obj.id : (this.parent && this.parent.obj) ? this.parent.obj.id : undefined
        };
    }

    fromJson(json: ViewJson, registry: Registry) {
        this.id = json.id;
        this.viewType = json.type;
        this.bounds = json.dimensions && Rectangle.fromString(json.dimensions);
        this.setObj(registry.stores.objStore.getById(json.objId));
    }
}

export function sortViewsByLayer(views: View[]): void {
    const layerSorter = (a: View, b: View) => b.layer - a.layer;

    views.sort(layerSorter);
}
