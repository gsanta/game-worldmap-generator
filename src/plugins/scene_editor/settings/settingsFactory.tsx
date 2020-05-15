import { MeshSettingsComponent } from "./MeshSettingsComponent";
import { PathSettingsComponent } from "./PathSettingsComponent";
import styled from "styled-components";
import * as React from 'react';
import { Stores } from "../../../core/stores/Stores";
import { Registry } from "../../../core/Registry";
import { MeshConcept } from "../../../core/models/concepts/MeshConcept";
import { SceneEditorPlugin } from "../SceneEditorPlugin";
import { Concept, ConceptType } from "../../../core/models/concepts/Concept";
import { PathView } from "../../../core/models/views/PathView";

export interface ViewFormProps<T extends Concept> {
    canvasController: SceneEditorPlugin;
    view: T;
    getStores: () => Stores;
}

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export function settingsFactory(registry: Registry): JSX.Element {
    const selectedViews = registry.stores.selectionStore.getAll();
    if (selectedViews.length !== 1) {
        return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
    }

    switch(selectedViews[0].type) {
        case ConceptType.MeshConcept:
            return <MeshSettingsComponent concept={selectedViews[0] as MeshConcept}/>;
        case ConceptType.PathConcept:
            return <PathSettingsComponent concept={selectedViews[0] as PathView}/>;
    }
}