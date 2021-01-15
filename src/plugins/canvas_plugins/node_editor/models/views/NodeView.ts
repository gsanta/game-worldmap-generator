import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodePortView, NodePortViewType } from "../../../../../core/models/views/child_views/NodePortView";
import { ViewJson, View } from "../../../../../core/models/views/View";
import { FormController, InputParamType } from "../../../../../core/controller/FormController";
import { Registry } from "../../../../../core/Registry";
import { NodeGraph } from "../../../../../core/services/node/NodeGraph";
import { sizes } from "../../../../../core/ui_components/react/styles";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { NodeRenderer } from "../../renderers/NodeRenderer";
import { UIController } from "../../../../../core/controller/UIController";

export const NodeViewType = 'node-view';

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
}

const HEADER_HIGHT = 30;
const PORT_HEIGHT = 20;
const INPUT_HEIGHT = 35;
const NODE_PADDING = 10;

export class NodeHeightCalc {
    static getFieldHeights(nodeView: NodeView) {
        const fieldParams = nodeView.getFieldParams();
        let sum = NODE_PADDING * 2;

        fieldParams.forEach(param => sum += this.getFieldHeight(nodeView, param));

        return sum;
    }

    static getFieldHeight(nodeView: NodeView, nodeParam: NodeParam): number {

        switch(nodeView.paramController[nodeParam.name].paramType) {
            case InputParamType.MultiSelect:
                return 50;
            default:
                return 35;
        }
    }
}

export class NodeView extends View {
    readonly  viewType = NodeViewType;
    id: string;
    protected obj: NodeObj;
    nodeGraph: NodeGraph;

    private paramsYPosStart: number;
    private registry: Registry;

    // TODO pass registry from the ui in every event handling method for FormController, so we don't need to pass it here
    constructor(registry: Registry) {
        super();
        
        this.registry = registry;
        this.renderer = new NodeRenderer(this);
        this.bounds = new Rectangle(new Point(0, 0), new Point(defaultNodeViewConfig.width, 0));
    }

    addParamControllers(paramControllers: UIController) {
        this.paramController = paramControllers;
        this.controller = new FormController(undefined, this.registry, [], paramControllers);
        this.setup();
    }

    getPortViews(): NodePortView[] {
        return <NodePortView[]> this.containedViews.filter((view: View) => view.viewType === NodePortViewType)
    }

    setup() {
        this.obj.getPorts()
            .map(portObj => new NodePortView(this, portObj))
            .forEach(portView => this.addContainedView(portView))
        this.updateDimensions();
    }

    private updateDimensions() {
        const inputPortLen = this.getStandaloneInputPorts().length;
        const outputPortLen = this.getStandaloneOutputPorts().length;
        const PORTS_HEIGHT = inputPortLen > outputPortLen ? inputPortLen * PORT_HEIGHT : outputPortLen * PORT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + PORTS_HEIGHT + NODE_PADDING;
        const inputFieldHeights = NodeHeightCalc.getFieldHeights(this);
        this.bounds.setHeight(inputFieldHeights + HEADER_HIGHT + PORTS_HEIGHT);

        this.initStandalonePortPositions();
        this.initPortsWithFieldPositions();
    }

    private initStandalonePortPositions() {
        const inputPorts = this.getStandaloneInputPorts();
        const outputPorts =  this.getStandaloneOutputPorts();
        
        this.containedViews
            .filter((portView: NodePortView) => this.isStandalonePort(portView.getObj().getNodeParam()))
            .forEach((portView: NodePortView) => {
                const x = portView.getObj().isInputPort() ? 0 : this.bounds.getWidth();

                let portIndex: number;
                if(portView.getObj().isInputPort()) {
                    portIndex = inputPorts.findIndex(param => param.name === portView.getObj().getNodeParam().name);
                } else {
                    portIndex = outputPorts.findIndex(param => param.name === portView.getObj().getNodeParam().name)
                }     
                const y = portIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
                portView.point = new Point(x, y);
                portView.bounds = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
            });
    }

    private initPortsWithFieldPositions() {
        this.containedViews
            .filter((portView: NodePortView) => this.paramController[portView.getObj().getNodeParam().name])
            .forEach((portView: NodePortView) => {
                const x = portView.getObj().isInputPort() ? 0 : this.bounds.getWidth();
                const fieldParams = this.getFieldParams();
                const paramIndex = fieldParams.findIndex(param => param.name === portView.getObj().getNodeParam().name);
                const y = paramIndex * INPUT_HEIGHT + this.paramsYPosStart + INPUT_HEIGHT / 2;
                portView.point = new Point(x, y);
                portView.bounds = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
            });
    }

    getObj(): NodeObj {
        return this.obj;
    }

    setObj(obj: NodeObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.containedViews.forEach(joinPointView => joinPointView.move(point));
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose(): void {
        this.obj.dispose();
        this.getJoinPointViews().forEach(joinPointView => joinPointView.dispose());
    }

    findJoinPointView(name: string) {
        return this.containedViews.find((nodePortview: NodePortView) => nodePortview.getObj().getNodeParam().name === name);
    }

    getDeleteOnCascadeViews(): View[] {
        return [];
    }

    isStandalonePort(param: NodeParam) {
        return param.portDirection && !this.paramController[param.name];
    }

    getFieldParams(): NodeParam[] {
        return this.getObj().getParams().filter(param => this.paramController[param.name]);
    }

    getOutputPorts(): NodeParam[] {
        return this.getObj().getParams().filter(param => param.portDirection === PortDirection.Output);
    }

    getStandaloneOutputPorts(): NodeParam[] {
        return this.getOutputPorts().filter(param => !this.paramController[param.name]);
    }

    getStandaloneInputPorts(): NodeParam[] {
        return this.getInputPorts().filter(param => !this.paramController[param.name]);
    }
    
    getInputPorts(): NodeParam[] {
        return this.getObj().getParams().filter(param => param.portDirection === PortDirection.Input);
    }
    
    isPort(param: NodeParam) {
        return param.portDirection;
    }
    
    toJson(): NodeViewJson  {
        return {
            ...super.toJson(),
        }
    }

    fromJson(json: NodeViewJson, registry: Registry) {
        super.fromJson(json, registry);
    }

    private getJoinPointViews(): NodePortView[] {
        return <NodePortView[]> this.containedViews.filter(v => v.viewType === NodePortViewType);
    }
}