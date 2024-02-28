import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs';
//import * as data from './files/confService.json'


@Injectable({
  providedIn: 'root'
})
export class RunCodeService {

  //public apiURL = 'http://10.29.240.55:3000';
  public apiURL = 'http://localhost:3000';
  public dataConfig:any;

  
  constructor(private http: HttpClient) { 

this.getJSON().subscribe(data => {
           // this.apiURL="http://"+data['prod']+':'+data['port']
         console.log('  json json json ',this.apiURL);
        });

  }
  module: string="";

public getJSON(): Observable<any> {
        return this.http.get("./assets/confService.json");
    }

getTest(){
  return 1;
}
 
  getResultApi() 
  {
    console.log(' getResultApi ')
    return this.http.get<any>(this.apiURL+'/getDf')
      }

  uploadFile(uploadData :any){

   return this.http.post<{'statut':string,'fileName':string}>(this.apiURL+'/file/', uploadData)
  }

validateLogin(uploadData:any){
      return this.http.post<{'statut':string,'token':string,'user':string}>(this.apiURL+'/validateLogin/', uploadData)

}

  executePipeGetCount(data: any) {
    console.log(' call service  '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post(this.apiURL+'/getCount/', data);
  }

  executePipeGetCode(dataShip: any) {
    const data = cloneDeep(dataShip);
    //console.log('call service  '+JSON.stringify(this.initObjectField(data)))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/getCode/', data, { headers: headers });
  }

  runSchedule(dataCron: any) {
    const data = cloneDeep(dataCron);
    //console.log('call service  '+JSON.stringify(this.initObjectField(data)))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/runSchedule/', data, { headers: headers });
  }


  cancelCron(cronName:string){
    return this.http.get(this.apiURL+'/cancelSchedule/'+cronName,{responseType:'blob'});
  }

  initObjectField(d:any){
    
  for(var i = 0; i < d.pipeObject.length; i++)
  {
    try {
      //console.log('  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!    ',d.pipeObject[i]['outPutColumns']);
      d.pipeObject[i]['outPutColumns']="";
      d.pipeObject[i]['initColumns']="";
    } catch (error) {
      
    }
    try {
      delete(d.pipeObject[i]['top'])
      delete(d.pipeObject[i]['img'])
      delete(d.pipeObject[i]['left'])
      delete(d.pipeObject[i]['color'])
      //delete(d.pipeObject[i]['name'])
      //delete(d.pipeObject[i]['id'])
      //delete(d.pipeObject[i]['type'])
    for(var j = 0; j < d.pipeObject['form'].length; j++)
  {
    try {
      //console.log('  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!    ',d.pipeObject[i]['outPutColumns']);
      d.pipeObject[i][j]['help']="";
    } catch (error) {
      
    }
  }
}catch (error) {}

    console.log('  !!!!!!! d.pipeObject[i]  !!!!!!!!!    ',d.pipeObject[i]);
    /*d.pipeObject[i]['help']="";
    d.pipeObject[i]['columns']="";
    d.pipeObject[i]['initColumns']="";
    d.pipeObject[i]['outPutColumns']="";*/
    
    
  }
  return d;
}
  
  executePipeGetPlot(data:any){
  console.log('call service  '+JSON.stringify(this.initObjectField(data)))
  const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/json' //application/x-www-form-urlencoded'
  });
   
  return this.http.post<any>(this.apiURL+'/getDfPlot/', data, { headers: headers });
}

