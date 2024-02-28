import { ComponentFixture, TestBed } from '@angular/core/testing';

import { composantCrudComponent } from './composant-crud.component';

describe('composantCrudComponent', () => {
  let component: composantCrudComponent;
  let fixture: ComponentFixture<composantCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ composantCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(composantCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
