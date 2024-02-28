import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavUserComponent } from './sidenav-user.component';

describe('SidenavUserComponent', () => {
  let component: SidenavUserComponent;
  let fixture: ComponentFixture<SidenavUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
