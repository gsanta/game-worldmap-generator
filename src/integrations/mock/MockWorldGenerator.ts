import { WorldGenerator, Converter } from '../../WorldGenerator';
import { MeshDescriptor } from '../../Config';
import { MeshFactoryService } from '../../model/services/MeshFactoryService';
import { WorldItem } from '../../WorldItem';
import { MeshTemplate } from '../../MeshTemplate';
import { MeshTemplateService } from '../../model/services/MeshTemplateService';
import { Point } from '@nightshifts.inc/geometry';
import { setup } from '../../../test/test_utils/testUtils';

export class MockMeshFactoryService implements MeshFactoryService<any, any> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, meshTemplate: MeshTemplate<any, any>): any {
        return null
    }
}

export class MockMeshTemplateService implements MeshTemplateService<any, any> {
    private templateMap: Map<string, MeshDescriptor>;

    constructor(templateMap: Map<string, MeshDescriptor>) {
        this.templateMap = templateMap;
    }

    hasTemplate(type: string): boolean {
        return this.templateMap.has(type);
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

    loadAll(meshDescriptors: MeshDescriptor[]): Promise<unknown> {
        return Promise.resolve();
    }
}


export class MockWorldGenerator<T> implements WorldGenerator<T> {
    generate(worldMap: string, meshDescriptors: MeshDescriptor[], converter: Converter<T>) {
        // const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
        // worldConfig.meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

        // const meshFactoryService = new MockMeshFactoryService();
        // const meshTemplateService = new MockMeshTemplateService(null);

        // const configService = new ConfigService(worldConfig.borders, worldConfig.furnitures, meshDescriptorMap, {x: worldConfig.xScale, y: worldConfig.yScale})

        // const serviceFacade = new ServiceFacade<any, any, T>(
        //     meshFactoryService,
        //     meshTemplateService,
        //     configService
        // );

        const serviceFacade = setup(worldMap, meshDescriptors);

        const worldItems = serviceFacade.importerService.import(worldMap);

        serviceFacade.converterService.convert(worldItems, converter);
    }
}