// Ficheiro: src/app/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorCardComponent } from '../../components/sensor-card/sensor-card';
import { MachineStatusPanelComponent } from '../../components/machine-status-panel/machine-status-panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SensorCardComponent, MachineStatusPanelComponent], // Importamos os nossos componentes
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  // Este array simula os dados que viriam da API da Siemens
  sensores = [
    // Sensores de Corrente
    { nome: 'Corrente', valor: 23.70, unidade: 'Amp', estado: 'Normal' },
    { nome: 'Corrente', valor: 29.34, unidade: 'Amp', estado: 'Atenção' },
    { nome: 'Corrente', valor: 48.70, unidade: 'Amp', estado: 'Alarme' },
    // Sensores de Temperatura
    { nome: 'Temperatura', valor: 91.67, unidade: '°C', estado: 'Normal' },
    { nome: 'Temperatura', valor: 97.57, unidade: '°C', estado: 'Atenção' },
    { nome: 'Temperatura', valor: 100.74, unidade: '°C', estado: 'Alarme' }
  ];

    maquinas = [
    { nome: 'Prensa 01', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 },
    { nome: 'Prensa 02', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 },
    { nome: 'Prensa 03', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 },
    { nome: 'Prensa 04', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 },
    { nome: 'Prensa 05', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 },
    { nome: 'Prensa 06', horasTrabalhadas: '00:00:00', diasTrabalhados: 0 }
  ];
}
