import { GwmWorldItem } from '../../model/GwmWorldItem';
import { Point } from '../../model/Point';
import { Polygon, GwmWorldMapParser } from '../..';
import { expect } from 'chai';
import { defaultParseOptions } from '../../GwmWorldMapParser';
import { MockWorldItemGenerator } from './MockWorldItemGenerator';
import { HierarchyBuildingWorldItemGeneratorDecorator } from './HierarchyBuildingWorldItemGeneratorDecorator';


describe('HierarchyBuildingWorldItemGeneratorDecorator', () => {
    describe('generate', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const worldItemParentMock = new GwmWorldItem(
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new GwmWorldItem(
                '',
                new Polygon([
                    new Point(1, 1),
                    new Point(2, 1),
                    new Point(2, 2),
                    new Point(1, 2),
                ]),
                'cupboard'
            );

            const hierarchyBuildingWorldItemGeneratorDecorator = new HierarchyBuildingWorldItemGeneratorDecorator(
                new MockWorldItemGenerator([worldItemParentMock, worldItemChildMock]),
                ['room'],
                ['cupboard']
            );

            hierarchyBuildingWorldItemGeneratorDecorator.generate(null);

            expect(worldItemParentMock.childWorldItems.length).to.eq(1);
            expect(worldItemParentMock.childWorldItems[0]).to.eq(worldItemChildMock);
        });

        it ('does not create a parent-child relationship if one does not contain the other', () => {
            const worldItemParentMock = new GwmWorldItem(
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new GwmWorldItem(
                '',
                new Polygon([
                    new Point(5, 1),
                    new Point(6, 1),
                    new Point(6, 2),
                    new Point(5, 2),
                ]),
                'cupboard'
            );

            const hierarchyBuildingWorldItemGeneratorDecorator = new HierarchyBuildingWorldItemGeneratorDecorator(
                new MockWorldItemGenerator([worldItemParentMock, worldItemChildMock]),
                ['room'],
                ['cupboard']
            );

            hierarchyBuildingWorldItemGeneratorDecorator.generate(null);

            expect(worldItemParentMock.childWorldItems.length).to.eq(0);
        });
    });
});