import { WindowController, CanvasViewSettings } from '../../common/WindowController';
import { IPointerService } from '../../common/services/IPointerService';
import { KeyboardHandler } from '../../common/services/KeyboardHandler';
import { MouseHandler } from '../../common/services/MouseHandler';
import { Editor } from '../../Editor';
import { ServiceLocator } from '../../ServiceLocator';
import { MeshViewForm } from './forms/MeshViewForm';
import { PathViewForm } from './forms/PathViewForm';
import { CanvasExporter } from './io/export/CanvasExporter';
import { PathExporter } from './io/export/PathExporter';
import { RectangleExporter } from './io/export/RectangleExporter';
import { CanvasImporter } from './io/import/CanvasImporter';
import { PathImporter } from './io/import/PathImporter';
import { MeshViewImporter } from './io/import/RectangleImporter';
import { Model3DController } from './Model3DController';
import { CanvasPointerService } from './services/CanvasPointerService';
import { UpdateService, UpdateTask } from '../../common/services/UpdateServices';
import { ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';
import { Stores } from '../../Stores';
import { FeedbackStore } from './models/FeedbackStore';
import { PathView } from './models/views/PathView';
import { LevelForm } from './forms/LevelForm';

export class CanvasWindow extends WindowController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    feedbackStore: FeedbackStore;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    importer: CanvasImporter;
    exporter: CanvasExporter;
    model3dController: Model3DController;

    toolService: ToolService;
    updateService: UpdateService;
    pointer: IPointerService;
    
    meshViewForm: MeshViewForm;
    pathForm: PathViewForm;
    levelForm: LevelForm;

    constructor(editor: Editor, services: ServiceLocator, stores: Stores) {
        super(editor, services, stores);

        this.updateService = new UpdateService(this, services);
        this.feedbackStore = new FeedbackStore();
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.importer = new CanvasImporter(
            [
                new MeshViewImporter(rect => this.stores.viewStore.addRect(rect)),
                new PathImporter((path: PathView) => this.stores.viewStore.addPath(path))
            ],
            this
        );
        this.exporter = new CanvasExporter(this, [new RectangleExporter(this), new PathExporter(this)]);
        this.model3dController = new Model3DController(this, this.services);

        this.toolService = new ToolService(this, this.services);

        this.meshViewForm = new MeshViewForm(this, this.services, this.editor.eventDispatcher);
        this.pathForm = new PathViewForm();
        this.levelForm = new LevelForm(this, this.services);
        this.pointer = new CanvasPointerService(this);
    }

    setSelectedTool(toolType: ToolType) {
        if (this.toolService.selectedTool) {
            this.toolService.getActiveTool().unselect();
        }
        this.toolService.selectedTool = toolType;
        this.toolService.getActiveTool().select();
        this.updateService.runImmediately(UpdateTask.RepaintSettings);
    }

    getId() {
        return CanvasWindow.id;
    }

    resize(): void {
        this.toolService.cameraTool.resize();
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    activate(): void {
        // this.
    }

    isEmpty(): boolean {
        return this.stores.viewStore.getViews().length === 0;
    }

    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}