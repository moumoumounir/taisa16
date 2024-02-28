import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
/*import { Observable, throwError, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { resolve } from 'url';*/

@Injectable({
  providedIn: 'root'
})
export class ModuleApiService {

  apiURL = 'http://localhost:8080';
  constructor(private http: HttpClient) { }
  module: string="";

  // get 
  getModule(id:any) {

    return this.http.get(this.apiURL +"/module/" + id);

  }
  getResultApi(nameModule:string) 
  {
    return this.http.get(this.apiURL +"/workspace/module/" + nameModule)
  }
  /*sendFile(file) {

    return this.http.post(this.apiURL +"/file/"+file);
    console.log('hani fi west el function')

  }*/

  getListModule() {

    return this.http.get(this.apiURL +'/listModule/?format=json')
  }

  getReusableModule() {
    return this.http.get(this.apiURL + "/workspace/reusable/")
  }
}
