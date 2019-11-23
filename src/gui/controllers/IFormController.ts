
export abstract class IFormController<P> {
    focusProp(propType: P) {};
    getFocusedProp(): P { return null; };
    updateStringProp(value: string) {}
    updateBooleanProp(value: boolean) {};
    updateNumberProp(value: number) {};
    commitProp(removeFocus?: boolean) {};
    deletItemFromListProp(propType: P, index: number): void {};
    getVal(propType: P) {};
}