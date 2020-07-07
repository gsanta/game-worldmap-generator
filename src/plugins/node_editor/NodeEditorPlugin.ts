import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { RenderTask } from '../../core/services/RenderServices';
import { calcOffsetFromDom, AbstractPlugin } from '../../core/AbstractPlugin';
import { Camera2D } from '../common/camera/Camera2D';
import { NodeStore } from '../../core/stores/NodeStore';
import { NodePreset, NodePresetRecipe } from '../../core/models/nodes/NodePreset';
import { NodeType, NodeModel } from '../../core/models/nodes/NodeModel';
import { AndNode } from '../../core/models/nodes/AndNode';
import { AnimationNode } from '../../core/models/nodes/AnimationNode';
import { KeyboardNode } from '../../core/models/nodes/KeyboardNode';
import { MeshNode } from '../../core/models/nodes/MeshNode';
import { MoveNode } from '../../core/models/nodes/MoveNode';
import { TurnNode } from '../../core/models/nodes/TurnNode';
import { SplitNode } from '../../core/models/nodes/SplitNode';
import { RouteNode } from '../../core/models/nodes/RouteNode';
import { PathNode } from '../../core/models/nodes/PathNode';
import { NodeEditorSettings } from './settings/NodeEditorSettings';
import { NodeEditorExporter } from './io/NodeEditorExporter';
import { NodeEditorImporter } from './io/NodeEditorImporter';
import { ToolType } from '../common/tools/Tool';
import { Tools } from '../Tools';
import { toolFactory } from '../common/toolbar/toolFactory';
import { PluginSettings } from '../common/PluginSettings';

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

const recipes: NodePresetRecipe[] = [
    {
        presetName: 'Mesh navigation',
        nodes: [
            {
                type: NodeType.Keyboard,
                relativeCoordInUnit: new Point(0, -2)
            },
            {
                type: NodeType.Keyboard,
                relativeCoordInUnit: new Point(0, -1)
            },
            {
                type: NodeType.Keyboard,
                relativeCoordInUnit: new Point(0, 0)
            },
            {
                type: NodeType.Keyboard,
                relativeCoordInUnit: new Point(0, 1)
            },
            {
                type: NodeType.Move,
                relativeCoordInUnit: new Point(1.5, -2)
            },
            {
                type: NodeType.Move,
                relativeCoordInUnit: new Point(1.5, -1)
            },
            {
                type: NodeType.Turn,
                relativeCoordInUnit: new Point(1.5, 0)
            },
            {
                type: NodeType.Turn,
                relativeCoordInUnit: new Point(1.5, 1)
            },
            {
                type: NodeType.Mesh,
                relativeCoordInUnit: new Point(-1, 2)
            },
            {
                type: NodeType.Split,
                relativeCoordInUnit: new Point(0, 2)
            }
        ],
        connections: [
            {
                node1Index: 0,
                node1SlotName: 'output',
                node2Index: 4,
                node2SlotName: 'input'
            },
            {
                node1Index: 1,
                node1SlotName: 'output',
                node2Index: 5,
                node2SlotName: 'input'
            },
            {
                node1Index: 2,
                node1SlotName: 'output',
                node2Index: 6,
                node2SlotName: 'input'
            },
            {
                node1Index: 3,
                node1SlotName: 'output',
                node2Index: 7,
                node2SlotName: 'input'
            },
            {
                node1Index: 8,
                node1SlotName: 'action',
                node2Index: 9,
                node2SlotName: 'input'
            },
            {
                node1Index: 4,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output1'
            },
            {
                node1Index: 5,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output2'
            },
            {
                node1Index: 6,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output3'
            },
            {
                node1Index: 7,
                node1SlotName: 'mesh',
                node2Index: 9,
                node2SlotName: 'output4'
            }
        ]
    },
    {
        presetName: 'Path walking',
        nodes: [
            {
                type: NodeType.Path,
                relativeCoordInUnit: new Point(-1, 0)
            },
            {
                type: NodeType.Mesh,
                relativeCoordInUnit: new Point(-1, -1)
            },
            {
                type: NodeType.Route,
                relativeCoordInUnit: new Point(0, 0)
            },
            {
                type: NodeType.Animation,
                relativeCoordInUnit: new Point(1, -1)
            },
            {
                type: NodeType.Animation,
                relativeCoordInUnit: new Point(1, 0)
            },
            {
                type: NodeType.Animation,
                relativeCoordInUnit: new Point(1, 1)
            },
        ],
        connections: [
            {
                node1Index: 0,
                node1SlotName: 'action',
                node2Index: 2,
                node2SlotName: 'path'
            },
            {
                node1Index: 1,
                node1SlotName: 'action',
                node2Index: 2,
                node2SlotName: 'mesh'
            },
            {
                node1Index: 2,
                node1SlotName: 'onStart',
                node2Index: 3,
                node2SlotName: 'action'
            },
            {
                node1Index: 2,
                node1SlotName: 'onTurnStart',
                node2Index: 4,
                node2SlotName: 'action'
            },
            {
                node1Index: 2,
                node1SlotName: 'onTurnEnd',
                node2Index: 5,
                node2SlotName: 'action'
            }
        ]
    }
];

export const NodeEditorPluginId = 'action-editor-plugin'; 

export class NodeEditorPlugin extends AbstractPlugin {
    id = 'action-editor-plugin';
    
    private camera: Camera2D;

    presets: NodePreset[];

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Select, ToolType.Delete, ToolType.Camera, ToolType.Pointer, ToolType.Join, ToolType.DragAndDrop].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.camera = cameraInitializer(NodeEditorPluginId, registry);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.exporter = new NodeEditorExporter(this, this.registry);
        this.importer = new NodeEditorImporter(this, this.registry);

        this.pluginSettings = new PluginSettings(
            [
                new NodeEditorSettings(registry)
            ]
        )

        const templates: NodeModel[] = [
            new AndNode(undefined),
            new AnimationNode(undefined),
            new KeyboardNode(undefined),
            new MeshNode(undefined),
            new MoveNode(undefined),
            new SplitNode(undefined),
            new TurnNode(undefined),
            new RouteNode(undefined),
            new PathNode(undefined)
        ];

        templates.forEach(template => this.registerTemplate(template));

        const presets: NodePreset[] = [
            new NodePreset(this.registry, recipes[0]),
            new NodePreset(this.registry, recipes[1])
        ];

        presets.forEach(preset => this.registerPreset(preset));

        this.registry.stores.nodeStore.presets
    }

    getStore(): NodeStore {
        return this.registry.stores.nodeStore;
    }

    resize(): void {
        const screenSize = getScreenSize(NodeEditorPluginId);
        screenSize && this.camera.resize(screenSize);

        this.renderFunc && this.renderFunc();
    };

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera() {
        return this.camera;
    }

    registerTemplate(node: NodeModel) {
        if (this.registry.stores.nodeStore.templates.find(n => n.type === node.type)) {
            throw new Error(`Node template with type ${node.type} already registered`);
        }
        this.registry.stores.nodeStore.templates.push(node);
    }

    registerPreset(preset: NodePreset) {
        if (this.registry.stores.nodeStore.templates.find(n => n.type === preset.presetName)) {
            throw new Error(`Node preset with name ${preset.presetName} already registered`);
        }
        this.registry.stores.nodeStore.presets.push(preset);
    }
}