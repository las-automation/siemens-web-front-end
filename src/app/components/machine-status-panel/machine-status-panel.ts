// Ficheiro: src/app/components/machine-status-panel/machine-status-panel.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-machine-status-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './machine-status-panel.html',
  styleUrl: './machine-status-panel.css'
})
export class MachineStatusPanelComponent {
  // @Input() permite que o componente receba a 'listaDeMaquinas' do componente pai.
  @Input() listaDeMaquinas: any[] = [];
}
