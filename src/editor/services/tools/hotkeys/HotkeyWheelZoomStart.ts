import { Hotkey } from "../../input/HotkeyService";
import { Registry } from "../../../Registry";

export class HotkeyWheelZoomStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('WheelZoom',  {wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.view.getActiveView().getActiveTool() !== this.registry.services.tools.zoom) {
            this.registry.services.view.getActiveView().setPriorityTool(this.registry.services.tools.zoom);
            return true;
        }
    }
}