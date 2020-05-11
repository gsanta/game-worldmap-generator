import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { ActionNodeProps } from './actionNodeSettingsFactory';
import { ActionNodeSettingsProps } from './ActionNodeSettings';

export class KeyboardActionNodeSettingsComponent extends React.Component<ActionNodeProps> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                {this.renderKeyboardKeysDropdown()}
            </div>
        )
    }

    private renderKeyboardKeysDropdown() {
        const keys: string[] = this.props.settings.getVal(ActionNodeSettingsProps.AllKeyboardKeys);
        const val: string = this.props.settings.getVal(ActionNodeSettingsProps.KeyboardKey);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Key</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={ActionNodeSettingsProps.KeyboardKey}
                        values={keys}
                        currentValue={val}
                        placeholder="Select key"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}