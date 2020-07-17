import { LayerTypes } from "./models/LayerTypes";
import { LayerOptions } from "./models/config-interface";
import { Subject, Observable } from "rxjs";

export abstract class CartoLayer {
    abstract type: LayerTypes;
    abstract options: LayerOptions;
    private changeSubject$: Subject<LayerOptions> = new Subject();
    public changeSubjectObs$: Observable<LayerOptions>;
    public isVisible = true;
    constructor(){
      this.changeSubjectObs$ = this.changeSubject$.asObservable();

    }
    triggerChange(newOption: LayerOptions){
      this.changeSubject$.next(newOption);
    }
    setVisibility(value: boolean) {
      this.isVisible = value;
      this.options.isVisible = value;
      this.triggerChange(this.options);
    }
  }