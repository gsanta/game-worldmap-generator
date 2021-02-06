import { TableDefinition, Then, When, World } from "cucumber";
import { NodeObj } from "../../../src/core/models/objs/node_obj/NodeObj";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { UI_Container } from "../../../src/core/ui_components/elements/UI_Container";
import { UI_Factory } from "../../../src/core/ui_components/UI_Factory";
import { NodeListPanelId } from "../../../src/modules/graph_editor/contribs/side_panel/node_library/NodeLibraryModule";
import { ModelDumper } from "./common/ModelDumper";
import expect from 'expect';
import { NodeLibraryController } from "../../../src/modules/graph_editor/contribs/side_panel/node_library/NodeLibraryController";
import { AbstractShape } from "../../../src/core/models/shapes/AbstractShape";
import { MouseEventAdapter } from "../../../src/core/controller/MouseEventAdapter";

When('drop node \'{word}\' at \'{int}:{int}\'', function(nodeType: string, x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    const nodeListPanel = this.registry.services.module.ui.getPanel(NodeListPanelId);
    const nodeEditorSettingsController = <NodeLibraryController> nodeListPanel.paramController;
    nodeEditorSettingsController.dragNode.onDndStart(nodeType);

    const element = UI_Factory.listItem(<UI_Container> { children: [] }, { key: nodeType, controller: nodeListPanel.controller, dropTargetPlugin: canvasPanel});
    const pointerEvent = MouseEventAdapter.dndDrop(<MouseEvent> {x, y})
    canvasPanel.pointer.pointerDrop(pointerEvent);

    nodeEditorSettingsController.dragNode.onDndEnd();
});

Then('node params for \'{word}\' are:', function(nodeObjId: string, tableDef: TableDefinition) {
    const nodeObj = <NodeObj> this.registry.data.scene.items.getItemById(nodeObjId);
    nodeParamsAre(this, nodeObj, tableDef);
});

Then('dump node params for \'{word}\'', function(nodeObjId: string) {
    const nodeObj = <NodeObj> this.registry.data.scene.items.getItemById(nodeObjId);
    new ModelDumper().dumpNodeParams(nodeObj);
});

function nodeParamsAre(world: World, nodeObj: NodeObj, tableDef: TableDefinition) {
    const paramNames = tableDef.raw()[0];
 
    tableDef.rows()[0].forEach((expectedPropValue: string, propIdx: number) => {
        const paramName = paramNames[propIdx];
        const param = nodeObj.param[paramName];

        if (!param) { throw new Error(`Param ${paramName} not found.`); }

        expect(nodeObj.param[paramName].val).toEqual(expectedPropValue);
    });
}