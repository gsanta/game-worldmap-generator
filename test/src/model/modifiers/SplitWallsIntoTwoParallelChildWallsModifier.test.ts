import { AssignBordersToRoomsModifier } from "../../../../src/world_generator/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../../../src/world_generator/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from '../../../../src/world_generator/modifiers/ChangeBorderWidthModifier';
import { ScaleModifier } from "../../../../src/world_generator/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../../../src/world_generator/modifiers/SegmentBordersModifier";
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../../../../src/world_generator/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from '../../../../src/world_generator/modifiers/ThickenBordersModifier';
import { FileFormat } from "../../../../src/WorldGenerator";
import { GameObject } from '../../../../src/world_generator/services/GameObject';
import { setup } from "../../../testUtils";
import { Segment } from "../../../../src/model/geometry/shapes/Segment";
import { StripeView } from "../../../../src/model/geometry/shapes/StripeView";

function createMap(worldMap: string) {
        return `
            map \`

            ${worldMap}

            \`

            definitions \`

            W = wall ROLES [BORDER]
            D = door ROLES [BORDER]
            - = room ROLES [CONTAINER]

            \`
        `;
}

describe(`SplitWallsIntoTwoParallelChildWallsModifier`, () => {


    it ('splits each wall into two parallel walls and adds them as children to the original wall', () => {
        const map = createMap(
            `
            WDDWWWWW
            W--W---W
            W--W---W
            WWWWWWWW

            `
        );

        const serviceFacade = setup(map, FileFormat.TEXT);

        let worldItems = serviceFacade.gameObjectBuilder.build(map);
        const [root] = serviceFacade.modifierExecutor.applyModifiers(
            worldItems,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ScaleModifier.modName,
                ChangeBorderWidthModifier.modName,
                ThickenBordersModifier.modName
            ]
        )
        
        expect(root.children.length).toEqual(10);

        const items = new SplitWallsIntoTwoParallelChildWallsModifier(serviceFacade.gameObjectFactory).apply([root]);

        const walls = root.children.filter(item => item.name === 'wall');

        expect(items[0].children.length).toEqual(10);
        walls.forEach(wall => {
            expect(wall.children.length).toEqual(2);
            checkIfChildrenDimensionsAddUpToParentDimensions(wall);
        });
    });
});

function checkIfChildrenDimensionsAddUpToParentDimensions(parentWall: GameObject) {
    const parentRect = (<Segment> parentWall.dimensions).addThickness(parentWall.thickness / 2);
    const childSegment1 = <Segment> parentWall.children[0].dimensions;
    const childSegment2 = <Segment> parentWall.children[1].dimensions;

    const childrenRect = StripeView.createRectangleFromTwoOppositeSides(childSegment1, childSegment2);
    expect(parentRect.equalTo(childrenRect)).toBeTruthy();
}
