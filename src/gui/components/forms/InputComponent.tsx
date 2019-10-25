import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { withDelayedSynchronization, DelayedSynchronizationProps } from '../panels/withFocusHandling';
import { Focusable } from './Focusable';

export interface InputProps extends Focusable {
    onChange(text: string): void;
    onFocus(): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
}

export function InputComponent(props: InputProps) {

    return (
        <FormControl 
            type={props.type}
            onFocus={() => props.onFocus()}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}    
        />
    );
}

export const DelayedInputComponent = withDelayedSynchronization<InputProps>(InputComponent);