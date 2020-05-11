import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";
import { Keyboard } from "../../../services/input/KeyboardService";

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}

export class KeyboardActionNode implements IActionNode {
    type = ActionType.Keyboard;
    title = "Keyboard input";
    key: string;
    color = '#89BD88';
    inputSlots = 2;
    outputSlots = 1;
}