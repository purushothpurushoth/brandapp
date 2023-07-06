import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GET_EMPLOYERS_RES } from 'src/mock/employers-mock';
import { HttpClient } from '@angular/common/http';
import {
  IPostAPIRes,
  SAVE_EMPLOYERS,
  GET_EMPLOYERS,
  GET_API_AUTH_TOKEN,
  IApiAuthTokenRes,
  IAuthCred,
} from 'src/app/interfaces/app.interface';
import { IEmployer } from 'src/app/interfaces/empoyer-enrolment.interface';
import { POST_RESPONSE } from 'src/mock/post-response-mocks';
import { API_AUTH_RES } from 'src/mock/api-auth-mock';

@Injectable({
  providedIn: 'root',
})
export class EmployerEntrolmentService {
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

  /**
   * @description Saves the employer(s)
   * @param {IEmployer[]} employers
   * @returns {Observable<IPostAPIRes>}
   */
  public saveEmployers(employers: IEmployer[] = []): Observable<IPostAPIRes> {
    if (environment.IS_MOCK) {
      return of(POST_RESPONSE);
    }
    const requestURL = `${environment.API_BASSE_URI}Employer${SAVE_EMPLOYERS}`;
    return this.http.post<IPostAPIRes>(requestURL, employers);
  }

  /**
   * @description Gets the employers base on search key, if search key is empty fetch the all the employers
   * with respect to page count
   * @param {number} startRowIndex
   * @param {string} searchText
   * @returns
   */
  public getEmployers(): Observable<IEmployer[]> {
    const requestURL = `${environment.API_BASSE_URI}Employer${GET_EMPLOYERS}`;
    if (environment.IS_MOCK) {
      return of(GET_EMPLOYERS_RES);
    }
    return this.http.get<IEmployer[]>(requestURL);
  }
}
