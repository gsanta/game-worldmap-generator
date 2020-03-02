import { Engine, Scene, Mesh } from 'babylonjs';
import { AbstractModelLoader } from '../../common/services/AbstractModelLoader';
import { CanvasWindow } from './CanvasWindow';
import { Point } from '../../../misc/geometry/shapes/Point';
import { ServiceLocator } from '../../ServiceLocator';
import { UpdateTask } from '../../common/services/UpdateServices';
import { MeshView } from './models/views/MeshView';

export class Model3DController extends AbstractModelLoader {
    private engine: Engine;
    private canvasController: CanvasWindow;

    private canvas: HTMLCanvasElement;

    private fileNameToMeshMap: Map<string, Mesh> = new Map();

    constructor(canvasController: CanvasWindow, services: ServiceLocator) {
        super(null, services);
        this.canvasController = canvasController;
        this.canvas = <HTMLCanvasElement> document.getElementById("model-size-tester");
        this.init();
    }

    set3dModelForCanvasItem(gameObject: MeshView) {
        if (this.fileNameToMeshMap.has(gameObject.modelPath)) {
            this.setDimensions(gameObject);
        }
       
        this.load(gameObject).then(mesh => {
            this.setDimensions(gameObject);
        });
    }

    createInstance(fileName: string): string {
        throw new Error('Not implemented.');
    }

    setModel(fileName: string, mesh: Mesh): void {
        this.fileNameToMeshMap.set(fileName, mesh);
    }

    private setDimensions(meshView: MeshView) {
        const mesh = this.fileNameToMeshMap.get(meshView.modelPath);
        const dimensions = this.getDimension(mesh).mul(10);
        dimensions.x  = dimensions.x < 50 ? 50 : dimensions.x;
        dimensions.y  = dimensions.y < 50 ? 50 : dimensions.y;
        meshView.dimensions = meshView.dimensions.setWidth(dimensions.x).setHeight(dimensions.y);
        meshView.animations = this.getAnimations(meshView, mesh);

        this.canvasController.updateService.runImmediately(UpdateTask.RepaintCanvas);
    }

    private getDimension(mesh: Mesh): Point {
        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        return new Point(width, height);
    }

    private getAnimations(meshView: MeshView, mesh: Mesh) {
        return mesh.skeleton ? mesh.skeleton.getAnimationRanges().map(range => range.name) : [];
    }

    private init() {
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
    }
}