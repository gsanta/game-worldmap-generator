import { AbstractNodeHandler } from './AbstractNodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../../core/stores/nodes/KeyboardNode';
import { BuiltinNodeType } from '../../../../core/stores/game_objects/NodeModel';
import { Registry } from '../../../../core/Registry';
import { AbstractCanvasPlugin } from '../../../../core/plugins/AbstractCanvasPlugin';

export class KeyboardNodeHandler extends AbstractNodeHandler<KeyboardNode> {
    nodeType: BuiltinNodeType.Keyboard;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        // this.registry.services.gamepad.registerGamepadListener(this.handleKeyEvent)
    }

    handle() {
        if (this.registry.services.gamepad.downKeys.has(this.instance.key)) {
            this.chain(KeyboardNodeSlot.Output);
        }

        // this.registry.
    }

    private handleKeyEvent(downKeys: number[]) {
        // this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
        //     .forEach(node => this.handle(node));
    }

    update(node: KeyboardNode) {
        super.update(node);
        if (this.registry.services.gamepad.downKeys.has(node.key)) {
            this.chain(KeyboardNodeSlot.Output);
        }
    }
}