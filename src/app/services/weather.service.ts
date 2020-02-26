import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url = 'https://api.openweathermap.org/data/2.5/';
  apiKey = environment.OW_API_KEY;
  cityWeather = new BehaviorSubject<any>(null);
  incrementedButton = new BehaviorSubject<any>(null);
  cityList = new BehaviorSubject<string[]>(null);

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.url}weather?q=${city}&appid=${this.apiKey}&units=imperial`);
  }

  getWeatherById(id: number): Observable<any> {
    return this.http.get(`${this.url}weather?id=${id}&appid=${this.apiKey}&units=imperial`);
  }
}
