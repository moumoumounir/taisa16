import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();
 
  constructor(private router : Router) { }

  ngOnInit(): void {
   }

 /* public onSidenavClose = () => {
    this.sidenavClose.emit({'data':'close'});
    console.log(' sidenavClose emit  ')
  }*/
  public onSidenavClose(event:string){
    
    this.sidenavClose.emit({'data':event});
    //this.router.navigate(['/workspace']);
    console.log(' localstorage data Length ',localStorage.getItem("data"))

    console.log(' sidenavClose emit  ',event)
  }

  isProjectEmpty(){
    const dataString = localStorage.getItem('data');
   if ( dataString != undefined )
   return dataString.length <10
   else return true

  }

}
