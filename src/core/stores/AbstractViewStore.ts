import { AbstractStore } from "./AbstractStore";
import { View } from "../models/views/View";
import { Rectangle } from "../geometry/shapes/Rectangle";
import { Polygon } from "../geometry/shapes/Polygon";


export class AbstractViewStore extends AbstractStore {
    protected views: View[] = [];


    addItem(item: {viewType: string, id: string}) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        if (!this.maxIdForType.has(item.viewType)) {
            this.maxIdForType.set(item.viewType, num);
        }

        if (this.maxIdForType.get(item.viewType) < num) {
            this.maxIdForType.set(item.viewType, num);
        }
    }

    removeItem(item: {viewType: string, id: string}) {
        const pattern = this.createPattern(item.viewType);
        const num = parseInt(item.id.match(pattern)[1], 10);

        const maxId = this.maxIdForType.get(item.viewType);
        if (maxId > 0 && maxId === num) {
            this.maxIdForType.set(item.viewType, maxId - 1);
        }
    }

    private createPattern(type: string) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }

    
    getIntersectingItemsInRect(rectangle: Rectangle): View[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.views.filter(item => polygon.contains(item.dimensions));
    }
}