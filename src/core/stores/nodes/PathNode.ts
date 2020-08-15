import { PathModel } from '../game_objects/PathModel';
import { JoinPointSlot, NodeCategory, NodeModel, BuiltinNodeType, NodeModelJson } from '../game_objects/NodeModel';
import { View } from '../views/View';
import { PathView } from '../views/PathView';

export interface PathNodeJson extends NodeModelJson {
    pathId: string;
}

export class PathNode extends NodeModel {
    type = BuiltinNodeType.Path;
    category = NodeCategory.Default;
    label = "Path";
    pathModel: PathModel;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'action'
        }
    ];

    toJson(): PathNodeJson {
        return {
            ...super.toJson(),
            pathId: this.pathModel && this.pathModel.getId()
        }
    }

    fromJson(json: PathNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.pathModel = json.pathId && (<PathView> viewMap.get(json.pathId)).model
    }
}