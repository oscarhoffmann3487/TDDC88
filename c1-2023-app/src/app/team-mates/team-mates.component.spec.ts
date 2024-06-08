import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMatesComponent } from './team-mates.component';

describe('TeamMatesComponent', () => {
  let component: TeamMatesComponent;
  let fixture: ComponentFixture<TeamMatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamMatesComponent]
    });
    fixture = TestBed.createComponent(TeamMatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
