import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorComponent } from './motor';

describe('Motor', () => {
  let component: MotorComponent;
  let fixture: ComponentFixture<MotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
