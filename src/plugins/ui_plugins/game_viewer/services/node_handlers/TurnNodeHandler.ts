import { BuiltinNodeType } from "../../../../../core/models/game_objects/NodeObj";
import { AbstractNodeHandler } from "./AbstractNodeHandler";

export class TurnNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Turn;

    handle() {
        // const joinedView = this.instance.nodeView.findJoinPointView('mesh').getOtherNode();

        // if (joinedView) {
        //     const handler = this.getNodeService().getHandler(joinedView.obj);
        //     handler.instance = joinedView.obj;
        //     const meshNode = handler.searchFromRight(BuiltinNodeType.Mesh);
            
        //     if (meshNode) {
        //         const meshView = this.registry.stores.canvasStore.getMeshViewById(meshNode.getParam('mesh').val);

        //         if (this.instance.getParam('turn').val === 'turn-left') {
        //             meshView.rotateBy(-0.02);
        //         } else {
        //             meshView.rotateBy(0.02);
        //         }
        //     }
        // }
    }
}