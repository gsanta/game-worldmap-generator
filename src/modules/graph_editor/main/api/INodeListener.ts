import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam } from "../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../core/Registry";
import { IKeyboardEvent } from "../../../../core/controller/KeyboardHandler";

export interface INodeListener {
    onBeforeRender(nodeObj: NodeObj, registry: Registry): void;
    onKeyDown(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void;
    onKeyUp(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void;
    onNodeParamChange(param: NodeParam): void;
    onInit(): void;
}

export abstract class AbstractNodeListener implements INodeListener {
    onBeforeRender(nodeObj: NodeObj, registry: Registry): void {}
    onKeyDown(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void {}
    onKeyUp(e: IKeyboardEvent, nodeObj: NodeObj, registry: Registry): void {}
    onNodeParamChange(param: NodeParam): void {}
    onInit(): void {}
}