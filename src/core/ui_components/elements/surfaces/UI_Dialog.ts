

import { UI_ElementType } from "../UI_ElementType";
import { UI_Layout } from '../UI_Layout';
import { UI_Region, UI_Plugin } from "../../../plugin/UI_Plugin";
import { Registry } from "../../../Registry";

export class UI_Dialog extends UI_Layout {
    elementType = UI_ElementType.Dialog;

    constructor(plugin: UI_Plugin) {
        super(plugin, UI_Region.Dialog);
    }

    width: string;
    height: string;
    title: string;

    close(registry: Registry): void {
        registry.plugins.getPropController(this.plugin.id).click(this);
        this.plugin.unmounted();
    }
}