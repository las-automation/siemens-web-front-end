// Ficheiro: src/app/components/sensor-card/sensor-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensor-card.html',
  styleUrl: './sensor-card.css'
})
export class SensorCardComponent {
  // A anotação @Input() permite que este componente receba dados do componente "pai" (o dashboard).
  @Input() dadosDoSensor: any;
}