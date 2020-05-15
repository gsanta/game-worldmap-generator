import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { UpdateTask } from '../../core/services/UpdateServices';
import { calcOffsetFromDom, AbstractPlugin } from '../../core/AbstractPlugin';
import { Camera2D } from '../common/camera/Camera2D';
import { ActionEditorSettings } from './settings/ActionEditorSettings';
import { ActionStore } from '../../core/stores/ActionStore';

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

export class ActionEditorPlugin extends AbstractPlugin {
    static id = 'action-editor-plugin';
    
    visible = true;
    
    private camera: Camera2D;

    actionSettings: ActionEditorSettings;

    constructor(registry: Registry) {
        super(registry);

        this.camera = cameraInitializer(ActionEditorPlugin.id, registry);

        this.selectedTool = this.registry.tools.pan;
        this.actionSettings = new ActionEditorSettings(registry);
    }

    getStore(): ActionStore {
        return this.registry.stores.actionStore;
    }

    getId() {
        return ActionEditorPlugin.id;
    }

    resize(): void {
        this.camera.resize(getScreenSize(ActionEditorPlugin.id));
        this.registry.tools.zoom.resize();
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }

    getCamera() {
        return this.camera;
    }

    updateCamera() {
        this.camera = cameraInitializer(ActionEditorPlugin.id, this.registry);
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }
}