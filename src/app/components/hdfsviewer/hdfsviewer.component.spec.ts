import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfsviewerComponent } from './hdfsviewer.component';

describe('HdfsviewerComponent', () => {
  let component: HdfsviewerComponent;
  let fixture: ComponentFixture<HdfsviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdfsviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdfsviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
