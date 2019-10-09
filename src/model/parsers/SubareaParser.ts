import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItem } from '../../WorldItem';
import { Parser } from "./Parser";
import { PolygonAreaParser } from './PolygonAreaParser';
import { WorldMapToSubareaMapConverter } from './WorldMapToSubareaMapConverter';
import { WorldMapToMatrixGraphConverter } from './reader/WorldMapToMatrixGraphConverter';
import { without } from '../utils/Functions';

export class SubareaParser implements Parser {
    private services: ServiceFacade<any, any, any>;
    private worldMapConverter: WorldMapToMatrixGraphConverter;

    constructor(services: ServiceFacade<any, any, any>, worldMapConverter = new WorldMapToMatrixGraphConverter()) {
        this.services = services;
        this.worldMapConverter = worldMapConverter;
    }

    parse(worldMap: string): WorldItem[] {
        const emptyChar = this.services.configService.meshDescriptorMap.get(this.services.configService.emptyType).char;
        const subareaChar = this.services.configService.meshDescriptorMap.get('_subarea').char;
        const borderChars = this.services.configService.borderTypes.map(borderType => this.services.configService.meshDescriptorMap.get(borderType).char);

        if (subareaChar === undefined) {
            return [];
        }

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(subareaChar, emptyChar, borderChars);

        let graph = this.worldMapConverter.convert(worldMapToSubareaMapConverter.convert(worldMap));
        const characters = without(graph.getCharacters(), this.services.configService.meshDescriptorMap.get('empty').char);

        const connectedCompGraphs = graph.getReducedGraphForCharacters(characters)
            .getConnectedComponentGraphs()
            .filter(graph => graph.getCharacters().includes(subareaChar));

        const polygonAreaParser = new PolygonAreaParser('_subarea', this.services.configService.meshDescriptorMap.get('_subarea').char, this.services);

        return connectedCompGraphs.map(g => polygonAreaParser.parse2(g));
    }
}