import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameCreatorComponent } from './username-creator.component';

describe('UsernameCreatorComponent', () => {
  let component: UsernameCreatorComponent;
  let fixture: ComponentFixture<UsernameCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
