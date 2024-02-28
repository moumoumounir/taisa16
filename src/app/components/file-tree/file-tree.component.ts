
  import {FlatTreeControl} from '@angular/cdk/tree';
  import {Component, OnInit,  Inject, Optional} from '@angular/core';
  import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
  import {MatTreeNestedDataSource, } from '@angular/material/tree';
  import {NestedTreeControl} from '@angular/cdk/tree';
  import {MatIconModule} from '@angular/material/icon';
  import {MatButtonModule} from '@angular/material/button';
  import { RunCodeService } from '../../services/run-code.service';
  
  import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
  
  
  /**
   * Food data with nested structure.
   * Each node has a name and an optional list of children.
   */
  interface FoodNode {
    id:string,
    name: string;
    time:string;
    children?: FoodNode[];
  }
  
  const TREE_DATA: FoodNode[] = [
    {
      id:'1',
      name: 'Fruit',
      time:'',
      children: [{id:'1', time:'',name: 'Apple'}, {id:'1', time:'',name: 'Banana'}, {id:'1', time:'',name: 'Fruit loops'}],
    },
    {
      id:'2',
      name: 'Vegetables',
      time:'',
      children: [
        { id:'2',
          name: 'Green',
          time:'',
          children: [{id:'2', time:'',name: 'Broccoli'}, {id:'2', time:'',name: 'Brussels sprouts'}],
        },
        {id:'2',
          name: 'Orange',
          time:'',
          children: [{id:'2', time:'',name: 'Pumpkins'}, {id:'2', time:'',name: 'Carrots'}],
        },
      ],
    },
  ];
  
  /** Flat node with expandable and level information */
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }
  
  /**
   * @title Tree with flat nodes
   */
  
  @Component({
    selector: 'app-file-tree',
    templateUrl: './file-tree.component.html',
    styleUrls: ['./file-tree.component.css']
  })
  export class FileTreeComponent implements OnInit{
    favoriteFruit: string="";
    selectedOptions: any = null;
    selectedOptions1: string[] = [];
    folder:string="";
    isFolder=0;
    isFile=0;
  
  
   private _transformer = (node: FoodNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        name: node.name,
        level: level,
      };
    };
  
    /*treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level,
      node => node.expandable,
    );*/
  
    treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children,
    );
  
    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();
 

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;


    //dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    //dataSource = new MatTreeNestedDataSource<FoodNode>();
    constructor(public dialogRef: MatDialogRef<FileTreeComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA)  public data:any,
      private service:RunCodeService) {
      this.dataSource.data = TREE_DATA;
  
      if (data.isFolder!= undefined)  this.isFolder=data.isFolder;
           if (data.isFile!= undefined) this.isFile=data.isFile;
          console.log("getFileByFolder this.isFolder ",this.isFolder, "this.isFile ",this.isFile)
          if ( data.folder.length>1 ){
            //localStorage.getItem("user")
          this.folder='mmelliti'+":"+data.folder;
          }
          else {
            const user =localStorage.getItem("user")
            if ( user  !== null ){
            this.folder=user;
            }
    }
  }
  
   // hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
    /*toggleNode(node: ExampleFlatNode): void {
      this.treeControl.toggle(node);
    }*/
  
    ngOnInit(): void {
      
   
    console.log(' getFileByFolder getFileByFolder ',this.folder);
    if ( this.folder.includes(':')){
        this.service.getFileByFolder(this.folder).subscribe(
        resultat => {
        var data = resultat[0]["children"]; //
        // SORT BY Timestamp
        data.sort(this.GetSortOrder1("time","desc"));
        //convert timestamp to date 
         data.map(function (element:any) {
           var temp = new Date(parseInt(element["time"]))
           element["time"] = temp.toISOString()
        // if ( element[""])
           return element;
         })
         console.log('oooooooooooooooooooodd 1',JSON.stringify(data));
         // tree.push(childrenCategory);
         this.dataSource.data=data;
        },
        error => console.log(error)
        
        );
      }else {
  
        if ( this.isFolder ==0 ) {
        this.service.getTreeByUser(this.folder).subscribe(
          resultat => {
          var data = resultat//[0]["children"]; //
          var children = []
          // SORT BY Timestamp
          //data.sort(this.GetSortOrder1("time","desc"));
          //convert timestamp to date 
           data.map(function (element:any) {
            
             children=element["children"]
             //children[0].sort(this.GetSortOrder1("time","desc"));
              children.map(function (el:any) {
             var temp = new Date(parseInt(el["time"]))
             el["time"] = temp.toISOString()
             return el;
              })
           })
           console.log('oooooooooooooooooooodd 2',JSON.stringify(data));
           // tree.push(childrenCategory);
           this.dataSource.data=data;
          },
          error => console.log(error)
          
          );
  
      }else {
        this.service.getFolderTreeByUser(this.folder).subscribe(
          resultat => {
          var data = resultat//[0]["children"]; //
          var children = []
          // SORT BY Timestamp
          //data.sort(this.GetSortOrder1("time","desc"));
          //convert timestamp to date 
           data.map(function (element:any) {
            
             children=element["children"]
             //children[0].sort(this.GetSortOrder1("time","desc"));
              children.map(function (el:any) {
             var temp = new Date(parseInt(el["time"]))
             el["time"] = temp.toISOString()
             return el;
              })
           })
           console.log('oooooooooooooooooooodd 3',JSON.stringify(data));
           // tree.push(childrenCategory);
           this.dataSource.data=data;
          },
          error => console.log(error)
          
          );
  
      }
    }
      
        
     // this.treeControl.expandAll() 
    }
  
    GetSortOrder1(prop:string,order:string) {
      if ( order.toUpperCase() =="ASC" ) {
      return function(a:any, b:any) {
            if (a[prop] > b[prop]) {
                  return 1;
              } else if (a[prop] < b[prop]) {
                  return -1;
              }
              return 0;
        } 
        
      }
      if ( order.toUpperCase() =="DESC" ) {
      return function(a:any, b:any) {
            if (a[prop] < b[prop]) {
                  return 1;
              } else if (a[prop] > b[prop]) {
                  return -1;
              }
            return 0;
        }
   }
   return 0;
   }
  
    doAction(){
      console.log(" do action ",this.selectedOptions1)
      this.dialogRef.close({data:this.favoriteFruit.replace(/\//g,":")});
    }
  
    closeDialog(){
      this.dialogRef.close({data:''});
    }
  
  }
  