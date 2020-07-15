import { Component, OnInit, Input } from '@angular/core';
import Map from 'ol/Map';
import { MapService } from '../map.service';
import { CartoDbConfig } from 'src/app/models/config-interface';
import { tap } from 'rxjs/operators';
import { LayerTypes } from 'src/app/enums/LayerTypes';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() targetMapElId ? = 'map';
  @Input() configPath: string;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.getConfig(this.configPath)
    .pipe(
      tap((config: CartoDbConfig) => {
        const { center, zoom, layers } = config;
        const { user_name } = config.maps_api_config;

        this.mapService.setMapViewOptions({ center, zoom });
        this.mapService.createMap(this.targetMapElId);
        this.mapService.addLayers(user_name, layers);
      })
    ).subscribe();
  }

}
