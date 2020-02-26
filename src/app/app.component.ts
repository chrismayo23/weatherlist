import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WeatherService } from './services/weather.service';
import { Observable, Subscription } from 'rxjs';
import { Weather } from './models/weather.model';
import { FirebaseService } from 'src/app/services/firebase.service'
import { map } from 'rxjs/operators';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  locationForm: FormGroup;
  weather: Observable<Weather>;
  citiesList: Array<any>;
  loadTopWeather = true;
  showSearchField = false;
  showSearchButton = true;
  citiesSubscription: Subscription;
  cityWeatherSubscription: Subscription;
  filteredOptions: Observable<string[]>;
  options: string[] = [];

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.firebaseService.getCityList().subscribe(res => {
      let cityList = [];
      res.forEach(item => {
        cityList.push(item.data.city)
      })
      this.weatherService.cityList.next(cityList)
      this.options = sortBy(cityList)
    })
    this.citiesSubscription = this.firebaseService.getCities().subscribe(res => {
      this.citiesList = res.reverse();
      if (this.loadTopWeather) {
        this.weather = this.weatherService.getWeatherById(this.citiesList[0].openWeatherId);
        this.loadTopWeather = false;
      }
    });
    this.cityWeatherSubscription = this.weatherService.cityWeather.subscribe(val => {
      this.weather = this.weatherService.getWeatherById(val);
    });
    this.locationForm = this.fb.group({
      citySearchTerm: [''],
    });
    this.filteredOptions = this.locationForm.controls.citySearchTerm.valueChanges
      .pipe(
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase().trim();
      if (filterValue === '') {
        return [];
      } else {
        return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
      }
    } else {
      return []
    }
  }

  getWeather() {
    this.weather = this.weatherService.getWeather(this.locationForm.value.citySearchTerm);
    this.locationForm.reset();
  }

  toggleSearchField() {
    this.showSearchField = !this.showSearchField;
    this.showSearchButton = !this.showSearchButton;
  }

  ngOnDestroy() {
    this.citiesSubscription.unsubscribe;
    this.cityWeatherSubscription.unsubscribe;
  }
}
