import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-motor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motor.html',
  styleUrl: './motor.css'
})
export class MotorComponent {
  // Recebe os dados do motor do componente pai (o dashboard)
  @Input() dadosDoMotor: any;

  constructor(private modalService: ModalService) {}

  // Este método é chamado quando o ícone do motor é clicado
  mostrarDetalhes() {
    // Se o motor não estiver no estado 'Normal', abre o modal
    if (this.dadosDoMotor.estado !== 'Normal') {
      this.modalService.open(
        `Detalhes do Motor: ${this.dadosDoMotor.id}`, // Título dinâmico
        this.dadosDoMotor.mensagemAlerta // Mensagem específica do motor
      );
    }
  }
}

