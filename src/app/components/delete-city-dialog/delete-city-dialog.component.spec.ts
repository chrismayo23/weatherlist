import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCityDialogComponent } from './delete-city-dialog.component';

describe('DeleteCityDialogComponent', () => {
  let component: DeleteCityDialogComponent;
  let fixture: ComponentFixture<DeleteCityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
