import { Concept } from "./Concept";
import { EditPoint } from "../feedbacks/EditPoint";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../misc/geometry/shapes/Point";


export interface VisualConcept extends Concept {
    editPoints: EditPoint[];
    dimensions: Rectangle;
    move(delta: Point): void;
    deleteEditPoint(editPoint: EditPoint): void;
    moveEditPoint(editPoint: EditPoint, delta: Point): void;
}