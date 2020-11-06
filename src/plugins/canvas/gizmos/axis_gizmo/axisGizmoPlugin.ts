import { corePlugins } from "../../../../core/plugin/corePlugins";
import { Plugins } from "../../../../core/plugin/Plugins";
import { AxisGizmoFactory } from "./AxisGizmoFactory";

export function register(plugins: Plugins) {
    plugins.canvas.registerGizmo(corePlugins.canvas.gizmos.AxisGizmo, AxisGizmoFactory);
}