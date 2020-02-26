import { Component, OnInit, Input } from '@angular/core';
import { Weather } from 'src/app/models/weather.model';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-tile',
  templateUrl: './map-tile.component.html',
  styleUrls: ['./map-tile.component.scss']
})
export class MapTileComponent implements OnInit {
  @Input() weather: Weather;
  apiKey = environment.GM_API_KEY;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() { }

  getMapUrl() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${this.weather.coord.lat},${this.weather.coord.lon}&zoom=12`
    );
  }
}
