import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { UI_Builder } from '../../UI_Builder';
import { UI_Region } from '../../../plugin/UI_Panel';

export interface MainPanelProps {
    region: UI_Region.Canvas1 | UI_Region.Canvas2;
}

export class MainPanelComp extends React.Component<MainPanelProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.render.setRenderer(this.props.region, () => this.forceUpdate());
    }

    render() {
        const region = this.props.region === UI_Region.Canvas1 ? UI_Region.Canvas1 : UI_Region.Canvas2;
        const plugins = this.context.registry.plugins.getByRegion(region);

        let component: JSX.Element = null;

        if (plugins.length) {
            const plugin = plugins[0];
            component = new UI_Builder(this.context.registry).build(plugin, this.context.registry.plugins.getPlugin(plugin.id));
        }

        return (
            <div id={this.props.region === UI_Region.Canvas1 ? 'canvas1' : 'canvas2'}>
                {component}
            </div>
        )
    }
}