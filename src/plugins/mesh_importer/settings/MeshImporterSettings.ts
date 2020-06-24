import { AssetModel, AssetType } from '../../../core/models/game_objects/AssetModel';
import { MeshView } from '../../../core/models/views/MeshView';
import { ViewType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings } from "../../scene_editor/settings/AbstractSettings";
import { MeshImporterPlugin } from '../MeshImporterPlugin';
import { ThumbnailMaker } from '../services/ThumbnailMaker';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';

export enum ImportSettingsProps {
    CreateThumbnailFromModel = 'CreateThumbnailFromModel',
    Thumbnail = 'Thumbnail',
    Model = 'Model',
}

export class MeshImporterSettings extends AbstractSettings<ImportSettingsProps> {
    static settingsName = 'mesh-importer-settings';
    getName() { return MeshImporterSettings.settingsName; }

    private registry: Registry;
    private plugin: MeshImporterPlugin;
    private thumbnailMaker: ThumbnailMaker;
    meshView: MeshView;
    private thumbnailModel: AssetModel;
    private modelModel: AssetModel;

    constructor(plugin: MeshImporterPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
        this.thumbnailMaker = new ThumbnailMaker();
    }

    open() {
        this.meshView = this.registry.stores.selectionStore.getView() as MeshView;
        
        if (this.meshView.thumbnailId) {
            this.thumbnailModel = this.registry.stores.assetStore.getAssetById(this.meshView.thumbnailId);
        }
        
        if (this.meshView.modelId) {
            this.modelModel = this.registry.stores.assetStore.getAssetById(this.meshView.modelId);
        }

        this.registry.services.dialog.openDialog(MeshImporterSettings.settingsName);
    }

    close() {
        this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).clear();
        this.registry.services.history.createSnapshot();
        this.registry.services.dialog.close();
        this.registry.services.update.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: ImportSettingsProps) {
        const meshView = this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView) as MeshView;

        switch (prop) {
            case ImportSettingsProps.CreateThumbnailFromModel:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.thumbnailId);
            case ImportSettingsProps.Thumbnail:
                return this.meshView && this.registry.stores.assetStore.getAssetById(this.meshView.thumbnailId);;
            case ImportSettingsProps.Model:
                return this.modelModel;    
        }
    }

    protected async setProp(val: any, prop: ImportSettingsProps) {
        let assetModel: AssetModel;
        switch (prop) {
            case ImportSettingsProps.CreateThumbnailFromModel:
                assetModel = await this.thumbnailMaker.createThumbnail(this.meshView, this.plugin.pluginServices.engineService());                
                this.registry.stores.assetStore.addAsset(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.meshView.thumbnailId = assetModel.getId();

                this.update();
                break;
            case ImportSettingsProps.Thumbnail:
                assetModel = new AssetModel({data: val.data, path: val.path, assetType: AssetType.Thumbnail});
                this.registry.stores.assetStore.addAsset(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.meshView.thumbnailId = assetModel.getId();

                this.update();
                break;
        }
    }

    private update() {
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
    }
}