import * as React from "react";
import { Focusable } from '../Focusable';
import { InputFieldCommands } from "./InputFieldCommands";

export function withCommitOnBlur<T extends Focusable>(WrappedComponent: React.ComponentType<T>) {
    
    return class extends React.Component<Omit<T & InputFieldCommands<any>, 'onBlur' | 'onFocus' | 'onChange'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onFocus={() => this.props.formController.focusProp(this.props.propertyName)}
                onChange={(val: string) => this.updateProp(val)}
                onBlur={() => this.props.formController.commitProp()}
            />;
        }

        private updateProp(val: any) {
            switch(this.props.propertyType) {
                case 'boolean':
                    this.props.formController.updateBooleanProp(val);
                    break;
                case 'string':
                    this.props.formController.updateStringProp(val);
                    break;
                case 'number':
                    this.props.formController.updateNumberProp(val);
                    break;
            }
        }
    }
}