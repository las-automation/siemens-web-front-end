// Ficheiro: src/app/components/header/header.ts

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true, // <-- AQUI ESTÁ A CORREÇÃO!
  imports: [ 
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
// CORREÇÃO: Renomeado para seguir a convenção do Angular
export class HeaderComponent {

}
