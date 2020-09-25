import { Services } from "./services/Services";
import { Stores } from "./stores/Stores";
import { Plugins } from "./plugin/Plugins";
import { IControlledObject, ObjectCapability } from './IControlledObject';
import { IListener } from './IListener';
import { Preferences, defaultPreferences } from './preferences/Preferences';
import { IEngineFacade } from "./adapters/IEngineFacade";
import { Bab_EngineFacade } from "./adapters/babylonjs/Bab_EngineFacade";

export class Registry {
    stores: Stores;
    services: Services;
    plugins: Plugins;    
    // ui_regions: UI_Regions;
    preferences: Preferences = defaultPreferences;
    engine: IEngineFacade;

    constructor() {
        this.stores = new Stores(this);
        this.services = new Services(this);
        this.services.setup();

        this.plugins = new Plugins(this);
        this.engine = new Bab_EngineFacade(this);
    }

    registerObject(object: IControlledObject) {
        if (ObjectCapability.hasObjectCapability(object, ObjectCapability.Listener)) {
            this.services.event.addListener(<IListener> <unknown> object)
        }
    }

    unregisterObject(object: IControlledObject) {
        if (ObjectCapability.hasObjectCapability(object, ObjectCapability.Listener)) {
            this.services.event.removeListener(<IListener> <unknown> object)
        }
    }
}