import { CanvasController } from "../../CanvasController";
import React = require("react");
import { sort, minBy } from "../../../../../../misc/geometry/utils/Functions";
import { Rectangle } from "../../../../../../misc/geometry/shapes/Rectangle";
import { CanvasItemTag } from "../../models/CanvasItem";
import { ToolType } from "../Tool";
import { IViewExporter } from "../IToolExporter";
import { MeshView } from "../../../../../../common/views/MeshView";
import { EditorFacade } from "../../../../EditorFacade";
import { ViewType } from "../../../../../../common/views/View";

export class RectangleExporter implements IViewExporter {
    type = ViewType.GameObject;
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        this.controller = controller;
    }

    export(): JSX.Element {
        const rectangles = this.renderRectangles();
        return rectangles.length > 0 ? <g data-view-type={ViewType.GameObject}>{rectangles}</g> : null;
    }

    private renderRectangles(): JSX.Element[] {
        const canvasStore = this.controller.viewStore;
        let items = [...this.controller.viewStore.getGameObjects()];
        items = sort(items, (a, b) => canvasStore.getLayer(a) - canvasStore.getLayer(b));
        return items.map((item, i) => {
            const rectangle = item.dimensions as Rectangle;

            const x = rectangle.topLeft.x;
            const y = rectangle.topLeft.y;
            const width = (rectangle.bottomRight.x - rectangle.topLeft.x);
            const height = (rectangle.bottomRight.y - rectangle.topLeft.y);

            const fill = canvasStore.getTags(item).has(CanvasItemTag.SELECTED) ? 'blue' : item.color;

            const minX = minBy<MeshView>(canvasStore.getGameObjects(), (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
            const minY = minBy<MeshView>(canvasStore.getGameObjects(), (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;
            

            const tranlateX = minX < 0 ? - minX : 0;
            const tranlateY = minY < 0 ? - minY : 0;

            let thumbnail: JSX.Element = null;
            
            if (item.thumbnailPath) {
                thumbnail =  (
                    <image xlinkHref={item.thumbnailPath} x="0" y="0" height={`${width}px`} width={`${height}px`}/>
                )
            }

            return (
                <g 
                    transform={`translate(${x} ${y})`}
                    onMouseOver={() => this.controller.mouseController.hover(item)}
                    onMouseOut={() => this.controller.mouseController.unhover()}
                    data-wg-x={x + tranlateX}
                    data-wg-y={y + tranlateY}
                    data-wg-width={width}
                    data-wg-height={height}
                    data-wg-type={item.type}
                    data-wg-color={item.color}
                    data-wg-layer={canvasStore.getLayer(item)}
                    data-rotation={item.rotation}
                    data-wg-scale={item.scale}
                    data-wg-name={item.name}
                    data-model={item.modelPath}
                    data-texture={item.texturePath}
                    data-thumbnail={item.thumbnailPath}
                    data-path={item.path}
                    data-is-manual-control={item.isManualControl ? 'true' : 'false'}
                >
                    <rect
                        key={i}
                        x={`0`}
                        y={`0`}
                        width={`${width}px`}
                        height={`${height}px`}
                        fill={fill}
                        stroke='black'
                    />
                    {thumbnail}
                </g>
            )
        });
    }
}