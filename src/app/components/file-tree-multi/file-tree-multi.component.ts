import {FlatTreeControl} from '@angular/cdk/tree';
    import {Component, Optional, Inject,  OnInit} from '@angular/core';
    import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
    import {MatIconModule} from '@angular/material/icon';
    import {MatButtonModule} from '@angular/material/button';

    import {MatTreeNestedDataSource, } from '@angular/material/tree';
    import {NestedTreeControl} from '@angular/cdk/tree';
    
    import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
    import { FormBuilder,FormGroup, FormControl } from '@angular/forms';
    
    import { RunCodeService } from '../../services/run-code.service';

    /**
     * Food data with nested structure.
     * Each node has a name and an optional list of children.
     */
    interface FoodNode {
      name: string;
      children?: FoodNode[];
    }
    
    const TREE_DATA: FoodNode[] = [
      {
        name: 'Fruit',
        children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
      },
      {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
          },
          {
            name: 'Orange',
            children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
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
    
    
@Component({
  selector: 'app-file-tree-multi',
  templateUrl: './file-tree-multi.component.html',
  styleUrls: ['./file-tree-multi.component.css']
})


    export class FileTreeMultiComponent implements OnInit{
    
      form: FormGroup;
       constructor(private fb: FormBuilder,
        private service :RunCodeService,
        public dialogRef: MatDialogRef<FileTreeMultiComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA)  public data:any) {
        this.dataSource.data = TREE_DATA;
      
           this.form = this.fb.group({
             items: new FormControl([]) // Initialize with an empty array
           });

           {
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
        


         }
    
         folder:string="";
         isFolder=0;
         isFile=0;
       

         favoriteFruit: string="";
         selectedOptions: any = null;
         selectedOptions1: string[] = [];
        private _transformer = (node: FoodNode, level: number) => {
           return {
             expandable: !!node.children && node.children.length > 0,
             name: node.name,
             level: level,
           };
         };
       
        /* treeControl = new FlatTreeControl<ExampleFlatNode>(
           node => node.level,
           node => node.expandable,
         );*/
       
         treeFlattener = new MatTreeFlattener(
           this._transformer,
           node => node.level,
           node => node.expandable,
           node => node.children,
         );
       
        // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
         treeControl = new NestedTreeControl<FoodNode>(node => node.children);
         dataSource = new MatTreeNestedDataSource<FoodNode>();
      
     
       
         hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
       
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


         toggleNode(node: ExampleFlatNode): void {
           this.treeControl.toggle(node);
         }
       
         doAction(){
          console.log(" ---> ",JSON.stringify(this.form.value))
           this.dialogRef.close({data:this.favoriteFruit.replace(/\//g,":")});
         }
       
         closeDialog(){
           this.dialogRef.close({data:''});
         }
    
    
    
    
         toggleItem(item: string): void {
          const items = this.form.get('items') as FormControl;
          const currentValue = items.value as string[];
      
          if (currentValue.includes(item)) {
            // Remove the item if it's already selected
            items.setValue(currentValue.filter(val => val !== item));
          } else {
            // Add the item if it's not selected
            items.setValue([...currentValue, item]);
          }
        }
    
    
    }
    