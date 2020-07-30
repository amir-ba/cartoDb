import 'leaflet/dist/leaflet.css';
import { Map as LMap, MapOptions, Layer, TileLayer } from "leaflet"
import { CustomMap } from './CustomMap';
import { CartoMapApiResponse } from './models/map-api-response';
import { CartoLayer } from './CartoLayer';
export class CustomLeafletMap extends CustomMap<LMap,Layer> {
    public mapInstance: LMap;
    constructor(public mapElId: string, public mapViewOptions?: MapOptions){
      super();
    this.mapInstance = this.createMap();
    }
    createMap(): LMap {
       if (!this.mapViewOptions) {
        throw Error('No view options defined');
       }
       const {zoom, center } = this.mapViewOptions; 
        // return new LMap(this.mapElId,{ ...this.mapViewOptions });
        return new LMap(this.mapElId).setView(center || [51.505, -0.09], zoom || 0);

    }
    
    addLayersToMap(layers: Array<Layer>): void {
      // layers.map(layer => this.mapInstance?.addLayer(layer));
      layers.map(layer => layer.addTo(this.mapInstance));

    }
    createTileLayer(tileConfig: CartoMapApiResponse, cartoLayer: CartoLayer): TileLayer {
      const { layergroupid } = tileConfig;
      const { options, account } = cartoLayer;

      if (options.isVisible !== false) {
        return  new TileLayer(`${this.baseUrlPrefix}/${account}/${this.baseUrlSuffix}/${layergroupid}/0/{z}/{x}/{y}.png`, {
          minZoom: options.minZoom ? parseInt(options.minZoom, 10): undefined,
          maxZoom: options.maxZoom ? parseInt(options.maxZoom, 10): undefined,
          attribution: options.attribution
         });
      } else {
        return  new TileLayer(``, { });
      }
    }
  
    async updateMapLayer(cartoLayer: CartoLayer) {
      const old = this.layerMap.get(cartoLayer);
      if (old) {
        const newLayer = await this.createMapLayer(cartoLayer);
        this.mapInstance.removeLayer(old);
        newLayer.addTo(this.mapInstance);
        this.layerMap.set(cartoLayer, newLayer);
      }
    }
    changeVisibility(cartoLayer: CartoLayer, isVisible: boolean) {
      const mapLayer = this.layerMap.get(cartoLayer) as Layer;
      if (!isVisible) {
        this.mapInstance.removeLayer(mapLayer);
      } else {
        this.mapInstance.addLayer(mapLayer);
      }
    }
}