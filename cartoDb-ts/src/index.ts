import 'ol/ol.css';
import { getClientConfig } from './functions';
import { CartoDbConfig } from './models/config-interface';
import { CartoClient } from './CartoClient';
import { LayerTypes } from './models/LayerTypes';
import { CartoDbTileLayer } from './CartoDbTileLayer';
import { CustomOlMap } from './customOlMap';

const CONFIGURL = './stub-config.json';
const MAPELEMENTID = 'map';

const getAll = async () => {
    const config: CartoDbConfig = await getClientConfig(CONFIGURL);
    const { zoom , center, maps_api_config, layers } = config;
    const { user_name } = maps_api_config;

    //1. create the client instance
    const client = new CartoClient(user_name);

    //2. create map instance
    client.map = new CustomOlMap(MAPELEMENTID, { zoom, center });

    //3. create layer classes
    layers.map(layer => (client.addLayers(layer)));
    // create mapping library layers
    const mapLayers = await client.getMappableLayers();
    client.map?.addLayerToMap(mapLayers);

    /**
     *  Update Query after 5 seconds
     */
    setTimeout(()=> {
        (client.layers.find(lyr => lyr.type === LayerTypes.CARTODB) as CartoDbTileLayer)
        .setQuery(`select * from european_countries_e LIMIT 10`);
    },5000);

}

getAll();
