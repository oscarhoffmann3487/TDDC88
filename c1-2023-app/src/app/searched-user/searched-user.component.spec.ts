import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedUserComponent } from './searched-user.component';

describe('SearchedUserComponent', () => {
  let component: SearchedUserComponent;
  let fixture: ComponentFixture<SearchedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchedUserComponent]
    });
    fixture = TestBed.createComponent(SearchedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
