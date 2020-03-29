import { Concept } from "../views/canvas/models/concepts/Concept";
import { Feedback } from "../views/canvas/models/feedbacks/Feedback";
import { without, maxBy } from "../../misc/geometry/utils/Functions";
import { CanvasItemType } from "../views/canvas/models/CanvasItem";
import { MeshConcept } from "../views/canvas/models/concepts/MeshConcept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";
import { Stores } from "./Stores";
import { Polygon } from "../../misc/geometry/shapes/Polygon";
import { Point } from "../../misc/geometry/shapes/Point";
import { Rectangle } from "../../misc/geometry/shapes/Rectangle";

export class CanvasStore {
    concepts: Concept[] = [];
    feedbacks: Feedback[] = [];

    private naming: Naming;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
        this.naming = new Naming(this);
    }

    addConcept(concept: Concept) {
        this.concepts.push(concept);
    }

    addFeedback(feedback: Feedback) {
        this.feedbacks.push(feedback);
    }

    removeConcept(concept: Concept) {
        this.concepts = without(this.concepts, concept);
        this.getStores().hoverStore.removeItem(concept);
        this.getStores().selectionStore.removeItem(concept);
    }

    clear(): void {
        this.concepts = [];
        this.feedbacks = [];
    }

    getAllConcepts(): Concept[] {
        return this.concepts;
    }

    getConceptsByType(type: CanvasItemType): Concept[] {
        return this.concepts.filter(v => v.type === type);
    }

    getMeshConcepts(): MeshConcept[] {
        return <MeshConcept[]> this.concepts.filter(view => view.type === CanvasItemType.MeshConcept);
    }

    getPathConcepts(): PathConcept[] {
        return <PathConcept[]> this.concepts.filter(view => view.type === CanvasItemType.PathConcept);
    }

    getIntersectingItemsInRect(rectangle: Rectangle): Concept[] {
        const x = rectangle.topLeft.x;
        const y = rectangle.topLeft.y;
        const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
        const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

        const polygon = Polygon.createRectangle(x, y, width, height);

        return this.concepts.filter(item => polygon.contains(item.dimensions));
    }

    getIntersectingItemsAtPoint(point: Point): Concept[] {
        const gridPoint = new Point(point.x, point.y);

        return this.concepts.filter(item => item.dimensions.containsPoint(gridPoint));
    }

    generateUniqueName(viewType: CanvasItemType) {
        return this.naming.generateName(viewType);
    }
}

export class Naming {
    private canvasStore: CanvasStore;

    constructor(canvasStore: CanvasStore) {
        this.canvasStore = canvasStore;
    }

    generateName(type: CanvasItemType) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: CanvasItemType): number {
        const pattern = this.createPattern(type);
        const views = this.canvasStore.getConceptsByType(type).filter(view => view.name.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<Concept>(views, (a, b) => parseInt(a.name.match(pattern)[1], 10) - parseInt(b.name.match(pattern)[1], 10));
            return parseInt(max.name.match(pattern)[1], 10);
        }

    }

    private createPattern(type: CanvasItemType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}