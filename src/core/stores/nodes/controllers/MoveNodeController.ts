import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum MoveNodeProps {
    SelectMove = 'SelectMove',
    Speed = 'Speed'
}

export class MoveNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<number>(MoveNodeProps.SelectMove)
            .onChange((val, context) => {
                context.updateTempVal(val)
            })
            .onBlur(context => {

            })
            .onGet((context) => {
                return context.getTempVal(() => null)
            });

        this.createPropHandler(MoveNodeProps.Speed)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}