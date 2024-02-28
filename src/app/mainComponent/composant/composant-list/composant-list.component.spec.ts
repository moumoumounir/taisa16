import { ComponentFixture, TestBed } from '@angular/core/testing';

import { composantListComponent } from './composant-list.component';

describe('composantListComponent', () => {
  let component: composantListComponent;
  let fixture: ComponentFixture<composantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ composantListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(composantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
