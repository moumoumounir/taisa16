import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-list-admin',
  templateUrl: './sidenav-list-admin.component.html',
  styleUrls: ['./sidenav-list-admin.component.css']
})
export class SidenavListAdminComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
 
  constructor() { }
  page='test'
  ngOnInit() {
    this.page=localStorage.getItem('route')?? '';
    //this.page='user'
    console.log(' route page ',this.page)
  }
 
  public onSidenavClose = () => {
    this.sidenavClose.emit();
    console.log(' sidenavClose emit  ')
  }


}
