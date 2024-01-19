import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { Iuser } from '../../model/users';
import { SnackbarService } from '../../services/snakbar.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  public dataSource: MatTableDataSource<Iuser> = new MatTableDataSource();
  @ViewChild(MatTable) table!: MatTable<any>;
  public displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'company',
    'DOB',
    'action',
  ];
  public userArr!: Array<Iuser>;
  constructor(
    private _dialog: MatDialog,
    private _userService: UserService,
    private _snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.updateUserOnUi();
  }

  onEmpFormHandler() {
    this._dialog.open(FormComponent, {
      disableClose: true,
    });
  }

  getUsers() {
    this._userService.getAllUsers().subscribe((res) => {
      this.userArr = res;
      this.dataSource = new MatTableDataSource<Iuser>(this.userArr);
      this._userService.newUserData$.subscribe((res) => {
        this.userArr.unshift(res);
        // this.table.renderRows();
      });
    });
  }

  onUserFormHandler() {
    this._dialog.open(FormComponent);
  }

  onEditUser(data: Iuser) {
    let obj: Iuser = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      company_name: data.company_name,
      gender: data.gender,
      DOB: data.DOB,
      password: data.password,
      confirm_password: data.confirm_password,
    };
    const dialogRef = new MatDialogConfig();
    dialogRef.data = obj;
    this._dialog.open(FormComponent, dialogRef);
  }

  updateUserOnUi() {
    this._userService.updateUserData$.subscribe((res) => {
      this.userArr.forEach((user) => {
        this._snackBar.openSnackBar(
          `User ${user.first_name} ${user.last_name} is Successfully Updated!!!`
        );
        if (user.id === res.id) {
          (user.first_name = res.first_name),
            (user.last_name = res.last_name),
            (user.email = res.email),
            (user.phone = res.phone),
            (user.company_name = res.company_name),
            (user.gender = res.gender),
            (user.DOB = res.DOB),
            (user.password = res.password),
            (user.confirm_password = res.confirm_password);
        }
      });
    });
  }

  onDeleteUser(id: string) {
    const dialogConfig = this._dialog.open(ConfirmComponent);
    dialogConfig.afterClosed().subscribe((res: boolean) =>
      res
        ? this._userService.deleteUserList(id).subscribe((res) => {
            const findInd = this.userArr.findIndex((ind) => ind);
            this.userArr.splice(findInd, 1);
            this.table.renderRows();
            this._snackBar.openSnackBar(
              `The User whose id is ${id} is Successfully delete`
            );
          })
        : false
    );
  }
}
