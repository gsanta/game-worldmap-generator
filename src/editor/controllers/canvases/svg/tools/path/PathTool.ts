import { Point } from "../../../../../../model/geometry/shapes/Point";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { SvgCanvasController } from "../../SvgCanvasController";
import { View, ViewType } from "../../../../../../model/View";
import { Rectangle } from "../../../../../../model/geometry/shapes/Rectangle";
import { minBy, maxBy } from "../../../../../../model/geometry/utils/Functions";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
export class PathView implements View {
    viewType = ViewType.Path;
    points: Point[] = [];
    pathId: number;
    dimensions: Rectangle;
    name: string;

    constructor(startPoint?: Point) {
        startPoint && this.points.push(startPoint);

        this.dimensions = this.calcBoundingBox();
    }

    getPoints(): Point[] {
        return this.points;
    }

    addPoint(point: Point) {
        this.points.push(point);
        this.dimensions = this.calcBoundingBox();
    }

    private calcBoundingBox() {
        if (this.points.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const maxX = maxBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const minY = minBy<Point>(this.points, (a, b) => a.y - b.y).y;
        const maxY = maxBy<Point>(this.points, (a, b) => a.y - b.y).y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }
}

export class PathTool extends AbstractTool {

    pendingPathes: PathView;
    
    private canvasController: SvgCanvasController;
    constructor(canvasController: SvgCanvasController) {
        super(ToolType.PATH);

        this.canvasController = canvasController;
    }

    down() {
        super.down();

        const pointer = this.canvasController.mouseController.pointer;

        if (!this.pendingPathes) {
            this.pendingPathes = new PathView(pointer.down.clone());
            this.canvasController.canvasStore.addPath(this.pendingPathes);
        } else {
            this.pendingPathes.points.push(pointer.down.clone());
        }

        this.canvasController.renderCanvas();
    }
}