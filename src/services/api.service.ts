import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly url = 'http://localhost:3000'

  constructor(
    private http: HttpClient
  ) { }

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/questions`)
  }

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/modules`)
  }

  getQuestionsByModule(module: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/questions/module/${module}`)
  }

  postQuestion(question: any): Observable<any> {
    return this.http.post<any>(`${this.url}/cadQuestion`, question).pipe(
      map(res => res),
      catchError(err => throwError(err))
    )
  }

  postExplanation(explanation: any): Observable<any> {
    return this.http.post<any>(`${this.url}/cadExplanation`, explanation).pipe(
      map(res => res),
      catchError(err => throwError(err))
    )
  }

  postLink(link: any): Observable<any> {
    return this.http.post<any>(`${this.url}/cadLink`, link).pipe(
      map(res => res),
      catchError(err => throwError(err))
    )
  }
}
