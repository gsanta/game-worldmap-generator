import * as React from 'react';
import { PauseIconComponent } from '../../../core/gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../core/gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../core/gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { SettingsRowStyled } from './SettingsComponent';
import { Editor } from '../../../core/Editor';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export class GlobalSettingsComponent extends React.Component<{editor: Editor}> {
    static contextType = AppContext;
    context: AppContextType;


    render() {

        const body = this.renderMovements();

        return (
            <AccordionComponent
                level="secondary"
                elements={[
                    {
                        title: 'Movements',
                        body
                    }
                ]}
            />
        )
    }

    private renderMovements() {
        return (
            <SettingsRowStyled verticalAlign='center'>
                <PlayIconComponent onClick={() => this.context.registry.services.game.playAllMovements()}/>
                <PauseIconComponent onClick={() => this.context.registry.services.game.pauseAllMovements()}/>
                <StopIconComponent onClick={() => this.context.registry.services.game.resetAllMovements()}/>
            </SettingsRowStyled>
        )
    }
}