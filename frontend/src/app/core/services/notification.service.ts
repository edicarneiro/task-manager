import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Exibe uma notificação de sucesso.
   * @param message A mensagem a ser exibida.
   * @param duration Duração em milissegundos (padrão: 3000ms).
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'FECHAR', {
      duration: duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Exibe uma notificação de erro.
   * @param message A mensagem a ser exibida.
   * @param duration Duração em milissegundos (padrão: 5000ms).
   */
  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'FECHAR', {
      duration: duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

}
