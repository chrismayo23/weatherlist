import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Weather } from 'src/app/models/weather.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';
import { City } from 'src/app/models/city.model';
import { FirebaseService } from 'src/app/services/firebase.service'
import { WeatherService } from '../../services/weather.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-tile',
  templateUrl: './weather-tile.component.html',
  styleUrls: ['./weather-tile.component.scss']
})
export class WeatherTileComponent implements OnInit, OnChanges, OnDestroy {
  @Input() weather: Weather;
  @Input() citiesList: Array<any>;
  degrees = 'F';
  mapDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
  likes = 0;
  incremented = false;
  showSaveButton = true;
  currentWeatherId: number;
  currentCitiesIdArray: Array<any>;
  saveCitiesList: any;
  currentCitiesFullArray: any[];
  currentDocId: string;
  incrementedButtonSubscription: Subscription;
  cityList: string[];

  constructor(public dialog: MatDialog, private firebaseService: FirebaseService, private weatherService: WeatherService) { }

  ngOnInit() {
    this.incrementedButtonSubscription = this.weatherService.incrementedButton.subscribe(val => {
      if (this.currentWeatherId === val) {
        this.incremented = true;
      } else {
        this.incremented = false;
      }
    });

    this.weatherService.cityList.subscribe(val => {
      this.cityList = val;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.weather && changes.weather.currentValue && !changes.weather.firstChange) {
      this.currentWeatherId = changes.weather.currentValue.id;
      this.degrees = 'F';
      const currentCity = `${changes.weather.currentValue.name}, ${changes.weather.currentValue.sys.country}`;
      if (!this.cityList.includes(currentCity)) {
        this.firebaseService.addToCityList(currentCity)
      }
    }
    if (changes.citiesList && changes.citiesList.currentValue) {
      this.saveCitiesList = changes.citiesList.currentValue;
      const currentCities = [];
      const currentCitiesFull = [];
      changes.citiesList.currentValue.forEach(element => {
        currentCities.push(element.openWeatherId);
        currentCitiesFull.push(element);
      });
      this.currentCitiesIdArray = currentCities;
      this.currentCitiesFullArray = currentCitiesFull;
    }
    if (this.currentCitiesIdArray) {
      if (this.currentCitiesIdArray.includes(this.currentWeatherId)) {
        this.showSaveButton = false;
      } else {
        this.likes = 0;
        this.showSaveButton = true;
      }
    }
    if (this.saveCitiesList && this.currentWeatherId) {
      this.saveCitiesList.forEach(element => {
        if (element.openWeatherId === this.currentWeatherId) {
          this.likes = element.likes;
          this.currentDocId = element.id;
        }
      });
    }
  }

  onTempChange(change: MatRadioChange) {
    if (change.value === 'celsius') {
      this.weather.main.temp = (this.weather.main.temp - 32) * 5 / 9;
      this.degrees = 'C';
    } else {
      this.weather.main.temp = (this.weather.main.temp * 9 / 5) + 32;
      this.degrees = 'F';
    }
  }

  getIconUrl() {
    return `https://openweathermap.org/img/w/${this.weather.weather[0].icon}.png`;
  }

  getWindDirection() {
    const direction = this.weather.wind.deg;
    const degreeModFloor = Math.floor(direction / 11.25);
    let mapDirectionIndex;
    if (degreeModFloor % 2 === 0) {
      mapDirectionIndex = degreeModFloor / 2;
      return this.mapDirections[mapDirectionIndex];
    } else {
      mapDirectionIndex = (degreeModFloor + 1) / 2;
      return this.mapDirections[mapDirectionIndex];
    }
  }

  saveToListDialog({ name, sys, id }: Weather) {
    const city = name;
    const country = sys.country;
    const openWeatherId = id;
    const likes = this.likes;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { city, country, openWeatherId, likes };
    const dialogRef = this.dialog.open(AddCityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value: City) => {
      if (value) {
        this.showSaveButton = !this.showSaveButton;
        this.firebaseService.createCity(value);
      }
    });
  }

  incrementLikeCounter() {
    this.weatherService.incrementedButton.next(this.currentWeatherId);
    setTimeout(() => {
      this.weatherService.incrementedButton.next(null);
    }, 600);
    if (!this.showSaveButton) {
      this.firebaseService.updateLikes(this.likes + 1, this.currentDocId);
    } else {
      this.likes++;
    }
  }

  ngOnDestroy() {
    this.incrementedButtonSubscription.unsubscribe();
  }
}
