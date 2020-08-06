import { SceneEditorPluginId } from '../../plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import { ObjectSettingsPluginId } from '../../plugins/object_settings/ObjectSettingsPlugin';
import { NodeEditorPluginId } from '../../plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPluginId } from '../../plugins/node_editor/NodeEditorSettingsPlugin';
import { CodeEditorPluginId } from '../../plugins/code_editor/CodeEditorPlugin';
import { LevelSettingsPluginId } from '../../plugins/level_settings/LevelSettingsPlugin';
import { Registry } from '../Registry';
import Split from 'split.js';
import { UI_Region } from '../UI_Plugin';
import { AbstractPlugin } from '../AbstractPlugin';

export class LayoutHandler {
    private registry: Registry;

    private panelIds = ['sidepanel', 'canvas1', 'canvas2'];

    private split: any;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    buildLayout() {
        if (this.split) {
            this.split.destroy();
        }

        let panelIds = this.panelIds;
        let sizes: number[] = [];

        if (this.registry.preferences.fullscreenRegion) {
            panelIds = ['sidepanel', this.registry.preferences.fullscreenRegion];
            sizes = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'sidepanel' | 'canvas1' | 'canvas2'].twoColumnRatio);
        } else {
            sizes = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'sidepanel' | 'canvas1' | 'canvas2'].threeColumnRatio);
        }

        let minSize = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'sidepanel' | 'canvas1' | 'canvas2'].minPixel);

        this.split = Split(panelIds.map(id => `#${id}`),
            {
                sizes: sizes,
                minSize: minSize,
                elementStyle: (dimension, size, gutterSize) => ({
                    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
                }),
                gutterStyle: (dimension, gutterSize) => ({
                    'width': '2px',
                    'cursor': 'ew-resize'
                }),
                onDrag: () => this.resizePlugins(),
                onDragEnd: ((sizes) => this.setSizesInPercent(sizes)) as any
            }
        );
    }

    resizePlugins() {
        if (this.registry.preferences.fullscreenRegion) {
            (this.registry.plugins.getByRegion(this.registry.preferences.fullscreenRegion)[0] as AbstractPlugin).resize()
        } else {
            (this.registry.plugins.getByRegion(UI_Region.Canvas1)[0] as AbstractPlugin).resize();
            (this.registry.plugins.getByRegion(UI_Region.Canvas2)[0] as AbstractPlugin).resize();
        }
    }

    setSizesInPercent(sizes: number[]) {

        const [sidepanelWidth] = sizes;

        if (this.registry.preferences.fullscreenRegion) {
            const prevSidepanelWidth = this.registry.preferences.panelSizes.sidepanel.twoColumnRatio;
            const prevCanvasWidth = this.registry.preferences.panelSizes[this.registry.preferences.fullscreenRegion].twoColumnRatio;

            const canvasWidth = prevCanvasWidth - (sidepanelWidth - prevSidepanelWidth);

            const widths: number[] = [sidepanelWidth, canvasWidth]

            // make sure added sizes don't diverge from 100% in the long term
            let sum = widths.reduce((sum, currSize) => sum + currSize, 0);
            if (sum < 100) {
                widths[0] += 100 - sum;
            }

            this.registry.preferences.panelSizes.sidepanel.twoColumnRatio = widths[0];
            this.registry.preferences.panelSizes[this.registry.preferences.fullscreenRegion].twoColumnRatio = widths[1];


        } else {
            const prevSidepanelWidth = this.registry.preferences.panelSizes.sidepanel.twoColumnRatio;
            const prevCanvas1Width = this.registry.preferences.panelSizes.canvas1.twoColumnRatio;
            const prevCanvas2Width = this.registry.preferences.panelSizes.canvas2.twoColumnRatio;

            const canvas1Width = prevCanvas1Width - (sidepanelWidth - prevSidepanelWidth) / 2;
            const canvas2Width = prevCanvas2Width - (sidepanelWidth - prevSidepanelWidth) / 2;

            const widths: number[] = [sidepanelWidth, canvas1Width, canvas2Width];

            // make sure added sizes don't diverge from 100% in the long term
            let sum = widths.reduce((sum, currSize) => sum + currSize, 0);
            if (sum < 100) {
                widths[0] += 100 - sum;
            }

            this.registry.preferences.panelSizes.sidepanel.threeColumnRatio = widths[0];
            this.registry.preferences.panelSizes[UI_Region.Canvas1 as string as 'sidepanel' | 'canvas1' | 'canvas2'].threeColumnRatio = widths[1];
            this.registry.preferences.panelSizes[UI_Region.Canvas2 as string as 'sidepanel' | 'canvas1' | 'canvas2'].threeColumnRatio = widths[2];
        }
    }
}

export interface UI_Perspective {
    name: string;

    sidepanelPlugins?: string[];
    canvas1Plugin: string;
    canvas2Plugin?: string;
}

export const SceneEditorPerspectiveName = 'Scene Editor';

export class UI_PerspectiveService {

    perspectives: UI_Perspective[] = [];
    activePerspective: UI_Perspective;

    layoutHandler: LayoutHandler;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.layoutHandler = new LayoutHandler(registry);

        this.perspectives.push({
            name: SceneEditorPerspectiveName,
            canvas1Plugin: SceneEditorPluginId,
            canvas2Plugin: GameViewerPluginId,
            sidepanelPlugins: [
                ObjectSettingsPluginId
            ]
        });

        this.perspectives.push({
            name: 'Node Editor',
            canvas1Plugin: NodeEditorPluginId,
            canvas2Plugin: GameViewerPluginId,
            sidepanelPlugins: [
                LevelSettingsPluginId,
                NodeEditorSettingsPluginId
            ]
        });

        this.perspectives.push({
            name: 'Code Editor',
            canvas1Plugin: CodeEditorPluginId,
            canvas2Plugin: GameViewerPluginId
        });
    }

    activatePerspective(name: string) {
        this.activePerspective && this.deactivatePerspective(this.activePerspective);

        const perspective = this.perspectives.find(perspective => perspective.name === name);
        this.activePerspective = perspective;

        this._activatePerspective(this.activePerspective);
    }

    private deactivatePerspective(perspective: UI_Perspective) {
        this.registry.plugins.deactivatePlugin(perspective.canvas1Plugin);
        
        if (perspective.canvas2Plugin) {
            this.registry.plugins.deactivatePlugin(perspective.canvas2Plugin);
        }

        (perspective.sidepanelPlugins || []).forEach(plugin => this.registry.plugins.deactivatePlugin(plugin))
    }

    private _activatePerspective(perspective: UI_Perspective) {
        this.registry.plugins.activatePlugin(perspective.canvas1Plugin);
        
        if (perspective.canvas2Plugin) {
            this.registry.plugins.activatePlugin(perspective.canvas2Plugin);
        }

        (perspective.sidepanelPlugins || []).forEach(plugin => this.registry.plugins.activatePlugin(plugin))
    }
}
