import { AbstractSettings } from "./AbstractSettings";
import { PathConcept } from "../../../core/models/concepts/PathConcept";

export enum PathPropType {
    NAME = 'name'
}

export class PathSettings extends AbstractSettings<PathPropType> {
    static type = 'path-settings';
    getName() { return PathSettings.type; }
    path: PathConcept;

    protected getProp(prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                return this.path.id;
        }
    }

    protected setProp(val: any, prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                this.path.id = val;
                break;
        }
    }
}