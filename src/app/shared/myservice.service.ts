import { HttpClient , HttpHeaders  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { throwError} from "rxjs";
  import {catchError, map} from 'rxjs/operators';
   
  
  @Injectable({
    providedIn: 'root'
  })
  
export class MyserviceService {

    constructor(private http: HttpClient) { }
    // tslint:disable-next-line:typedef
    obtenerany() {
      return this.http.get<any[]>('http://localhost:8080/any');
    }
  
    // tslint:disable-next-line:typedef
    obtenerUsuario(Id: number) {
      return this.http.get<any>('http://localhost:8080/getUserById?Id=' + Id);
    }
  
    // tslint:disable-next-line:typedef
    crearUsuario(usuario: any) {
      return this.http.post<any>('http://localhost:8080/any', usuario);
    }
  
    // tslint:disable-next-line:typedef
  
    addUsuario(usuario: any) {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json' //application/x-www-form-urlencoded'
      });
      
      console.log(' add send  '+JSON.stringify(usuario))
      return this.http.post('http://localhost:8080/appendDataSheet/user', usuario, { headers: headers })
  
    }
    editarUsuario(usuario: any) {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json' //application/x-www-form-urlencoded'
      });
      
      console.log(' edit send  '+JSON.stringify(usuario))
      return this.http.post('http://localhost:8080/updateDataSheet/user', usuario, { headers: headers })
  
    }
  
    // tslint:disable-next-line:typedef
    eliminarUsuario(usuario: any) {
      return this.http.delete('http://localhost:8080/any/' + usuario.Id);
    }
  
    // tslint:disable-next-line:typedef
    login( email: string, password: string ){
      
      return this.http.get<any>('http://localhost:8080/login?email='+email+'&password='+password ) .pipe(
        catchError((err) => {
          console.log('error caught in service')
          //console.error(err);
  
          //Handle the error here
  
          return throwError(err);    //Rethrow it back to component
        })
      );
    }
  
  // tslint:disable-next-line:typedef
  getAllNews(){
    return this.http.get<any>('http://localhost:8080/getAllNews');
  }
  
  getAllDocuments(){
    console.log(' service getAllDocuments ')
    return this.http.get<any>('http://localhost:8080/getAllDocuments');
  }
  
  getAllUsers(){
    console.log(' service getAllUsers ')
    return this.http.get<any>('http://localhost:8080/getAllUsers');
  }
  
  appendDocument(data){
    const headers = new HttpHeaders({
     'Access-Control-Allow-Origin': '*',
     'Accept': 'application/json',
     'Accept-Language': 'en_US',
     'Content-Type': 'application/json' //application/x-www-form-urlencoded'
   });
   
   return this.http.post('http://localhost:8080/appendDocument/', data, { headers: headers })
  
  }
  
  appendNews(data){
     const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
    
    console.log(' httpclient.post(http://localhost:8080/post-test ')
    return this.http.post('http://localhost:8080/appendNews/', data, { headers: headers })
  
  }
  checkUserMail(Email){
    console.log('Check User Mail ')
    return this.http.get<any>('http://localhost:8080/getDataSheetByColName/?sheet=user&colName=Email&colValue='+Email);
       
    }
  }

