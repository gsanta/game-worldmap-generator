import { WorldItem } from '../WorldItem';
import { WorldMapToMatrixGraphConverter } from "./reader/WorldMapToMatrixGraphConverter";
import { Matrix } from "./matrix/Matrix";
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import _ = require("lodash");
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';

export class RoomParser implements Parser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private polygonAreaParser: PolygonAreaParser;
    private worldMapToMatrixGraphConverter = new WorldMapToMatrixGraphConverter();
    private borderCharacters: string[];
    private worldItemFactoryService: WorldItemFactoryService

    constructor(worldItemFactoryService: WorldItemFactoryService, borderCharacters: string[] = ['W', 'D', 'I']) {
        this.borderCharacters = borderCharacters;
        this.worldItemFactoryService = worldItemFactoryService;
    }

    parse(worldMap: string): WorldItem[] {
        const matrix = this.worldMapToMatrixGraphConverter.convert(worldMap);

        this.worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', matrix.getCharacterForName('empty'), this.borderCharacters);
        this.polygonAreaParser = new PolygonAreaParser('room', this.worldItemFactoryService);

        return this.polygonAreaParser.parse(this.worldMapToRoomMapConverter.convert(worldMap));
    }
}