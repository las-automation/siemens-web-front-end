import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportData } from './daily-report-data';

describe('DailyReportData', () => {
  let component: DailyReportData;
  let fixture: ComponentFixture<DailyReportData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyReportData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
