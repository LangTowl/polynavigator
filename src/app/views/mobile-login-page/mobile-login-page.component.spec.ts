import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLoginPageComponent } from './mobile-login-page.component';

describe('MobileLoginPageComponent', () => {
  let component: MobileLoginPageComponent;
  let fixture: ComponentFixture<MobileLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
