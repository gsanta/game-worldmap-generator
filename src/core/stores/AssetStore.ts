

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export interface AssetJson {
    id: string;
    assetType: string;
    path: string;
    data: string;
}

export class AssetModel {
    private id: string;
    assetType: AssetType;
    path: string;
    data: string;

    constructor(config?: {path: string, data?: string, assetType: AssetType}) {
        this.path = config.path;
        this.data = config.data;
        this.assetType = config.assetType;
    }

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    toJson(): AssetJson {
        return {
            id: this.id,
            assetType: this.assetType,
            path: this.path,
            data: this.data
        };
    }

    fromJson(json: AssetJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        this.path = json.path;
        this.data = json.data;
    }
}

export class AssetStore {
    private maxIdForPrefix: Map<string, number> = new Map();
    private assetsById: Map<string, AssetModel> = new Map();

    constructor() {
        this.maxIdForPrefix = new Map([
            ['model', 0],
            ['texture', 0],
            ['thumbnail', 0],
        ]);
    }

    addModel(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('model'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addThumbnail(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('thumbnail'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addTexture(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('texture'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    getAssetById(id: string) {
        return this.assetsById.get(id);
    }

    getAssets(): AssetModel[] {
        return Array.from(this.assetsById.values());
    }

    private generateId(assetPrefix: string) {
        const idIndex = this.maxIdForPrefix.get(assetPrefix);
        this.maxIdForPrefix.set(assetPrefix, idIndex + 1);
        return `${assetPrefix}-${idIndex + 1}`.toLocaleLowerCase();
    }
}