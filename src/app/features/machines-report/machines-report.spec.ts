import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesReport } from './machines-report';

describe('MachinesReport', () => {
  let component: MachinesReport;
  let fixture: ComponentFixture<MachinesReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachinesReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachinesReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
