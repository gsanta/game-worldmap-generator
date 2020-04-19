import { Tools } from "babylonjs";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { MeshObject } from "../../../game/models/objects/MeshObject";
import { RouteObject } from "../../../game/models/objects/RouteObject";
import { Stores } from "../../stores/Stores";
import { ConceptType } from "../../views/canvas/models/concepts/Concept";
import { MeshConcept } from "../../views/canvas/models/concepts/MeshConcept";
import { IConceptConverter } from "./IConceptConverter";

export class MeshConceptConverter implements IConceptConverter {
    viewType = ConceptType.MeshConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    convert(meshView: MeshConcept): IGameObject {
        if (meshView.path) {
            const routeObject = new RouteObject(
                () => this.getStores().gameStore.getByName(meshView.id),
                () => this.getStores().gameStore.getByName(meshView.path)
            );

            routeObject.id = `${meshView.id}-route`;

            this.getStores().gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(() => this.getStores().gameStore.getByName(`${meshView.id}-route`));

        meshObject.dimensions = meshView.dimensions.div(10);
        meshObject.type = meshView.type;
        meshObject.meshName = meshView.meshName;
        meshObject.id = meshView.id;
        meshObject.rotation = Tools.ToRadians(meshView.rotation);
        const modelConcept = this.getStores().canvasStore.getModelConceptById(meshView.modelId);
        meshObject.texturePath = modelConcept && modelConcept.texturePath;
        meshObject.modelPath = modelConcept && modelConcept.modelPath;

        meshObject.thumbnailPath = meshView.thumbnailPath;
        meshObject.path = meshView.path;
        meshObject.color = meshView.color;
        meshObject.scale = meshView.scale;
        meshObject.speed = meshView.speed;
        meshObject.activeBehaviour = meshView.activeBehaviour;
        meshObject.wanderAngle = meshView.wanderAngle;
        meshObject.isManualControl = meshView.isManualControl;

        if (meshView.animationId) {
            meshObject.animation = this.getStores().canvasStore.getAnimationConceptById(meshView.animationId);
        }

        this.getStores().gameStore.add(meshObject);

        return meshObject;
    }
}