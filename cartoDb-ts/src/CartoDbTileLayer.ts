import { LayerOptions } from "./models/config-interface";
import { LayerTypes } from "./models/LayerTypes";
import { CartoLayer, ICartoLayer } from "./CartoLayer";
export class CartoDbTileLayer extends CartoLayer {
    public cartoCss?: string;
    public type: LayerTypes;
    public options: LayerOptions;
    public cartoCssVersion?: string;
    public sql: string| undefined;
    public account: string;
    constructor(public layer: ICartoLayer){
        super();
        const { type, options, account } = layer;
        const { sql, cartocss, cartocss_version } = options;
        this.options = options;
        this.type = type;
        this.sql = sql;;
        this.cartoCss = cartocss;
        this.cartoCssVersion = cartocss_version;
        this.account = account;
    }
    setQuery (newSql: string | undefined){
        this.options.sql = newSql;
        this.triggerChange();
        this.sql = newSql;
    }
    getQuery(){
        return this.sql;
    }
}