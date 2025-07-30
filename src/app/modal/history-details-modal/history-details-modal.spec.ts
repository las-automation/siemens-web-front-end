import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetailsModal } from './history-details-modal';

describe('HistoryDetailsModal', () => {
  let component: HistoryDetailsModal;
  let fixture: ComponentFixture<HistoryDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
