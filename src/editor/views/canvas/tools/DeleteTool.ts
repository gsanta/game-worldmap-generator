import { UpdateTask } from '../../../services/UpdateServices';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasView } from '../CanvasView';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { Concept } from '../models/concepts/Concept';
import { Stores } from '../../../stores/Stores';
import { PointerTool } from './PointerTool';

export class DeleteTool extends AbstractTool {
    private view: CanvasView;
    private rectSelector: RectangleSelector;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.DELETE);
        this.view = view;
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(view);
    }

    drag() {
        this.rectSelector.updateRect(this.getServices().pointerService().pointer);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).click()
        const hovered = this.getStores().conceptStore.getHoveredView();
        hovered && this.getStores().conceptStore.remove(hovered);
        
        this.getServices().levelService().updateCurrentLevel();
        hovered && this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    
    draggedUp() {
        const canvasItems = this.getStores().conceptStore.getIntersectingItemsInRect(this.view.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.getStores().conceptStore.remove(item));

        this.rectSelector.finish();

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: Concept) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).over(item);
    }

    out(item: Concept) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(item);
    }

    eraseAll() {
        this.getServices().storageService().clearAll();
        this.getStores().conceptStore.clear();
        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().runImmediately(UpdateTask.All);
    }
}