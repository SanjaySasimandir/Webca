import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoconfComponent } from './videoconf.component';

describe('VideoconfComponent', () => {
  let component: VideoconfComponent;
  let fixture: ComponentFixture<VideoconfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoconfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
