import { AbstractController } from '../../../plugins/scene_editor/settings/AbstractController';
import { UI_ElementType } from './UI_ElementType';

export class UI_Element {
    elementType: UI_ElementType;
    id: string;
    protected controller: AbstractController;
    prop: string;
    isBold: boolean;

    constructor(controller: AbstractController) {
        this.controller = controller;
    }

    setController(controller: AbstractController) {
        this.controller = controller;
    }

    mouseOver() {
        this.controller.mouseOver(this.prop);
    }

    mouseOut() {
        this.controller.mouseOut(this.prop);
    }
}

