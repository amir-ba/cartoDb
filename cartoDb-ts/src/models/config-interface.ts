import { CartoLayer } from '../CartoLayer';


export interface TileLayerOptions {
  minZoom?: string;
  maxZoom?: string;
  attribution?: string;
  urlTemplate?: string;
}
export class LayerOptions {
  minZoom?: string;
  maxZoom?: string;
  attribution?: string;
  urlTemplate?: string;
  cartocss_version?: string;
  cartocss?: string;
  sql?: string;
  isVisible?: boolean;
}
export interface CartoTileLayerOptions {
  cartocss_version?: string;
  cartocss?: string;
  sql?: string;
}

export interface CartoDbConfig {
  center: [number, number];
  zoom: number;
  maps_api_config: {user_name: string; maps_api_template: string; };
  layers: Array<CartoLayer>;
}
