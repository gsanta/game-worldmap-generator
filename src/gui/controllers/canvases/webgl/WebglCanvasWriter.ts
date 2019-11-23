import { ICanvasWriter } from "../ICanvasWriter";
import { WebglCanvasController } from './WebglCanvasController';
import { WorldItemDefinitionModel } from "../../world_items/WorldItemDefinitionModel";
import { BabylonWorldGenerator } from "../../../../integrations/babylonjs/BabylonWorldGenerator";
import { FileFormat } from '../../../../WorldGenerator';
import { WorldItem } from "../../../../WorldItem";

export class WebglCanvasWriter implements ICanvasWriter {
    private webglEditorController: WebglCanvasController;
    private worldItemDefinitionModel: WorldItemDefinitionModel;

    constructor(webglEditorController: WebglCanvasController, worldItemDefinitionModel: WorldItemDefinitionModel) {
        this.webglEditorController = webglEditorController;
        this.worldItemDefinitionModel = worldItemDefinitionModel;
    }

    write(file: string, fileFormat: FileFormat): void {
        const that = this;
        new BabylonWorldGenerator(this.webglEditorController.scene).generate(file, fileFormat, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                    worldItem.meshTemplate.meshes[0].isVisible = false;
                }
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {
                // this.webglEditorController.engine.runRenderLoop(() => this.webglEditorController.scene.render());
                that.webglEditorController.render();
            }
        });
    }
}