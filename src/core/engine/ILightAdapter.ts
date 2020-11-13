import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";
import { LightObj } from "../models/objs/LightObj";

export interface ILightAdapter {
    setPosition(lightObj: LightObj, pos: Point_3): void;
    setAngle(lightObj: LightObj, angleRad: number): void;
    getAngle(lightObj: LightObj): number;
    getPosition(lightObj: LightObj): Point_3;
    createInstance(lightObj: LightObj): void;
    updateInstance(lightObj: LightObj): void;
    deleteInstance(lightObj: LightObj): void;
}