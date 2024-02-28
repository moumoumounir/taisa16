import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectColumnFramComponent } from './select-column-fram.component';

describe('SelectColumnFramComponent', () => {
  let component: SelectColumnFramComponent;
  let fixture: ComponentFixture<SelectColumnFramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectColumnFramComponent]
    });
    fixture = TestBed.createComponent(SelectColumnFramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
