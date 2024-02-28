import {  Directive ,ElementRef ,ViewChild, HostListener,Renderer2,Component, AfterViewInit, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { LocalstorageService } from 'src/app/dragdrop/shared/localstorage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
//import {formatDate} from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RunCodeService }  from '../services/run-code.service';
import { BehaviorService } from '../shared/behavior.service';
import { ConfigComponent } from '../config/config.component';


//Change DATE_TIME_FORMAT by the format need
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';  // date format

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit, AfterViewInit {

  Description : String;
  lable : string;

  constructor(//@Inject(LOCAL_STORAGE) private storage: StorageService,
  private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data:any,
  private elRef : ElementRef ,private render : Renderer2 ,
  private runCodeService:RunCodeService,
  private router : Router,
  public send: BehaviorService,
  //private localStorageService: LocalstorageService,
  public dialogRef : MatDialogRef<SaveComponent>) { 
    this.Description = data["fileName"]
    this.lable = data["title"]
  }

  @ViewChild(ConfigComponent, { static: false }) childC!: ConfigComponent;
  reusable:boolean=true;

  onUpdateChild() {
    this.childC.updateProject();
   
  }

  closeDialog(){
    console.log("close   ")
    this.dialogRef.close({fileName:''});
  }


  clearAndReload(){
    this.dialogRef.close({fileName:''});
    //this.router.navigate(['/workspace'])
  }

  // save pipeline 
  savePipeline(name:string) {

    let dateCreation = moment().format('MMMM Do YYYY, h:mm:ss a'); // get the system date with moment library
    let author = "kacem111" // the project creator is hard coded
     
    console.log(name,' savePipeline   ',dateCreation)
    this.dialogRef.close({fileName:name});
    let erreurGenerateCode=false
     let projetData=JSON.parse(localStorage.getItem('data')!);
     let project = JSON.parse(localStorage.getItem('projectConf')!);
    
     project["fileName"]=name
     project["auteur"]=localStorage.getItem('user')
     project["user"]=localStorage.getItem('user')
     project.data=projetData
     project.update=dateCreation
     //project["update"]=dateCreation
     delete project["logFile"]
     //project["pipeObject"]=projetData 
     //delete project["reusable"]
     //project["logFile"]="log_fake"
     // { 'flag':0,'idparent':1, "auteur":"mounir", "fileName":name+".json","update":dateCreation,
    //  'data':JSON.parse(projetData)}
    let pipeProject = { fileName:name,user:localStorage.getItem('user'),logFile:"log_fake",pipeObject:projetData}
    console.log('  send after save ',project)
    if ( this.reusable ){
      this.runCodeService.executeSaveCode(pipeProject).subscribe(
        resultat => {
          console.log(' executeSaveCode ',resultat)
          if (resultat[0]['data'] != 1 ) erreurGenerateCode =true

        });
    if (erreurGenerateCode) return 0;
    //delete project["logFile"]
    //project["reusable"]=this.reusable
    this.runCodeService.executeSaveModule(project).subscribe(
      resultat => {
        this.send.SendProject.next(project);
        console.log(' runCodeService '+resultat)
        //this.send.SendProject.next(project);
        //this.onUpdateChild()
       // alert('  file     '+name+".json   "+resultat[0]["data"])
       if (resultat[0]["data"]==0) {
        if(window.confirm('  file     '+name+".json   already Existe, OverWrite ?")){
        project['flag']=1
        this.runCodeService.executeSavePipe(project).subscribe(
          resultat => {

            if (resultat[0]["data"]==1) {
              alert('  file     '+name+".json   "+"succefull 1 saved")
              
              localStorage.setItem('projectConf',JSON.stringify(project))
              localStorage.setItem('project',JSON.stringify(project))
              //this.send.SendProject.next(project);
              console.log(' call childC.updateProject ')
              this.childC.updateProject()
              }else {
              alert('Error   file     '+name+".json   "+"not  saved")
    
              }
          });
         }
        }else
        if (resultat[0]["data"]==1) {
          alert('  file     '+name+".json   "+"succefull 2 saved")

          localStorage.setItem('projectConf',JSON.stringify(project))
          localStorage.setItem('project',JSON.stringify(project))
          //this.send.SendProject.next(project);
          console.log(' call 2 childC.updateProject ')
          this.childC.updateProject()
          }else {
          alert('Error   file     '+name+".json   "+"not  saved")

          }
        console.log('  send after save ',project)
      }
    );
    }else {
    this.runCodeService.executeSavePipe(project).subscribe(
      resultat => {
        this.send.SendProject.next(project);
        console.log(' runCodeService '+resultat)
        //this.send.SendProject.next(project);
        //this.onUpdateChild()
       // alert('  file     '+name+".json   "+resultat[0]["data"])
       if (resultat[0]["data"]==0) {
        if(window.confirm('  file     '+name+".json   already Existe, OverWrite ?")){
        project['flag']=1
        this.runCodeService.executeSavePipe(project).subscribe(
          resultat => {

            if (resultat[0]["data"]==1) {
              alert('  file     '+name+".json   "+"succefull 3 saved")
              
              localStorage.setItem('projectConf',JSON.stringify(project))
              localStorage.setItem('project',JSON.stringify(project))
              //this.send.SendProject.next(project);
              console.log(' call childC.updateProject ')
              this.childC.updateProject()
              }else {
              alert('Error   file     '+name+".json   "+"not  saved")
    
              }
          });
         }
        }else
        if (resultat[0]["data"]==1) {
          alert('  file     '+name+".json   "+"succefull 4 saved")

          localStorage.setItem('projectConf',JSON.stringify(project))
          localStorage.setItem('project',JSON.stringify(project))
          this.send.SendProject.next(project);
          console.log(' call 4 childC.updateProject ')
          //this.childC.updateProject()
          }else {
          alert('Error   file     '+name+".json   "+"not  saved")

          }
        console.log('  send after save ',project)
      }
    );
    }
     return 0;
 

  }
  // mark the project as reusable 
  saveReusable(event:any)
  {
    this.reusable=event.target.checked
    /*if (event.target.checked) {
      this.storage.set("reusable" ,true) // add reusable true to localStorage 
     
    }
    else {
      this.storage.set("reusable" ,false) // add resuable false to localStorage 
    }*/
  }
  /*getname(event)
  {
    if (event.target.value) {
      this.storage.set("projectname" ,event.target.value)
    }
  }*/

  ngAfterViewInit(): void {
    //this.reusable=true
    
  }

  ngOnInit(): void {
    let project = JSON.parse(localStorage.getItem('projectConf')!);
    this.reusable=project["reusable"]
    //this.reusable=false
    console.log(' save as reusable ',this.reusable)
    
  }




}
