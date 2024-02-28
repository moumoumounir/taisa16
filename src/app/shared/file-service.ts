import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  apiURL = 'http://localhost:8000';
  constructor(private http: HttpClient) { }

  sendFile(file) {

    return this.http.post(this.apiURL +"/file/" ,file);

  }
}
