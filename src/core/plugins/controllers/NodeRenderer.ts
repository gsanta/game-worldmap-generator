import { AbstractController } from './AbstractController';
import { UI_SvgCanvas } from '../../ui_components/elements/UI_SvgCanvas';
import { UI_SvgGroup } from '../../ui_components/elements/svg/UI_SvgGroup';
import { UI_SvgForeignObject } from '../../ui_components/elements/svg/UI_SvgForeignObject';
import { sizes, colors } from '../../ui_components/react/styles';
import { JoinPointView } from '../../models/views/child_views/JoinPointView';
import { UI_Column } from '../../ui_components/elements/UI_Column';
import { NodeView } from '../../models/views/NodeView';
import { NodeController } from './NodeController';

export class NodeRenderer extends AbstractController {
    controller: AbstractController;

    private joinPointsHeight: number;

    render(svgCanvas: UI_SvgCanvas, nodeView: NodeView, controller: NodeController) {
        const group = svgCanvas.group(nodeView.id);
        group.transform = `translate(${nodeView.dimensions.topLeft.x} ${nodeView.dimensions.topLeft.y})`;

        this.renderRect(group, nodeView);
        const column = this.renderContent(group, nodeView);
        column.controller = controller;
        column.data = nodeView;
        this.renderInputsInto(column, nodeView);
    }

    private renderInputsInto(column: UI_Column, nodeView: NodeView) {
        nodeView.model.params.map(param => {
            let row = column.row({key: param.name});
            row.height = '35px';

            switch(param.inputType) {
                case 'textField':
                    const textField = row.textField(param.name);
                    textField.layout = 'horizontal';
                    textField.type = 'number';
                    textField.label = param.name;
                    textField.isBold = true;
                break;
                case 'list':
                    const select = row.select(param.name);
                    select.layout = 'horizontal';
                    select.label = param.name;
                    select.placeholder = param.name;
                    select.isBold = true;
                break;
            }
        });
    }

    private renderRect(group: UI_SvgGroup, nodeView: NodeView) {
        const rect = group.rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = nodeView.dimensions.getWidth();
        rect.height = nodeView.dimensions.getHeight();
        rect.strokeColor = this.getStrokeColor();
        rect.fillColor = nodeView.model.color || 'white';
    }

    private renderContent(group: UI_SvgGroup, nodeView: NodeView): UI_Column {
        const foreignObject = group.foreignObject({key: nodeView.id});
        foreignObject.width = nodeView.dimensions.getWidth();
        foreignObject.height = nodeView.dimensions.getHeight();
        foreignObject.controller = this.controller;
    
        this.renderTitle(foreignObject, nodeView);
        this.renderJoinPoints(group, nodeView);
    
        let column = foreignObject.column({ key: 'data-row' });
        column.margin = `${this.joinPointsHeight}px 0 0 0`;
        column.vAlign = 'space-between';
        column.padding = '10px';

        return column;
    }
    
    private renderTitle(foreignObject: UI_SvgForeignObject, nodeView: NodeView) {
        const header = foreignObject.row({key: 'header-row'});
        header.height = sizes.nodes.headerHeight + 'px';
        header.padding = '2px 5px';
        header.backgroundColor = colors.panelBackground;
        
        const title = header.text();
        title.text = nodeView.model.type;
        title.isBold = true;
        title.color = colors.textColor;
    }
    
    private renderJoinPoints(svgGroup: UI_SvgGroup, nodeView: NodeView) {
        const inputSlots = nodeView.model.inputSlots;
        const outputSlots = nodeView.model.outputSlots;
    
        inputSlots.forEach(inputSlot => {
            inputSlot
        });
    
        const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;
        let inputs: number = 0;
        let outputs: number = 0;
    
        let rowHeight = 20;
        nodeView.joinPointViews.forEach(joinPointView => {
            joinPointView.isInput ? (inputs++) : (outputs++);
            this.renderLabeledJoinPointInto(svgGroup, nodeView, joinPointView);
        });
    
        this.joinPointsHeight = inputs > outputs ? inputs * rowHeight : outputs * rowHeight;
    }
    
    private renderLabeledJoinPointInto(svgGroup: UI_SvgGroup, nodeView: NodeView, joinPointView: JoinPointView) {
        const circle = svgGroup.circle();
        svgGroup.data = nodeView;
    
        circle.cx = joinPointView.point.x;
        circle.cy = joinPointView.point.y;
        circle.r = 5;
        circle.fillColor = colors.grey4
        circle.data = joinPointView;
        circle.strokeColor = colors.panelBackground;
    
        const text = svgGroup.svgText({key: joinPointView.slotName});
        text.text = joinPointView.slotName;
        const textOffsetX = joinPointView.isInput ? 10 : -10;
        text.x = joinPointView.point.x + textOffsetX;
        text.y = joinPointView.point.y + 5;
        text.fontSize = '12px';
        text.isBold = true;
        joinPointView.isInput === false && (text.anchor = 'end');
    }
    
    private getStrokeColor(defaultColor = 'black'): string {
        // const selectionColor = this.registry.stores.selectionStore.contains(nodeView) ? colors.views.highlight : undefined;
        // let hoverColor: string = undefined
        // if (this.registry.plugins.getHoveredView()) {
        //     const activeTool = this.registry.plugins.getHoveredView().toolHandler.getActiveTool();
        //     hoverColor = this.registry.services.pointer.hoveredItem === nodeView ? activeTool.id === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;
        // }
    
        // return hoverColor || selectionColor || defaultColor;
        return defaultColor;
    }
}