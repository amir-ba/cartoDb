
import { CartoMapApiResponse } from './models/map-api-response';
import { LayerTypes } from './models/LayerTypes';
import { LayerOptions } from './models/config-interface';
import { CartoLayer } from './CartoLayer';
export type MapObjTyp = {};
export type MapLayerTyp = {};

export abstract class CustomMap<IMapObjType extends MapObjTyp,ILayerObjTpe extends MapLayerTyp>{
  configResolverUrl =  'http://documentation.cartodb.com/api/v1/map';
  baseUrlPrefix = 'http://gusc.cartocdn.com';
  baseUrlSuffix = '/api/v1/map';
  protected layerMap: Map<CartoLayer,ILayerObjTpe> = new Map();
  abstract createMap(): IMapObjType;
  abstract createTileLayer(account: string, tileConfig: CartoMapApiResponse,
    cartoLayer: CartoLayer): ILayerObjTpe;
  abstract createCartoDbLayer(account: string, cartoLayer: CartoLayer): ILayerObjTpe;
  abstract addLayerToMap(layers: Array<ILayerObjTpe>): void;
  abstract updateMapLayer(oldCartoLayer: CartoLayer, newCartoLayer: CartoLayer, account: string): void;
  abstract changeVisibility(cartoLayer: CartoLayer, isVisible: boolean): void;
  async getTileConfig(account: string, cartoLayer: CartoLayer ) {
      const amendedConfigs: CartoLayer = { ...cartoLayer, type: LayerTypes.HTTP } as CartoLayer;
      const fetchResponse = await fetch(this.configResolverUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({layers:[amendedConfigs]})});
      const tileConfig: CartoMapApiResponse = await fetchResponse.json();

      return this.createTileLayer(account,tileConfig, amendedConfigs);
  }
  async createMapLayer(account: string,cartoLayer: CartoLayer): Promise<ILayerObjTpe> {
    let layer: ILayerObjTpe;
    switch (cartoLayer.type) {
      case LayerTypes.CARTODB:
        layer = this.createCartoDbLayer(account,cartoLayer);
        break;
      default:
        layer = await this.getTileConfig(account,cartoLayer);
      break
    }
    cartoLayer.changeSubjectObs$.subscribe((options: LayerOptions)=> {
      this.updateMapLayer(cartoLayer,{...cartoLayer, options } as CartoLayer, account)
    })
    this.layerMap.set(cartoLayer,layer);

    return layer;
  }
}

