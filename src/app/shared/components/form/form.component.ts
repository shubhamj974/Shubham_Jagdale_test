import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Iuser } from '../../model/users';
import { SnackbarService } from '../../services/snakbar.service';
import { CustomRegex } from '../../const/validation';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public UserForm!: FormGroup;
  public genderInfo: string[] = ['Male', 'Female'];
  public isBtnShow: boolean = true;
  public updateId!: string;
  constructor(
    private _userService: UserService,
    private _dialog: MatDialog,
    private _snackBar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) UserObj: Iuser
  ) {
    this.createUserForm();
    if (UserObj) {
      this.UserForm.patchValue(UserObj);
      this.updateId = UserObj.id;
      this.isBtnShow = false;
    }
  }

  ngOnInit(): void {}

  createUserForm() {
    this.UserForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(CustomRegex.email),
      ]),
      phone: new FormControl(null, [Validators.required]),
      company_name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      DOB: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirm_password: new FormControl(null, [Validators.required]),
    });
  }

  onUserForm() {
    if (this.UserForm.valid) {
      this._userService.createUserList(this.UserForm.value).subscribe((res) => {
        for (const item in res) {
          this._userService.newUser({ id: res[item], ...this.UserForm.value });
          this._snackBar.openSnackBar(
            `User ${this.UserForm.value.first_name} ${this.UserForm.value.last_name} is Successfully Added !!!`
          );
        }
        this._dialog.closeAll();
      });
    }
  }

  onCancel() {
    this.UserForm.reset();
  }

  get f() {
    return this.UserForm.controls;
  }

  onUpdateUser() {
    if (this.UserForm.valid) {
      let updateUserObj = {
        id: this.updateId,
        ...this.UserForm.value,
      };
      this._userService.updateUserList(updateUserObj).subscribe((res) => {
        this._userService.updateUser(updateUserObj);
      });
      this._dialog.closeAll();
    }
  }
}
