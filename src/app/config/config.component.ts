import { LocalstorageService } from './../shared/localstorage.service';
import { FileTreeComponent } from '../components/file-tree/file-tree.component';
import { FileTreeMultiComponent } from './../components/file-tree-multi/file-tree-multi.component';

import { RunCodeService } from '../services/run-code.service';
import swal from 'sweetalert2'; 

import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ComponentFactoryResolver,
  OnDestroy,
  AfterViewInit, EventEmitter
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
  SelectControlValueAccessor
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { cloneDeep, replace } from 'lodash';

//import FileService from 'src/app/dragdrop/shared/file-service';
//import { ModuleApiService } from 'src/app/';

//import form_template from 'src/app/fromtemplate';
import { BehaviorService } from 'src/app/shared/behavior.service';
//import * as $ from 'jquery'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HelpComponent } from 'src/app/help/help.component'
import { ModuleApiService} from 'src/app/shared/module-api.service'
import { take, throwIfEmpty } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';
import { clone } from 'lodash';


//import {MatCheckboxModule} from '@angular/material/checkbox';



interface sqltype {
  nature: string;
}


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})


export class ConfigComponent implements OnInit {

  public listReusable : any[] = []
  colomns : any = []
  selected :any
  myFormGroup: FormGroup;
  blockArray = new FormArray([])
  //formTemplate:any = form_template;
  selectedDate: Date = new Date();
  dateVariable : Date = new Date();
  FilterColumnType =false;
  group : any = {};
  formInput: any[]=[];
  title: String ="";
  filename : String="";
  uploadFilePath: File | null = null;
  selectedValue="$Value"
  //csv: File | null = null;
  csv:string="";
  folderUpload="";
  submitLabel="Configure"
  csvFolder:string[]= [] ;//| null = null;
  Blocks= [];
  subscription!: Subscription;

  sql_type: sqltype[] = [{ nature: 'insertion' }, { nature: 'selection' }];
  static_controls = ['action','type','id','idmodule','id_base']
  public filenameValue : String ="";
  public filenameFinal : String ="";
  public nextElements : any[] = []
  public previousElements : any[] = []
  public multipleSelectedValue:string[]=[]; 
  public multipleSelectedForme; 
  public choiceAndOr:string=" AND "
  public fileContent=[]
 


  constructor(public matDialog: MatDialog, //private localStorageService: LocalstorageService, 
    private runCodeService : RunCodeService,
    public httpclient: HttpClient, public restApi: ModuleApiService, public receive: BehaviorService, private formBuilder: FormBuilder) {

    this.myFormGroup = new FormGroup(this.group);
    this.multipleSelectedForme = new FormControl();

  }
  dataForm:any=[];
  //projet!:{name:string,version:string,creationDate:string,createdBy:string};
  projet!: { name: string; version: string; creationDate: string; createdBy: string };

