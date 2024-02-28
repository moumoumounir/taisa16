import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectListComponent } from './data-object-list.component';

describe('DataObjectListComponent', () => {
  let component: DataObjectListComponent;
  let fixture: ComponentFixture<DataObjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataObjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
