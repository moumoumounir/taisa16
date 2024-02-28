import { BehaviorService } from 'src/app/shared/behavior.service';
import { Component, OnInit, AfterViewInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateRepoComponent } from 'src/app/create-repo/create-repo.component';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CopyToLocalComponent } from 'src/app/copy-to-local/copy-to-local.component';
//import { BehaviorService } from 'src/app/shared/behavior.service';



@Component({
  selector: 'app-hdfsviewer',
  templateUrl: './hdfsviewer.component.html',
  styleUrls: ['./hdfsviewer.component.scss']
})
export class HdfsviewerComponent implements AfterViewInit {
  public repos : any[] =[]
  public currentRepo :string;
  constructor(private service : BehaviorService ,
    public matDialog: MatDialog,private http: HttpClient,public dialogRef : MatDialogRef<HdfsviewerComponent>,@Inject(MAT_DIALOG_DATA) data,) {
    //this.repos = data['result']
   }


   getRepo(path)
   {
    let toSend = {"path" : path}
    this.http.post('http://localhost:8080/hdfs/repos/',toSend).subscribe(data =>{
      console.log(data['result'])
      this.currentRepo = path
      this.repos = data['result']
    })
   }
   createRepo(current)
   {
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "modal-create-repo";
    dialogConfig.height = "300px";
    dialogConfig.width = "300px";
    dialogConfig.data = current
    const modalDialog = this.matDialog.open(CreateRepoComponent, dialogConfig);
     
   }
   openToLocal(repo)
   {
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "modal-create-repo";
    dialogConfig.height = "300px";
    dialogConfig.width = "400px";
    dialogConfig.data = repo
    const modalDialog = this.matDialog.open(CopyToLocalComponent, dialogConfig);
   }
    ngAfterViewInit(): void {
      this.currentRepo = "/"
      this.service.SendProject.subscribe((data) =>{
        this.repos = data['result']
        console.log(this.repos)
      })
      
    }

}
