import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http: HttpClient) { }
  // tslint:disable-next-line:typedef
  

// sheet dataPortalOvh , apps script : apiCaseManagement1 , user: moumoumounir@gmail.com
  validateLogin( email: string, password: string ){

    const headers = new HttpHeaders({
  
      'Content-Type': 'text/plain' //application/json' //text/plain' //  '
    });
  
  
    let data={"data":{"mail":email,"password":password},"action":"login","sheet":"user"};
    //data={"action":"login","mail":"mounir.melliti@orange.com","password":"mounir2023"    }
    //https://script.google.com/macros/s/AKfycbwI-R5HUfNA82_71dHo8xO9aj4M7gfsG0ra4CHwJKrkMHQsGLhBjjcsXn-GrcsUx4QsQA/exec
     return this.http.post<any>('https://script.google.com/macros/s/AKfycbxAPw2m8mD26IMhYnylGDEZdR9sIaFXmaEMjYKh0ebOog8ROvhqAFZaX8RS-39P2pOgDA/exec', data, { headers: headers })
    //return this.http.post<any>('https://script.google.com/macros/s/AKfycbwU5nw-fhN3iL5h3HTEkOcCXMqsI8Fzzf8MpClmC-j7X7iIbUKNikdiELRm2mJ4GmAnUw/exec', data, { headers: headers })
    .pipe(catchError(err => {
      if (err.status === 404) {
        console.log(`error input data `);
        return EMPTY
      }
     // console.log(`error input data `);
      return EMPTY
    })
    );
  }
}
