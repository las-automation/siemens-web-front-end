import { TestBed } from '@angular/core/testing';

import { ReportDownload } from './report-download';

describe('ReportDownload', () => {
  let service: ReportDownload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDownload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
