import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'close', {
      horizontalPosition: 'start',
      verticalPosition: 'top',
      duration: 2000,
    });
  }
}
