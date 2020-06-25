import * as React from 'react';

import {IconForgroundStyled, IconBackgroundStyled, IconStyled, IconProps} from '../../../../core/gui/icons/Icon';
import { colors } from '../../../../core/gui/styles';

export function PlayIconComponent(props: IconProps) {
    return (
        <IconStyled height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick} state={props.state}>
            <IconForgroundStyled {...props} d="M8 5v14l11-7z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}