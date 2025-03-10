import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopLoginPageComponent } from './desktop-login-page.component';

describe('DesktopManagerComponent', () => {
  let component: DesktopLoginPageComponent;
  let fixture: ComponentFixture<DesktopLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
