import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './save-button.html'
})
export class SaveButtonComponent {
    // 2. Crie um "emissor de eventos" chamado 'saveClicked'
  @Output() saveClicked = new EventEmitter<void>();

  // 3. Crie um método que será chamado pelo clique no botão
  onSave(): void {
    // 4. Use o emissor para "disparar" o evento para o pai
    this.saveClicked.emit();
  }
}