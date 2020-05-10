import { Registry } from '../../../core/Registry';
import { Feedback } from '../../../core/models/feedbacks/Feedback';
import { IKeyboardEvent } from '../../../core/services/input/KeyboardService';
import { Tool, ToolType, Cursor } from './Tool';
import { Concept } from '../../../core/models/concepts/Concept';

export class AbstractTool implements Tool {
    type: ToolType;
    cursor = Cursor.Default;
    
    protected registry: Registry;

    constructor(type: ToolType, registry: Registry) {
        this.type = type;
        this.registry = registry;
    }

    down() { }
    move() { }
    drag() { }
    click() { }
    draggedUp() { }
    up() { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: Concept | Feedback) { }
    out(item: Concept | Feedback) { }
    
    /**
     * Called when the mouse leaves the canvas.
     */
    leave() { }

    /**
     * Called when the tool is selected.
     */
    select(): void {}
    
    /**
     * Called when the tool is deselected.
     */
    deselect(): void {}

    setup(): void {};
    teardown(): void {};
}