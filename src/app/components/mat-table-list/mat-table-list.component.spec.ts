import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableListComponent } from './mat-table-list.component';

describe('MatTableListComponent', () => {
  let component: MatTableListComponent;
  let fixture: ComponentFixture<MatTableListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatTableListComponent]
    });
    fixture = TestBed.createComponent(MatTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
