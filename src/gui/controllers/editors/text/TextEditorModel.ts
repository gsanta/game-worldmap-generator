import { IEditorModel } from "../IEditorModel";
import { WorldItemDefinition } from "../../../../WorldItemDefinition";
import { FileFormat } from "../../../../WorldGenerator";
import { WorldItemDefinitionModel } from "../../world_items/WorldItemDefinitionModel";

export class TextEditorModel implements IEditorModel {
    private editorContent: string;

    setEditorContent(editorContent: string): void {
        this.editorContent = editorContent;
    }

    getFileFormat(): FileFormat {
        return FileFormat.TEXT;
    }

    getFile(worldItemDefinitionModel: WorldItemDefinitionModel): string {
        return this.createFile(worldItemDefinitionModel);
    }

    private createFile(worldItemDefinitionModel: WorldItemDefinitionModel) {
        const definitions = this.createDefinitionSection(worldItemDefinitionModel);
    
            return `
map \`

${this.editorContent.trim()}

\`

definitions \`

${definitions}

\`
`;
    }

    private createDefinitionSection(worldItemDefinitionModel: WorldItemDefinitionModel) {
        const lines = worldItemDefinitionModel.types.map(descriptor => this.createDefinitionLine(descriptor));

        return lines.join('\n');
    }

    private createDefinitionLine(meshDescriptor: WorldItemDefinition): string {
        let line = `${meshDescriptor.char} = ${meshDescriptor.typeName}`;

        if (meshDescriptor.isBorder) {
            line += ' BORDER';
        }

        if (meshDescriptor.model) {
            line += ` MOD ${meshDescriptor.model}`;
        }

        if (meshDescriptor.materials && meshDescriptor.materials.length > 0) {
            let materialPaths = '';

            meshDescriptor.materials.forEach(mat => materialPaths += ` ${mat}`);
            
            line += ` MAT [${materialPaths}]`;
        }

        if (meshDescriptor.scale) {
            line += ` SCALE ${meshDescriptor.scale}`
        }

        if (meshDescriptor.translateY) {
            line += ` TRANS_Y ${meshDescriptor.translateY}`
        }

        return line;
    }
}