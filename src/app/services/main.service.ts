import { HttpClient , HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MainService {


  constructor(private http: HttpClient) { }
 


  
getDataByCols(sheet:string,paramString:any ){
  console.log(' service getAllUserInteractionRequest ')
 // return this.http.get<any>('https://script.google.com/macros/s/AKfycbwXtCXWWJlXyAVZah-8EnoddGTzVDM6oDhtNw6DsI0tfOu8CuZikDQhYEUzKWsh0GMz/exec?sheet='+sheet+'&action=getDataByCols&data='+JSON.stringify(paramString));
 // return this.http.get<any>('https://script.google.com/macros/s/AKfycby3ppuOjYaA6I9K4PCet6h_nhomWov4gV1TwY9e9SS_1nNSUjzRxsPeshPaVUcVM5g/exec?sheet='+sheet+'&action=getDataByCols&data='+JSON.stringify(paramString));
  return this.http.get<any>('https://script.google.com/macros/s/AKfycby9493uuGCkiVve2kw4zEpjy4LhWv_m7kCRfe2x8xfIYwZhGH-9aM67o1RvgfTjPISV3g/exec?sheet='+sheet+'&action=getDataByCols&data='+JSON.stringify(paramString));
}

insertJsonDataToSheet(data: any, sheet:string) {
  const headers = new HttpHeaders({
    'Content-Type': 'text/plain' //application/x-www-form-urlencoded'
  });
  
 // console.log(' add send  '+JSON.stringify(usuario))
 const obj ={
  "data":data,
  "sheet":sheet,
  "action":"insert"
  }  
console.log('  service  0000000',JSON.stringify(obj)) ;
  return this.http.post('https://script.google.com/macros/s/AKfycbxAPw2m8mD26IMhYnylGDEZdR9sIaFXmaEMjYKh0ebOog8ROvhqAFZaX8RS-39P2pOgDA/exec',obj, { headers: headers })
  .pipe(catchError(err => {
    if (err.status === 404) {
      console.log(`error input data `);
      return EMPTY
    }
    return EMPTY
  })
  );
}


  getDataBySheet(city: string): Observable<any> {

    let head = new HttpHeaders();
      head.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      head.append('Access-Control-Allow-Methods', 'GET');
      head.append('Access-Control-Allow-Origin', '*');
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json' //application/x-www-form-urlencoded'
      });
      
      //return this.http.get(this.baseWeatherURL + city + this.urlSuffix, {headers: head})
      return this.http.get('https://script.google.com/macros/s/AKfycby08kD0RuQqrbMKWfsUa7ixSk59Ze5Ebfn7TndA4CXolSALY1-t7VjMB2aL1zlbonb0/exec?action=listAll&sheet=user')
         .pipe(catchError(err => {
          if (err.status === 404) {
            console.log(`City ${city} not found`);
            return EMPTY
          }
          return EMPTY
        })
        );
    }

    insertJsonDataBySheet(data: any, sheet:string): Observable<any> {

      let head = new HttpHeaders();
        head.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
        head.append('Access-Control-Allow-Methods', 'GET');
        head.append('Access-Control-Allow-Origin', '*');
        const headers = new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json' //application/x-www-form-urlencoded'
        });
        
        //return this.http.get(this.baseWeatherURL + city + this.urlSuffix, {headers: head})
        
        return this.http.get('https://script.google.com/macros/s/AKfycbwZyVU_Q2E0aLZnp7UIYeUUreKyIS8xskJGIjslPCmMSadGdhvV6LBTS4Bxx-WZOOatsg/exec?action=insert&sheet=user&Data={}')
  
        //return this.http.get('https://script.google.com/macros/s/AKfycby08kD0RuQqrbMKWfsUa7ixSk59Ze5Ebfn7TndA4CXolSALY1-t7VjMB2aL1zlbonb0/exec?action=insert&sheet=user&Data={}')
        .pipe(catchError(err => {
            if (err.status === 404) {
              console.log(`Row not found`);
              return EMPTY
            }
            return EMPTY
          })
          );
      }
  

      //insertJsonDataToSheet(data: any, sheet:string) {
        updateJsonDataToSheet(data: any, sheet:string) {
          const headers = new HttpHeaders({
            'Content-Type': 'text/plain' //application/x-www-form-urlencoded'
            
          });
          
         // console.log(' add send  '+JSON.stringify(usuario))
         const obj ={
          "data":data,
          "sheet":sheet,
          "action":"update"
          } 
          console.log('  service  0000000 ',JSON.stringify(obj)) 
          
          return this.http.post('https://script.google.com/macros/s/AKfycbwZyVU_Q2E0aLZnp7UIYeUUreKyIS8xskJGIjslPCmMSadGdhvV6LBTS4Bxx-WZOOatsg/exec',obj, { headers: headers })
  
          //return this.http.post('https://script.google.com/macros/s/AKfycbxAPw2m8mD26IMhYnylGDEZdR9sIaFXmaEMjYKh0ebOog8ROvhqAFZaX8RS-39P2pOgDA/exec',obj, { headers: headers })
          .pipe(catchError(err => {
            if (err.status === 404) {
              console.log(`error input data `);
              return EMPTY
            }
            return EMPTY
          })
          );
        }
   
    deleteRowSheet(row_id: string, sheet:string) {
      const headers = new HttpHeaders({
        'Content-Type': 'text/plain' //application/x-www-form-urlencoded'
      });
      console.log('  service  0000000') 
     // console.log(' add send  '+JSON.stringify(usuario))
     const obj ={
      "id":row_id,
      "sheet":sheet,
      "action":"delete"
      } 
      return this.http.post('https://script.google.com/macros/s/AKfycbwZyVU_Q2E0aLZnp7UIYeUUreKyIS8xskJGIjslPCmMSadGdhvV6LBTS4Bxx-WZOOatsg/exec',obj, { headers: headers })
  
      //return this.http.post('https://script.google.com/macros/s/AKfycbw_t57kbsgeHTguLrzhniSB59h9vEYhsMapkk4VVsHvVfd6H8PE9AevsOcSkjFiMI1N/exec',obj, { headers: headers })
      .pipe(catchError(err => {
        if (err.status === 404) {
          console.log(`error input data `);
          return EMPTY
        }
        return EMPTY
      })
      );
    }
    getObjectMergedRequest(data:any){

      const headers = new HttpHeaders({
    
        'Content-Type': 'text/plain' //application/json' //text/plain' //  '
      });
    
     // let data={"sheet":"dataObject","action":"mergeObjectWithRequestUserByKeyToSubscribed",
     // "data":{"joinedSheetName":"userRequest", "mergeKey":"Ref_Object",  "filtredFieldValue" : {"User":"ExtMounirMelliti" } } }
      
      return this.http.post<any>('https://script.google.com/macros/s/AKfycby9iLPjnu3cSMRYzgpYssGt2jAIsoMqyr1u7_OTkHP1kciJEqnoKRSk7pJRiQ_VvX4f/exec', data, { headers: headers })
       .pipe(catchError(err => {
        if (err.status === 404) {
          console.log(`error input data `);
          return EMPTY
        }
        return EMPTY
      })
      );
    }
    
}
