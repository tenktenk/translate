// generated by ng_file_service_ts
import { Injectable, Component, Inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT, Location } from '@angular/common'

/*
 * Behavior subject
 */
import { BehaviorSubject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { VillageDB } from './village-db';

// insertion point for imports

@Injectable({
  providedIn: 'root'
})
export class VillageService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Kamar Raïmo: Adding a way to communicate between components that share information
  // so that they are notified of a change.
  VillageServiceChanged: BehaviorSubject<string> = new BehaviorSubject("");

  private villagesUrl: string

  constructor(
    private http: HttpClient,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    // path to the service share the same origin with the path to the document
    // get the origin in the URL to the document
    let origin = this.document.location.origin

    // if debugging with ng, replace 4200 with 8080
    origin = origin.replace("4200", "8080")

    // compute path to the service
    this.villagesUrl = origin + '/api/github.com/tenktenk/translate/go/v1/villages';
  }

  /** GET villages from the server */
  getVillages(): Observable<VillageDB[]> {
    return this.http.get<VillageDB[]>(this.villagesUrl)
      .pipe(
        tap(_ => this.log('fetched villages')),
        catchError(this.handleError<VillageDB[]>('getVillages', []))
      );
  }

  /** GET village by id. Will 404 if id not found */
  getVillage(id: number): Observable<VillageDB> {
    const url = `${this.villagesUrl}/${id}`;
    return this.http.get<VillageDB>(url).pipe(
      tap(_ => this.log(`fetched village id=${id}`)),
      catchError(this.handleError<VillageDB>(`getVillage id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new village to the server */
  postVillage(villagedb: VillageDB): Observable<VillageDB> {

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)

    return this.http.post<VillageDB>(this.villagesUrl, villagedb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`posted villagedb id=${villagedb.ID}`)
      }),
      catchError(this.handleError<VillageDB>('postVillage'))
    );
  }

  /** DELETE: delete the villagedb from the server */
  deleteVillage(villagedb: VillageDB | number): Observable<VillageDB> {
    const id = typeof villagedb === 'number' ? villagedb : villagedb.ID;
    const url = `${this.villagesUrl}/${id}`;

    return this.http.delete<VillageDB>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted villagedb id=${id}`)),
      catchError(this.handleError<VillageDB>('deleteVillage'))
    );
  }

  /** PUT: update the villagedb on the server */
  updateVillage(villagedb: VillageDB): Observable<VillageDB> {
    const id = typeof villagedb === 'number' ? villagedb : villagedb.ID;
    const url = `${this.villagesUrl}/${id}`;

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)

    return this.http.put<VillageDB>(url, villagedb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`updated villagedb id=${villagedb.ID}`)
      }),
      catchError(this.handleError<VillageDB>('updateVillage'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {

  }
}
