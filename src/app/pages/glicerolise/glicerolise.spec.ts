import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Glicerolise } from './glicerolise';

describe('Glicerolise', () => {
  let component: Glicerolise;
  let fixture: ComponentFixture<Glicerolise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Glicerolise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Glicerolise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
