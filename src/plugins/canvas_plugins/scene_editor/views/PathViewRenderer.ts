import { ViewRenderer } from "../../../../core/models/views/View";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { PathView } from "./PathView";

export class PathViewRenderer implements ViewRenderer {
    renderInto(canvas: UI_SvgCanvas, pathView: PathView) {
        const group = canvas.group(pathView.id);
        group.isInteractive = false;

        if (pathView.containedViews.length > 1) {
            const highlightPath = group.path();
            highlightPath.d = pathView.serializePath();
            highlightPath.data = pathView;

            highlightPath.css = {
                fill: 'none',
                stroke: 'blue',
                strokeOpacity: pathView.isHovered() || pathView.isSelected() ? 0.5 : 0,
                strokeWidth: "4"
            }

            const path = group.path();
            path.d = pathView.serializePath();

            path.css = {
                fill: 'none',
                stroke: 'black',
                strokeWidth: "2",
                pointerEvents: 'none'
            }
        }

        pathView.containedViews.forEach(editPoint => {
            const circle = group.circle();

            circle.cx = editPoint.point.x;
            circle.cy = editPoint.point.y;
            circle.r = pathView.radius;
            circle.data = editPoint;

            circle.css = {
                fill: pathView.getActiveContainedView() === editPoint ? 'orange' : (pathView.isHovered() || pathView.isSelected()) ? 'blue' : 'black'
            }
        });
    }
}