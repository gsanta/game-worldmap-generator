import { AbstractSidepanelPlugin } from '../../../core/plugins/AbstractSidepanelPlugin';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { FileSettingsController, FileSettingsControllerId, FileSettingsProps } from './FileSettingsController';

export const FileSettingsPluginId = 'file-settings-plugin'; 
export class FileSettingsPlugin extends AbstractSidepanelPlugin {
    id = FileSettingsPluginId;
    displayName = 'File Settings';
    region = UI_Region.Sidepanel;
    isGlobalPlugin = true;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(FileSettingsControllerId, new FileSettingsController(this, registry));
    }

    renderInto(layout: UI_Layout): UI_Layout {
        layout.controllerId = FileSettingsControllerId;
        let row = layout.row({ key: FileSettingsProps.Export });

        const exportButton = row.button(FileSettingsProps.Export);
        exportButton.label = 'Export File';
        exportButton.icon = 'export-icon';
        exportButton.width = 'full-width';

        row = layout.row({ key: FileSettingsProps.Import });
        const importButton = row.fileUpload(FileSettingsProps.Import);
        importButton.label = 'Import File';
        importButton.icon = 'import-icon';
        importButton.width = 'full-width';

        row = layout.row({ key: FileSettingsProps.NewProject });
        const newProjectButton = row.button(FileSettingsProps.NewProject);
        newProjectButton.label = 'New Project';
        newProjectButton.icon = 'blank-icon';
        newProjectButton.width = 'full-width';

        return layout;
    }
}