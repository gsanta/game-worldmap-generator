import { AbstractCanvasPanel } from '../models/modules/AbstractCanvasPanel';
import { Registry } from '../Registry';
import { UI_GizmoLayer } from './elements/gizmo/UI_GizmoLayer';
import { UI_DropLayer } from './elements/surfaces/canvases/UI_DropLayer';
import { UI_TableRowGroup } from './elements/surfaces/table/UI_TableRowGroup';
import { UI_Accordion } from './elements/surfaces/UI_Accordion';
import { UI_Dialog } from './elements/surfaces/dialog/UI_Dialog';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { UI_SvgForeignObject } from './elements/svg/UI_SvgForeignObject';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { UI_SvgLine } from './elements/svg/UI_SvgLine';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { UI_SvgPolygon } from './elements/svg/UI_SvgPolygon';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { UI_SvgText } from './elements/svg/UI_SvgText';
import { UI_ActionIcon } from './elements/toolbar/UI_ActionIcon';
import { UI_IconSeparator } from './elements/toolbar/UI_IconSeparator';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_Tool } from './elements/toolbar/UI_Tool';
import { UI_Box } from './elements/UI_Box';
import { UI_Button } from "./elements/UI_Button";
import { UI_Column } from './elements/UI_Column';
import { UI_Container } from './elements/UI_Container';
import { UI_ControlledElementConfig, UI_Element, UI_ElementConfig } from './elements/UI_Element';
import { UI_FileUpload } from "./elements/UI_FileUpload";
import { UI_GridSelect } from './elements/UI_GridSelect';
import { UI_HtmlCanvas } from './elements/UI_HtmlCanvas';
import { UI_Icon } from './elements/UI_Icon';
import { UI_Image } from './elements/UI_Image';
import { UI_Layout } from './elements/UI_Layout';
import { UI_ListItem } from './elements/UI_ListItem';
import { UI_Row } from './elements/UI_Row';
import { UI_Select } from "./elements/UI_Select";
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { UI_Table, UI_TableRow } from './elements/UI_Table';
import { UI_TableColumn } from "./elements/UI_TableColumn";
import { UI_Text } from "./elements/UI_Text";
import { UI_TextField } from './elements/UI_TextField';
import { UI_Tooltip } from './elements/UI_Tooltip';
import { UI_ToolbarDropdown } from './elements/toolbar/UI_ToolbarDropdown';
import { UI_ToolDropdownHeader } from './elements/toolbar/UI_ToolDropdownHeader';
import { UI_SvgMarker } from './elements/svg/UI_SvgMarker';
import { GlobalControllerProps, ParamController } from '../controller/FormController';
import { UI_Checkbox } from './elements/UI_Checkbox';
import { UI_PopupMultiSelect } from './elements/UI_PopupMultiSelect';
import { UI_Tree } from './elements/complex/tree/UI_Tree';
import { TreeController } from './elements/complex/tree/TreeController';
import { UI_DialogFooter } from './elements/surfaces/dialog/UI_DialogFooter';
import { UI_Separator } from './elements/surfaces/misc/UI_Separator';

export class UI_Factory {

    static registry: Registry;

    static layout(config: UI_ElementConfig): UI_Layout {
        const layout = new UI_Layout({controller: config.controller, ...config});

        return layout;
    }

    static dialog(config: UI_ElementConfig): UI_Dialog {
        // TODO closing dialog should be handled more clearly
        const dialog = new UI_Dialog({controller: config.controller, ...config, key: GlobalControllerProps.CloseDialog});

        return dialog;
    }

    static dialogFooter(parent: UI_Dialog, config: UI_ElementConfig): UI_DialogFooter {
        const element = new UI_DialogFooter({controller: config.controller, ...config, key: GlobalControllerProps.CloseDialog});

        element.canvasPanel = parent.canvasPanel;
        element.panel = parent.panel;

        parent._footer = element;

        return element;
    }

    static row(parent: UI_Container, config: UI_ElementConfig): UI_Row {
        const element = new UI_Row({controller: config.controller || parent.controller, parent, ...config});

        element.canvasPanel = parent.canvasPanel;
        element.panel = parent.panel;

        parent.children.push(element);

        return element;
    }

