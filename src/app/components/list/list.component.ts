import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteCityDialogComponent } from '../delete-city-dialog/delete-city-dialog.component';
import { WeatherService } from '../../services/weather.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() citiesList: Array<any>;
  incrementedId: string;
  incrementedButtonSubscription: Subscription;

  constructor(public dialog: MatDialog, private firebaseService: FirebaseService, private weatherService: WeatherService) { }

  ngOnInit() {
    this.incrementedButtonSubscription = this.weatherService.incrementedButton.subscribe(val => {
      this.incrementedId = val;
    });
  }

  getWeather(city) {
    this.weatherService.cityWeather.next(city.openWeatherId);
  }

  deleteCityDialog(cityObject) {
    const city = cityObject.city;
    const country = cityObject.country;
    const id = cityObject.id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { city, country, id };
    dialogConfig.restoreFocus = false;
    const dialogRef = this.dialog.open(DeleteCityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.firebaseService.deleteCity(value.id);
      }
    });
  }

  incrementLikeCounter(item) {
    const updatedLikes = item.likes + 1;
    this.weatherService.incrementedButton.next(item.openWeatherId);
    setTimeout(() => {
      this.weatherService.incrementedButton.next(null);
    }, 600);
    this.firebaseService.updateLikes(updatedLikes, item.id);
  }

  ngOnDestroy() {
    this.incrementedButtonSubscription.unsubscribe();
  }
}
