import { Point, Polygon } from '@nightshifts.inc/geometry';
import { PolygonAreaParser } from "../../../src/model/parsers/PolygonAreaParser";
import { setup } from "../../test_utils/testUtils";
import { Format } from '../../../src/model/parsers/Parser';

it ('Create items for a given type which is represented on the world map by a polygon shape.', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W---W----W
        W---W----W
        W---W----W
        W---W----W
        WWWWWWWWWW

        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map);
    const polygonAreaInfoParser = new PolygonAreaParser('empty', services);

    const worldItems = polygonAreaInfoParser.parse(map, Format.TEXT);

    expect(worldItems.length).toEqual(2);
    expect(worldItems).toHaveAnyWithDimensions(services.geometryService.factory.rectangle(1, 1, 3, 4));
    expect(worldItems).toHaveAnyWithDimensions(services.geometryService.factory.rectangle(5, 1, 4, 4));
});

it ('Create a more complicated polygon shape TEST 1', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W---WWWWWW
        W----WWWWW
        W----WWWWW
        W------WWW
        WWWWWWWWWW
        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map);
    const polygonAreaInfoParser = new PolygonAreaParser('empty', services);

    const worldItem = polygonAreaInfoParser.parse(map, Format.TEXT);

    expect(worldItem.length).toEqual(1);
    expect(worldItem[0].dimensions.equalTo(new Polygon([
        new Point(1, 1),
        new Point(1, 5),
        new Point(7, 5),
        new Point(7, 4),
        new Point(5, 4),
        new Point(5, 2),
        new Point(4, 2),
        new Point(4, 1)
    ]))).toBeTruthy();
});

it ('Create a more complicated polygon shape TEST 2', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W----WWWWW
        W----WWWWW
        WWW--WWWWW
        WWW--WWWWW
        WWWWWWWWWW

        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map);
    const polygonAreaInfoParser = new PolygonAreaParser('empty', services);

    const worldItem = polygonAreaInfoParser.parse(map, Format.TEXT);

    expect(worldItem.length).toEqual(1);
    expect(worldItem[0].dimensions.equalTo(new Polygon([
        new Point(1, 1),
        new Point(1, 3),
        new Point(3, 3),
        new Point(3, 5),
        new Point(5, 5),
        new Point(5, 1),
    ]))).toBeTruthy();
});