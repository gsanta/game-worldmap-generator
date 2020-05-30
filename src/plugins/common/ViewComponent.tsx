import * as React from 'react';
import { colors } from '../../core/gui/styles';
import { InstanceProps } from '../InstanceProps';
import { ToolType } from './tools/Tool';
import { View } from '../../core/models/views/View';


export class ViewComponent<T extends View> extends React.Component<InstanceProps<T>> {
    protected ref: React.RefObject<HTMLDivElement>;

    constructor(props: InstanceProps<T>) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current && this.props.registry.services.hotkey.registerInput(this.ref.current);
    }

    componentWillUnmount() {

    }
    
    getStrokeColor(defaultColor = 'black'): string {
        const selectionColor = this.props.registry.stores.selectionStore.contains(this.props.item) ? colors.views.highlight : undefined;
        const activeTool = this.props.registry.services.plugin.getHoveredView().getActiveTool();
        const hoverColor = this.props.registry.services.pointer.hoveredItem === this.props.item ? activeTool.type === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;

        return hoverColor || selectionColor || defaultColor;
    }
}