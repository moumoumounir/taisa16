import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectCrudComponent } from './data-object-crud.component';

describe('DataObjectCrudComponent', () => {
  let component: DataObjectCrudComponent;
  let fixture: ComponentFixture<DataObjectCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataObjectCrudComponent]
    });
    fixture = TestBed.createComponent(DataObjectCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
