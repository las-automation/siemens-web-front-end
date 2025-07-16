import { TestBed } from '@angular/core/testing';

import { ReportDataService } from './report-data';

describe('ReportData', () => {
  let service: ReportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
