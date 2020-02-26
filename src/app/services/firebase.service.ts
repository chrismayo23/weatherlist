import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { City } from '../models/city.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  createCity(value: City) {
    return this.db.collection('cities').add({
      city: value.city,
      country: value.country,
      openWeatherId: value.openWeatherId,
      likes: value.likes,
    });
  }

  addToCityList(currentCity: string) {
    return this.db.collection('cityList').add({
      city: currentCity
    });
  }

  getCities() {
    return this.db.collection<City>('cities', ref => ref.orderBy('likes')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as City;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );;
  }

  getCityList() {
    return this.db.collection<any>('cityList', ref => ref.orderBy('city')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        return { data };
      }))
    );;
  }

  updateLikes(updatedLikes: number, docId: string) {
    return this.db.collection('cities').doc(docId).update({
      likes: updatedLikes
    })
  }

  deleteCity(docId: string) {
    return this.db.collection('cities').doc(docId).delete();
  }
}
