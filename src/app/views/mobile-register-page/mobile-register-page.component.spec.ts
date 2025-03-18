import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRegisterPageComponent } from './mobile-register-page.component';

describe('MobileRegisterPageComponent', () => {
  let component: MobileRegisterPageComponent;
  let fixture: ComponentFixture<MobileRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRegisterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
