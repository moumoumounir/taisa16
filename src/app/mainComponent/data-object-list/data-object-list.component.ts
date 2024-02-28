import { Component, OnInit, ViewChild } from '@angular/core';                                                           
import { EchangeData }  from  'src/app/_interface/EchangeData'                                                          
import { ActivatedRoute, ParamMap } from '@angular/router';                                                             
                                                                                                                        
import { MainService } from 'src/app/services/main.service';                                                            
import { NavbarUserComponent } from 'src/app/components/navbar-user/navbar-user.component';                             
import { Location } from '@angular/common';                                                                             
import { firstValueFrom } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
                                                                                                                        
@Component({                                                                                                            
  selector: 'app-data-object-list',                                                                                     
  templateUrl: './data-object-list.component.html',                                                                     
  styleUrls: ['./data-object-list.component.css' ]                                                                      
})                                                                                                                      
                                                                                                                        
                                                                                                                        
export class DataObjectListComponent implements OnInit {                                                                
                                                                                                                        
  constructor(                                                                                                          
    private location:Location,                                                                                          
    private mainService: MainService,                                                                                   
    private activeRoute: ActivatedRoute) { }                                                                            
                                                                                                                        
                                                                                                                        
  public echangeData : EchangeData ={                                                                                   
      displayedColumns:[],data:[],                                                                                      
      actionColumns:[],                                                                                                 
      actionButton:{}                                                                                                   
   ,type:'df'}                                                                                                          
                                                                                                                        
   @ViewChild(NavbarUserComponent, { static: false }) childC!: NavbarUserComponent;                                     
                                                                                                                        
  public  sheet='dataObject'                                                                                            
                                                                                                                        
  public crudData :any;                                                                                                 
                                                                                                                        
  public displayedColumns = [];                                                                                         
  public action='list'                                                                                                  
  public spinerSelectedField=false;                                                                                     
  public sortField=''                                                                                                   
  public dataConf : any={};                                                                                             
                                                                                                                        
  public title='';                                                                                                      
                                                                                                                        
  async  ngOnInit() {                                                                                                   
    this.sortField='Date'                                                                                               
    const routePath = this.activeRoute.snapshot.routeConfig?.path;                                                      
                                                                                                                        
    if (routePath) {                                                                                                    
      localStorage.setItem('route', routePath);                                                                         
    } else {                                                                                                            
      // Handle the case where routePath is undefined (or provide a default value)                                      
      console.error('Route path is undefined.');                                                                        
    }                                                                                                                   
                                                                                                                        
                                                                                                                        
    this.title='Data Object List ' ;
    this.echangeData.actionColumns= [ 'Select', 'details', 'action', 'delete', 'Add' ] ;                                
    this.echangeData.displayedColumns= [ 'Ref_Object', 'Short_Description' ] ;                                          
                                                                                                                        
     let o:any={}                                                                                                       
                                                                                                                        
      if ( this.activeRoute.snapshot.params['req'] != undefined ){                                                      
      let req=this.activeRoute.snapshot.params['req'];                                                                  
                                                                                                                        
     o['Ref_Object']=req;                                                                                               
     }                                                                                                                  
     this.spinerSelectedField=true                                                                                      
     this.echangeData.data = await this.getDataByCols(o,this.sheet)                                                     
     this.echangeData.data.sort((a, b) => new Date(b[this.sortField]).getTime() - new Date(a[this.sortField]).getTime());
                                                                                                                        
     if ( this.activeRoute.snapshot.params['req'] != undefined ){
      let event={'action':'details','data':[this.echangeData.data[0]] };                                                
        //event['data'].push(this.echangeData.data[0])                                                                  
         this.actionHandler1(event);                                                                                    
     }                                                                                                                  
                                                                                                                        
       this.spinerSelectedField=false                                                                                   
}                                                                                                                       
                                                                                                                        
                                                                                                                        
                public   getAllObjects = () => {                                                                        
                          let o:any={}                                                                                  
                                                                                                                        
                          if ( this.activeRoute.snapshot.params['req'] != undefined ){                                  
                                        let req=this.activeRoute.snapshot.params['req'];                                
                                        o['Ref_Object']=req;                                                            
                           }                                                                                            
                           this.spinerSelectedField=true;                                                               
                           this.mainService.getDataByCols(this.sheet,o).subscribe(data => {                             
                                   this.action ='list'                                                                  
                                   this.echangeData.data = data;                                                        
                                                                                                                        
                                   if ( this.activeRoute.snapshot.params['req'] != undefined ){                         
                                                  let event={'action':'details','data':[this.echangeData.data[0]] };    
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
                         this.reloadData('delete')                                                                      
                        }                                                                                               
                                                                                                                        
                  }else {                                                                                               
                  this.crudData ={}                                                                                     
                  this.crudData['data']=data                                                                            
                  this.crudData['action']=this.action;                                                                  
                  console.log(' actionHandler1  crud data ', this.crudData)                                             
                        }                                                                                               
          }                                                                                                             
                                                                                                                        
public async getDataByCols(data:any,sheet:string):Promise<any>{                                                         
                try {                                                                                                   
                  const response = await firstValueFrom(this.mainService.getDataByCols(sheet,data).pipe(defaultIfEmpty('default value')));
                  return response;                                                                                      
                } catch (error) {                                                                                       
                  console.error('Error updating JSON data:', error);                                                    
                  throw error;                                                                                          
                }                                                                                                       
                                                                                                                        
          }                                                                                                             
reloadData(event:any){
  console.log(' reloadData  ', JSON.stringify(event))
  this.location.replaceState('/ListDataObject')
  if ( event != null ){
  this.childC.ngAfterViewInit();
  //this.getAllDataObjects();
   // this.action='list'
    this.ngOnInit()
  }else this.action='list';


}
                                                                                                                        
}                                                                                                                       