import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageSnackBarComponent } from './new-message-snack-bar.component';

describe('NewMessageSnackBarComponent', () => {
  let component: NewMessageSnackBarComponent;
  let fixture: ComponentFixture<NewMessageSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMessageSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMessageSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
