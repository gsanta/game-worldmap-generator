import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ViewFormProps } from './formComponentFactory';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { PathPropType } from '../../forms/PathForm';
import { PathView } from '../../models/views/PathView';

export class PathFormComponent extends React.Component<ViewFormProps<PathView>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<PathView>) {
        super(props);

        this.props.canvasController.pathForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        this.props.canvasController.pathForm.path = this.props.view;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const form = this.props.canvasController.pathForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={PathPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(PathPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

}