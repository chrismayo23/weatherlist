import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-delete-city-dialog',
  templateUrl: './delete-city-dialog.component.html',
  styleUrls: ['./delete-city-dialog.component.scss']
})
export class DeleteCityDialogComponent implements OnInit {
  form: FormGroup;
  city: string;
  country: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeleteCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { city, country, id }
  ) {
    this.city = city;
    this.country = country;
    this.form = fb.group({
      city: [city, Validators.required],
      country: [country, Validators.required],
      id: [id, Validators.required],
    });
  }

  ngOnInit() {
  }

  delete() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
