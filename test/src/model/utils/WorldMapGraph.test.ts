import { LinesToGraphConverter } from '../../../../src/world_generator/importers/text/LinesToGraphConverter';
import { TextConfigReader } from '../../../../src/world_generator/importers/text/TextConfigReader';
import { Point } from '../../../../src/model/geometry/shapes/Point';


describe('MatrixGraph', () => {
    describe('getGraphForVertexValue', () => {
        it('returns a graph where all the vertices contain the given value', () => {

            const input = [
                '##WW##',
                '######',
                '##W###',
                '##W###',
                '##WW##',
            ];

            const {gameObjectTemplates, globalConfig} = new TextConfigReader().read(
                `
                    definitions \`

                    # = empty
                    W = wall ROLES [BORDER]

                    \`
                `
            );

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(input, gameObjectTemplates);

            const reducedGraph = graph.getReducedGraphForTypes(['wall']);

            expect(reducedGraph.size()).toEqual(6);
        });
    });

    describe('createConnectedComponentGraphsForCharacter', () => {
        it ('separates the graph into multiple sub-graphs where each graph contains only' +
         'the given characters, and are all `connected-component`s', () => {
            const input = [
                '--------',
                '-RRR-RR-',
                '-RRR-RR-',
                '-RRR----',
                '--------',
            ];

            const {gameObjectTemplates, globalConfig} = new TextConfigReader().read(
                `
                    definitions \`

                    R = room
                    - = wall

                    \`
                `
            );

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(input, gameObjectTemplates);

            const connectedComponentGraphs = graph.getReducedGraphForTypes(['room']).getAllConnectedComponents();

            expect(connectedComponentGraphs.length).toEqual(2);
            expect(connectedComponentGraphs[0].getAllNodes().length).toEqual(9)
            expect(connectedComponentGraphs[1].getAllNodes().length).toEqual(4)
         });
    });

    describe('getReducedGraphForCharacters', () => {
        it ('returns a reduced graph that contains only the provided characters', () => {
            const input = [
                '##DDD########',
                '#------#----#',
                'D------#----#',
                'D------#----#',
                '#############',
            ];

            const {gameObjectTemplates, globalConfig} = new TextConfigReader().read(
                `
                    definitions \`

                    - = room
                    # = wall
                    D = door BORDER

                    \`
                `
            );

            const linesToGraphConverter = new LinesToGraphConverter();

            const graph = linesToGraphConverter.parse(input, gameObjectTemplates);

            const reducedGraph = graph.getReducedGraphForTypes(['wall', 'door']);

            expect(reducedGraph.getNodeAtPosition(new Point(0, 0))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(2, 0))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(12, 0))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(12, 1))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(12, 4))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(0, 4))).not.toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(7, 1))).not.toBeNull();

            expect(reducedGraph.getNodeAtPosition(new Point(1, 1))).toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(11, 1))).toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(1, 3))).toBeNull();
            expect(reducedGraph.getNodeAtPosition(new Point(11, 3))).toBeNull();
        });
    });
});