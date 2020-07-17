import { LayerTypes } from "./models/LayerTypes";
import { LayerOptions } from "./models/config-interface";
import { Subject, Observable } from "rxjs";

export abstract class CartoLayer {
    abstract type: LayerTypes;
    abstract options: LayerOptions;
    private changeSubject$: Subject<LayerOptions> = new Subject();
    public changeSubjectObs$: Observable<LayerOptions>;
    constructor(){
      this.changeSubjectObs$ = this.changeSubject$.asObservable();
    }
    triggerChange(newOption: LayerOptions){
      this.changeSubject$.next(newOption);
    }
  }