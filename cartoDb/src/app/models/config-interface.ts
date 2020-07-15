import { LayerTypes } from '../enums/LayerTypes';


export interface LayerOptions {
  minZoom?: string;
  maxZoom?: string;
  attribution?: string;
  urlTemplate?: string;
  sql?: string;
}
export interface Layer {
  type: LayerTypes;
  options?: LayerOptions;
}
export interface CartoDbConfig {
  center: [number, number];
  zoom: number;
  maps_api_config: {user_name: string; maps_api_template: string; };
  layers: Array<Layer>;
}
