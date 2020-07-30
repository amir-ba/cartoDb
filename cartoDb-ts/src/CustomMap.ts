
import { CartoMapApiResponse } from './models/map-api-response';
import { LayerTypes } from './models/LayerTypes';
import { CartoLayer } from './CartoLayer';

export type MapObjTyp = {};
export type MapLayerTyp = {};


export interface MapFactory {
  createMap(): MapObjTyp;
  mapInstance: MapObjTyp;
  createMapLayer(cartoLayer: CartoLayer): Promise<MapLayerTyp> ;
  update(layerSubject: CartoLayer): void;
  addLayersToMap(layers: Array<MapLayerTyp>): void;
  getMapLayers(): Array<MapLayerTyp>;
  getCartoLayers(): Array<CartoLayer>
}

export abstract class CustomMap<IMapObjType extends MapObjTyp,ILayerObjTpe extends MapLayerTyp> implements MapFactory{
  configResolverUrl =  'http://documentation.cartodb.com/api/v1/map';
  baseUrlPrefix = 'http://gusc.cartocdn.com';
  baseUrlSuffix = '/api/v1/map';
  protected layerMap: Map<CartoLayer,ILayerObjTpe> = new Map();
  abstract mapInstance: MapObjTyp;
  abstract createMap(): IMapObjType;
  abstract createTileLayer(tileConfig: CartoMapApiResponse,
    cartoLayer: CartoLayer): ILayerObjTpe;
  abstract addLayersToMap(layers: Array<ILayerObjTpe>): void;
  abstract updateMapLayer(cartoLayer: CartoLayer): void;
  abstract changeVisibility(cartoLayer: CartoLayer, isVisible: boolean): void;
  async getTileConfig(cartoLayer: CartoLayer ) {
      const amendedConfigs: CartoLayer = { 
        isVisible: cartoLayer.isVisible, 
        options: cartoLayer.options, 
        type: cartoLayer.type === LayerTypes.CARTODB ? LayerTypes.CARTODB : LayerTypes.HTTP,
        account: cartoLayer.account
        } as CartoLayer;
      const fetchResponse = await fetch(this.configResolverUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({layers:[amendedConfigs]})});
      const tileConfig: CartoMapApiResponse = await fetchResponse.json();

      return this.createTileLayer(tileConfig,amendedConfigs);
  }
  async createMapLayer(cartoLayer: CartoLayer): Promise<ILayerObjTpe> {
    let layer: ILayerObjTpe;
    layer = await this.getTileConfig(cartoLayer);
    this.layerMap.set(cartoLayer,layer);

    return layer;
  }
  update(layerSubject: CartoLayer): void {
    this.updateMapLayer(layerSubject);
  }
  getMapLayers(): Array<ILayerObjTpe>{
    return [...this.layerMap.entries()].map(([_key, value]) => value);
  }
  getCartoLayers(): Array<CartoLayer>{
    return [...this.layerMap.entries()].map(([key, _value]) => key);
  }
}

