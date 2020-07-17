import { CartoLayer } from "./models/config-interface";
import { MapLayerTyp, CustomMap, MapObjTyp } from "./CustomMap";
import { CartoDbTileLayer } from "./CartoDbTileLayer";
import { CartoTileLayer } from "./CartoTileLayer";

import { LayerTypes } from "./models/LayerTypes";

export class CartoClient {
    public layers: Array<CartoLayer>= [];
    public mapLibrary = 'openlayers';
    public map: CustomMap<MapObjTyp,MapLayerTyp>| undefined;
    constructor(public userName: string, public apiKKey?: string) {}
    addLayers(layer: CartoLayer){
        let layerClass;
        switch(layer.type) {
            case LayerTypes.CARTODB:
                layerClass = new CartoDbTileLayer(layer);
                break;
            default:
                layerClass = new CartoTileLayer(layer)
                break;

        }
        this.layers.push(layerClass);
    }
    getMappableLayers() : Promise<Array<MapLayerTyp>> {
        if (!(this.map instanceof CustomMap)) {
            throw new Error('no map object');
        }
        return Promise.all(this.layers.map((layer: CartoLayer) =>{
            //@ts-ignore
            const mappableLayer = this.map.createMapLayer(this.userName, layer);
            return mappableLayer;
        }));
    }

}