    static column(parent: UI_Container, config: UI_ElementConfig): UI_Column {
        const element = new UI_Column({controller: config.controller || parent.controller, parent, ...config});

        element.canvasPanel = parent.canvasPanel;
        element.panel = parent.panel;
        parent.children.push(element);

        return element;
    }

    static box(parent: UI_Container, config: UI_ElementConfig): UI_Box {
        const element = new UI_Box({controller: config.controller || parent.controller, parent, ...config});
        
        element.canvasPanel = parent.canvasPanel;
        element.panel = parent.panel;
        parent.children.push(element);

        return element;
    }

    static htmlCanvas(parent: UI_Container, config: UI_ElementConfig & { canvasPanel: AbstractCanvasPanel<any> }): UI_HtmlCanvas {
        const element = new UI_HtmlCanvas({controller: config.controller || parent.controller, parent, ...config});
        parent.children.push(element);

        element.canvasPanel = config.canvasPanel;

        return element;
    }

    static svgCanvas(parent: UI_Container, config: UI_ElementConfig & { canvasPanel: AbstractCanvasPanel<any> }): UI_SvgCanvas {
        const element = new UI_SvgCanvas({controller: config.controller || parent.controller, parent, ...config});
        parent.children.push(element);

        element.canvasPanel = config.canvasPanel;

        return element;
    }

