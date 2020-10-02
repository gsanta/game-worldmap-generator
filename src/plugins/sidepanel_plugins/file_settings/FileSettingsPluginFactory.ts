import { PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { FileSettingsPlugin, FileSettingsPluginId } from "./FileSettingsPlugin";
import { ExportFileController, ImportFileController, NewProjectController } from "./FileSettingsProps";

export class FileSettingslPluginFactory implements PluginFactory {
    pluginId = FileSettingsPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new FileSettingsPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ExportFileController(),
            new ImportFileController(),
            new NewProjectController()
        ];
    }

    createTools(): Tool[] { return []; }
}