import * as React from 'react';
import { ArrowIconComponent } from '../../../gui/icons/tools/ArrowIconComponent';
import { DeleteIconComponent } from '../../../gui/icons/tools/DeleteIconComponent';
import { DrawIconComponent } from '../../../gui/icons/tools/DrawIconComponent';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { RedoIconComponent } from '../../../gui/icons/tools/RedoIconComponent';
import { SelectIconComponent } from '../../../gui/icons/tools/SelectIconComponent';
import { UndoIconComponent } from '../../../gui/icons/tools/UndoIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { ToolType } from '../../../../core/tools/Tool';
import { UpdateTask } from '../../../../core/services/UpdateServices';
import { AbstractToolbarComponent, ToolbarComponentProps } from '../../AbstractToolbarComponent';
import { CanvasView } from '../CanvasView';
import { AbstractTool } from '../../../../core/tools/AbstractTool';

export class CanvasToolbarComponent extends AbstractToolbarComponent<CanvasView> {

    constructor(props: ToolbarComponentProps<CanvasView>) {
        super(CanvasView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        const historyService = this.context.registry.services.history;

        return (
            <React.Fragment>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(this.context.registry.services.tools.rectangle)} format="short"/>
                <ArrowIconComponent isActive={this.isToolActive(ToolType.PATH)} onClick={() => this.activateTool(this.context.registry.services.tools.path)} format="short"/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(this.context.registry.services.tools.select)} format="short"/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(this.context.registry.services.tools.delete)} format="short"/>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.Pan)} onClick={() => this.activateTool(this.context.registry.services.tools.pan)} format="short"/>
                <UndoIconComponent isActive={false} disabled={!historyService.hasUndoHistory()} onClick={() => this.undo()} format="short"/>
                <RedoIconComponent isActive={false} disabled={!historyService.hasRedoHistory()} onClick={() => this.redo()} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private undo() {
        this.context.registry.services.history.undo();
        this.context.registry.services.update.runImmediately(UpdateTask.All);
    }

    private redo() {
        this.context.registry.services.history.redo();
        this.context.registry.services.update.runImmediately(UpdateTask.All);
    }


    private isToolActive(toolType: ToolType) {
        return this.context.registry.services.view.getViewById(CanvasView.id).getSelectedTool().type === toolType;
    }

    private activateTool(tool: AbstractTool) {
        const view = this.context.registry.services.view.getViewById(CanvasView.id);
        view.setSelectedTool(tool);
        view.repainter();
    }

    private zoomIn() {
        this.context.registry.services.view.getHoveredView().getCamera().zoomIn();
    }

    private zoomOut() {
        this.context.registry.services.view.getHoveredView().getCamera().zoomOut();
    }
}