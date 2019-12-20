import { GlobalsSectionParser } from "../../../../../src/world_generator/importers/text/GlobalSectionParser";
import { Point } from "../../../../../src/model/geometry/shapes/Point";

it ('Parse scale property', () => {
    const worldMap = `
        globals \`

            scale 1 2

        \`
    `;

    const globalsSectionParser = new GlobalsSectionParser();

    const globals = globalsSectionParser.parse(worldMap);

    expect(globals.scale).toEqual(new Point(1, 2));
});

it ('Parse scale property with one number', () => {
    const worldMap = `
        globals \`

            scale 3

        \`
    `;

    const globalsSectionParser = new GlobalsSectionParser();

    const globals = globalsSectionParser.parse(worldMap);

    expect(globals.scale).toEqual(new Point(3, 3));
});