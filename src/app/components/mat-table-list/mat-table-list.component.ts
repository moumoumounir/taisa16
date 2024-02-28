import {  ElementRef , Renderer2,Component, AfterViewInit, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EchangeData }  from  '../../_interface/EchangeData'
import { MainService } from 'src/app/services/main.service'; 


@Component({
  selector: 'app-mat-table-list',
  templateUrl: './mat-table-list.component.html',
  styleUrls: ['./mat-table-list.component.css']
})

export class MatTableListComponent implements OnInit {
  
  Description : any;
  existImage :boolean=true;
  image:string="";
  text_top:string=""
  text_bottom:string=""
  datalength=0

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elRef : ElementRef ,private render : Renderer2 ,
  private usuariosService: MainService,
  public dialogRef : MatDialogRef<MatTableListComponent>
  ) { 
    this.Description = data
    
  }
  public echangeData : EchangeData ={displayedColumns:[],data:[],actionColumns:[],actionButton:{}, type:'df'}
 
  async ngOnInit(){


    this.echangeData.displayedColumns=this.Description['displayedColumns'];
    this.echangeData.actionColumns=this.Description['actionColumns']
    this.echangeData.data=this.Description['data']
    console.log('description ',JSON.stringify(this.Description))

    console.log('echangeData ',JSON.stringify(this.echangeData))


      
   }
  public spinerSelectedField=false;
        public action='list'

         actionHandler1(event:any){

          console.log(' action handler event ',JSON.stringify(event))
          this.dialogRef.close({data:JSON.stringify(event)});
        }



}
