import * as React from 'react';
import styled from 'styled-components';
import { UI_Select } from '../../elements/UI_Select';
import { ClearIconComponent } from '../icons/ClearIconComponent';
import { UI_ComponentProps } from '../UI_ComponentProps';
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
    placeholder: string;
    label?: string;
    clear?: () => void;
}

const SelectStyled = styled.div`
    height: 30px;
    display: flex;
    justify-content: space-between;
`;

const LabelStyled = styled.div`
    font-size: 12px;
`;

export function SelectComp(props: UI_ComponentProps<UI_Select>) {
    const values: string[] = props.element.values || [];

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    let select = (
        <select
            className="dropdown-component"
            style={{minWidth: '100px'}}
            onChange={(e) => {
                props.element.change(e.target.value);
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
            value={props.element.val() ? props.element.val() : ''}
        >
            {props.element.val() ? options : [placeholder, ...options]}
        </select>
    );

    if (props.element.label) {
        select = (
            <div style={{display: 'flex', flexDirection: props.element.layout, width: '100%'}}>
                <LabelStyled key={'label'}>{props.element.label}</LabelStyled>
                <SelectStyled key="select">
                    {select}
                    {props.element.clearable && props.element.val() ? <ClearIconComponent onClick={() => props.element.change(undefined)}/> : null}
                </SelectStyled>
            </div>
        )
    }

    return select;
}

SelectComp.displayName = 'SelectComp';