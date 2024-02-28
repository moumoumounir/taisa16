import { FileTreeMultiComponent } from './components/file-tree-multi/file-tree-multi.component';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FileTreeComponent } from './components/file-tree/file-tree.component';

import { FormBuilder,FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-tour-of-heroes';
  selectedOptions :string[]=[];
  form: FormGroup;
 items: string[] = ['item1', 'item2', 'item3', 'item4'];
  constructor(private matDialog:MatDialog,private fb: FormBuilder)
   {
      this.form = this.fb.group({
        items: new FormControl([]) // Initialize with an empty array
      });
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



  openFolderServerModal(folder:any) {
    console.log(" ---> ",JSON.stringify(this.form.value))
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    console.log(' openFolderServerModal  ',folder)
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus= false;
    dialogConfig.height= '100%';
    //dialogConfig.data= {user:localStorage.getItem('user'),folder:'input'};
    dialogConfig.data= {user:'mmelliti',folder:'input',isFolder:1,isFile:0};
   
    const modalDialog = this.matDialog.open(FileTreeMultiComponent, dialogConfig);
    //const modalDialog = this.matDialog.open(FileTreeMultiComponent, dialogConfig);
    
    modalDialog.afterClosed().subscribe(result => {
   //   if(result.event == 'Add'){
        console.log(' dialog close ',result)
               });
        }
        



}
