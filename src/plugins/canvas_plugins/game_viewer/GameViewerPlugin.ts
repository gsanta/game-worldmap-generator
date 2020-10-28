import { ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_3d_Plugin } from '../../../core/plugin/Canvas_3d_Plugin';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { GameViewerProps } from './GameViewerProps';
import { GameToolId } from './tools/GameTool';
import { CameraToolId } from '../../../core/plugin/tools/CameraTool';
(<any> window).earcut = require('earcut');

export const GameViewerPluginId = 'game-viewer-plugin'; 
export const GameViewerPluginControllerId = 'game-viewer-plugin-controller'; 
export class GameViewerPlugin extends Canvas_3d_Plugin {
    id = GameViewerPluginId;
    region = UI_Region.Canvas2;

    constructor(registry: Registry) {
        super(GameViewerPluginId, registry);
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);

        this.registry.engine.setup(document.querySelector(`#${GameViewerPluginId} canvas`));
        this.registry.engine.resize();

        this.gizmos.forEach(gizmo => gizmo.mount());

        this.renderFunc && this.renderFunc();
    }

    destroy() {
        this.registry.engine.meshLoader.clear();
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.htmlCanvas();

        const selectedTool = this.registry.plugins.getToolController(this.id).getSelectedTool();

        const toolbar = canvas.toolbar();

        let tool = toolbar.tool({prop: CameraToolId});
        tool.isActive = selectedTool.id === CameraToolId;
        tool.icon = 'pan';
        let tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        let separator = toolbar.iconSeparator();
        separator.placement = 'left';

        separator = toolbar.iconSeparator();
        separator.placement = 'left';

        let actionIcon = toolbar.actionIcon({prop: ZoomInProp});
        actionIcon.icon = 'zoom-in';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom in';

        actionIcon = toolbar.actionIcon({prop: ZoomOutProp});
        actionIcon.icon = 'zoom-out';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Zoom out';

        tool = toolbar.tool({prop: GameToolId});
        tool.isActive = selectedTool.id === GameToolId;
        tool.icon = 'games';
        tool.placement = 'middle';
        tooltip = tool.tooltip();
        tooltip.label = 'Game tool';

        separator = toolbar.iconSeparator();
        separator.placement = 'middle';

        actionIcon = toolbar.actionIcon({prop: GameViewerProps.Play});
        actionIcon.icon = 'play';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'running';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Play';

        actionIcon = toolbar.actionIcon({prop: GameViewerProps.Stop});
        actionIcon.icon = 'stop';
        actionIcon.placement = 'middle';
        actionIcon.isActivated = this.registry.stores.game.gameState === 'paused';
        tooltip = actionIcon.tooltip();
        tooltip.label = 'Stop';


        const gizmoLayer = canvas.gizmoLayer();
        
        this.gizmos.forEach(gizmo => gizmo.renderInto(gizmoLayer));
    }
}