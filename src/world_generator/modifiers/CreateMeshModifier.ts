import { Scene } from "babylonjs/scene";
import { ModelFactory } from '../factories/ModelFactory';
import { Modifier } from "./Modifier";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { GameObject, WorldItemShape } from '../services/GameObject';
import { Mesh, Skeleton } from 'babylonjs';
import { ModelLoader } from '../services/ModelLoader';
import { RectangleFactory } from '../factories/RectangleFactory';
import { MaterialFactory } from "../factories/MaterialFactory";

export class CreateMeshModifier implements Modifier  {
    static modName = 'createMesh';
    private modelFactory: ModelFactory;
    private rectangleFactory: RectangleFactory;
    dependencies = [];

    constructor(scene: Scene, modelLoader: ModelLoader) {
        this.modelFactory = new ModelFactory(scene, modelLoader);
        this.rectangleFactory = new RectangleFactory(scene, new MaterialFactory(scene), 0.1);
    }

    getName(): string {
        return CreateMeshModifier.modName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.shape) {
                    const [mesh, skeleton] = this.creteMesh(item);
                    item.mesh = mesh;
                    item.skeleton = skeleton;
                }
            }
        });

        return worldItems;
    }

    private creteMesh(worldItem: GameObject): [Mesh, Skeleton] {
        switch(worldItem.shape) {
            case WorldItemShape.RECTANGLE:
                return this.rectangleFactory.createMesh(worldItem);
            case WorldItemShape.MODEL:
                return this.modelFactory.createMesh(worldItem);
        }
    }
}