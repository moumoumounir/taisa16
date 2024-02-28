import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, 
  ElementRef, Input,Output, EventEmitter  } from '@angular/core';

import { BehaviorService } from 'src/app/shared/behavior.service';

import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
//import { Router } from '@angular/router';
import { EchangeDataConf } from 'src/app/_interface/EchangeDataConf';


@Component({
  selector: 'app-select-column-fram',
  templateUrl: './select-column-fram.component.html',
  styleUrls: ['./select-column-fram.component.css']
})
export class SelectColumnFramComponent implements OnInit ,AfterViewInit, OnChanges{

  
    @Input() echangeData!: EchangeDataConf ;
    @Output() countChanged: EventEmitter<any> =   new EventEmitter();
     
        constructor(
          //public router :Router
          ){}
    
        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;
        @ViewChild('filterInput') public userInput!: ElementRef;
    
        load = true;
        isSearchShow!: boolean;
        isSearchActive!: Observable<boolean>;
        selection = new SelectionModel<any>(true, []);
    
        public dataSource = new MatTableDataSource<any>();
        public inActiveSearchSubject: BehaviorSubject<any> = new BehaviorSubject(false);
     
    
        columns: { columnDef: string, header: string, cell: any }[] = [];
        columnsAction : { columnDef: string, header: string, cell: any }[] = [];
        selectFlag=false;
        columnsSelected:string[]= [];
        displayedColumns :string[]= [] //this.columns.map(c => c.columnDef);
        actionColumns :string[]= []
        iconActionColumns = [{ 'key': 'Details', 'icon': 'reorder' }, 
                            { 'key': 'Delete', 'icon': 'delete' },
                            { 'key':'Download','icon':'download'},
                            { 'key':'Settings','icon':'settings'},
                            { 'key':'Update','icon':'settings'}]
  
  
        checkSelectedColumn(element:any)  {
          var colStr=element['column']
          console.log(colStr,'  checkSelectedColumn  ',this.columnsSelected)
          for ( var i in this.columnsSelected ){
          //if (this.columnsSelected.length) //findIndex(element['column'])>=0 )
          if( this.columnsSelected[i] == colStr){ 
            this.selection.toggle(element)
            return 1
            //this.selection.select(element);
            
          }
          }
          return 0
        }    
        
        initSelectedColumn()  {
          //var colStr=element['column']
          
          for ( var ind in this.echangeData.data){
          for ( var i in this.columnsSelected ){
              let colStr=this.echangeData.data[ind]['column']
          //if (this.columnsSelected.length) //findIndex(element['column'])>=0 )
          if( this.columnsSelected[i] == colStr){ 
            this.selection.toggle(this.echangeData.data[ind])
            //return 1
            //this.selection.select(element);           
          }
          }
         // return 0
        }
        console.log(' initSelectedColumn checkSelectedColumn  ',this.selection.selected)
        }      
  
        ngOnInit(){
          this.columnsSelected=this.echangeData.selectedRows;
          this.initSelectedColumn();
          this.isSearchShow=true;
          this.isSearchActive = this.inActiveSearchSubject.asObservable().pipe(delay(0));
              // this.immubleService.getAllDataSheet('composant').subscribe(
              // data => {
              //console.log(' ngOnInit table-fil-sort-pag data '+JSON.stringify(this.echangeData.data))
              
              this.dataSource.data = this.echangeData.data;
              //this.dataSource.data =data;
              this.columns!=this.generateColumns()
              //console.log(' columns '+JSON.stringify(this.columns))

              this.generateDisplyColumns()
              this.columnsAction!=this.generateActionColums()
  
              //console.log('onInit displayedColumns '+JSON.stringify(this.displayedColumns))
              //console.log('onInit  columnsAction '+JSON.stringify(this.columnsAction))
              this.load=false;
                               
        }

        refresh(){
          this.columnsSelected=this.echangeData.selectedRows;
          this.initSelectedColumn();
          this.isSearchShow=true;
          this.isSearchActive = this.inActiveSearchSubject.asObservable().pipe(delay(0));
              // this.immubleService.getAllDataSheet('composant').subscribe(
              // data => {
              //console.log(' ngOnInit table-fil-sort-pag data '+JSON.stringify(this.echangeData.data))
              
              this.dataSource.data = this.echangeData.data;
              //this.dataSource.data =data;
              this.columns!=this.generateColumns()
              //console.log(' columns '+JSON.stringify(this.columns))

              this.generateDisplyColumns()
              this.columnsAction!=this.generateActionColums()
  
              //console.log('onInit displayedColumns '+JSON.stringify(this.displayedColumns))
              //console.log('onInit  columnsAction '+JSON.stringify(this.columnsAction))
              this.load=false;
                               
        }
  
  
        ngOnChanges(){

          
          console.log(' onchange  table-fil-sort-pag data '+JSON.stringify(this.echangeData.data))
    
        }
    
