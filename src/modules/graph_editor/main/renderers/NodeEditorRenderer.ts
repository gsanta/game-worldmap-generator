import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ICanvasRenderer } from "../../../../core/plugin/ICanvasRenderer";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { NodeEditorModule } from "../../NodeEditorModule";
import { NodeEditorToolbarController } from "../controllers/NodeEditorToolbarController";
import { JoinTool } from "../controllers/tools/JoinTool";
import { NodeShape, NodeShapeType } from "../models/shapes/NodeShape";
import { NodeConnectionRenderer } from "./NodeConnectionRenderer";
import { NodeEditorToolbarRenderer } from "./NodeEditorToolbarRenderer";

export class NodeEditorRenderer implements ICanvasRenderer {
    private canvas: NodeEditorModule;
    private registry: Registry;
    private nodeConnectionRenderer: NodeConnectionRenderer;
    private nodeEditorToolbarRenderer: NodeEditorToolbarRenderer;

    constructor(registry: Registry, canvas: NodeEditorModule, controller: NodeEditorToolbarController) {
        this.canvas = canvas;
        this.registry = registry;
        this.nodeConnectionRenderer = new NodeConnectionRenderer(registry);
        this.nodeEditorToolbarRenderer = new NodeEditorToolbarRenderer(registry, canvas, controller);
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        const joinTool = <JoinTool> this.canvas.tool.getToolById(ToolType.Join);

        if (joinTool.startPoint && joinTool.endPoint) {
            const line = svgCanvas.line()
            line.css = {
                pointerEvents: 'none',
                stroke: colors.grey1,
                strokeWidth: "3",
                strokeDasharray: "12 3"
            }
            line.x1 = joinTool.startPoint.x;
            line.y1 = joinTool.startPoint.y;
            line.x2 = joinTool.endPoint.x;
            line.y2 = joinTool.endPoint.y;
        }

        this.nodeEditorToolbarRenderer.renderInto(svgCanvas);
        this.renderNodesInto(svgCanvas);
        this.nodeConnectionRenderer.renderInto(svgCanvas);
    }

    private renderNodesInto(canvas: UI_SvgCanvas) {
        (<NodeShape[]> this.registry.data.shape.node.getShapesByType(NodeShapeType)).forEach(nodeView => {
            nodeView.renderer.renderInto(canvas, nodeView, this.canvas);
        });
    }
}