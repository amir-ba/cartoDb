import { LayerTypes } from "./models/LayerTypes";
import { LayerOptions } from "./models/config-interface";
import { CustomMap, MapLayerTyp, MapObjTyp } from "./CustomMap";
import { MapFactory } from "./CartoClient";

export interface ICartoLayer {
   type: LayerTypes;
   options: LayerOptions;
   isVisible: boolean;
   account: string;
}
export abstract class CartoLayer implements ICartoLayer{
    abstract type: LayerTypes;
    abstract options: LayerOptions;
    public isVisible = true;
    abstract account: string;
    private observers: MapFactory[] = [];
    attach(mapObj: MapFactory){
      this.observers.push(mapObj);
    }
    triggerChange(){
      this.observers.map(obs => obs.update(this));
    }
    setVisibility(value: boolean) {
      this.isVisible = value;
      this.options.isVisible = value;
      this.triggerChange();
    }
  }