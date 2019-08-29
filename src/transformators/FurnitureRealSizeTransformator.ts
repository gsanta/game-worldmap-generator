import { WorldItemUtils } from "../WorldItemUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { Polygon, Segment, Distance, Line, Point, Angle, Transform } from '@nightshifts.inc/geometry';


export class FurnitureRealSizeTransformator {
    private realSizes: {[name: string]: Polygon};

    constructor(realFurnitureSizes: {[name: string]: Polygon}) {
        this.realSizes = realFurnitureSizes;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemUtils.filterRooms(worldItems);

        rooms.forEach(room => this.transformFurnituresInRoom(room));

        return worldItems;
    }

    private transformFurnituresInRoom(room: WorldItemInfo) {
        room.children
        // TODO: find better solution to handle empty
        .filter(furniture => furniture.name !== 'empty')
        .forEach(furniture => {

            let realSize = <Polygon> (this.realSizes[furniture.name] || furniture.dimensions);
            const centerPoint = furniture.dimensions.getBoundingCenter();

            const snappingWallSegment = this.getSnappingWallSegmentIfExists(room, furniture);

            if (snappingWallSegment) {
                const angle = this.getRotationAngle(snappingWallSegment, realSize);
                realSize = this.rotate(realSize, angle);
                furniture.rotation = angle.getAngle();
                furniture.dimensions = realSize.setPosition(centerPoint);
                this.snapToWallWallSegment(furniture, snappingWallSegment);
            } else {
                furniture.dimensions = realSize.clone().setPosition(centerPoint);
            }
        });
    }

    private getSnappingWallSegmentIfExists(room: WorldItemInfo, furniture: WorldItemInfo): Segment {
        const roomSegments = <Segment[]> room.borderItems.map(item => item.dimensions);
        const furnitureSegments = furniture.dimensions.getEdges();

        let minDistance = Number.MAX_VALUE;
        let closestWallSegment: Segment = null;

        for (let j = 0; j < furnitureSegments.length; j++) {
            const center = furnitureSegments[j].getBoundingCenter();
            for (let i = 0; i < roomSegments.length; i++) {
                const dist = new Distance().pointToSegment(center, roomSegments[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestWallSegment = roomSegments[i];
                }
            }
        }

        return minDistance <= 0.5 ? closestWallSegment : null;
    }

    private snapToWallWallSegment(furniture: WorldItemInfo, wallSegment: Segment) {
        let closestFurnitureSegment: Segment = null;
        const furnitureSegments = furniture.dimensions.getEdges();
        let minDistance = Number.MAX_VALUE;

        for (let j = 0; j < furnitureSegments.length; j++) {
            const center = furnitureSegments[j].getBoundingCenter();
            const dist = new Distance().pointToSegment(center, wallSegment);
            if (dist < minDistance) {
                minDistance = dist;
                closestFurnitureSegment = furnitureSegments[j];
            }
        }

        const fromPoint = closestFurnitureSegment.getPoints()[0];
        const slope = wallSegment.getPerpendicularBisector().slope;
        const line = Line.fromPointSlopeForm(fromPoint, slope);

        const toPoint = wallSegment.getLine().intersection(line);

        const vector = toPoint.subtract(fromPoint);

        furniture.dimensions = furniture.dimensions.translate(vector);
    }

    private getRotationAngle(snappingWallSegment: Segment, realPolygon: Polygon): Angle {
        const xAxis = new Segment(new Point(0, 0), new Point(10, 0)).getLine();
        const snappingWallLine = snappingWallSegment.getLine();
        const o = xAxis.intersection(snappingWallLine);

        if (o !== undefined) {
            const a = snappingWallSegment.getPoints()[0];
            const b = new Point(o.x + 10, 0);

            return Angle.fromThreePoints(o, a, b);

        }

        return Angle.fromThreePoints(new Point(0, 0), new Point(0, 0), new Point(0, 0));

    }

    private rotate(polygon: Polygon, angle: Angle): Polygon {
        const transform = new Transform();

        return transform.rotatePolygon(polygon, angle.getAngle());
    }
}

