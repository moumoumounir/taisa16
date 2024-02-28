import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css'] 

})
export class ShipComponent  {
  @Input() name: string="";
  @Input() size:number=0;
  @Input() color:string="";
  @Input() imgSource: string="";
  @Input() selected: boolean=true;
  
  index:number=-1
}
