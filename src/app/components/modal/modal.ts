// Ficheiro: src/app/components/modal/modal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalService, ModalData } from '../../services/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {
  // A nossa variável agora "ouve" o objeto ModalData completo.
  displayState$: Observable<ModalData>;

  constructor(private modalService: ModalService) {
    this.displayState$ = this.modalService.displayState$;
  }

  closeModal() {
    this.modalService.close();
  }
}