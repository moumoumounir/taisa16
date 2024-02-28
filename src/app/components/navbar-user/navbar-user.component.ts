import { MainService } from '../../services/main.service';
import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FlexLayoutModule } from '@angular/flex-layout';
 

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit, AfterViewInit  {
  notif =0;
  request=0;
  task=0;
  changeText : boolean=true;
  page :string='';
  mail:string=''
  user:string=''
  constructor(private router: Router,
    private mainService:MainService) { }

  @Output() public sidenavToggle = new EventEmitter();
  
  btnColourAccueil='white'
  btnColourDataUser='white'
  btnColourComplainUser='white'
  btnColourRapportUser='white'
  
  //public onToggleSidenav = () => {
  public onToggleSidenav (){
    this.sidenavToggle.emit();
    console.log(' onToggleSidenav emit ')
  }
  initColor(){

    this.btnColourAccueil='primary'
    this.btnColourDataUser='primary'
    this.btnColourComplainUser='primary'
    this.btnColourRapportUser='primary'

  }

  ngOnInit(): void {
   // this.notif=0;
    this.page = localStorage.getItem('route')?? '';
    this.mail=localStorage.getItem('mail')?? '';
    
    this.user=localStorage.getItem('user') ?? '';
    console.log('nofi '+this.notif)
    console.log('this.page '+this.page)
    //let paramString="sheet=userRequest"
    
   
  }


  async ngAfterViewInit() {
    let paramObject:{data:any,sheet:any}={data:{},sheet:''}
    let o={'User':this.user}
    paramObject['data']=o
    paramObject['sheet']='userRequest'
   
  //await this.mainService.getDataByCols(paramObject).subscribe(
  await this.mainService.getDataByCols('userRequest',o).subscribe(
      data1 =>{
    
        //this.request=Object.keys(data1).length
        this.request=data1.length
        console.log(this.request,' nav request  ',JSON.stringify(data1))
      }
      );
      let paramString2='colName=Responsible&colValue='+this.user+'&sheet=userRequestValidation'
      let o1={'Responsible':this.user,'Status':'Waiting'}
     // o1['Status']='Waiting'
    paramObject['data']=o1
    paramObject['sheet']='userRequestValidation'
      await this.mainService.getDataByCols('userRequestValidation',o1).subscribe(
       data2 =>{
   
        //this.notif=Object.keys(data2).length
         this.notif=data2.length
         console.log(this.notif,' nav notof ',JSON.stringify(data2))
       }
       );

       let o3={'Responsible_Group':localStorage.getItem('Groupe'),'Status':["Open","In Progress","To Do","Requested"]}
       console.log(' nav task ',JSON.stringify(o3))
          
       await this.mainService.getDataByCols('userRequestTask',o3).subscribe(
        data2 =>{
    
         //this.notif=Object.keys(data2).length
          this.task=data2.length
          console.log(this.task,' nav task ',JSON.stringify(data2))
        }
        );

  }
  getMoreInformation(): string {
    return 'Address : Home \n  Tel : Number';
    }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/']);
  }
}