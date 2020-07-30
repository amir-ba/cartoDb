import { CartoLayer, ICartoLayer } from "./CartoLayer";
import { MapLayerTyp, CustomMap, MapObjTyp, MapFactory } from "./CustomMap";
import { CartoDbTileLayer } from "./CartoDbTileLayer";
import { CartoTileLayer } from "./CartoTileLayer";

import { LayerTypes } from "./models/LayerTypes";


export class LayerFactory {
    public  static createLayer(layer: ICartoLayer): CartoLayer {
        let layerClass;
        switch(layer.type) {
            case LayerTypes.CARTODB:
                layerClass = new CartoDbTileLayer(layer);
                break;
            default:
                layerClass = new CartoTileLayer(layer)
                break;
        }
        return layerClass;
    }
} 


export class CartoClient {
    private _layers: Array<CartoLayer>= [];
    constructor(public userName: string, public map: MapFactory, public apiKKey?: string) {
    }
    async addLayer(layer: ICartoLayer): Promise<MapLayerTyp> {
        const layerClass = LayerFactory.createLayer(layer);
        layerClass.attach(this.map);
        return this.map?.createMapLayer(layerClass) as MapLayerTyp;
    }
    get layers(): Array<CartoLayer> {
        return this._layers
    }
}