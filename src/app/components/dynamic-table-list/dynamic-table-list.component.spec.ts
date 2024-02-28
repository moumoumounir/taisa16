import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableListComponent } from './dynamic-table-list.component';

describe('DynamicTableListComponent', () => {
  let component: DynamicTableListComponent;
  let fixture: ComponentFixture<DynamicTableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
