import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './save-button.html'
})
export class SaveButtonComponent {}
