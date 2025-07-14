import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { ModalComponent } from './components/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('web-scada-siemens');
}
