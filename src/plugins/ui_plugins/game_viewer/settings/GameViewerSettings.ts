import { Registry } from '../../../../core/Registry';
import { AbstractSettings } from '../../AbstractSettings';
import { RenderTask } from '../../../../core/services/RenderServices';
import { TimelineState } from '../../../../core/models/game_objects/RouteModel';
import { UI_Region } from '../../../../core/plugins/UI_Plugin';

export enum GameViewerSettingsProps {
    TimelineState = 'TimelineState'
}

export class GameViewerSettings extends AbstractSettings<GameViewerSettingsProps> {
    static settingsName = 'game-viewer-settings';
    getName() { return GameViewerSettings.settingsName; }

    private timeLineState: TimelineState = TimelineState.Stopped;
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: GameViewerSettingsProps) {
        switch (prop) {
            case GameViewerSettingsProps.TimelineState:
                return this.timeLineState;
        }
    }

    protected setProp(val: any, prop: GameViewerSettingsProps) {
        switch (prop) {
            case GameViewerSettingsProps.TimelineState:
                this.timeLineState = val;
                this.registry.stores.gameStore.getRoutes().forEach(model => {
                    switch(this.timeLineState) {
                        case TimelineState.Stopped:
                            model.reset();
                            break;
                        case TimelineState.Paused:
                            model.pause();
                            break;
                        case TimelineState.Playing:
                            model.play();
                            break;
                    }
                });

                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }

        this.registry.services.render.reRender(this.registry.services.pointer.hoveredPlugin.region, UI_Region.Sidepanel);
    }
}