  projet_name="";
  projet_version="";
  projet_creationDate="";
  projet_createdBy="";
  moduleIndex = -1;
  @Input() modules :any[]= [];
  interval: any;
  submittedValue: any;
  currentModule="";
  currentAction: string ="";
  addFilterButton:Boolean=false;
  @Input() message!: [];
  @Output() countChanged: EventEmitter<any> =   new EventEmitter();

 
  ngOnInit() {
    this.group = {};
    this.formInput=[];
    this.myFormGroup = new FormGroup(this.group);
    //let project = { 'idparent':1, "auteur":"mounir", "fileName":"myproject1.json","update":dateCreation}
   
    this.receive.SendProject.subscribe((project: any) => {
      console.log(Object.keys(project).length ,' receive project before ',project['fileName'])
      if (Object.keys(project).length >0){
         this.projet_name = project['fileName'];
          this.projet_version = project['version'];
          this.projet_creationDate = project['update'];
          this.projet_createdBy = project['auteur'];
        }else { 
          this.projet_name = '';
          this.projet_version = '';
          this.projet_creationDate = '';
          this.projet_createdBy = '';
         }
         console.log(' receive project after ',this.projet_name)
          if ( this.projet_name =="" ) this.projet_name="Not saved !!!"
          console.log(' this.projet ', this.projet_name) //, ' this.projet_name ', this.projet_name)
    
    
    });
   
    this.receive.SendMessage.subscribe((data: any) => {
    let dataSize = Object.keys(data).length;

    this.projet = { name: "Not saved !!! ", version: "01", creationDate: "10/01/2022", createdBy: localStorage.getItem('usr')! }
   
    this.currentModule = data['currentModule']
    this.currentAction=data['action']
    if ( this.currentAction=='Impala' || this.currentAction=='ImpalaAgg'){
      this.group['andOrOptions'] = new FormControl('')
      this.myFormGroup.controls['andOrOptions'].setValue(' AND ')  ;
    }


    this.formInput = []
    this.submitLabel='Configure'
      if (!(typeof data['form'] === 'undefined')) {
        const dataFormClone = cloneDeep(data['form']);

        this.dataForm = dataFormClone
        this.formInput = Object.values(dataFormClone);


        for (var i in this.formInput) {

          if (this.formInput[i]['type']=='text' || this.formInput[i]['type']=='textarea') {
             this.formInput[i]['value']=this.formInput[i]['value'].replace(/~/g,'\'')
          }

          if (this.formInput[i]['type']=='uploadfile') this.submitLabel='Upload'
          
          if (this.formInput[i]['label'].toUpperCase().includes('PYTHON')){
            this.group[this.formInput[i]['label']] = new FormControl('',[Validators.required,this.pythonValidator()])
            this.myFormGroup.controls[this.formInput[i]['label']].setValue(this.formInput[i]['value'])
          } else  
          if (this.formInput[i]['label']=='Query'){
          this.group[this.formInput[i]['label']] = new FormControl('',[Validators.required,this.patternValidator()])
          this.myFormGroup.controls[this.formInput[i]['label']].setValue(this.formInput[i]['value'])
        }else 
          this.group[this.formInput[i]['label']] = new FormControl('',[Validators.required])
          this.myFormGroup.controls[this.formInput[i]['label']].setValue(this.formInput[i]['value'])
          
        }
      } else this.formInput = []
    });
    
  };
  //////  update sultiSelectValue : exemple fillNA 
  onElementSelection(event:any){
    console.log(' *********** select multiple ',event)
    this.multipleSelectedValue=event;

  }

  /*
   isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}*/
///////////  used by type select 
SelectOnChange(eventObj: any,listValue:any){
let event=eventObj['target']['value]']
this.FilterColumnType=event.toUpperCase().includes('DATE') || event.toUpperCase().includes('DAY')
if (this.myFormGroup.controls['Python Code']!=undefined ){
let content = this.myFormGroup.controls['Python Code'].value.replace(this.selectedValue,event.split(':')[1].trim())
let cols = listValue
console.log(' col ',cols)
content=content+'\ndf_'+this.currentModule+'.columns='+JSON.stringify(cols)
content=content.replace('df_currentModule','df_'+this.currentModule)
    this.myFormGroup.controls['Python Code'].setValue(content)
    this.selectedValue=event.split(':')[1].trim()
}
console.log(this.FilterColumnType,' SelectOnChange   :::::::::::::::: ',event)

}

pickerEvent(event:any){
  console.log(' date picked   :::::::::::::::: ',event)
  this.selectedDate=event.value;
  //this.myDate.getFullYear() + '-' + (this.myDate.getMonth()+1) + '-' + ('0' + this.myDate.getDate()).slice(-2) ;
  this.myFormGroup.controls['Filter Value'].setValue(this.selectedDate.getFullYear() + '-' + (this.selectedDate.getMonth()+1) + '-' + ('0' + this.selectedDate.getDate()).slice(-2));
}

addtoQuery(filter:string){
if ( this.myFormGroup.controls['Impala Code'].value.trim().length==0 )
    this.myFormGroup.controls['Impala Code'].setValue(filter)
else 
    this.myFormGroup.controls['Impala Code'].setValue(this.myFormGroup.controls['Impala Code'].value+this.myFormGroup.controls['andOrOptions'].value+filter)
}

controleFilterQuery(){
  let filterColumn = this.myFormGroup.controls['Filter Column'].value
  let filterOperator=  this.myFormGroup.controls['Filter Condition'].value
  let filterValue= this.myFormGroup.controls['Filter Value'].value
  return filterColumn.length>0 && filterOperator.length > 0 && filterValue.length>0

  }

AddToQueryFilter(){ 
  /*
  var index1=this.formInput.findIndex(function(item,i){
      return item.label="Impala Code"
  });
  */
  let filter = ' cast('+this.myFormGroup.controls['Filter Column'].value+' as string) '+  this.myFormGroup.controls['Filter Condition'].value+'  cast('+  this.myFormGroup.controls['Filter Value'].value+' as string)'

  console.log(" adddddddddddddddddd to filter ",this.myFormGroup.controls)
  //let filter = ' '+this.myFormGroup.controls['Filter Column'].value+' '+  this.myFormGroup.controls['Filter Condition'].value+' '+  this.myFormGroup.controls['Filter Value'].value
  if ( ['<=','<','>=','>'].includes(this.myFormGroup.controls['Filter Condition'].value)  ){
   filter = ' cast('+this.myFormGroup.controls['Filter Column'].value+' as int) '+  this.myFormGroup.controls['Filter Condition'].value+'  cast('+  this.myFormGroup.controls['Filter Value'].value+' as int)'
  }else{

  }
  if ( this.controleFilterQuery())
    this.addtoQuery(filter)
  }

