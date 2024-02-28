import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilSortPagComponent } from './table-fil-sort-pag.component';

describe('TableFilSortPagComponent', () => {
  let component: TableFilSortPagComponent;
  let fixture: ComponentFixture<TableFilSortPagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableFilSortPagComponent]
    });
    fixture = TestBed.createComponent(TableFilSortPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
