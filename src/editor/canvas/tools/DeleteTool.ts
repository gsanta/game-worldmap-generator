import { CanvasController } from '../CanvasController';
import { ToolType, ToolReturnType } from './Tool';
import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { View } from '../models/views/View';
import { ServiceLocator } from '../../ServiceLocator';

export class DeleteTool extends AbstractTool {
    private controller: CanvasController;
    private rectSelector: RectangleSelector;
    private services: ServiceLocator;

    constructor(controller: CanvasController, services: ServiceLocator) {
        super(ToolType.DELETE);
        this.controller = controller;
        this.services = services;
        this.rectSelector = new RectangleSelector(controller);
    }

    drag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.renderWindow();
    }

    click() {
        this.controller.pointerTool.click()
        const hovered = this.controller.viewStore.getHoveredView();
        hovered && this.controller.viewStore.remove(hovered);
        
        hovered && this.controller.updateContent();
    }

    
    draggedUp() {
        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(this.controller.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.controller.viewStore.remove(item));

        this.rectSelector.finish();

        this.controller.updateContent();
    }

    leave() {
        this.rectSelector.finish();
        this.controller.renderWindow();
    }

    over(item: View) {
        this.controller.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.pointerTool.out(item);
    }

    eraseAll() {
        this.services.storageService().clearAll();
        this.controller.viewStore.clear();
        this.controller.updateContent();
    }
}
