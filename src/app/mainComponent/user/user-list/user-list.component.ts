
import { Component, OnInit, ViewChild } from '@angular/core';
import { EchangeData }  from  'src/app/_interface/EchangeData'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MainService } from 'src/app/services/main.service';
import { NavbarUserComponent } from 'src/app/components/navbar-user/navbar-user.component';
import { HttpClient } from '@angular/common/http';

import { NgZone } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})


export class UserListComponent implements OnInit {

  constructor(
    private httpClient:HttpClient,
    private mainService: MainService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private location:Location,
    private ngZone: NgZone) { }

  //isSearchShow: boolean;
  public echangeData : EchangeData ={
      displayedColumns:[],data:[],
      actionColumns:[],
      actionButton:{}
   ,type:'df'}

   @ViewChild(NavbarUserComponent, { static: false }) childC!: NavbarUserComponent;
 
  public  sheet='user'

  public crudData :any;

  public displayedColumns = [];
  public action='list'
  public spinerSelectedField=false;
  public sortField=""  
  public dataConf : any={};
    
  public title="";

  public getJson(): Promise<any>{
     
    console.log(' json  getJson ')  
    return this.httpClient.get("assets/dbUserForm.json").toPromise()
 }
  async  ngOnInit() {
    this.sortField="Date"
    const routePath = this.activeRoute.snapshot.routeConfig?.path;

    if (routePath) {
      localStorage.setItem('route', routePath);
    } else {
      // Handle the case where routePath is undefined (or provide a default value)
      console.error('Route path is undefined.');
    }
    this.dataConf = await this.getJson()
    
  
    this.title=this.dataConf['titleList']
    this.echangeData.actionColumns=this.dataConf['actionColumns']
 

    this.echangeData.displayedColumns=this.dataConf['displayedColumns'];

    console.log(' ngOninit echange data ',JSON.stringify(this.echangeData))
   
    //this.getAllObjects();

    let o:any={}
    //{'User':localStorage.getItem('user')}
  
    
      if ( this.activeRoute.snapshot.params['req'] != undefined ){
      let req=this.activeRoute.snapshot.params['req'];
     //  o['R_params_id']=req;
     o['user_Id']=req;
     }
  
     console.log(' getALLOBject ',this.sheet,o)
     this.spinerSelectedField=true
     this.echangeData.data = await this.getDataByCols(o,this.sheet)
     ///applay sort 

     this.echangeData.data.sort((a, b) => new Date(b[this.sortField]).getTime() - new Date(a[this.sortField]).getTime());
      console.log(' getALLOBject Data ',this.echangeData.data)
  
     if ( this.activeRoute.snapshot.params['req'] != undefined ){
      let event={'action':'details','data':[this.echangeData.data[0]]};

         this.actionHandler1(event) 
     }
      // })
       this.spinerSelectedField=false


    console.log(' getAllDataObjec before brfore  ',this.activeRoute.snapshot.params['req'])

}
 
   
public   getAllObjects = () => {

  let o={'R_params_id':''}
  //{'User':localStorage.getItem('user')}

  
    if ( this.activeRoute.snapshot.params['req'] != undefined ){
    let req=this.activeRoute.snapshot.params['req'];
   //  o['R_params_id']=req;
   o['R_params_id']=req;
   }

   console.log(' getALLOBject ',this.sheet,o)
   this.spinerSelectedField=true;
   this.mainService.getDataByCols(this.sheet,o).subscribe(data => {
    this.action ='list'    
    this.echangeData.data = data;
    console.log(' getALLOBject echangeData ',JSON.stringify(this.echangeData))

   

   if ( this.activeRoute.snapshot.params['req'] != undefined ){
    let event={'action':'details','data':[data[0]]};

       this.actionHandler1(event) 
   }
    })
     this.spinerSelectedField=false
        
      }


  public deleteRowSheet(id:string,sheet:string): Promise<any>{
         
     return this.mainService.deleteRowSheet(id,sheet).toPromise()
  }
  

  async actionHandler1(event:any){
  this.action=event['action'] 
  let data = event['data'][0];
  console.log('action ',this.action,' actionHandler1 event ', event)
  if ( this.action == 'delete'){
    if (window.confirm('Are sure you want to delete this row ?'))  {
      this.spinerSelectedField=true
	  let id=this.sheet+'_id'
    const resp=await this.deleteRowSheet(data[id],this.sheet)
      
   
    this.spinerSelectedField=false
     this.reloadData("delete")
    }
    
  }else {
  this.crudData ={}
  this.crudData['data']=data
  this.crudData['action']=this.action;
  console.log(' actionHandler1  crud data ', this.crudData)
    }
  }


  
  getDataByCols(data:any,sheet:string):Promise<any>{
    // let paramString1='colName=Ref_Request&colValue='+this.echangeData['Ref_Request']+'&sheet=userRequestValidation'
     
       
     return this.mainService.getDataByCols(sheet,data).toPromise()
 }

async reloadData(event:any){  
/*  this.ngZone.run(() => {
    location.replace('/ListUser');
  });*/
  this.location.replaceState('/ListDataObject');
  //this.route.navigate(['/ListUser']);
  //this.route.navigate(['/ListDataObject']);
  //location.go('/ListUser');
   this.action='list' 
  console.log(this.location.getState(), '  ',this.route.getCurrentNavigation(),' reloadData ',JSON.stringify(event), 'echangeData',JSON.stringify(this.echangeData))
  this.echangeData.actionColumns=this.dataConf['actionColumns']
  if ( event != null ){

  //this.childC.ngAfterViewInit();

  this.echangeData.data = [];
  this.spinerSelectedField=true;
  let o={}
  this.echangeData.data = await this.getDataByCols(o,this.sheet) 
  

  this.echangeData.data.sort((a, b) => new Date(b[this.sortField]).getTime() - new Date(a[this.sortField]).getTime());
  console.log(' getALLOBject Data ',this.echangeData.data)
  
    this.spinerSelectedField=false


}


}

}
