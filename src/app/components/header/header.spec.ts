// Ficheiro: header.component.spec.ts (ou header.spec.ts)

import { ComponentFixture, TestBed } from '@angular/core/testing';

// CORREÇÃO: O nome da classe importada foi atualizado.
import { HeaderComponent } from './header';

// CORREÇÃO: A descrição do teste foi atualizada para consistência.
describe('HeaderComponent', () => {
  // CORREÇÃO: O tipo da variável foi atualizado.
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // CORREÇÃO: O componente importado para o teste foi atualizado.
      imports: [HeaderComponent]
    })
    .compileComponents();

    // CORREÇÃO: O componente a ser criado foi atualizado.
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});