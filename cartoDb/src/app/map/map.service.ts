import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View, { ViewOptions } from 'ol/View';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartoDbConfig, Layer } from '../models/config-interface';
import { CartoMapApiResponse } from '../models/map-api-response-interface';
import { tap } from 'rxjs/operators';
import {CartoDB} from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { LayerTypes } from '../enums/LayerTypes';
import XYZ from 'ol/source/XYZ';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  private initialState = {center: [0, 0], zoom: 2};
  mapViewOptions$: BehaviorSubject<ViewOptions> = new BehaviorSubject(this.initialState);
  mapViewOptionsObs$: Observable<ViewOptions>;
  private olMap: Map;
  constructor(private http: HttpClient) {
     this.mapViewOptionsObs$ = this.mapViewOptions$.asObservable();
  }
  getConfig(configPath: string): Observable<CartoDbConfig> {
    return this.http.get<CartoDbConfig>(configPath);
  }
  createMap(target: string, center?: Array<number>, zoom?: number): void {
    if (center || zoom) {
      const options = {center, zoom};
      this.setMapViewOptions(options);
    }
    const viewOptions = this.mapViewOptions$.value;
    this.olMap = new Map({
      target,
      view: new View(viewOptions)
    });
  }
  /**
   * sets ol view options subject value
   * @param viewOptions openlayers view options
   */
  setMapViewOptions(viewOptions: ViewOptions): void{
    this.mapViewOptions$.next(viewOptions);
  }
  addLayers(account: string, layers: Array<Layer>): void {
    const cartoLayers = layers.filter(layer => layer.type === LayerTypes.CARTODB);
    const tiledLayers = layers.filter(layer => layer.type === LayerTypes.TILED);
    this.addTiledLayers(account, tiledLayers);
    this.addCartoDbLayer(account, cartoLayers);
  }
  addCartoDbLayer(account: string, cartoLayers: Array<Layer>): void {
    const source =  new CartoDB({
      account,
      config: { layers: cartoLayers }
    });
    const cartoTileLayer = new TileLayer({
      source,
      zIndex: this.olMap.getLayers.length + 1
    });
    this.olMap.addLayer(cartoTileLayer);
  }
  addTiledLayers(account: string, layerConfigs: Array<Layer>): void{
    const configResolver = 'http://documentation.cartodb.com/api/v1/map';
    const baseUrl = `http://gusc.cartocdn.com/${account}/api/v1/map/`;
    const amendedConfigs = layerConfigs.map(lyr => ({...lyr, type: 'http'}));
    this.http.post<CartoMapApiResponse>(configResolver, { layers: amendedConfigs})
    .pipe(
      tap((config: CartoMapApiResponse) => {
      const { layergroupid, metadata } = config;
      const { layers } = metadata;
      layers.map((layer, indx) => {
        const source = new XYZ({
          minZoom: parseInt(layerConfigs[indx].options.minZoom, 10),
          maxZoom: parseInt(layerConfigs[indx].options.maxZoom, 10),
          attributions: layerConfigs[indx].options.attribution,
          url: `${baseUrl}${layergroupid}/${indx}/{z}/{x}/{y}.png`
        });
        const tileLayer = new TileLayer({ source });
        this.olMap.addLayer(tileLayer);
      });
      })
    ).subscribe();
  }
}
