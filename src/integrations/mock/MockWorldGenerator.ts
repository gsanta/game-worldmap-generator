import { WorldGenerator, Converter } from '../../WorldGenerator';
import { WorldItemType } from '../../WorldItemType';
import { MeshFactoryService } from '../../model/services/MeshFactoryService';
import { WorldItem } from '../../WorldItem';
import { MeshTemplate } from '../../MeshTemplate';
import { MeshTemplateService } from '../../model/services/MeshTemplateService';
import { Point } from '@nightshifts.inc/geometry';
import { setup } from '../../../test/test_utils/testUtils';

export class MockMeshFactoryService implements MeshFactoryService<any, any> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemType, meshTemplate: MeshTemplate<any, any>): any {
        return null
    }
}

export class MockMeshTemplateService implements MeshTemplateService<any, any> {
    private templateMap: Map<string, WorldItemType>;

    constructor(templateMap: Map<string, WorldItemType>) {
        this.templateMap = templateMap;
    }

    hasTemplate(type: string): boolean {
        return this.templateMap.has(type) && !!this.templateMap.get(type).model;
    }

    getTemplate(type: string): MeshTemplate<any, any> {
        return null;
        // throw new Error('Not implemented');
    }

    getTemplateDimensions(type: string): Point {
        const meshDescriptor = this.templateMap.get(type);

        if (meshDescriptor.realDimensions) {
            if (meshDescriptor.isBorder) {
                return new Point(meshDescriptor.realDimensions.width, 0);
            } else {
                return new Point(meshDescriptor.realDimensions.width, meshDescriptor.realDimensions.height);
            }
        } else {
            return null;
        }
    }

    loadAll(meshDescriptors: WorldItemType[]): Promise<unknown> {
        return Promise.resolve();
    }
}


export class MockWorldGenerator<T> implements WorldGenerator<T> {
    generate(worldMap: string, converter: Converter<T>) {
        const serviceFacade = setup(worldMap);

        const worldItems = serviceFacade.importerService.import(worldMap);

        serviceFacade.converterService.convert(worldItems, converter);
    }
}