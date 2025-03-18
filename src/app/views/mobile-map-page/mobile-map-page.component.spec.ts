import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMapPageComponent } from './mobile-map-page.component';

describe('MobileMapPageComponent', () => {
  let component: MobileMapPageComponent;
  let fixture: ComponentFixture<MobileMapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMapPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MobileMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
