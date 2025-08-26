import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonReport } from './comparison-report';

describe('ComparisonReport', () => {
  let component: ComparisonReport;
  let fixture: ComponentFixture<ComparisonReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
