
import { getClientConfig } from './functions';
import { CartoDbConfig } from './models/config-interface';
import { CartoClient } from './CartoClient';
import { LayerTypes } from './models/LayerTypes';
import { CartoDbTileLayer } from './CartoDbTileLayer';
import { CustomOlMap } from './customOlMap';
import { CustomLeafletMap } from './customLMap';

const CONFIGURL = './stub-config.json';
const MAPELEMENTID = 'map';

const getAll = async () => { 
    const config: CartoDbConfig = await getClientConfig(CONFIGURL);
    const { zoom , center, maps_api_config, layers } = config;
    const { user_name } = maps_api_config;

    /**
     *  the section to see the api in action
     */
    //1. create map instance 
    // OPENLAYERS
    const map = new CustomOlMap(MAPELEMENTID, { zoom, center });
    // LEAFLET
    // const map = new CustomLeafletMap(MAPELEMENTID, { zoom, center });

    //2. create the client instance
    const client = new CartoClient(user_name, map);
    // 3. add layers to client
    await Promise.all(layers.map(layer => client.addLayer({...layer, account: client.userName })));
    // add layers to map
    client.map.addLayersToMap(client.map.getMapLayers());


    /**
     * the section to see the change implementations in action
     */

    /**
     *  Update Query after 5 seconds
     */
    setTimeout(()=> {
        console.log('CHANGE QUERY');
        (client.map?.getCartoLayers().find(lyr => lyr.type === LayerTypes.CARTODB) as CartoDbTileLayer)
        .setQuery(`select * from european_countries_e LIMIT 10`);
    },5000);

    /**
     * change layer visibility to false and back to true
     */
    setTimeout(()=> {
        console.log('CHANGE VISIBILITY',false);
        (client.map?.getCartoLayers().find(lyr => lyr.type === LayerTypes.CARTODB) as CartoDbTileLayer)
        .setVisibility(false);
    },10000);
    setTimeout(()=> {
        console.log('CHANGE VISIBILITY',true);
        (client.map?.getCartoLayers().find(lyr => lyr.type === LayerTypes.CARTODB) as CartoDbTileLayer)
        .setVisibility(true);
    },11000);
}

getAll();
