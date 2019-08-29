import { Convert, Converter, AddChildren, AddBorders } from '../../api/Converter';
import { WorldItem } from '../../../WorldItemInfo';
import { TreeIteratorGenerator } from '../../../utils/TreeIteratorGenerator';


export class BabylonConverter<T> implements Converter<T> {
    convert(worldItemInfo: WorldItem[], convert: Convert<T>, addChildren: AddChildren<T>, addBorders: AddBorders<T>): T[] {
        const map: Map<WorldItem, T> = new Map();

        const rootItems: T[] = [];

        worldItemInfo.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                map.set(item, convert(item));
                rootItems.push(map.get(item));
            }
        });

        map.forEach((val: T, key: WorldItem) => {
            const children = key.children.map(child => map.get(child));

            if (children.length > 0) {
                addChildren(val, children);
            }

            const borders = key.borderItems.map(border => map.get(border));

            if (borders.length > 0) {
                addBorders(val, borders);
            }
        });

        return rootItems;
    }
}