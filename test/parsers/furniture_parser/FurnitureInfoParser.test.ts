import { LinesToGraphConverter } from '../../../src/matrix_graph/conversion/LinesToGraphConverter';
import { FurnitureInfoParser } from '../../../src/parsers/furniture_parser/FurnitureInfoParser';
import { WorldItem } from '../../../src/WorldItemInfo';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemFactory } from '../../../src/WorldItemInfoFactory';

describe('FurnitureInfoParser', () => {
    describe('generate', () => {
        it ('creates world items from the graph (test case with one connected component)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWWW',
                    '#W#W##',
                    '######'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const furnitureInfoParser = new FurnitureInfoParser(new WorldItemFactory(), ['wall']);
            const worldItems = furnitureInfoParser.generate(graph);

            expect(worldItems.length).toEqual(4);
            const firstItem = worldItems[0];
            expect(firstItem).toEqual(new WorldItem('wall-1', 'W', Polygon.createRectangle(1, 1, 1, 2), 'wall'));
            const secondItem = worldItems[1];
            expect(secondItem).toEqual(new WorldItem('wall-2', 'W', Polygon.createRectangle(3, 1, 1, 2), 'wall'));
        });

        it ('creates world items from the graph (test case with multiple connected components)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '##WW##'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const furnitureInfoParser = new FurnitureInfoParser(new WorldItemFactory(), ['wall']);
            const worldItems = furnitureInfoParser.generate(graph);

            expect(worldItems.length).toEqual(3);
            const firstItem = worldItems[0];
            expect(firstItem).toEqual(new WorldItem('wall-1', 'W', Polygon.createRectangle(1, 1, 1, 2), 'wall'));
            const thirdItem = worldItems[2];
            expect(thirdItem).toEqual(new WorldItem('wall-3', 'W', Polygon.createRectangle(2, 3, 2, 1), 'wall'));
        });

        it ('creates one world item for a rectangular connected component', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '#DD###',
                    '#DD###',
                    '#DD###',
                    '######'
                ],
                {
                    D: 'door',
                    '#': 'empty'
                },
                {}
            );


            const furnitureInfoParser = new FurnitureInfoParser(new WorldItemFactory(), ['door']);
            const worldItems = furnitureInfoParser.generate(graph);
            expect(worldItems.length).toEqual(1);
            expect(worldItems[0]).toEqual(new WorldItem('door-1', 'D', Polygon.createRectangle(1, 0, 2, 3), 'door'));
        });
    });
});
