import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashBiodiesel } from './flash-biodiesel';

describe('FlashBiodiesel', () => {
  let component: FlashBiodiesel;
  let fixture: ComponentFixture<FlashBiodiesel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashBiodiesel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashBiodiesel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
