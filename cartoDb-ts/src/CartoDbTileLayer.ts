import { LayerOptions } from "./models/config-interface";
import { LayerTypes } from "./models/LayerTypes";
import { CartoLayer } from "./CartoLayer";
export class CartoDbTileLayer extends CartoLayer {
    public cartoCss?: string;
    public type: LayerTypes;
    public options: LayerOptions;
    public cartoCssVersion?: string;
    public sql: string| undefined;
    constructor(public layer: CartoLayer){
        super();
        const { type, options } = layer;
        const { sql, cartocss, cartocss_version } = options;
        this.options = options;
        this.type = type;
        this.sql = sql;;
        this.cartoCss = cartocss;
        this.cartoCssVersion = cartocss_version;
    }
    setQuery (newSql: string | undefined){
        this.options.sql = newSql;
        this.triggerChange(this.options);
        this.sql = newSql;
    }
    getQuery(){
        return this.sql;
    }
}