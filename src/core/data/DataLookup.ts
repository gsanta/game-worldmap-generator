import { ObjObservable } from "../models/ObjObservable";
import { IObj } from "../models/objs/IObj";
import { AbstractShape } from "../../modules/graph_editor/main/models/shapes/AbstractShape";
import { Registry } from "../Registry";
import { DataHelperLookup } from "./DataHelperLookup";
import { ItemData } from "./ItemData";

export class DataLookup {
    helper: DataHelperLookup;
    observable: ObjObservable;
    
    scene: ItemData<IObj>;
    node: ItemData<AbstractShape>
    
    private _registry: Registry;

    constructor(registry: Registry) {
        this.helper = new DataHelperLookup(registry);
        this.observable =  new ObjObservable()

        this._registry = registry;
    }

    clearData() {
        this.node.items.clear();
        this.scene.items.clear();

        this._registry.data.scene.items.clear();
        this._registry.stores.assetStore.clear();
    }
}