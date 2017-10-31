import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { RequestOptions } from '@angular/http';

import { Problem } from '../../models/problem.model';


@Injectable()
export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]);
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    this.http.get('api/v1/problems')
      .toPromise()
      .then((res: Response) => {
        this._problemSource.next(res.json());
      })
      .catch(this.handleError)
      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
            .toPromise()
            .then((res: Response) => res.json())
            .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    //const headers = new Headers({'content-type': 'application/json'});
    return this.http.post('/api/v1/problems', problem, { headers: this.headers })
            .toPromise()
            .then((res: Response) => {
              this.getProblems();
              return res.json();
            })
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }

  buildAndRun(data): Promise<any> {
    return this.http.post('api/v1/executors', data, { headers: this.headers })
      .toPromise()
      .then((res: Response) => {
        console.log(res);
        return res.json();
      })
      .catch(this.handleError);
  }
}