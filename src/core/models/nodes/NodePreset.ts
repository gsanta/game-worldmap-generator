import { createNodeSettings } from "../../../plugins/node_editor/settings/nodes/nodeSettingsFactory";
import { DroppableItem } from "../../../plugins/common/tools/DragAndDropTool";
import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { NodeType, SlotName } from "./NodeModel";
import { NodeView, defaultNodeViewConfig } from "../views/NodeView";
import { ConceptType } from "../views/View";
import { NodeConnectionView } from "../views/NodeConnectionView";

export interface NodePresetRecipe {
    presetName: string;
    nodes: {
        type: NodeType,
        relativeCoordInUnit: Point
    }[],
    connections: {
        node1Index: number;
        node1SlotName: string;
        node2Index: number;
        node2SlotName: string;
    }[];
}

export class NodePreset {
    presetName: string;
    private registry: Registry;
    private recipe: NodePresetRecipe;

    constructor(registry: Registry, recipe: NodePresetRecipe) {
        this.registry = registry;
        this.recipe = recipe;
        this.presetName = this.recipe.presetName;
    }

    createPreset(centerPoint: Point): void {
        const nodeViews = this.createNodes(centerPoint);
        this.createConnections(nodeViews);
    }

    private createNodes(centerPoint: Point): NodeView[] {
        return this.recipe.nodes.map(node => {
            const offset = new Point(node.relativeCoordInUnit.x * 20, node.relativeCoordInUnit.y * 20); 
            const delta = node.relativeCoordInUnit
                .mul(defaultNodeViewConfig.width, defaultNodeViewConfig.height)
                .add(offset);
            const topLeft = centerPoint.clone().add(delta);
            const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
            const nodeView = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: node.type, dimensions: new Rectangle(topLeft, bottomRight)});
            this.registry.stores.nodeStore.addNode(nodeView);
            return nodeView;
        });
    }

    private createConnections(nodes: NodeView[]) {
        this.recipe.connections.forEach(conn => {
            const joinPoint1 = nodes[conn.node1Index].findJoinPointView(<SlotName> conn.node1SlotName)
            const joinPoint2 = nodes[conn.node2Index].findJoinPointView(<SlotName> conn.node2SlotName)
            const connection = new NodeConnectionView({joinPoint1, joinPoint2});
            joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            this.registry.stores.nodeStore.addConnection(connection);
        });
    }
}

export class DroppablePreset implements DroppableItem {
    itemType = 'Preset'
    preset: NodePreset;

    constructor(preset: NodePreset) {
        this.preset = preset;
    }
}