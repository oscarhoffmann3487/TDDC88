import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IwmodalComponent } from './iwmodal.component';

describe('IwmodalComponent', () => {
  let component: IwmodalComponent;
  let fixture: ComponentFixture<IwmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IwmodalComponent]
    });
    fixture = TestBed.createComponent(IwmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
