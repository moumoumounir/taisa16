import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, 
  ElementRef, Input,Output, EventEmitter  } from '@angular/core';

import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
//import { Router } from '@angular/router';
import { EchangeData } from 'src/app/_interface/EchangeData';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table-fil-sort-pag',
  templateUrl: './table-fil-sort-pag.component.html',
  styleUrls: ['./table-fil-sort-pag.component.css']
})
export class TableFilSortPagComponent implements OnInit ,AfterViewInit, OnChanges{

  @Input() public echangeData!: EchangeData ;
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
   
      addAction =false;
      downloadAction = false;
      columns: { columnDef: string, header: string, cell: any }[] = [];
      columnsAction : { columnDef: string, header: string, cell: any }[] = [];
      selectFlag=false;
      columnsSelected:string[]= [];
      displayedColumns :string[]= [] //this.columns.map(c => c.columnDef);
      actionColumns :string[]= []
      iconActionColumns = [{ 'key': 'Details', 'icon': 'reorder' }, 
                          { 'key': 'Delete', 'icon': 'delete' },
                          {  'key':'Download','icon':'download'},
                          { 'key':'Settings','icon':'settings'},
                          { 'key':'Update','icon':'settings'},
                          { 'key':'view module','icon':'view_module'}]


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
        //console.log(colStr,'  checkSelectedColumn  ',this.columnsSelected)
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
      }      

      ngOnInit(){
        //this.columnsSelected=["montant","prix"]
        //this.initSelectedColumn();
        const upperColumns = this.echangeData.actionColumns.map(element => {
          return element.toUpperCase();
        });
        this.addAction=upperColumns.includes('ADD')
        this.downloadAction=upperColumns.includes('DOWNLOAD')
                console.log(' save add ',this.addAction, ' download ',this.downloadAction)
        
        this.echangeData.actionColumns=this.arrayRemove(this.echangeData.actionColumns,['ADD','DOWNLOAD'])
        this.isSearchShow=true;
        this.isSearchActive = this.inActiveSearchSubject.asObservable().pipe(delay(0));
            // this.immubleService.getAllDataSheet('composant').subscribe(
         // data => {
          console.log(' ngOnInit table-fil-sort-pag data '+JSON.stringify(this.echangeData.data))
            
            this.dataSource.data = this.echangeData.data;
            //this.dataSource.data =data;
            this.columns!=this.generateColumns()
            //console.log(' columns '+JSON.stringify(this.columns))
                   this.generateDisplyColumns()
            this.columnsAction!=this.generateActionColums()

            //console.log('onInit displayedColumns '+JSON.stringify(this.displayedColumns))
            //console.log('onInit  columnsAction '+JSON.stringify(this.columnsAction))
                    this.load=false;
                   
           //          },
         //  error => console.log(error));
        
  
        //localStorage.setItem('route','immeuble')
        //localStorage.setItem('subRoute','assurance')
        
      }

      ngOnChanges(){
        //console.log(' onchange  table-fil-sort-pag data '+JSON.stringify(this.echangeData.data))
  
      }
  
      ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
      
      // Recuperer la valeur du json object suivant la valeur du header col 
      getCellValue(element:any,col:any){
        var ob=element 
        let st="ob['"+col+"']";
        //console.log(' getCellValue  element ',element,' col ',col)
        //console.log(' eval ob.concat(col) ',eval(st))
        //return eval('ob.'.concat(col))
        return eval(st)
      }
      
      download(){
        console.log('  download  ',this.echangeData )
        if ( this.echangeData.type != undefined && this.echangeData.type =='code' ){
          let body = document.body;
          const a = document.createElement("a");
          let st="";
          this.dataSource.data.forEach(el => st=st+el.code+'\n');
          console.log('  download  st  ',st)
          a.href = URL.createObjectURL(new Blob([st], {
              type: "text/plain"
          }));
          a.setAttribute("download", "data.txt");
          body.appendChild(a);
          a.click();
          body.removeChild(a);
      }else {
        console.log('  download download download download ',this.dataSource.data)
          const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
           XLSX.writeFile(workBook,"fileExcel.xlsx");

        } 
      }
      addElement(){
        var obj={action:'add',data:[]}
        //console.log(' redirectToAction ',obj)
        this.countChanged.emit(obj);

      }
      redirectToAction(data:any,action:string){
        var obj={action:action,data:[data]}
        //console.log(' redirectToAction ',obj)
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
        for ( var i=0; i <ar.length; i++ ) {
        if ( ar[i].key==action )  {
          icon=ar[i].icon
          break;
          }
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
  
   arrayRemove(arr:any, value:any) { 
    
        return arr.filter(function(ele:any){ 
		if (!value.includes(ele.toUpperCase())) return ele;
        });
    }
     generateActionColums(){
      var jjson=[]
      let tmpjson= {columnDef:'',header:''}
      var ar = this.actionColumns;
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
        console.log(' generateColumns ',this.dataSource.data[0])
        var jjson=[]
        let tmpjson= {columnDef:'',header:''}
        var ar = Object.keys(this.dataSource.data[0])
        console.log(' ar '+ar)
        for ( var i=0;i<ar.length;i++ ){
         tmpjson.columnDef=ar[i];
         tmpjson.header=ar[i].replace(/_/g,' ').replace(/\*/g,'\'');
         console.log(ar[i])
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
          ;//columns.map(c => c.columnDef);
          }else {
            this.displayedColumns = this.columns.map((c : any) => c.columnDef);
          }

          if (this.echangeData.actionColumns.map(el => el.toUpperCase()).includes('SELECT')){
             tmpColumns.push('Select');
             this.echangeData.actionColumns.splice(this.echangeData.actionColumns.map(el => el.toUpperCase()).indexOf('SELECT'),1)
            this.echangeData.actionColumns=this.echangeData.actionColumns
          }
          tmpColumns=tmpColumns.concat(this.displayedColumns)
          this.displayedColumns!=tmpColumns.concat(this.echangeData.actionColumns)
          this.actionColumns!=this.echangeData.actionColumns
             
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
   //console.log(' isAllSelected '+JSON.stringify(this.selection.selected))
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
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log('selected value '+s));
  }
      
    validData(){
      console.log(' before emit '+JSON.stringify(this.selection.selected))
      const obj={action:'selectAction',data:this.selection.selected}
      this.countChanged.emit(obj);
    }  
    }
  
  