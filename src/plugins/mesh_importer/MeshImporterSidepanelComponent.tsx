import * as React from 'react';
import { AssetModel } from '../../core/models/game_objects/AssetModel';
import { MeshViewPropType } from '../scene_editor/settings/MeshSettings';
import { SettingsRowStyled, LabelColumnStyled, FieldColumnStyled } from '../scene_editor/settings/SettingsComponent';
import { ConnectedFileUploadComponent } from '../common/toolbar/icons/ImportFileIconComponent';
import { AccordionComponent } from '../../core/gui/misc/AccordionComponent';
import { MeshImporterSettings, ImportSettingsProps } from './settings/MeshImporterSettings';
import { MeshImporterPlugin } from './MeshImporterPlugin';
import { ButtonComponent } from '../../core/gui/inputs/ButtonComponent';
import { AssetLoaderSidepanelControllerProps, AssetLoaderSidepanelController } from './controllers/AssetLoaderSidepanelController';

export class MeshImporterSidepanelComponent extends React.Component<{plugin: MeshImporterPlugin}> {

    render() {
        const body = (
            <React.Fragment>
                {this.renderModelFileChooser()}
                {this.renderTextureFileChooser()}
                {this.changeThumbnailButton()}
            </React.Fragment>
        )

        return (
            <AccordionComponent
                key="material"
                level="primary"
                expanded={true}
                elements={[
                    {
                        title: 'Asset loader',
                        body
                    }
                ]}
            />
        );
    }

    private renderModelFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderSidepanelController>(AssetLoaderSidepanelController.settingsName);
        const assetModel: AssetModel = settings.getVal(AssetLoaderSidepanelControllerProps.Model);

        return (
            <SettingsRowStyled key="model-file">
                <LabelColumnStyled>Model</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={AssetLoaderSidepanelControllerProps.Model}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.getId()}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<AssetLoaderSidepanelController>(AssetLoaderSidepanelController.settingsName);
        const assetModel: AssetModel = settings.getVal(AssetLoaderSidepanelControllerProps.Texture);

        return (
            <SettingsRowStyled key="texture-file">
                <LabelColumnStyled>Texture</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedFileUploadComponent
                        formController={settings}
                        propertyName={AssetLoaderSidepanelControllerProps.Texture}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={assetModel && assetModel.getId()}
                        readDataAs="dataUrl"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private changeThumbnailButton(): JSX.Element {
        const settings = this.props.plugin.pluginSettings.byName<MeshImporterSettings>(MeshImporterSettings.settingsName);

        return (
            <SettingsRowStyled key="thumbnail-file">                   
                <LabelColumnStyled></LabelColumnStyled>
                <ButtonComponent text="Change thumbnail" type="info" onClick={() => settings.open()}/>
            </SettingsRowStyled>
        );
    }
}