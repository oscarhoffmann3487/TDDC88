import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowsingpageComponent } from './browsingpage.component';

describe('BrowsingpageComponent', () => {
  let component: BrowsingpageComponent;
  let fixture: ComponentFixture<BrowsingpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsingpageComponent]
    });
    fixture = TestBed.createComponent(BrowsingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
