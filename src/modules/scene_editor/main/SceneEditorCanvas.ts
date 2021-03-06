import { EngineEventAdapter } from "../../../core/controller/EngineEventAdapter";
import { FormController } from "../../../core/controller/FormController";
import { CameraTool } from "../../../core/controller/tools/CameraTool";
import { SelectToolId } from "../../graph_editor/main/controllers/tools/SelectTool_2D";
import { SelectTool_3D } from "./controllers/tools/SelectTool_3D";
import { ItemData } from "../../../core/data/ItemData";
import { ObjStore } from "../../../core/data/stores/ObjStore";
import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { Canvas3dPanel } from "../../../core/models/modules/Canvas3dPanel";
import { AbstractGameObj } from "../../../core/models/objs/AbstractGameObj";
import { UI_Region } from "../../../core/models/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AbstractModuleExporter } from "../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../core/services/import/AbstractModuleImporter";
import { Point } from "../../../utils/geometry/shapes/Point";
import { SceneEditorToolbarController } from "../contribs/toolbar/SceneEditorToolbarController";
import { HistoryListener } from "./controllers/listeners/HistoryListener";
import { SelectionListener } from "./controllers/listeners/SelectionListener";
import { GameTool } from "./controllers/tools/GameTool";
import { GizmoHandler } from "./GizmoHandler";
import { Exporter_Scene } from "./io/Exporter_Scene";
import { Importer_Scene } from "./io/Importer_Scene";
import { SceneEditorRenderer } from "./renderers/SceneEditorRenderer";
(<any> window).earcut = require('earcut');

export const SceneEditorPanelId = 'scene-editor'; 
export const SceneEditorPluginControllerId = 'scene-editor-plugin-controller';

export class SceneEditorCanvas extends Canvas3dPanel {
    showBoundingBoxes: boolean = false;
    selectedTool: string;

    data: ItemData<AbstractGameObj>;

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;

    private _selectionListener: SelectionListener;

    constructor(registry: Registry) {
        super(registry, UI_Region.Canvas2, SceneEditorPanelId, 'Scene Editor');

        this.exporter = new Exporter_Scene(registry);
        this.importer = new Importer_Scene(this, registry);

        this.gizmoHandler = new GizmoHandler(this);

        this.engine = registry.engine;
        this.data = {
            items: new ObjStore()
        }

        this.registry.data.scene = this.data;

        this.engineEventAdapter = new EngineEventAdapter(registry, this);
        this.engineEventAdapter.register();

        const tools = [
            new GameTool(this, registry),
            new CameraTool(this, registry),
            new SelectTool_3D(this, registry)
        ];
        
        const controller = new SceneEditorToolbarController(registry, this);
        this.setController(new FormController(this, registry, [], controller));
        this.setCamera(registry.engine.getCamera());
        this.renderer = new SceneEditorRenderer(this, controller);
        tools.forEach(tool => this.addTool(tool));

        this._selectionListener = new SelectionListener(this);
        this._selectionListener.listen();

        const historyListener = new HistoryListener(this.registry, this);
        historyListener.listen();
    
        this.onMounted(() => {
            registry.engine.setup(document.querySelector(`#${SceneEditorPanelId} canvas`));
            registry.engine.resize();
        });
    
        this.onUnmounted(() => registry.engine.meshLoader.clear());

        registry.engine.onReady(() => {
            registry.engine.gizmos.showGizmo(AxisGizmoType);
            registry.engine.gizmos.setGizmoPosition(AxisGizmoType, new Point(2.5, 3.2));
            
            this.tool.setSelectedTool(SelectToolId);
        });
    }
}