
import { RunCodeService } from '../services/run-code.service';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {  Directive ,ElementRef , HostListener,Renderer2,Component, AfterViewInit, OnInit,Inject } from '@angular/core';
//import { ResizeEvent } from 'angular-resizable-element';

//import { BehaviorService } from 'src/app/dragdrop/shared/behavior.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
//import { ConfigreusableComponent } from 'src/app/dragdrop/configreusable/configreusable.component';

@Component({
selector: 'app-plot',
templateUrl: './plot.component.html',
styleUrls: ['./plot.component.css']
})
export class PlotComponent implements AfterViewInit{

imageSource : String;

constructor( @Inject(MAT_DIALOG_DATA) public data:any,private elRef : ElementRef ,private render : Renderer2 ,
//private localStorageService: LocalstorageService,
public dialogRef : MatDialogRef<PlotComponent>)
// public loadApi: RunCodeService)
{ 
this.imageSource = data
}
public modules: any[]=[];
ngAfterViewInit(): void {

}


}
