import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { City } from '../../models/city.model';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-add-city-dialog',
  templateUrl: './add-city-dialog.component.html',
  styleUrls: ['./add-city-dialog.component.scss']
})
export class AddCityDialogComponent implements OnInit {
  form: FormGroup;
  city: string;
  country: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { city, country, openWeatherId, likes }: City
  ) {
    this.city = city;
    this.country = country;
    this.form = fb.group({
      city: [city, Validators.required],
      country: [country, Validators.required],
      openWeatherId: [openWeatherId, Validators.required],
      likes: [likes, Validators.required]
    });
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
