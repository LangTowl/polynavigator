import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopMapPageComponent } from './desktop-map-page.component';

describe('DesktopMapPageComponent', () => {
  let component: DesktopMapPageComponent;
  let fixture: ComponentFixture<DesktopMapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopMapPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DesktopMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
