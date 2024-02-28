import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeMultiComponent } from './file-tree-multi.component';

describe('FileTreeMultiComponent', () => {
  let component: FileTreeMultiComponent;
  let fixture: ComponentFixture<FileTreeMultiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileTreeMultiComponent]
    });
    fixture = TestBed.createComponent(FileTreeMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