        ngAfterViewInit(): void {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
        
        // Recuperer la valeur du json object suivant la valeur du header col 
        getCellValue(element : any,col :string){
          var ob=element 
          return eval('ob.'.concat(col))
        }
  
        redirectToAction(data:any,action:string){
          var obj={action:action,data:[data]}
          this.countChanged.emit(obj);
  
        }
  
        redirectToDetails(data:any){
          //console.log('redirectToDetails '+JSON.stringify(data))
          const st='A 0-8';
          var obj={action:'editDetails',data:[data]}
          this.countChanged.emit(obj);
          //this.router.navigate(['/editPaiment/'+st]);
  
        }
  
        getIcon(action:any) {
          var icon='reorder';
          var ar=this.iconActionColumns;
          console.log('1er  getIcon(action) ',action,'icon ',icon)

          for ( var i=0; i <ar.length; i++ ) {
          if ( ar[i].key==action )  {
            console.log(' getIcon(action) ',action,'icon')
            icon=ar[i].icon
            break;
            }
            console.log(' getIcon(action) ',action,'icon ',icon)

          }
          return icon
         }
  
        redirectToDelete(data:any){
          //console.log('redirectToDelete '+JSON.stringify(data))
          const st='A 0-8';
          var obj={action:'deleteAction',data:[data]}
          this.countChanged.emit(obj);
          //this.router.navigate(['/editPaiment/'+st]);
  
        }
        redirectToDownload(data:any){
          //console.log('redirectToDownload '+JSON.stringify(data))
          const st='A 0-8';
          var obj={action:'downloadAction',data:[data]}
          this.countChanged.emit(obj);
          //this.router.navigate(['/editPaiment/'+st]);
  
        }
    
       generateActionColums(){
        var jjson=[]
        let tmpjson= {columnDef:'',header:''}
        var ar = this.actionColumns
        //console.log(' ar '+ar)
        for ( var i=0;i<ar.length;i++ ){
         tmpjson.columnDef=ar[i];
         tmpjson.header=(ar[i] as string).replace(/_/g,' ').replace(/\*/g,'\'');
         //console.log(ar[i])
         jjson.push(tmpjson);
         tmpjson= {columnDef:'',header:''}
         }
        return jjson
  
       }
  
        generateColumns(){
          var jjson=[]
          let tmpjson= {columnDef:'',header:''}
          var ar = Object.keys(this.dataSource.data[0])
          //console.log(' ar '+ar)
          for ( var i=0;i<ar.length;i++ ){
           tmpjson.columnDef=ar[i];
           tmpjson.header=ar[i].replace(/_/g,' ').replace(/\*/g,'\'');
           //console.log(ar[i])
           jjson.push(tmpjson);
           tmpjson= {columnDef:'',header:''}
           }
          return jjson
        }
        generateDisplyColumns(){
          var tmpColumns=[];
          
          if ( this.echangeData.displayedColumns.length>0 ){
            const displayStringColumn:string[]=this.echangeData.displayedColumns as string[]
            this.displayedColumns =   displayStringColumn
           }else {
              this.displayedColumns = this.columns.map((c :any) => c.columnDef);
            }
  
            if (this.echangeData.actionColumns.map(el => el.toUpperCase()).includes('SELECT')){
               tmpColumns.push('Select');
               this.echangeData.actionColumns.splice(this.echangeData.actionColumns.map(el => el.toUpperCase()).indexOf('SELECT'),1)
              this.echangeData.actionColumns=this.echangeData.actionColumns
            }
            tmpColumns=tmpColumns.concat(this.displayedColumns)
            this.displayedColumns=tmpColumns.concat(this.echangeData.actionColumns)
            this.actionColumns=this.echangeData.actionColumns
               
             //this.displayedColumns= tmpDisplayColumns;
          }
    
        public customSort = (event:any) => {
          console.log(event);
        }
    
        public doFilter = ($event: any) => {
          this.dataSource.filter = $event.target.value.trim().toLocaleLowerCase();
        }
      
        searchOnTable(): void {
          setTimeout(() => {
            const userInputHTMLElement: HTMLElement = this.userInput.nativeElement;
            userInputHTMLElement.focus();
          }, 100);
          this.inActiveSearchSubject.next(true);
        }
      
        capitalizeFirstLetter(st:string) {
          return st.charAt(0).toUpperCase() + st.slice(1);
        }
        
        
        closeSearch(){
          this.dataSource.filter='';
          this.inActiveSearchSubject.next(false);
        }
      
  
         /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
    // console.log(' isAllSelected '+JSON.stringify(this.selection.selected))
    const obj={action:'selectAction',data:this.selection.selected}
    this.countChanged.emit(obj);
      const numSelected = this.selection.selected.length;
     // console.log(' isAllSelected numSelected  '+numSelected)
      const numRows = this.dataSource.data.length;
     // console.log(' isAllSelected numRows  '+numRows)
      return numSelected === numRows;
      this.logSelection()
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
          //console.log('  masterToggle  '+JSON.stringify(this.selection.selected))
    }
  
    logSelection() {
      this.selection.selected.forEach(s => console.log('selected value '+s));
    }
        
      validData(){
        console.log(' before emit '+JSON.stringify(this.selection.selected))
        const obj={action:'selectAction',data:this.selection.selected}
        this.countChanged.emit(obj);
      }  

      update(): void {

     
        /*this.formInput.map(elem => {
            console.log(' update elem ',elem['label'])
                 this.myFormGroup.removeControl(elem['label']); // remove controls
   
         })
     
           this.static_controls.map(control => {
           this.myFormGroup.removeControl(control) // remove static control
         })*/
    
    
        console.log('  update ')
      }



}
    
    