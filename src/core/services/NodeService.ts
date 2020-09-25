import { AnimationNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/AnimationNodeObj';
import { KeyboardNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/KeyboardNodeObj';
import { MeshNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/MeshNodeObj';
import { MoveNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/MoveNodeObj';
import { PathNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/PathNodeObj';
import { RouteNodeFacotry } from '../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj';
import { NodeEditorPluginId } from '../../plugins/canvas_plugins/node_editor/NodeEditorPlugin';
import { NodeObj } from '../models/objs/NodeObj';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeView } from '../models/views/NodeView';
import { View, ViewType } from '../models/views/View';
import { AbstractController } from '../plugin/controller/AbstractController';
import { NodeRenderer } from '../../plugins/canvas_plugins/node_editor/NodeRenderer';
import { UI_Plugin } from '../plugin/UI_Plugin';
import { Registry } from '../Registry';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { NodeGraph } from './node/NodeGraph';
import { ViewStoreHook } from '../stores/ViewStore';

export class NodeService {
    nodeTemplates: Map<string, NodeObj> = new Map();
    nodeTypes: string[] = [];
    graph: NodeGraph;

    private nodeFactories: Map<string, NodeFactory> = new Map();

    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(this.registry);
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);

            this.registerNode(KeyboardNodeFacotry);
            this.registerNode(AnimationNodeFacotry);
            this.registerNode(MeshNodeFacotry);
            this.registerNode(MoveNodeFacotry);
            this.registerNode(PathNodeFacotry);
            this.registerNode(RouteNodeFacotry);

            // TODO: unregister somewhere
            this.registry.stores.nodeStore.addHook(new RemoveRelatedConnectionHook(this.registry));
            this.registry.stores.nodeStore.addHook(new NodeGraphHook(this.registry));
        });
    }

    registerNode(nodeFactory: NodeFactory) {
        // TODO create dummygraph instead of passing undefined
        const nodeTemplate = nodeFactory.newNodeInstance(undefined);
        this.nodeTemplates.set(nodeTemplate.type, nodeTemplate);
        this.nodeTypes.push(nodeTemplate.type);
        this.nodeFactories.set(nodeTemplate.type, nodeFactory);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeTemplates.has(nodeView.getObj().type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.getObj().type}`);
        }

        this.defaultNodeRenderer.render(ui_svgCanvas, nodeView);
    }

    createNodeView(nodeType: string): NodeView {
        if (!this.nodeTemplates.has(nodeType)) {
            throw new Error(`Node creator registered for node type ${nodeType}`);
        }

        const nodeObject = this.nodeFactories.get(nodeType).newNodeInstance(this.graph);
        
        // const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        // new Rectangle(topLeft, bottomRight)
        
        const nodeView = new NodeView({nodeType: nodeObject.type, node: nodeObject});
        nodeView.controller = this.nodeFactories.get(nodeType).newControllerInstance(this.registry.plugins.getById(NodeEditorPluginId), this.registry);
        
        return nodeView;
    }
}

export interface NodeFactory {
    newNodeInstance(graph: NodeGraph): NodeObj;
    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any>;
}

class RemoveRelatedConnectionHook implements ViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addViewHook() {}

    removeViewHook(view: View) {
        switch(view.viewType) {
            case ViewType.NodeView:
                this.removeRelatedConnections(<NodeView> view)
            break;
        }
    }

    private removeRelatedConnections(nodeView: NodeView) {
        nodeView.joinPointViews.forEach(joinPointView => {
            if (joinPointView.connection) {
                this.registry.stores.nodeStore.removeView(joinPointView.connection);
            }
        });
    }
}

class NodeGraphHook implements ViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addViewHook(view: View) {
        const graph = this.registry.services.node.graph;
        switch(view.viewType) {
            case ViewType.NodeConnectionView:
                graph.addConnection((<NodeConnectionView> view).getObj());
            break;
            case ViewType.NodeView:
                graph.addNode((<NodeView> view).getObj());
            break;
        }
    }

    removeViewHook(view: View) {
        const graph = this.registry.services.node.graph;

        switch(view.viewType) {
            case ViewType.NodeConnectionView:
                graph.removeConnection((<NodeConnectionView> view).getObj());
            break;
            case ViewType.NodeView:
                graph.removeNode((<NodeView> view).getObj());
            break;
        }
    }
}