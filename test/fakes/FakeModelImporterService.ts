import { ModelImportService, ModelData } from '../../src/model/services/ModelImportService';
import { Point } from '@nightshifts.inc/geometry';

export class FakeModelImporterService extends ModelImportService {

    private pathToDimensionMap: Map<string, Point> = new Map();

    constructor(pathToDimensionMap: Map<string, Point>) {
        super(null);
        this.pathToDimensionMap = pathToDimensionMap;
    }

    getModelByPath(path: string): ModelData {
        if (this.pathToDimensionMap.has(path)) {
            const dim = this.pathToDimensionMap.get(path);

            return {
                mesh: null,
                skeleton: null,
                dimensions: dim
            }
        }
        return null;
    }
}