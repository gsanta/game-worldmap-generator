import { IconProps, ToolIconStyled, ToolIconImageStyled, ToolIconBackgroundStyled, ToolStyled, ToolNameStyled } from "../../../plugins/common/toolbar/icons/ToolIcon";
import * as React from 'react';

export function FullScreenExitIconComponent(props: IconProps) {
    const toolName =  props.format === 'long' ? <ToolNameStyled>Full screen</ToolNameStyled> : null;

    return (
        <ToolStyled {...props}>
            <ToolIconStyled viewBox="0 0 24 24">
                <ToolIconBackgroundStyled isActive={props.isActive} d="M0 0h24v24H0z"/>
                <ToolIconImageStyled isActive={props.isActive} d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </ToolIconStyled>
            {toolName}
        </ToolStyled>
    );
}