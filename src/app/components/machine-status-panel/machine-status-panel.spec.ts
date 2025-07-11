import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStatusPanelComponent } from './machine-status-panel';

describe('MachineStatusPanel', () => {
  let component: MachineStatusPanelComponent;
  let fixture: ComponentFixture<MachineStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineStatusPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineStatusPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