executePipeGetColStat(dataShip: any) {
  const data = cloneDeep(dataShip);
  console.log('call service ::::::::::::::::::::::: '+JSON.stringify(this.initObjectField(data)))
  const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/json' //application/x-www-form-urlencoded'
  });
   
   return this.http.post<any>(this.apiURL+'/getStatColumns/', this.initObjectField(data), { headers: headers });

}

  executePipeGetDf(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(this.initObjectField(data)))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/getDf/', this.initObjectField(data), { headers: headers });
  
  }
  executePipeGetImpalaDf(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(this.initObjectField(data)))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/getImpalaDf/', this.initObjectField(data), { headers: headers });
  }

  executeSavePipe(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/savePipe/', data, { headers: headers });
  }

   executeSaveCron(dataShip: any) {
    console.log('call service :::')
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/saveCron/', data, { headers: headers });
  }


  executeDeleteCron(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/deleteCron/', data, { headers: headers });
  }


  executeSaveModule(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/saveModule/', data, { headers: headers });
  }

  executeSaveCode(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/saveCode/', data, { headers: headers });
  }

  checkfileExiste1(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/checkfileExiste/', data, { headers: headers });
  }



  checkfileExiste(dataShip: any) {
    const data = cloneDeep(dataShip);
    console.log('call service ::::::::::::::::::::::: '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/saveCode/', data, { headers: headers });
  }



  
  deleteFile(deleteData:any) {
    //const data = cloneDeep(dataShip);
    console.log('call service :::::::deleteFile :::::::::::::::: ',deleteData)
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
    
    return this.http.post<any>(this.apiURL+'/deleteFile/',deleteData);
  }


  executePipeGetHeader(data: any) {
    console.log('call service  '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });   
    return this.http.post<any>(this.apiURL+'/getDfHead/', data);
  }
 
  getPlotImgBase64(data: any) {
    console.log('call service  '+JSON.stringify(data))
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json' //application/x-www-form-urlencoded'
    });
     
    return this.http.post<any>(this.apiURL+'/getDfPlot/', data, { headers: headers });
  }

  getAllNews(){
    return this.http.get<any>(this.apiURL+'/getAllNews');
  }

  downloadModel(modelName:string){
    return this.http.get(this.apiURL+'/downloadModel/'+modelName,{responseType:'blob'});
  }

  downloadSqlFile(fileName:string){
    return this.http.get(this.apiURL+'/downloadSqlFile/'+fileName,{responseType:'text'});
  }

  downloadUserFolderFile(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/downloadUserFolderFile/'+fileName,{responseType:'text'});
  }
  downloadUserFolderJsonFile(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/downloadUserFolderFile/'+fileName,{responseType:'json'});
  }
  getExcelFileHeaderByUserFolder(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/getExcelFileHeaderByUserFolder/'+fileName,{responseType:'json'});
  }

  getFileHeaderByUserFolder(action:string,paramFiles:any){
    //paramFiles= paramFiles+":"+action
    console.log(action,' run service downloadUserFolderFile ',paramFiles)
    return this.http.get(this.apiURL+'/getFileHeaderByUserFolder/'+paramFiles,{responseType:'json'});

  }

  
  getFileContentByUserFolder(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/getFileContentByUserFolder/'+fileName,{responseType:'json'});
  }
  getCsvFileHeaderByUserFolder(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/getCsvFileHeaderByUserFolder/'+fileName,{responseType:'json'});
  }
  getJsonFileHeaderByUserFolder(fileName:string){
    console.log(' run service downloadUserFolderFile ',fileName)
    return this.http.get(this.apiURL+'/getJsonFileHeaderByUserFolder/'+fileName,{responseType:'json'});
  }

  getLogInfo(fileName:string): Observable<any>{
    return this.http.get<any>(this.apiURL+'/getLogInfo/'+fileName);
  }

  getProjectContent(fileName:string){
    return this.http.get<any>(this.apiURL+'/getProjetContent/'+fileName);
  }

  getModuleContent(fileName:string){
    return this.http.get<any>(this.apiURL+'/getModuleContent/'+fileName);
  }

  getModuleCodeContent(fileName:string){
    return this.http.get<any>(this.apiURL+'/getModuleCodeContent/'+fileName);
  }
 /* getFileContent(fileName:string){
    return this.http.get<any>(this.apiURL+'/downloadFile/'+fileName,{responseType:'blob'});
  }*/

  getFileContent(fileName:string){
    return this.http.get(this.apiURL+'/downloadFile/'+fileName,{responseType:'blob'});
  }

  getTreeByUser(folder:string){
    return  this.http.get<any>(this.apiURL+'/getTreeByUser/'+folder);
    
}
getFolderTreeByUser(folder:string){
  return  this.http.get<any>(this.apiURL+'/getFolderTreeByUser/'+folder);
  
}

  getBooks1(){
    return  this.http.get<any>(this.apiURL+'/getFileByFolder/');
    
     }

  getFileByFolder(folder:string){
    console.log('getFileByFolder  ',folder);
      return  this.http.get<any>(this.apiURL+'/getFileByFolder1/'+folder);
      
  }

  getContentFileByFolder(folder:string){
    console.log('getFileByFolder  ',this.apiURL,' folder ',folder);
      //return  this.http.get<any>(this.apiURL+'getFileByFolder1/'+folder);
      return  this.http.get<any>(this.apiURL+'/getContentAllFileFolder/'+folder);
      
  }

 getFileByUser(){
       console.log('getFileByUser  ',this.apiURL);
      return  this.http.get<any>(this.apiURL+'/getFileByUser/');
      
       }

  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
      text: 'Children', value: 1, collapsed: true, children: [
        { text: 'Baby 3-5', value: 11 },
        { text: 'Baby 6-8', value: 12 },
        { text: 'Baby 9-12', value: 13 }
      ]
    });
    const itCategory = new TreeviewItem({
      text: 'IT', value: 9, children: [
        {
          text: 'Programming', value: 91, children: [{
            text: 'Frontend', value: 911, children: [
              { text: 'Angular 1', value: 9111 },
              { text: 'Angular 2', value: 9112 },
              { text: 'ReactJS', value: 9113, disabled: true }
            ]
          }, {
            text: 'Backend', value: 912, children: [
              { text: 'C#', value: 9121 },
              { text: 'Java', value: 9122 },
              { text: 'Python', value: 9123, checked: false, disabled: true }
            ]
          }]
        },
        {
          text: 'Networking', value: 92, children: [
            { text: 'Internet', value: 921 },
            { text: 'Security', value: 922 }
          ]
        }
      ]
    });
    const teenCategory = new TreeviewItem({
      text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
        { text: 'Adventure', value: 21 },
        { text: 'Science', value: 22 }
      ]
    });
    const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
    //return [childrenCategory, itCategory, teenCategory, othersCategory];
    return [childrenCategory];
  }

  
}
