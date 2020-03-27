import { Point } from "../../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";
import { ICamera } from '../../renderer/ICamera';

export class Camera implements ICamera {
    readonly screenSize: Point;
    private viewBox: Rectangle;

    constructor(canvasSize: Point) {
        this.screenSize = canvasSize;
        this.viewBox = new Rectangle(new Point(0, 0), new Point(canvasSize.x, canvasSize.y));
    }

    zoom(scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = this.viewBox.topLeft;
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    setTopLeftCorner(canvasPoint: Point, scale: number) {
        console.log('set top left corner')
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = new Point(canvasPoint.x, canvasPoint.y);
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    moveBy(amount: Point) {
        this.setViewBox(this.viewBox.clone().translate(new Point(amount.x, amount.y)));
    }

    moveTo(translate: Point): void {
        this.setViewBox(this.viewBox.clone().moveTo(new Point(translate.x, translate.y)));
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        const scale = this.getScale();

        return screenPoint.clone().div(scale).add(this.viewBox.topLeft);
    }

    canvasToScreenPoint(canvasPoint: Point): Point {
        const scale = this.getScale();

        return canvasPoint.clone().subtract(this.viewBox.topLeft).mul(scale);
    }

    getScale(): number {
        return this.screenSize.x / this.viewBox.getWidth();
    }

    getViewBox(): Rectangle {
        return this.viewBox;
    }

    getViewBoxAsString(): string {
        return `${this.viewBox.topLeft.x} ${this.viewBox.topLeft.y} ${this.viewBox.getWidth()} ${this.viewBox.getHeight()}`;
    }

    setViewBox(newViewBox: Rectangle): void {
        this.viewBox = newViewBox;
    }

    private getAspectRatio(): number {
        return this.viewBox.getWidth() / this.viewBox.getHeight();
    }
}

export const nullCamera = new Camera(new Point(100, 100));
