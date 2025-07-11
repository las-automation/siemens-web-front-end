// Ficheiro: src/app/components/header/header.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true, // <-- AQUI ESTÁ A CORREÇÃO!
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
// CORREÇÃO: Renomeado para seguir a convenção do Angular
export class HeaderComponent {

}