  AddToQueryAgg(){ 
    /*
  
    var index1=this.formInput.findIndex(function(item,i){
        return item.label="Impala Code"
    });
  
    */
    console.log(" adddddddddddddddddd to Agg ",this.myFormGroup.controls)
    let filter = ' '+this.myFormGroup.controls['Function'].value+'('+  this.myFormGroup.controls['Agg Column'].value+') as '+this.myFormGroup.controls['Function'].value+'_'+  this.myFormGroup.controls['Agg Column'].value
    //if ( this.controleFilterQuery())
    if ( this.myFormGroup.controls['Impala Code'].value.trim().length==0 )
    this.myFormGroup.controls['Impala Code'].setValue(filter)
else 
    this.myFormGroup.controls['Impala Code'].setValue(this.myFormGroup.controls['Impala Code'].value+' , '+filter)

    }

    clearAgg(){

      this.myFormGroup.controls['Impala Code'].setValue('')

    }

    AddToQueryMerge(){ 

      console.log(" adddddddddddddddddd to Merge ",this.myFormGroup.controls)
      
    let filter = 'cast(_left.'+this.myFormGroup.controls['Merge left'].value+' as string)= cast(_right.'+this.myFormGroup.controls['Merge right'].value+' as string)'
      if ( this.myFormGroup.controls['Impala Code'].value.trim().length==0 )
      this.myFormGroup.controls['Impala Code'].setValue(filter)
  else 
      this.myFormGroup.controls['Impala Code'].setValue(this.myFormGroup.controls['Impala Code'].value+' '+this.myFormGroup.controls['andOrOptions'].value+filter)
 

      }
  

uploadFile(file:File){

  const uploadData = new FormData();
    
  let filename = file
 
  uploadData.append('filename', filename);
  uploadData.append('folder', this.folderUpload);
  //uploadData.append('user',localStorage.getItem('user'));
  const user = localStorage.getItem('user');
if (user !== null) {
  uploadData.append('user', user);
}
  console.log(' uploadFile ',uploadData)
   this.runCodeService.uploadFile(uploadData).subscribe(
 
    data => {
             console.log('upload file ',data.fileName);
             //alert("file succefull uploaded "+data.fileName)
             swal.close()
             swal.fire('file has been succeful  uploaded')
             swal.getConfirmButton()
             //this.filename=data.fileName;
             
             },
    error => {console.log(error)
      swal.close()
      swal.fire('error upload')
      swal.getCloseButton()
    }
  )
}

