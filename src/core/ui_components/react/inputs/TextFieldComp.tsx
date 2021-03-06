import * as React from 'react';
import { UI_TextField } from '../../elements/UI_TextField';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { colors } from '../styles';
import { UI_ComponentProps } from '../UI_ComponentProps';

const FormControlStyled = styled(Form.Control)`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey1};

    &:focus {
        box-shadow: none;
    }

    &.ce-disabled {
        // TODO: get rid of !important
        background-color: ${colors.grey2} !important;
        color: ${colors.grey1} !important
    }
`;

export function TextFieldComp(props: UI_ComponentProps<UI_TextField>) {
    const inputStyle: React.CSSProperties = {
        minWidth: '100px',
        height: '20px',
        borderRadius: 0,
        background: colors.grey3,
        color: colors.textColor
    };

    props.element.inputWidth && (inputStyle.width = props.element.inputWidth);


    const value = props.element.paramController ? props.element.paramController.val() : props.element.val(props.registry);
    let textFieldComponent = (
        <FormControlStyled
            className={props.element.isDisabled ? 'ce-disabled' : null}
            style={inputStyle}
            block
            type={props.element.type}
            onKeyDown={e => e.stopPropagation()}
            onKeyUp={e => e.stopPropagation()}
            onFocus={() => props.element.paramController ? props.element.paramController.focus(null, null) : props.element.focus(props.registry)}
            value={value === undefined || value === null ? '' : value}
            onChange={e => props.element.paramController ? props.element.paramController.change(e.target.value, null, null) : props.element.change(e.target.value, props.registry)}
            onBlur={() => props.element.paramController ? props.element.paramController.blur(null, null) : props.element.blur(props.registry)}
            disabled={props.element.isDisabled}
        />
    );

    if (props.element.label) {
        const style: React.CSSProperties = {
            display: 'flex',
            width: '100%'
        };
        
        if (props.element.layout === 'horizontal') {
            style.flexDirection = 'row';
            style.justifyContent = 'space-between';
            style.alignItems = 'center';
        } else {
            style.flexDirection = 'column';
        }

        return (
            <div style={style} className={`ce-labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                <div className="input">{textFieldComponent}</div>
            </div>
        )
    } else {
        return textFieldComponent;
    }
}