    static dropLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_DropLayer {
        const element = new UI_DropLayer({controller: config.controller || parent.controller, parent, ...config});

        parent._dropLayer = element;
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static gizmoLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_GizmoLayer {
        const element = new UI_GizmoLayer({controller: config.controller || parent.controller, parent, ...config});

        parent._gizmoLayer = element;
        element.canvasPanel = parent.canvasPanel;
        element.panel = parent.panel;

        return element;
    }


    static accordion(parent: UI_Container, config: UI_ElementConfig): UI_Accordion {
        const element = new UI_Accordion({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tree(parent: UI_Container, config: UI_ControlledElementConfig<TreeController>): UI_Tree {
        const element = new UI_Tree(config);

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static text(parent: UI_Container, config: UI_ElementConfig): UI_Text {
        const element = new UI_Text({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static image(parent: UI_Container, config: UI_ElementConfig): UI_Image {
        const element = new UI_Image({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static icon(parent: UI_Container, config: UI_ElementConfig): UI_Icon {
        const element = new UI_Icon({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static listItem(parent: UI_Container, config: UI_ElementConfig & {dropTargetPlugin: AbstractCanvasPanel<any>}): UI_ListItem {
        const element = new UI_ListItem({controller: config.controller || parent.controller, parent, ...config});

        if (config) {
            element.dropTargetPlugin = config.dropTargetPlugin;
        }

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static button(parent: UI_Container, config: UI_ElementConfig): UI_Button {
        const element = new UI_Button({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static select(parent: UI_Container, config: UI_ElementConfig & { target?: string}) {
        const element = new UI_Select({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static popupMultiSelect(parent: UI_Container, config: UI_ElementConfig & { anchorElementKey: string }): UI_PopupMultiSelect {
        const anchorParent = this.findParentWithKey(parent, config.anchorElementKey);
        const element = new UI_PopupMultiSelect({controller: config.controller || parent.controller, parent, ...config}, anchorParent);

        parent.children.push(element);
        anchorParent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static fileUpload(parent: UI_Container, config: UI_ElementConfig): UI_FileUpload {
        const element = new UI_FileUpload({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static textField(parent: UI_Container, config: UI_ElementConfig & { target?: string}): UI_TextField {
        const element = new UI_TextField({controller: config.controller || parent.controller, parent, ...config});
        element.type = 'text';

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static checkbox(parent: UI_Container, config: UI_ElementConfig & { target?: string}): UI_Checkbox {
        const element = new UI_Checkbox({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static grid(parent: UI_Container, config: UI_ElementConfig & { filledIndexProp?: string}): UI_GridSelect {
        const element = new UI_GridSelect({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }
Id

    ///////////////////////////////////////////// Svg /////////////////////////////////////////////

    static svgText(parent: UI_Container, config: UI_ElementConfig): UI_SvgText {
        const element = new UI_SvgText({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgRect(parent: UI_Container, config: UI_ElementConfig): UI_SvgRect {
        const element = new UI_SvgRect({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;
    
        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgLine(parent: UI_Container, config: UI_ElementConfig): UI_SvgLine {
        const element = new UI_SvgLine({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;
    
        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgCircle(parent: UI_Container, config: UI_ElementConfig): UI_SvgCircle {
        const element = new UI_SvgCircle({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;
    
        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgPath(parent: UI_Container, config: UI_ElementConfig): UI_SvgPath {
        const element = new UI_SvgPath({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;
    
        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgPolygon(parent: UI_Container, config: UI_ElementConfig): UI_SvgPolygon {
        const element = new UI_SvgPolygon({controller: config.controller || parent.controller, parent, ...config});

        element.data = parent.data;
    
        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static svgImage(parent: UI_Container, config: UI_ElementConfig): UI_SvgImage {
        const element = new UI_SvgImage({controller: config.controller || parent.controller, parent, ...config});
    
        element.data = parent.data;

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
    
        return element;
    }

    static svgGroup(parent: UI_Container, config: UI_ElementConfig): UI_SvgGroup {
        const element = new UI_SvgGroup({ controller: config.controller || parent.controller, parent, ...config});
        
        element.data = parent.data;

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
        
        return element;
    }

    static svgMarker(parent: UI_Container, config: UI_ElementConfig & {uniqueId: string}): UI_SvgMarker {
        const element = new UI_SvgMarker({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
        
        return element;
    }

    static svgForeignObject(parent: UI_Container, config: UI_ElementConfig): UI_SvgForeignObject {
        const element = new UI_SvgForeignObject({controller: config.controller || parent.controller, parent, ...config});
        
        element.data = parent.data;

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;
        
        return element;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////Id

    static toolbar(parent: UI_SvgCanvas | UI_HtmlCanvas, config: UI_ElementConfig): UI_Toolbar {
        const element = new UI_Toolbar({controller: config.controller || parent.controller, parent, ...config});

        parent._toolbar = element;
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static toolbarDropdown(parent: UI_Toolbar, config: UI_ElementConfig): UI_ToolbarDropdown {
        const element = new UI_ToolbarDropdown({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static toolDropdownHeader(parent: UI_ToolbarDropdown, config: UI_ElementConfig): UI_ToolDropdownHeader {
        const element = new UI_ToolDropdownHeader({controller: config.controller || parent.controller, parent, ...config});

        parent._header = element;
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tool(parent: UI_Toolbar | UI_ToolDropdownHeader | UI_ToolbarDropdown, config: UI_ElementConfig): UI_Tool {
        const element = new UI_Tool({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static actionIcon(parent: UI_Toolbar, config: UI_ElementConfig & {uniqueId: string}): UI_ActionIcon {
        const element = new UI_ActionIcon({controller: config.controller || parent.controller, parent, ...config });

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static iconSeparator(parent: UI_Toolbar, config: UI_ElementConfig): UI_IconSeparator {
        const element = new UI_IconSeparator({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    ///////////////////////////////////////////// Panels ////////////////////////////////////////////

    static separator(parent: UI_Container, config: UI_ElementConfig): UI_Separator {
        const element = new UI_Separator({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: UI_ElementConfig): UI_Table {
        const element = new UI_Table({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tooltip(parent: UI_Tool | UI_ActionIcon | UI_Icon, config: UI_ElementConfig & { anchorId?: string }): UI_Tooltip {
        const element = new UI_Tooltip({controller: config.controller || parent.controller, parent, ...config});
        
        (config && config.anchorId) && (element.anchorId = config.anchorId);

        parent._tooltip = element;
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tableColumn(parent: UI_Container, config: UI_ElementConfig) {
        const element = new UI_TableColumn({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tableRow(parent: UI_Table, config: UI_ElementConfig & {isHeader?: boolean}) {
        const element = new UI_TableRow({controller: config.controller || parent.controller, parent, ...config});
        element.isHeader = config.isHeader;

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static tableRowGroup(parent: UI_Table, config: UI_ElementConfig) {
        const element = new UI_TableRowGroup({controller: config.controller || parent.controller, parent, ...config});

        parent.children.push(element);
        element.canvasPanel = parent.canvasPanel;

        return element;
    }

    static findParentWithKey(element: UI_Container, key: string): UI_Container {
        let currentElement = element;

        if (currentElement.key === key) { return currentElement; }

        while(currentElement.parent && currentElement.parent.key !== key) {
            currentElement = <UI_Container> currentElement.parent;
        }

        return currentElement.parent ? <UI_Container> currentElement.parent : undefined;

    }
}