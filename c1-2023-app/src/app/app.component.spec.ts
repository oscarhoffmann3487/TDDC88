// Import necessary modules and dependencies
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    // Configure TestBed and create a fixture
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an <h2> heading', () => {
    fixture.detectChanges(); // Trigger change detection

    const h2Element = fixture.nativeElement.querySelector('h2');

    // Assert that an <h2> element exists
    expect(h2Element).toBeTruthy();

    expect(h2Element.textContent).toEqual('Hello World!');

  });

  it('should contain an <h2> heading', () => {
    fixture.detectChanges(); // Trigger change detection

    const h2Element = fixture.nativeElement.querySelector('h2');

    // Assert that an <h2> element exists
    expect(h2Element).not.toBeFalsy();

  });

  // You can add more tests here as needed

  afterEach(() => {
    fixture.destroy();
  });
});
