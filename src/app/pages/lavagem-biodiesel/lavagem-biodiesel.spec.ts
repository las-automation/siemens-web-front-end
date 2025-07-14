import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavagemBiodiesel } from './lavagem-biodiesel';

describe('LavagemBiodiesel', () => {
  let component: LavagemBiodiesel;
  let fixture: ComponentFixture<LavagemBiodiesel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LavagemBiodiesel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LavagemBiodiesel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