  onFileChanged(event: any) {
    console.log(' onFileChanged ',event.target.files[0])
   
   
    this.uploadFilePath = event.target.files[0]; // get the file name  
    
  }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any | null } => {
      //console.log(' patternValidator  control.value ',control.value)
      if (!control.value) {
        //console.log(' patternValidator  !!!! control.value  NULLLLL ',control.value)
        
      }
      const valid = control.value.includes(" * ")
      //if ( valid ) console.log(' valid includes * ')
      const valid1 = control.value.includes("()")
      //if ( valid1 ) console.log(' valid includes ()) ')
      const queryAr = control.value.toUpperCase().split(' ')
      const queryKeyWord=['SELECT','FROM','WHERE']
      const lastWord= queryAr.pop()
       const valid2= queryKeyWord.includes(lastWord)  
       //console.log('patternValid lastWord ', lastWord, ' valid2 ',valid2)
   
      //console.log(' patternValid  valid2 ',valid2)
      const countOpen=(control.value.match(/\(/g) || []).length
      const countClose=(control.value.match(/\)/g) || []).length
      if (!control.value.toUpperCase().includes('SELECT') || 
      !control.value.toUpperCase().includes('FROM') ) {
        //console.log('patternValidator control.value.dont includes("select or from ")  ')
        control.setErrors({ invalidQuery: true });
        return { 'invalidQuery': 'Select or From is missing  ' };
      }

      if ( valid ){
        //console.log(' patternValidator control.value.includes("*")  countOpen!=countClose ')
        control.setErrors({ invalidQuery: true });
        return { 'invalidQuery': 'Query Should not include * '};
      }
      /*if ( valid1 ){
        //console.log(' patternValidator control.value.includes("*")  countOpen!=countClose ')
        control.setErrors({ invalidQuery: true });
        return { 'invalidQuery': 'Query Syntaxe  () '};
      }*/
      if ( valid2 ){
        //console.log(' patternValidator control.value.includes("*")  countOpen!=countClose ')
        control.setErrors({ invalidQuery: true });
        return { 'invalidQuery': 'End Query Syntax  error' };
      }

      if (   countOpen != countClose ){
        //console.log(' patternValidator control.value.includes("*")  countOpen!=countClose ')
        control.setErrors({ invalidQuery: true });
        return { 'invalidQuery': 'Query syntaxe ( not match ) '};
      }
      return {"error" :null} ;
      //else {
        //console.log(' patternValidator return null ')
      //return null;
      //}
    };
  }

  pythonValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      //console.log(' patternValidator  control.value ',control.value)
      if (!control.value) {
        console.log(' python Validator  !!!! control.value  NULLLLL ',control.value)
        return {"error" :null} ;
      }
      const valid = !control.value.includes(".columns")
      const valid1 = !control.value.includes("df_"+this.currentModule)
      if ( valid ) console.log('pythonValidator  don t include columns ',control.value)
      
       
      if ( valid1  ){
        console.log(' pythonValidator control.value.includes(" dont include columns ")   ')
        control.setErrors({ 'invalidQuery': 'df.colunms required ' });
        return { 'invalidQuery': 'df_'+this.currentModule+'= Is missing' };
      }else
         return {"error" :null} ;
    };
  }


  queryNotValid(query: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const queryControl = formGroup.get(query);
      //const confirmPasswordControl = formGroup.get(confirmPassword);

      const countOpen=(queryControl?.value.match(/\(/g) || []).length
      const countClose=(queryControl?.value.match(/\)/g) || []).length
      if (!queryControl?.value.toUpperCase().includes('SELECT') || 
      !queryControl.value.toUpperCase().includes('FROM') ) {
        queryControl?.setErrors({ syntaxError: true });
        return { syntaxError: true };
      }

      if (countOpen != countClose) {
        queryControl.setErrors({ syntaxError: true });
        return { syntaxError: true };
      } 
      
      if (queryControl.value.includes(' * ')) {
        queryControl.setErrors({ syntaxError: true });
        return { syntaxError: true };
      }
      else {
        queryControl.setErrors(null);
        return null;
      }
    };
  }

  

  onFolderChanged(event: any) { 
    console.log(' onFolderChanged ',event.target.files)
    var filesSelected=event.target.files
    let output = document.getElementById("listing");
    var tmpArr:string[]=[];

    for (let item of filesSelected) {
  
     // tmpArr.push( item.webkitRelativePath+' '+item.name)
      tmpArr.push( item.webkitRelativePath)
    }
    this.csvFolder = tmpArr ; // get the file name 
  }
  onColumnChange(module:any) 
  {
    //console.log(event.target.value)
    this.myFormGroup.get('Reusable_Pipeline')?.setValue(module)
  }
  openFolderServerModal(folder:any) {
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
    dialogConfig.data= {user:localStorage.getItem('user'),folder:folder['folder'],isFolder:1,isFile:0};
   
    const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
    //const modalDialog = this.matDialog.open(FileTreeMultiComponent, dialogConfig);
    
    modalDialog.afterClosed().subscribe(result => {
   //   if(result.event == 'Add'){
        console.log(this.currentAction,' dialog close ',result)
        this.myFormGroup.controls[folder['label']].setValue(result.data)
        this.folderUpload=result.data;
        if ( this.currentAction=="ImpalaDb" ){
          let paramFile=localStorage.getItem('user')+':'+folder['folder']+':'+this.myFormGroup.controls["Nom fichier"].value;
          console.log(' addddddddd  ImpalaDb  ddddddddddddd ',paramFile)
          let  columns:any[]=[];
          this.runCodeService.getFileContentByUserFolder(paramFile).subscribe(
            data => {
              //this.fileContent=data['content'] //data.replace('\r','').split('\n').slice(0,2);
              //content
              let fileName=this.myFormGroup.controls["Nom fichier"].value;
              //to be verififed
              //this.fileContent=data?["content"];
              
              this.fileContent.map(el=>columns.push(el['name']))
              console.log(' content ',columns.join(','))
              let query= " Select "+columns.join(',')+ " from "+fileName.split('json')[0]
              this.myFormGroup.controls["Query"].setValue(query)  ;
              console.log(' this.fileContent ',this.fileContent)
             });
        }
        if ( result.data.split('.').pop()=='sql'){
          this.runCodeService.downloadSqlFile(result.data).subscribe(
            data => {

              this.myFormGroup.controls["Query"].setValue(data)  ;

            });
                
        }
   //   }
     this.csv=result.data;
    });

  }


  openMultiFolderServerModal(folder:any) {
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    console.log(' openFolderServerModal  ')
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus= false;
    dialogConfig.height= '100%';
    //dialogConfig.data= {user:localStorage.getItem('user'),folder:'input'};
    dialogConfig.data= {user:localStorage.getItem('user'),folder:folder['folder'],isFolder:1,isFile:0};
   
    //const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
    const modalDialog = this.matDialog.open(FileTreeMultiComponent, dialogConfig);
    
    modalDialog.afterClosed().subscribe(result => {
   //   if(result.event == 'Add'){
        console.log(' dialog close ',result)
        this.myFormGroup.controls[folder['label']].setValue(result.data)

        if (   this.currentAction=="folderInput"){
          let paramFile=localStorage.getItem('user')+':'+result.data //localStorage.getItem('user')+':'+this.myFormGroup.controls["Nom fichier"].value;
          console.log(' addddddddd  concat  ddddddddddddd ',paramFile)
          this.runCodeService.getFileHeaderByUserFolder(this.currentAction,paramFile).subscribe(
            (data:any) => {
   
              //content
              this.fileContent=data?.content;

              console.log(data,' Excell file content ', this.fileContent);
             });
        }

     this.csv=result.data;
    });
  }
  showHelp(help:any)
  {
    console.log(' showHelp ',help)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-help"; 
    dialogConfig.height = "250px";
    dialogConfig.width = "400px";
    dialogConfig.data = help // pass help variable to the helpcomponent
    const modalDialog = this.matDialog.open(HelpComponent, dialogConfig); // load the help component
   
  }

  isSelected(data:any){

    console.log(' isSelected  ',data)
  }
  onCheckChanges(event: any) {
    this.formInput.map(elem => {
      // this.myFormGroup.removeControl(elem['label']); // remove controls
      if ( this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='checkbox1') {
       let value=event.target.checked ? 1: 0
        this.dataForm[elem['label'].replace(/ /g,'_')]['value'] =value
   
    console.log(this.dataForm[elem['label'].replace(/ /g,'_')],' onCheckChanges    ',this.dataForm[elem['label'].replace(/ /g,'_')]['value'])
      }
  });
}
  // onchange checkbox function for "next"
  onCheckChangesNext(event: any) {
    // get the form array "next" and add data in every changes
   // const formArrayNext: FormArray = this.myFormGroup.get('next') as FormArray;
    console.log(' onCheckChangesNext ',event.target.value, ' checked ')
    /* Selected */


    this.formInput.map(elem => {
      // this.myFormGroup.removeControl(elem['label']); // remove controls
      if ( this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='checkbox') {
       
        let ar=this.dataForm[elem['label'].replace(/ /g,'_')]['valueSelected'] 
        console.log(' el ',event.target.value, '   at  ',ar.indexOf(event.target.value))
        if ( ar.indexOf(event.target.value) >= 0 &&  !event.target.checked ) {
          console.log(' remove ',event.target.value, '   at  ',ar.indexOf(event.target.value))
          ar.splice(ar.indexOf(event.target.value), 1);
        }

        if ( ar.indexOf(event.target.value) == -1 && event.target.checked) ar.push(event.target.value);

        this.dataForm[elem['label'].replace(/ /g,'_')]['valueSelected']=ar
       console.log(elem['label'],'value  ',this.dataForm[elem['label'].replace(/ /g,'_')]['valueSelected'])
      } 
        
     })
  

  }

  onOptionsSelected()
  {
    console.log(this.selected)
  }
  // onchange checkbox function for "previous"
  onCheckChangesPrevious(event: any) {
    // get the form array "previous" and add data in every changes
    const formArrayPrevious: FormArray = this.myFormGroup.get('previous') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArrayPrevious.push(new FormControl(event.target.value));
    }
    else {
      // find the unselected element
      let i: number = 0;


      formArrayPrevious.controls.forEach((ctrl: AbstractControl, i: number) => {
        if (ctrl instanceof FormControl && ctrl.value == event.target.value) {
          // Remove the unselected element from the formArrayPrevious
          formArrayPrevious.removeAt(i);
          return;
        }
      });
     
    }
    console.log('previous', formArrayPrevious.value)



  }

  onSubmit() {
  
  for (var i in this.formInput) {
   console.log(this.formInput[i]['label'],'    '+this.myFormGroup.controls[this.formInput[i]['label']].value)
    if (!this.myFormGroup.controls[this.formInput[i]['label']].valid ){
      if (this.formInput[i]['label']=='Query')
        alert(this.formInput[i]['label']+' is Invalid \n Should be Select field1,field2...   from TableName')
        if (this.formInput[i]['label'].toUpperCase().includes('PYTHON'))
        alert(this.formInput[i]['label']+' is Invalid \n Should Includes columns definition df_currentDf.columns=[..columns..] ')
        else  alert(this.formInput[i]['label']+' is Invalid')
     return 0
     }
  }

  //alert(this.myFormGroup.controls.length+'  Form Submitted Error : please entere all required fields .'+JSON.stringify(this.myFormGroup));
//  return 0;
//}
  if ( this.uploadFilePath != undefined){
      swal.fire({title:'Please wait',allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false})
      swal.showLoading()
      this.uploadFile(this.uploadFilePath);
      this.uploadFilePath = null;
      this.countChanged.emit([]);
      
      return 1
    }


    let filename = this.csv // get the file name 

    // remove all the FormControls and FormArray after change to configure other module
    const todo = 'new';
   

    this.formInput.map(elem => {

      if ((elem['label'].toUpperCase().includes('IMPALA')||
      elem['label'].toUpperCase().includes('QUERY')) && (this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='text' || 
        this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='textarea')) {
          console.log(' before >>>>> ',this.myFormGroup.get(elem['label'])?.value)
    
    let tmpText =this.myFormGroup.get(elem['label'])?.value.replace(/'/g,'~').replace(/"/g,'~')
    this.dataForm[elem['label'].replace(/ /g,'_')].value=tmpText;
    console.log(' after >>>>> ',this.dataForm[elem['label'].replace(/ /g,'_')].value)
    
  }else 
  if (this.dataForm[elem['label'].replace(/ /g,'_')]['type']!='checkbox' && 
  this.dataForm[elem['label'].replace(/ /g,'_')]['type']!='checkbox1' && 
         this.dataForm[elem['label'].replace(/ /g,'_')]['type']!='selectMultiple'  &&
         this.dataForm[elem['label'].replace(/ /g,'_')]['type']!='savefile' &&
         !elem['label'].includes('Repertoire')     ){
          console.log(' elem type  ',this.dataForm[elem['label'].replace(/ /g,'_')]['type'])
          this.dataForm[elem['label'].replace(/ /g,'_')].value=this.myFormGroup.get(elem['label'])?.value
        }
        console.log(elem['label'],' test 2',this.dataForm[elem['label'].replace(/ /g,'_')])
        if ( elem['label'].includes('fichier1') ){
        this.dataForm[elem['label'].replace(/ /g,'_')].value=this.filename //csv['name']
        console.log(' fichier   ::::::ffffffffff  ',JSON.stringify(this.myFormGroup.get(elem['label'])))
        }
        if ( elem['label'].includes('Repertoire') ){
          this.dataForm[elem['label'].replace(/ /g,'_')].value=this.csvFolder 
          //console.log(' fichier   ffffffffff  ',JSON.stringify(this.myFormGroup.get(elem['label'])))
          }
       if (this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='selectMultiple' ){
        this.dataForm[elem['label'].replace(/ /g,'_')].value=this.multipleSelectedValue
        console.log(' fichier   ffffffffffffff  value  ',  this.multipleSelectedValue)
      }
      console.log(' type ',this.dataForm[elem['label'].replace(/ /g,'_')]['type'])
      if (this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='fileServer' ||
      this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='text1' || 
      this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='multiFileServer'  ) {
        console.log(' this.currentModule   ',this.currentModule)  
      
      let paramFile=localStorage.getItem('user')+':'+this.myFormGroup.controls["Nom fichier"].value+':'+this.currentAction;
      if ( this.myFormGroup.controls["Separateur"] !=undefined)  {
        paramFile=paramFile+':'+this.myFormGroup.controls["Separateur"].value
      }
      console.log(' addddddddd openFolderServerModal  inputCSV  ddddddddddddd ',paramFile)
      
      //this.callerFn(paramFile)
      
      this.runCodeService.getFileHeaderByUserFolder(this.currentAction,paramFile).subscribe(
         (data:any) => {
            console.log('openFolderServerModal csv columns ',data?.columns);
        
         // this.dataForm[elem['label'].replace(/ /g,'_')]['content']=this.fileContent;
          //this.dataForm[elem['label'].replace(/ /g,'_')]['columns']=data?['columns'];
          this.dataForm[elem['label'].replace(/ /g,'_')]['columns'] =  data?['columns'] : null;
         
      });
          
    }

    if (this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='textarea' 
        && this.currentAction.toUpperCase().includes('PYTHON')){
        console.log(' PYTHON >>>>>>>>>>>  ',this.dataForm[elem['label'].replace(/ /g,'_')]['value'])  
        const pythonCode=this.dataForm[elem['label'].replace(/ /g,'_')]['value']
        if ( !pythonCode.toUpperCase().includes(this.currentModule+'.columns'.toUpperCase())){
        const indexOfFirst = pythonCode.indexOf('df_'+this.currentModule+'.columns')
        const st= pythonCode.substring(indexOfFirst);
        
        console.log(indexOfFirst,'  PYTHON >>>>>>>>>>> st  ', st)
        const st1 = st.split('\n')[0] //st.substring(0, st.indexOf('\n')|st.length-1);
        const st2 = st1.split('=')[1];
        console.log(st.indexOf('\n')|st.length-1,'  ',st1," ",st1.split('='),"st2 ",st2)
        const columns = st2.replace(/\[|\]/g,'').replace(/~/g,'').replace(/\n/g,'').replace(/"/g,'').replace(/'/g,'').split(',')
        
        this.dataForm[elem['label'].replace(/ /g,'_')]['columns']=columns        ;
        }else {
          this.dataForm[elem['label'].replace(/ /g,'_')]['columns']=[]        ;

        }
      
       }
      console.log(' label  ',elem['label'].replace(/ /g,'_'))
       
      if (this.dataForm[elem['label'].replace(/ /g,'_')]['type']=='textarea' 
      && elem['label'].replace(/ /g,'_').toUpperCase().includes('QUERY')){
      console.log(' QUery >>>>>>>>>>>  ',this.dataForm[elem['label'].replace(/ /g,'_')]['value'])  
      const query=this.dataForm[elem['label'].replace(/ /g,'_')]['value']
      const select_index=query.toUpperCase().indexOf('SELECT') + 7

      const select_from=query.toUpperCase().indexOf(' FROM')

      const col1=query.substring(select_index,select_from).split(',')

      const columns=col1.map((x:string)=> x.split(' ')[x.split(' ').length-1])

       this.dataForm[elem['label'].replace(/ /g,'_')]['columns']=columns ;

      console.log('  Query  >>>>>>>>>>> columns  ', columns)
    }
    
      

      
    })
   
    setTimeout(() => {
    console.log('  this.dataForm 2222222222222 ',this.dataForm)
    this.countChanged.emit(this.dataForm);
    },700);
   
    return 1;
  }
  


  //does not work 05/03/2023
  async callerFn(paramFile:any){

      
   await this.runCodeService.getFileHeaderByUserFolder(this.currentAction,paramFile).pipe(take(10))
    .toPromise()
    .then((data:any) => {
      //to be verififed
      this.fileContent = data?.content;

    });
    

 }


  updateProject(){
    console.log(' config Component  update Project Project Name before  ', this.projet_name)
   
    
    if (localStorage.getItem("projectConf")!.length >0){
    //let project =JSON.parse(localStorage.getItem("projectConf"))
    const projectConf = localStorage.getItem("projectConf");

    if ( projectConf !== null   ){
  
      let project=JSON.parse(localStorage.getItem("projectConf")!);
    

      console.log(' config Component  update Project Project Name after ',project['fileName'])
      this.projet_name = project?.fileName;
      this.projet_version = project['version'];
      this.projet_creationDate = project['update'];
      this.projet_createdBy = project['auteur'];}
    }else { 
      this.projet_name = '';
      this.projet_version = '';
      this.projet_creationDate = '';
      this.projet_createdBy = '';
     }
      if ( this.projet_name =="" ) this.projet_name="Not saved !!!"
      console.log(' this.projet ', this.projet_name) //, ' this.projet_name ', this.projet_name)


    //})


  }

  
  update(): void {
    console.log(' update :::::::::::::: ')
    this.currentModule=""//[]
    this.formInput.map(elem => {
      // this.myFormGroup.removeControl(elem['label']); // remove controls
       console.log(' update elem ',elem['label'])
       this.myFormGroup.removeControl(elem['label']); // remove controls
      // }
 
     })
 
    // console.log(' update this.dataForm 2 ',this.dataForm)
     //this.countChanged.emit(this.dataForm);
     this.static_controls.map(control => {
       this.myFormGroup.removeControl(control) // remove static control
     })


    console.log('  update ')
  }

  openProject(){} 
  saveProject(){}
  deleteProject(){}

}
