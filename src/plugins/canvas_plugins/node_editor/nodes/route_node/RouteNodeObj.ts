import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeCategory, NodeObj, NodeParam } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { AbstractController, PropControl } from "../../../../../core/plugin/controller/AbstractController";
import { UI_Plugin, UI_Region } from "../../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../../core/Registry";
import { NodeGraph } from "../../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../../core/services/NodeService";
import { RouteWalker } from "./RouteWalker";

export const RouteNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new RouteNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('speed', SpeedControl);
        return controller;
    }
}

export const RouteNodeObjType = 'route-node-obj';
export class RouteNodeObj extends NodeObj {
    type = RouteNodeObjType;
    category = NodeCategory.Default;
    displayName = 'Route';

    private routeNodeExecutor: RouteNodeExecutor;

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.routeNodeExecutor = new RouteNodeExecutor(this);

        this.addParam({
            name: 'speed',
            val: 1,
            inputType: 'textField',
            valueType: 'number'
        })
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
        this.routeNodeExecutor && this.routeNodeExecutor.routWalker.setSpeed(value);
    }

    execute(registry: Registry) {
        if (this.connections.get('mesh') && this.connections.get('path')) {
            this.routeNodeExecutor.execute(registry);
        }
    }
}

const SpeedControl: PropControl<string> = {
    defaultVal(context, element) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('speed').val;
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    },

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


class RouteNodeExecutor {

    private node: RouteNodeObj;
    private registry: Registry;
    routWalker: RouteWalker;

    constructor(node: RouteNodeObj) {
        this.node = node;
    }

    execute(registry: Registry) {
        const meshObj = this.getMeshObj(registry);
        const pathObj = this.getPathObj(registry);

        if (!meshObj || !pathObj) { return; }

        if (!this.routWalker) {
            this.routWalker = new RouteWalker(meshObj, pathObj);
        }

        this.routWalker.step();
    }

    private getMeshObj(registry: Registry): MeshObj {
        let meshParam = this.node.connections.get('mesh') && this.node.connections.get('mesh').getOtherNode(this.node).getParam('mesh');

        if (meshParam) {
            return <MeshObj> registry.stores.viewStore.getById(meshParam.val)?.getObj();
        }
    }

    private getPathObj(registry: Registry): PathObj {
        let pathParam = this.node.connections.get('path') && this.node.connections.get('path').getOtherNode(this.node).getParam('path');

        if (pathParam) {
            return <PathObj> registry.stores.viewStore.getById(pathParam.val)?.getObj();
        }
    }
}