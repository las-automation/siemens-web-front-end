import { TestBed } from '@angular/core/testing';

import { ReportDataTimeService } from '../report-data-time.service';

describe('ReportDataTimeService', () => {
  let service: ReportDataTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDataTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
