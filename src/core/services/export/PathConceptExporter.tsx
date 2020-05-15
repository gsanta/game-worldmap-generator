import { ConceptType } from "../../models/views/View";
import { Hoverable } from "../../models/Hoverable";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import { PathComponent } from "./PathComponent";
import React = require("react");

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element {
        const pathes = this.registry.stores.canvasStore.getPathConcepts().map(path => {
            return <PathComponent
                key={path.id}
                onlyData={!hover}
                item={path}
                isHovered={this.registry.stores.hoverStore.contains(path)}
                isSelected={this.registry.stores.selectionStore.contains(path)}
                onMouseOver={(item: Hoverable) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: Hoverable) => unhover ? unhover(item) : () => undefined}
                stores={this.registry.stores}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-concept-type={ConceptType.PathConcept} key={ConceptType.PathConcept}>{pathes}</g> 
            )
            : null;
    }

    exportToFile(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element {
        return this.export(hover, unhover);
    }
}