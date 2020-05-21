import { NodeModel, NodeType } from "./NodeModel";
import { Keyboard } from "../../../services/input/KeyboardService";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}

export enum KeyboardNodeSlot {
    Output = 'output'
}

export class KeyboardNode extends NodeModel {
    type = NodeType.Keyboard;
    group = NodeGroupName.Default;
    title = "Keyboard input";
    key: Keyboard;
    color = '#89BD88';
    inputSlots = [];
    outputSlots = [
        {
            name: KeyboardNodeSlot.Output
        }
    ];

    findSlotByName(name: KeyboardNodeSlot) {
        return super.findSlotByName(name);
    }
}