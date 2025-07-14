import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secagem } from './secagem';

describe('Secagem', () => {
  let component: Secagem;
  let fixture: ComponentFixture<Secagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
