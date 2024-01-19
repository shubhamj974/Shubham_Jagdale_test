import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iuser } from '../model/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userUrl: string = `${environment.baseUrl}/users.json`;
  private newUserSub$: Subject<Iuser> = new Subject<Iuser>();
  public newUserData$ = this.newUserSub$.asObservable();

  private updateUserSub$: Subject<Iuser> = new Subject<Iuser>();
  public updateUserData$ = this.updateUserSub$.asObservable();

  constructor(private _http: HttpClient) {}

  createUserList(userObj: Iuser): Observable<Iuser[]> {
    return this._http.post<Iuser[]>(this.userUrl, userObj);
  }

  getAllUsers(): Observable<Iuser[]> {
    return this._http.get(this.userUrl).pipe(
      map((user: any) => {
        let data: Iuser[] = [];
        for (const item in user) {
          let obj = {
            id: item,
            ...user[item],
          };
          data.push(obj);
        }
        return data;
      })
    );
  }

  newUser(todo: Iuser) {
    this.newUserSub$.next(todo);
  }

  updateUserList(updateUser: Iuser): Observable<Iuser> {
    let updateUserUrl = `${environment.baseUrl}/users/${updateUser.id}.json`;
    return this._http.patch<Iuser>(updateUserUrl, updateUser);
  }

  updateUser(user: Iuser) {
    this.updateUserSub$.next(user);
  }

  deleteUserList(id: string): Observable<null> {
    let deleteUserUrl = `${environment.baseUrl}/users/${id}.json`;
    return this._http.delete<null>(deleteUserUrl);
  }
}
