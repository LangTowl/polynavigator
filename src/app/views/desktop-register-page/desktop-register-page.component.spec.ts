import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopRegisterPageComponent } from './desktop-register-page.component';

describe('DesktopRegisterPageComponent', () => {
  let component: DesktopRegisterPageComponent;
  let fixture: ComponentFixture<DesktopRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopRegisterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
