import {  Directive ,ElementRef , HostListener,Renderer2,Component, AfterViewInit, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { LocalstorageService } from 'src/app/dragdrop/shared/localstorage.service';



@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements AfterViewInit {

  Description : any;
  existImage :boolean=true;
  image:string="";
  text_top:string=""
  text_bottom:string=""

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private elRef : ElementRef ,private render : Renderer2 ,
  //private localStorageService: LocalstorageService,
  public dialogRef : MatDialogRef<HelpComponent>) { 
    this.Description = data
    
  }
  
  ngAfterViewInit(): void {
    if (this.Description["image"]!=undefined) {
      this.existImage=true
      this.image=this.Description["image"]
    }
    if (this.Description["text_top"]!=undefined) {
      this.text_top=this.Description["text_top"]
    }
    if (this.Description["text_bottom"]!=undefined) {
      this.text_bottom=this.Description["text_bottom"]
    }
    console.log('help ',this.text_top, '  ',this.image,' ',this.text_bottom)
  }

}
