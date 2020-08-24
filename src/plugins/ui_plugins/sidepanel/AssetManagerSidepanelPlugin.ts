import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { Registry } from '../../../core/Registry';
import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { AssetManagerSidepanelController, AssetManagerSidepanelControllerProps, AssetManagerSidepanelControllerId } from './AssetManagerSidepanelController';

export const AssetManagerSidepanelPluginId = 'asset-manager-sidepanel-plugin' 
export class AssetManagerSidepanelPlugin extends UI_Plugin {
    id = 'asset-manager-sidepanel-plugin';
    displayName = 'Asset manager';
    region = UI_Region.Sidepanel;
    isGlobalPlugin = true;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(AssetManagerSidepanelControllerId, new AssetManagerSidepanelController(this, registry));
    }

    renderInto(layout: UI_Layout): void {
        layout.controllerId = AssetManagerSidepanelControllerId;
        let row = layout.row({ key: AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen });
        const manageAssetsButton = row.button(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen);
        manageAssetsButton.label = 'Manage assets';
    }
}