import { AbstractPlugin } from '../core/AbstractPlugin';
import { AbstractSidepanelPlugin } from '../core/AbstractSidepanelPlugin';
import { Registry } from '../core/Registry';
import { RenderTask } from '../core/services/RenderServices';
import { UI_Plugin, UI_Region } from '../core/UI_Plugin';
import { AssetLoaderPlugin } from './asset_loader/AssetLoaderPlugin';
import { AssetManagerDialogPlugin } from './asset_manager/AssetManagerDialogPlugin';
import { AssetManagerPlugin } from './asset_manager/AssetManagerPlugin';
import { AssetManagerSidepanelPlugin, AssetManagerSidepanelPluginId } from './asset_manager/AssetManagerSidepanelPlugin';
import { CodeEditorPlugin } from './code_editor/CodeEditorPlugin';
import { AbstractPluginComponentFactory } from './common/AbstractPluginComponentFactory';
import { FileSettingsPlugin, FileSettingsPluginId } from './file_settings/FileSettingsPlugin';
import { GameViewerPlugin } from './game_viewer/GameViewerPlugin';
import { LayoutSettingsPlugin, LayoutSettingsPluginId } from './layout_settings/LayoutSettingsPlugin';
import { LevelSettingsPlugin, LevelSettingsPluginId } from './level_settings/LevelSettingsPlugin';
import { NodeEditorPlugin } from './node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPlugin, NodeEditorSettingsPluginId } from './node_editor/NodeEditorSettingsPlugin';
import { ObjectSettingsPlugin, ObjectSettingsPluginId } from './object_settings/ObjectSettingsPlugin';
import { ThumbnailDialogPlugin } from './object_settings/ThumbnailDialogPlugin';
import { SceneEditorPlugin, SceneEditorPluginId } from './scene_editor/SceneEditorPlugin';

export class Plugins {
    // private plugins: Map<string, UI_Plugin> = new Map();

    // private registeredPlugins: Map<UI_Region, UI_Plugin[]> = new Map();
    // private showedPlugins: Map<UI_Region, UI_Plugin[]> = new Map();

    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;
    assetLoader: AssetLoaderPlugin;
    assetManager: AssetManagerPlugin;

    private plugins: UI_Plugin[] = [];
    private activePlugins: UI_Plugin[] = [];

    private pluginFactoryMap: Map<AbstractPlugin, AbstractPluginComponentFactory<any>> = new Map();
    
    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);
        this.assetLoader = new AssetLoaderPlugin(registry);
        this.assetManager = new AssetManagerPlugin(registry);

        this.registry.services.plugin.registerPlugin(this.sceneEditor);
        this.registry.services.plugin.activatePlugin(SceneEditorPluginId);
    
        this.registry.services.plugin.registerPlugin(this.gameView);
        this.registry.services.plugin.registerPlugin(this.nodeEditor);
        this.registry.services.plugin.registerPlugin(this.codeEditor);
        this.registry.services.plugin.registerPlugin(this.assetLoader);
        this.registry.services.plugin.registerPlugin(this.assetManager);

        this.registry.services.plugin.registerPlugin(new FileSettingsPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(FileSettingsPluginId);
        this.registry.services.plugin.registerPlugin(new LayoutSettingsPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(LayoutSettingsPluginId);

        this.registry.services.plugin.registerPlugin(new ObjectSettingsPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(ObjectSettingsPluginId);

        this.registry.services.plugin.registerPlugin(new LevelSettingsPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(LevelSettingsPluginId);

        this.registry.services.plugin.registerPlugin(new AssetManagerSidepanelPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(AssetManagerSidepanelPluginId);

        this.registry.services.plugin.registerPlugin(new AssetManagerDialogPlugin(this.registry));

        this.registry.services.plugin.registerPlugin(new ThumbnailDialogPlugin(this.registry));

        this.registry.services.plugin.registerPlugin(new NodeEditorSettingsPlugin(this.registry));
        this.registry.services.plugin.activatePlugin(NodeEditorSettingsPluginId);
    }

    getPluginFactory(plugin: AbstractPlugin): AbstractPluginComponentFactory<any> {
        return this.pluginFactoryMap.get(plugin);
    }

    private hoveredView: AbstractPlugin;
    
    setHoveredView(view: AbstractPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractPlugin {
        return this.hoveredView;
    }

    getViewById<T extends AbstractPlugin = AbstractPlugin>(id: string): T {
        return <T> this.plugins.find(view => view.id === id);
    }
    
    getActivePlugins(region?: UI_Region): UI_Plugin[] {
        if (region) {
            return this.activePlugins.filter(activePlugin => activePlugin.region === region);
        }
        return this.activePlugins;
    }

    findPlugin(pluginId: string): UI_Plugin {
        return this.plugins.find(plugin => plugin.id === pluginId);
    } 

    activatePlugin(pluginId: string) {
        const plugin = this.findPlugin(pluginId);
        if (UI_Region.isSinglePluginRegion(plugin.region)) {
            this.activePlugins = this.activePlugins.filter(activePlugin => activePlugin.region !== plugin.region);
        }
        
        this.activePlugins.push(plugin);
        // this.registry.services.ui.runUpdate(UI_Region.Dialog);

        switch(plugin.region) {
            case UI_Region.Dialog:
                this.registry.services.render.runImmediately(RenderTask.RenderDialog);
            break;
        }

    }

    deactivatePlugin(pluginId: string) {
        const plugin = this.findPlugin(pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id)

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }

    registerPlugin(plugin: UI_Plugin) {
        this.plugins.push(plugin);

        if (plugin.region === UI_Region.SidepanelWidget) {
            (<AbstractSidepanelPlugin> plugin).isGlobalPlugin && this.activatePlugin(plugin.id);
        }
    }
}