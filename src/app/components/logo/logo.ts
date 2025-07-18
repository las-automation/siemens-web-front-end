// Ficheiro: src/app/components/logo/logo.component.ts
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [NgOptimizedImage], // Importa a diretiva de imagem
  templateUrl: './logo.html',
  styleUrl: './logo.css'
})
export class LogoComponent {

}