import { ICanvasImporter } from "../ICanvasImporter";
import { WebglCanvasController } from './WebglCanvasController';
import { MeshView } from "../../../../common/views/MeshView";
import { ConverterService } from "../../../../game/import/ConverterService";
import { CreateMeshModifier } from "../../../../game/import/CreateMeshModifier";
import { GameFacade } from "../../../../game/GameFacade";
import { MeshObject } from "../../../../game/models/objects/MeshObject";

export class WebglCanvasWriter implements ICanvasImporter {
    private webglEditorController: WebglCanvasController;
    private gameFacade: GameFacade;


    constructor(webglEditorController: WebglCanvasController, gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.webglEditorController = webglEditorController;
    }

    import(file: string): void {
        this.webglEditorController.gameFacade.clear();

        const converterService = new ConverterService();
        const that = this;

        this.gameFacade.generateWorld(file)
            .then(gameObjects => converterService.convert(
                    gameObjects,
                    {
                        convert(worldItem: MeshObject): any {
                            that.webglEditorController.meshes.push(that.webglEditorController.gameFacade.meshStore.getMesh(worldItem.meshName));
                        },
                        addChildren(parent: any, children: any[]): void {},
                        addBorders(item: any, borders: any[]): void {},
                        done() {
                            that.webglEditorController.renderWindow();
                        }
                    }    
                )
            )
            .catch(e => console.log(e));
    }
}