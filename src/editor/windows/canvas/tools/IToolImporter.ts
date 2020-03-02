import { ViewGroupJson } from "../io/import/CanvasImporter";
import { ViewType } from "../models/views/View";

export interface IViewImporter {
    type: ViewType;
    import(group: ViewGroupJson): void;
} 

export function getImporterByType(toolType: ViewType, importers: IViewImporter[]) {
    return importers.find(tool => tool.type === toolType);
}