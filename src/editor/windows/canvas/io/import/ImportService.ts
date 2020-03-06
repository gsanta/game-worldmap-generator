import * as convert from 'xml-js';
import { IViewImporter } from '../../tools/IToolImporter';
import { CanvasWindow } from '../../CanvasWindow';
import { ViewType } from '../../models/views/View';
import { Point } from '../../../../../misc/geometry/shapes/Point';
import { Stores } from '../../../../Stores';
import { MeshViewImporter } from './RectangleImporter';
import { PathImporter } from './PathImporter';

export interface WgDefinition {
    _attributes: WgDefinitionAttributes;
}

export interface WgDefinitionAttributes {
    color: string;
    "roles": string;
    "materials": string;
    model: string;
    scale: string;
    "translate-y": string;
    "type-name": string;
}

export interface RawWorldMapJson {
    svg: {
        metadata: {
            "wg-type": WgDefinition[]
        };

        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
            "data-wg-pixel-size": string;
            "data-wg-scale-x": string;
            "data-wg-scale-y": string;
            "data-zoom": string;
            "data-viewbox": string;
        };

        g: ViewGroupJson[];
    }
}

export interface ViewGroupJson<T = any> {
    _attributes: {
        "data-view-type": string
    }
}

export class ImportService {
    serviceName = 'import-service';
    private viewImporters: IViewImporter[];
    private controller: CanvasWindow;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
        this.viewImporters = [
            new MeshViewImporter(rect => this.getStores().viewStore.addRect(rect)),
            new PathImporter(path => this.getStores().viewStore.addPath(path))
        ]
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const toolGroups: ViewGroupJson[] =  <ViewGroupJson[]> (rawJson.svg.g ? rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g] : []);

        toolGroups
        .forEach(toolGroup => {
            const viewType: ViewType = <ViewType> toolGroup._attributes["data-view-type"];
            this.findViewImporter(viewType).import(toolGroup)
        });

        this.controller && this.applyGlobalSettings(rawJson);
    }

    private applyGlobalSettings(rawJson: RawWorldMapJson) {
        if (rawJson.svg._attributes['data-translate']) {
            const topLeft = Point.fromString(rawJson.svg._attributes['data-translate']);
            this.getStores().cameraStore.getCamera().moveTo(topLeft);
        }        
        const zoom = rawJson.svg._attributes['data-zoom'] ? parseFloat(rawJson.svg._attributes['data-zoom']) : 1;
        this.getStores().cameraStore.getCamera().zoom(zoom);

    }

    private findViewImporter(viewType: ViewType): IViewImporter {
        return this.viewImporters.find(view => view.type === viewType);
    }
}