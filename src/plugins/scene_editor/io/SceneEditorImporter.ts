import { MeshView, MeshViewJson } from '../../../core/models/views/MeshView';
import { PathView, PathViewJson } from '../../../core/models/views/PathView';
import { ViewType, View } from "../../../core/models/views/View";
import { AppJson } from '../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { AssetModel, AssetType } from '../../../core/models/game_objects/AssetModel';

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

        const meshJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.MeshView);

        const promises = meshJsons.views.map((viewJson: MeshViewJson) => {
            const meshView: MeshView = new MeshView();
            meshView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(meshView);
            this.initAssets(meshView);

            return meshView;
        })
        .filter((meshView: MeshView) => meshView.thumbnailId)
        .map((meshView: MeshView) => this.registry.services.localStore.loadAsset(this.registry.stores.assetStore.getAssetById(meshView.thumbnailId)));

        Promise.all(promises)
            .catch(e => console.error(e))
            .finally(() => this.plugin.reRender());

        const pathJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.PathView);

        pathJsons.views.forEach((viewJson: PathViewJson) => {
            const pathView: PathView = new PathView();
            pathView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(pathView);
        });
    }

    private initAssets(meshView: MeshView) {
        if (meshView.modelId) {
            const assetModel = new AssetModel({assetType: AssetType.Model});
            assetModel.setId(meshView.modelId);
            this.registry.stores.assetStore.addAsset(assetModel);
        }
        
        if (meshView.textureId) {
            const assetModel = new AssetModel({assetType: AssetType.Texture});
            assetModel.setId(meshView.textureId);
            this.registry.stores.assetStore.addAsset(assetModel);
        }

        if (meshView.thumbnailId) {
            const assetModel = new AssetModel({assetType: AssetType.Thumbnail});
            assetModel.setId(meshView.thumbnailId);
            this.registry.stores.assetStore.addAsset(assetModel);
        }    
    }
}