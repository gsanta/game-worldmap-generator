import { Registry } from "../../Registry";
import { ConceptType } from "../../models/concepts/Concept";
import { PathConcept } from "../../models/concepts/PathConcept";
import { IConceptImporter } from "./IConceptImporter";
import { ConceptGroupJson } from "./ImportService";

export interface PathJson {
    circle: {
        _attributes: {
            cx: number;
            cy: number;
            r: number;
        }
    }[];

    path: {
        _attributes: {
            'data-name': string;
            'data-points': string;
            'data-parent-relations': string;
        }
    }
}

export interface PathGroupJson extends ConceptGroupJson {
    g: PathJson[] | PathJson;
}

export class PathConceptImporter implements IConceptImporter {
    type = ConceptType.PathConcept;
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathConcept();
            path.id = json.path._attributes['data-name'];
            path.deserialize(json.path._attributes['data-points'], json.path._attributes['data-point-relations']);

            this.registry.stores.canvasStore.addConcept(path);
        });
    }
}