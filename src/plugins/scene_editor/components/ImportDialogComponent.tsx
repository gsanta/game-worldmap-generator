import * as React from 'react';
import styled from 'styled-components';
import { AppContextType, AppContext } from '../../../core/gui/Context';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { ImportSettings } from '../settings/ImportSettings';

const CanvasStyled = styled.canvas`
    /* position: absolute; */
    width: 300px;
    height: 150px;
    /* z-index: 1000; */
    /* display: none; */

    /* top: -500px; */
    /* left: -500px; */
`

export class ImportDialogComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    private ref: React.RefObject<HTMLCanvasElement>;

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();

    }

    render() {
        if (this.context.registry.services.dialog.activeDialog !== ImportSettings.settingsName) { return null; }

        return (
            <DialogComponent title={'Import model'} closeDialog={() => null}>
                <CanvasStyled ref={this.ref} id="thumbnail-maker"/>
            </DialogComponent>
        );
    }
}