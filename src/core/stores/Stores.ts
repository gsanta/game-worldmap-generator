import { Registry } from "../Registry";
import { AbstractStore } from "./AbstractStore";
import { AssetStore } from "./AssetStore";
import { GameStore } from "./GameStore";
import { LevelStore } from "./LevelStore";
import { MeshStore } from "./MeshStore";
import { NodeStore } from './NodeStore';
import { SceneStore } from "./SceneStore";
import { SelectionStore } from "./SelectionStore";
import { SpriteStore } from "../../game/example/SpriteStore";
import { ObjStore } from "./ObjStore";

export class Stores {
    private registry: Registry
    private stores: AbstractStore[] = [];

    canvasStore: SceneStore;
    selectionStore: SelectionStore;
    levelStore: LevelStore;
    meshStore: MeshStore;
    spriteStore: SpriteStore;
    nodeStore: NodeStore;
    assetStore: AssetStore;
    gameStore: GameStore;

    objStore: ObjStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new SceneStore(this.registry);
        this.selectionStore = new SelectionStore();
        this.levelStore = new LevelStore();
        this.meshStore = new MeshStore(this.registry);
        this.spriteStore = new SpriteStore();
        this.nodeStore = new NodeStore(this.registry);
        this.assetStore = new AssetStore(this.registry);
        this.gameStore = new GameStore(this.registry);
        this.objStore = new ObjStore();

        this.stores.push(
            this.canvasStore,
            this.meshStore,
            this.nodeStore,
            this.assetStore,
            this.gameStore,
            this.spriteStore,
            this.objStore
        )
    }
}