import { LayerOptions } from "./models/config-interface";
import { LayerTypes } from "./models/LayerTypes";
import { CartoLayer, ICartoLayer } from "./CartoLayer";

export class CartoTileLayer extends CartoLayer {
    public minZoom?: string;
    public maxZoom?: string;
    public attribution?: string;
    public urlTemplate?: string;
    public type: LayerTypes;
    public options: LayerOptions;
    public account: string
    constructor(public layer: ICartoLayer){
        super();
        const { type, options, account } = layer;
        const { maxZoom, minZoom, attribution, urlTemplate } = options;
        this.options = options;
        this.type = type;
        this.maxZoom = maxZoom;;
        this.minZoom = minZoom;
        this.attribution = attribution;
        this.urlTemplate = urlTemplate;
        this.account = account;
    }
}