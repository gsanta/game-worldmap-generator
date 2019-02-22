
export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public addX(amount: number): Point {
        return new Point(this.x + amount, this.y);
    }

    public addY(amount: number): Point {
        return new Point(this.x, this.y + amount);
    }

    /*
     * Returns true if the line through this and the parameter is not
     * vertical and not horizontal
     */
    public isDiagonalTo(otherPoint: Point): boolean {
        return this.x !== otherPoint.x && this.y !== otherPoint.y;
    }
}