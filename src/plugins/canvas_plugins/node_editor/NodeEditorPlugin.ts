import { Camera2D } from '../../../core/models/misc/camera/Camera2D';
import { NodeObj } from '../../../core/models/objs/NodeObj';
import { NodeConnectionView, NodeConnectionViewType } from '../../../core/models/views/NodeConnectionView';
import { NodeView, NodeViewType } from '../../../core/models/views/NodeView';
import { ViewTag } from '../../../core/models/views/View';
import { AbstractCanvasPlugin, calcOffsetFromDom, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { FormController } from '../../../core/plugin/controller/FormController';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { ViewStore } from '../../../core/stores/ViewStore';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { colors } from '../../../core/ui_components/react/styles';
import { Point } from '../../../utils/geometry/shapes/Point';
import { NodeRenderer } from './NodeRenderer';
import { AnimationNodeFacotry } from './nodes/AnimationNodeObj';
import { KeyboardNodeFacotry } from './nodes/KeyboardNodeObj';
import { MeshNodeFacotry } from './nodes/MeshNodeObj';
import { MoveNodeFacotry } from './nodes/MoveNodeObj';
import { PathNodeFacotry } from './nodes/PathNodeObj';
import { RouteNodeFacotry } from './nodes/route_node/RouteNodeObj';
import { JoinTool } from './tools/JoinTool';

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, new Point(100, 100));
    }
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export const NodeEditorPluginId = 'node-editor-plugin'; 
export const NodeEditorToolControllerId = 'node-editor-tool-controller'; 

export class NodeEditorPlugin extends AbstractCanvasPlugin {
    id = NodeEditorPluginId;
    region = UI_Region.Canvas1;

    nodeObjects: NodeObj;

    private camera: Camera2D;

    private formControllers: Map<string, FormController> = new Map();
    private defaultNodeRenderer = new NodeRenderer();

    constructor(registry: Registry) {
        super(registry);

        // setTimeout(() => {
    
        // }, 0);

        this.camera = cameraInitializer(NodeEditorPluginId, registry);
    }

    getStore(): ViewStore {
        return this.registry.stores.views;
    }

    resize(): void {
        const screenSize = getScreenSize(NodeEditorPluginId);
        screenSize && this.camera.resize(screenSize);

        this.registry.services.render.reRender(this.region);
    };

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera() {
        return this.camera;
    }

    getFormController(controllerId?: string): FormController {
        return this.formControllers.get(controllerId);
    }

    addFormController(controllerId: string, formController: FormController): void {
        this.formControllers.set(controllerId, formController);
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas();

        const dropLayer = canvas.dropLayer();
        dropLayer.acceptedDropIds = this.registry.services.node.nodeTypes
        dropLayer.isDragging = !!this.dropItem;

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool(ToolType.Select);
        tool.icon = 'select';
        let tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool(ToolType.Delete);
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool(ToolType.Camera);
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';
        
        let actionIcon = toolbar.actionIcon({prop: ZoomInProp});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: ZoomOutProp});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        const joinTool = <JoinTool> this.registry.plugins.getToolController(this.id).getById(ToolType.Join);

        if (joinTool.startPoint && joinTool.endPoint) {
            const line = canvas.line()
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey4,
                strokeWidth: "3",
                strokeDasharray: "12 3"
            }
            line.x1 = joinTool.startPoint.x;
            line.y1 = joinTool.startPoint.y;
            line.x2 = joinTool.endPoint.x;
            line.y2 = joinTool.endPoint.y;
        }

        this.renderNodesInto(canvas);
        this.renderConnectionsInto(canvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        (<NodeView[]> this.registry.stores.views.getViewsByType(NodeViewType)).forEach(nodeView => {
            this.defaultNodeRenderer.render(canvas, nodeView);
        });
    }

    private renderConnectionsInto(canvas: UI_SvgCanvas) {
        this.registry.stores.views.getViewsByType(NodeConnectionViewType).forEach((connection: NodeConnectionView) => {
            const line = canvas.line();
            line.x1 = connection.point1.x;
            line.y1 = connection.point1.y;
            line.x2 = connection.point2.x;
            line.y2 = connection.point2.y;
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey4,
                strokeWidth: "3"
            }

            const line2 = canvas.line();
            line2.data = connection;
            line2.css = {
                stroke: connection.tags.has(ViewTag.Hovered) || connection.tags.has(ViewTag.Selected) ? colors.views.highlight : 'transparent',
                strokeWidth: "6"
            }
            line2.x1 = connection.point1.x;
            line2.y1 = connection.point1.y;
            line2.x2 = connection.point2.x;
            line2.y2 = connection.point2.y;
        });
    }
}