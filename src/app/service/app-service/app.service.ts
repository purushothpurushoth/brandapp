import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  GET_API_AUTH_TOKEN,
  IApiAuthTokenRes,
  IAuthCred
} from 'src/app/interfaces/app.interface';
import { environment } from 'src/environments/environment';
import { API_AUTH_RES } from 'src/mock/api-auth-mock';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  /**
   * @description Fetches the auth token for Api
   * @param authCred
   * @returns token
   */
  public getApiAuthToken(authCred: IAuthCred): Observable<IApiAuthTokenRes> {
    const requestURL = environment.API_BASSE_URI + 'Token' + GET_API_AUTH_TOKEN;
    if (environment.IS_MOCK) {
      return of(API_AUTH_RES);
    }
    return this.http.post<IApiAuthTokenRes>(requestURL, authCred);
  }
}
