// Ficheiro: src/app/services/modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Criamos uma interface para definir a "forma" do estado do nosso modal
export interface ModalData {
  isOpen: boolean;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // O nosso estado agora é um objeto completo, começando com o modal fechado.
  private modalState = new BehaviorSubject<ModalData>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Continuamos a expor o estado como um Observable.
  displayState$ = this.modalState.asObservable();

  constructor() { }

  // O método open agora aceita um título e uma mensagem.
  open(title: string, message: string) {
    this.modalState.next({
      isOpen: true,
      title: title,
      message: message
    });
  }

  close() {
    // Ao fechar, redefinimos o estado para o inicial.
    this.modalState.next({
      isOpen: false,
      title: '',
      message: ''
    });
  }
}