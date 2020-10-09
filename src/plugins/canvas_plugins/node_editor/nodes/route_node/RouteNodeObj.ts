import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeCategory, NodeObj, NodeParam } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../../core/Registry";
import { INodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { NodeGraph } from "../../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../../core/services/NodeService";
import { SaveEditControl } from "../../../../dialog_plugins/asset_manager/AssetManagerProps";
import { RouteWalker } from "./RouteWalker";

export const RouteNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        return new RouteNodeObj(graph);
    },

    createPropControllers(): PropController[] {
        return [new SaveEditControl()];
    },

    createExecutor(): INodeExecutor {
        return undefined;
    }
}

const params: NodeParam[] = [
    {
        name: 'speed',
        val: 1,
        uiOptions: {
            inputType: 'textField',
            valueType: 'number'
        }
    },
    {
        name: 'routeWalker',
        val: undefined
    },
];

export const RouteNodeObjType = 'route-node-obj';
export class RouteNodeObj extends NodeObj {
    type = RouteNodeObjType;
    category = NodeCategory.Default;
    displayName = 'Route';

    // private routeNodeExecutor: RouteNodeExecutor;

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addAllParams(params);
    }

    inputs = [
        {
            name: 'mesh'
        },
        {
            name: 'path'
        }
    ];

    outputs = [
        {
            name: 'onStart'
        },
        {
            name: 'onTurnStart'
        },
        {
            name: 'onTurnEnd'
        },
        {
            name: 'onFinish'
        }
    ];

    setParam(name: string, value: any) {
        super.setParam(name, value);
        // this.routeNodeExecutor && this.routeNodeExecutor.routWalker.setSpeed(value);
    }

    execute(registry: Registry) {
        // if (this.connections.get('mesh') && this.connections.get('path')) {
        //     this.routeNodeExecutor.execute(registry);
        // }
    }
}

export class SpeedControl extends PropController<string> {
    acceptedProps() { return ['speed']; }

    defaultVal(context, element) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('speed').val;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        try {
            if (speed) {
                const speedNum = parseFloat(speed);
                const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
                nodeView.getObj().setParam('speed', speedNum);
            }
        } catch (e) {
            console.log(e);
        }
    }
}


export class RouteNodeExecutor implements INodeExecutor {
    routWalker: RouteWalker;

    execute(nodeObj: NodeObj, registry: Registry) {
        const meshObj = this.getMeshObj(nodeObj, registry);
        const pathObj = this.getPathObj(nodeObj, registry);

        if (!meshObj || !pathObj) { return; }

        if (!nodeObj.getParam('routeWalker').val) {
            nodeObj.setParam('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        this.routWalker.step();
    }

    stop() {}

    private getMeshObj(nodeObj: NodeObj, registry: Registry): MeshObj {
        let meshParam = nodeObj.connections.get('mesh') && nodeObj.connections.get('mesh').getOtherNode(nodeObj).getParam('mesh');

        if (meshParam) {
            return <MeshObj> registry.stores.viewStore.getById(meshParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        let pathParam = nodeObj.connections.get('path') && nodeObj.connections.get('path').getOtherNode(nodeObj).getParam('path');

        if (pathParam) {
            return <PathObj> registry.stores.viewStore.getById(pathParam.val)?.getObj();
        }
    }
}