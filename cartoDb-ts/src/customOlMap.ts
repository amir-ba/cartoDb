import  OlMap   from 'ol/Map';
import View, { ViewOptions } from 'ol/View';
import { CustomMap } from './CustomMap';
import TileLayer from 'ol/layer/Tile';
import Layer from 'ol/layer/Layer';
import {CartoDB} from 'ol/source';
import XYZ from 'ol/source/XYZ';
import { CartoMapApiResponse } from './models/map-api-response';
import { CartoLayer } from './CartoLayer';
export class CustomOlMap extends CustomMap<OlMap,Layer> {
    public mapInstance: OlMap;
    constructor(public mapElId: string, public mapViewOptions?: ViewOptions){
      super();
    this.mapInstance = this.createMap();
    }
    createMap(): OlMap {
       if (!this.mapViewOptions) {
        throw Error('No view options defined');
       }

        return new OlMap({
          target: this.mapElId,
          view: new View(this.mapViewOptions)
        });
    }
    setMapViewOptions(viewOptions: ViewOptions): void {
      this.mapViewOptions = viewOptions;
      const newView = new View(viewOptions);
      this.mapInstance?.setView(newView);
    }
    addLayerToMap(layers: Array<Layer>): void {
      layers.map(layer => this.mapInstance?.addLayer(layer));
    }
    createTileLayer(account: string, tileConfig: CartoMapApiResponse, cartoLayer: CartoLayer): TileLayer {
      const { layergroupid } = tileConfig;
      const { options, } = cartoLayer;

      const source = new XYZ({
        minZoom: options.minZoom ? parseInt(options.minZoom, 10): undefined,
        maxZoom: options.maxZoom ? parseInt(options.maxZoom, 10): undefined,
        attributions: options.attribution,
        url: `${this.baseUrlPrefix}/${account}/${this.baseUrlSuffix}/${layergroupid}/0/{z}/{x}/{y}.png`
      });

      return  new TileLayer({ source });

    }
    createCartoDbLayer(account: string, layer: CartoLayer): TileLayer{
      const {type, options } = layer;
      const source =  new CartoDB({
        account,
        config: { layers: [{options, type}] }
      });
      return new TileLayer({
        source
      });
    }
    async updateMapLayer(oldCartoLayer: CartoLayer, newCartoLayer: CartoLayer, account: string) {
      const old = this.layerMap.get(oldCartoLayer);
      if (old) {
        const newLayer = await this.createMapLayer(account,newCartoLayer);
        old?.setSource(newLayer.getSource());
        this.layerMap.set(newCartoLayer,old);
      }
    }
}