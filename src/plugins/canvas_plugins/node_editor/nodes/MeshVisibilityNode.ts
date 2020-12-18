import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodePortObj } from "../../../../core/models/objs/NodePortObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField } from "../../../../core/models/objs/node_obj/NodeParam";

export const MeshVisibilityNodeType = 'mesh-visibility-node-obj';

export class MeshVisibilityNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MeshVisibilityNodeType;
    displayName = 'Mesh Visibility';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new MeshVisibilityNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        // obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshVisibilityNodeParams extends NodeParams {    
    readonly signalOn: NodeParam = {
        name: 'signal on',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push,
            execute: () => {
                const meshObj = this.mesh.val;

                if (meshObj) {
                    meshObj.setVisibility(1);
                }
            }
        }
    }

    readonly signalOff: NodeParam = {
        name: 'signal off',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push,
            execute: () => {
                const meshObj = this.mesh.val;

                if (meshObj) {
                    meshObj.setVisibility(0);
                }
            }
        }
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull
        }
    }
}

export class MeshVisibilityNodeExecutor extends AbstractNodeExecutor<MeshVisibilityNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const visibility: number = this.nodeObj.param.visible.val;

        let meshObj: MeshObj;
        if (this.nodeObj.getPort('mesh').hasConnectedPort()) {
            meshObj = this.nodeObj.pullData('mesh');
        } else {
            meshObj =  this.nodeObj.param.mesh.val;
        }

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}