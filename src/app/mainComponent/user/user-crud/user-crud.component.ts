
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
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
  SelectControlValueAccessor,
  Validator
} from '@angular/forms';
import bsCustomFileInput from 'bs-custom-file-input';
//declare const bsCustomFileInput: any;
import { ThemePalette } from '@angular/material/core';
import { cloneDeep } from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HelpComponent } from 'src/app/components/help/help.component';
import { EchangeData  } from 'src/app/_interface/EchangeData';
import { MainService } from 'src/app/services/main.service';
import { HttpClient } from '@angular/common/http';

import { Location } from '@angular/common';

import { firstValueFrom } from 'rxjs';

import { MatTableListComponent } from 'src/app/components/mat-table-list/mat-table-list.component'

import { DomSanitizer } from '@angular/platform-browser';
import { defaultIfEmpty } from 'rxjs/operators';


@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.css']
})


export class UserCrudComponent implements OnInit {

//public listData : EchangeData ={displayedColumns:[],data:[],actionColumns:[],actionButton:{},type:'df'}
   
    public displayedColumns = [];
     selectedFileName:string="";
  
     myFormGroup: FormGroup;
     selectedDate: Date = new Date();
     FilterColumnType:boolean =false;
    group:any = {};
    formInput: any[]=[];
    formInputLoop: any[]=[];
    formInputLoop1: any[]=[];
    formInputLoop2: any[]=[];
    //title: String;
    filename : String='';
    uploadFilePath?:File;
	fileBase64:any;
    csv:string='';
    UploadDirectory:any="";
    submitLabel:string="validate"
    csvFolder:string[]= [] ;//| null = null;
    public multipleSelectedValue:string[]=[]; 
    
    startDate : FormControl = new FormControl(new Date());
    endDate : FormControl = new FormControl(new Date());
    public spinerSelectedField:boolean=false
	  public spinerSelectedFieldpopUp:boolean=false;

    color: ThemePalette = 'primary';
    disabled: boolean = false;
    multiple: boolean = false;
    accept: string='';

  
    constructor(public matDialog: MatDialog, //private localStorageService: LocalstorageService, 
      private mainService :MainService, 
      private formBuilder: FormBuilder,
      public sanitizer:DomSanitizer,
      private httpClient:HttpClient,
      private location:Location) {
  
      this.myFormGroup = new FormGroup(this.group);
      this.accept='';
      
    }
    //cronstrue1=""
    dataForm:any=[]
     currentAction: string='';
    //addFilterButton:Boolean=false;
    data: {action:string,id:number,type:string,currentModule:string,droppedModules:[],
    form: any  }={action:'',id:0,type:'',currentModule:'',droppedModules:[],
      form: {}}
    //@Input() message: [];
    @Input() echangeObject: any ;
  
    @Output() countChanged: EventEmitter<any> =   new EventEmitter();
    
    public dataConf : any={};
  
    public form : any={};
    public formTitle:string="";
    public echangeData:any={};
  public  sheet:string='user'
 
 
    public getJson(): Promise<any>{
      // let paramString1='colName=Ref_Request&colValue='+this.echangeData['Ref_Request']+'&sheet=userRequestValidation'
      console.log(' json  getJson ')  
      return this.httpClient.get("assets/dbUserForm.json").toPromise()
   }
    async  ngOnInit() {

      bsCustomFileInput.init()
      console.log(' this.echangeObject  ',this.echangeObject) 
      if ( this.echangeObject['data'] != undefined )       this.echangeData=this.echangeObject['data']
       
      this.dataConf = await this.getJson()
	  
		this.form=this.dataConf['form']
	  
      this.formTitle=this.dataConf['TitleFormObject']
      console.log(this.formTitle,' this.dataConf  ',this.dataConf)  

           
      
      this.group = {};
      this.formInput=[];
      this.formInputLoop=[];
      this.myFormGroup = new FormGroup(this.group);
      let myDate: Date = new Date();
  
       let today = myDate.getFullYear() + '-' + (('0' + (myDate.getMonth()+1)).slice(-2)) + '-' + ('0' + myDate.getDate()).slice(-2) ;  
  
          this.data ={action:'action',id:5,type:'type',currentModule:'module321',droppedModules:[],
          form: this.form  }
   
      this.formInput = []
      //this.submitLabel='Close'
        if (!(typeof this.data['form'] === 'undefined')) {
          const dataFormClone = cloneDeep(this.data['form']);
    
          this.dataForm = dataFormClone
          this.formInput = Object.values(dataFormClone);
  
   
          for (var i in this.formInput) {
          
           console.log(i, ' ',this.formInput[i]['label'])
            if (this.formInput[i]['hide'] != 1) {
              //if ( this.formInput[i]['label'].replace(/ /g, '_') != 'Date' ) 
              this.formInputLoop.push(this.formInput[i])
              this.group[this.formInput[i]['label']] = new FormControl('')
				  
            if ( this.formInput[i]['type'] == "file"){
               this.selectedFileName=this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')]||'';
               this.fileBase64=this.echangeData['base64']
               console.log('selectedFileName  ',this.selectedFileName,' this.fileBase64 ',this.fileBase64)

            }
            if (this.formInput[i]['validator'] != undefined){
              let validator=this.formInput[i]['validator'] 
              //let vt:ValidatorFn=eval(st);
          //    for ( let vt in validator){
             // stringPatternValidator
              console.log('validatorName ',this.formInput[i]['label'],'  ',this.formInput[i]['validator'] )
              this.myFormGroup.controls[this.formInput[i]['label']].setValidators(this.getValidators(validator))
            //  }
            }

            if (this.formInput[i]['validator_pattern1'] != undefined){
              let validator=this.formInput[i]['validator_pattern'] 
              //let vt:ValidatorFn=eval(st);
          //    for ( let vt in validator){
             // stringPatternValidator

           //   this.myFormGroup.controls[this.formInput[i]['label']].get   (this.stringPatternValidator(validator))
            //  }
            }


             if (this.formInput[i]['required'] == 1){
                  this.myFormGroup.controls[this.formInput[i]['label']].setValidators(Validators.required)
                }
              if (this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')] != undefined) { 
                 this.myFormGroup.controls[this.formInput[i]['label']].setValue(this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')])
                 console.log(this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')], ' *startDat ', this.myFormGroup.controls[this.formInput[i]['label']])

                }else {
                  let value=this.formInput[i]['value']
                  if ( typeof this.formInput[i]['value'] ==='string' ){
                  if (this.formInput[i]['value'].toUpperCase()=='SYSDATE' && this.echangeObject.action.toUpperCase() == 'ADD' ){
                    let myDate = new Date()
                    
                     value=myDate//.getFullYear() + '-' + (myDate.getMonth()+1) + '-' + ('0' + myDate.getDate()).slice(-2) ;
                     console.log(myDate,this.formInput[i]['value'],' sysdate ',value)
                  }
                  if (this.formInput[i]['value'].toUpperCase().includes('LOCALSTORAGE') && this.echangeObject.action.toUpperCase() == 'ADD' ){
                   
                     value=eval(this.formInput[i]['value']) ;
                     console.log(this.formInput[i]['value'],' localStorage ',value)
    //
                  }
                  this.myFormGroup.controls[this.formInput[i]['label']].setValue(value)
                }
          
               }
  
  
              if (this.formInput[i]['type'] == 'startDate') {
                let value=new Date(this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')])
                this.startDate.setValue(value)
                console.log(this.formInput[i]['value'], ' *startDate ***  ', this.myFormGroup.controls[this.formInput[i]['label']])
  
              }
              if (this.formInput[i]['type'] == 'endDate') {
                let value=new Date(this.echangeData[this.formInput[i]['label'].replace(/ /g, '_')])
                this.endDate.setValue(value)
  
                //console.log( i, ' *startDate ***  ', this.myFormGroup.controls[this.formInput[i]['label']] ) 
  
              }
  
            }   
          }
          //  prepare data for two column 
          let keys=Object.keys(this.formInputLoop)
          for (var el = 0 ; el < this.formInputLoop.length;el++ ){
             if ( el  % 2 == 0 )
             this.formInputLoop1.push(this.formInputLoop[el])
             else
             this.formInputLoop2.push(this.formInputLoop[el])
             }
         } else this.formInput = []
  
      
         };
  
    onSelectMultipleChange(event:any){
       this.multipleSelectedValue=event;
  
    }
  

	
	async loadSelectionList(form_elem:any){

      {
        console.log(' loadSelectionList ',JSON.stringify(form_elem))
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
        this.spinerSelectedFieldpopUp=true;
        
		let echangeData:any={}
        let val = await this.getDataForSelect()
        this.spinerSelectedFieldpopUp=false;
        console.log('  getAllUsers ', JSON.stringify(val))

        echangeData['data']=val;
        echangeData['displayedColumns'] = ['Designation','Statut'];
        echangeData['actionColumns']=[ 'Action']

        dialogConfig.data = echangeData;

        const modalDialog = this.matDialog.open(MatTableListComponent
		, dialogConfig); // load the help component
        modalDialog.afterClosed().subscribe(result => {
            // if(result.event == 'Add'){
            console.log(' close dialog ', JSON.parse(result.data)['data'][0]['Designation'])
             this.myFormGroup.controls[form_elem.label].setValue(JSON.parse(result.data)['data'][0]['Designation'])
      
          });   
    }

    }

	
	
	
	
   
   public getDataForSelect(): Promise<any>{
    let o={}
		let sheet='Composant'
     return   this.mainService.getDataByCols(sheet,o).toPromise();
//this.usuariosService.updateUserRequestValidation(this.crudData).subscribe(resultat => {
     //  return  this.mainService.getAllRowsSheet('Composant').toPromise()
       
    //return this.mainService.updateJsonDataToSheet(data,'dataObject').toPromise()
    }
  
  
SelectOnChange(event:any){
  console.log(' SelectOnChange   ',event.value, ' SelectOnChange ')
this.FilterColumnType=event.value.toUpperCase().includes('DATE') || event.value.toUpperCase().includes('DAY')
}
  
  pickerEvent(event:any){
     this.selectedDate=event.value;
     this.myFormGroup.controls['Filter Value'].setValue(this.selectedDate.getFullYear() + '-' + (this.selectedDate.getMonth()+1) + '-' + ('0' + this.selectedDate.getDate()).slice(-2));
  }
  
  
	onFileChanged(event: any) {
		console.log(' onFileChanged ',event.target.files[0]) 
		this.uploadFilePath = event.target.files[0]; // get the file name  
    this.selectedFileName!=this.uploadFilePath?.name;
		
		  var reader = new FileReader();
		
		// Assuming uploadFilePath is of type File | undefined
// Assuming uploadFilePath is of type File | undefined
if (this.uploadFilePath instanceof File) {
  const reader = new FileReader();

  reader.onload = (event) => {
    if (event.target?.result) {
      this.fileBase64 = event.target.result.toString();
      // Now this.fileBase64 contains the base64 representation of the file
      console.log(this.fileBase64);
    }
  };

  reader.readAsDataURL(this.uploadFilePath);
} else {
  console.error("Upload file path is undefined or not a File.");
}



	  }

    getValidators(validatorStrings: string[]) {
      const validators = [];
  
      for (const validatorString of validatorStrings) {
        const [validatorName, validatorParam] = validatorString.split('(');
        const param = validatorParam ? validatorParam.replace(')', '') : '';
        console.log(' validatorName ',validatorName,'  ',param)
        if (validatorName === 'required') {
          validators.push(Validators.required);
        } else if (validatorName === 'minLength') {
          console.log(' validatorName minLength ',parseInt(param, 10))
          validators.push(Validators.minLength(parseInt(param, 10)));
        }else if (validatorName === 'maxLength') {
          validators.push(Validators.maxLength(parseInt(param, 10)));
        }else if ( validatorName == "stringPatternValidator"){
          validators.push(this.stringPatternValidator(param));

        }
        // Add more validators as needed
  
        // You can also handle custom validators here
  
      }
  
      return validators;
    }

    stringPatternValidator(stringPattern: string): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
    
        if (Validators.required(control)) {
          return null; // Don't validate if the field is empty, required validator will handle that
        }
        let pattern: RegExp=new RegExp(stringPattern);
        if (!pattern.test(value)) {
          return { Pattern: true };
        }
    
        return null;
      };
    }
   
  
  
    patternValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } => {
         if (!control.value) {
          console.log(' patternValidator  !!!! control.value  NULLLLL ',control.value)
          return {};
        }
        if (!control.value.toUpperCase().includes('SELECT') || 
        !control.value.toUpperCase().includes('FROM') ) {
          console.log('patternValidator control.value.dont includes("select or from ")  ')
          control.setErrors({ invalidQuery: true });
          return { invalidQuery: true };
        } else 
        {
        return {};
        }
      };
    }
  
    download(){
    let vfileToBeName =this.echangeData['Attached_File']
      const source = this.echangeData['base64'];
      const link = document.createElement("a");
      link.href = source;
      link.download = `${vfileToBeName}`
      link.click();

    }
     
    uploadFile(file:File){
  
      const uploadData = new FormData();
        
      let filename = file
       let user:string=localStorage.getItem('user')!;
      uploadData.append('filename', filename);
      uploadData.append('folder', this.UploadDirectory);
      uploadData.append('user',user);
      console.log(' uploadFile ',uploadData)
  
    }
    
  
    onFolderChanged(event: any) { 
      console.log(' onFolderChanged ',event.target.files)
      var filesSelected=event.target.files
      let output = document.getElementById("listing");
      var tmpArr=[];
  
      for (let item of filesSelected) {
    
         tmpArr.push( item.webkitRelativePath)
      }
      this.csvFolder = tmpArr ; // get the file name 
    }
  
    // help modal
    showHelp(help:any)
    { 
      /*
      help["image"]="info.jpg";
      help["text_top"]=" Top Top Top "
      help["text_bottom"]=" Bottom  "
     
  
      */
      const dialogConfig = new MatDialogConfig();
      dialogConfig.id = "modal-help"; 
      dialogConfig.height = "450px";
      dialogConfig.width = "800px";
      dialogConfig.data = help // pass help variable to the helpcomponent
      const modalDialog = this.matDialog.open(HelpComponent, dialogConfig); // load the help component
     
    }
  
    isSelected(data:any){
  
      console.log(' isSelected  ',data)
    }
    
    // onchange checkbox function for "next"
    onCheckChangesNext(event: any) {
      // get the form array "next" and add data in every changes
      // const formArrayNext: FormArray = this.myFormGroup.get('next') as FormArray;
  
      this.formInput.map(elem => {
        console.log(' elem ',elem)
        if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'checkbox') {
          let ar: string[] = [];
           ar = this.dataForm[elem['label'].replace(/ /g, '_')]['valueSelected']
          console.log(' el ', event.target.value, '   at  ', ar.indexOf(event.target.value))
          if (ar.indexOf(event.target.value) >= 0 && !event.target.checked) {
            console.log(' remove ', event.target.value, '   at  ', ar.indexOf(event.target.value))
            ar.splice(ar.indexOf(event.target.value), 1);
          }
  
          if (ar.indexOf(event.target.value) == -1 && event.target.checked) ar.push(event.target.value);

          this.dataForm[elem['label'].replace(/ /g, '_')]['valueSelected'] = ar
		
          //  skipped error 16/01/2023
          //this.dataForm[0]['valueSelected'] = ar
          console.log(elem['label'], 'value  ', this.dataForm[elem['label'].replace(/ /g, '_')]['valueSelected'])
        }
  
      })
    }
  
    cancel() { 
      this.countChanged.emit(this.dataForm);
    }
  
   buildOjectFromDataForm(obj:any){
    var data:any={}
    if ( Object.keys(this.echangeData).length > 1 ){
		let id=this.sheet+'_id'
      data[id]=this.echangeData[id]
    }
    for (var el in obj){
      console.log(el,obj[el]['value'])
      data[el]=obj[el]['value']
    }
    return data 
   }
  
    async onSubmit() {
    // check validation form  
    for (var i in this.formInputLoop) {
      if (!this.myFormGroup.controls[this.formInputLoop[i]['label']].valid ){
      alert(this.myFormGroup.controls[this.formInputLoop[i]['label']]+'  Form Submitted Error : '+'    '+this.formInputLoop[i]["label"])
      return 0
       }
    }
  
   
      
      let filename = this.csv // get the file name 
	  
        console.log(' elem ',JSON.stringify(this.formInputLoop))
        console.log(' this.dataForm ',JSON.stringify(this.dataForm))
        this.formInputLoop.map(elem => {
  
          console.log(elem['label'],'elem ',this.dataForm[elem['label']])

          if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'text' ||
            this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'textarea') {
  
            let tmpText = this.myFormGroup.get(elem['label'])?.value//.replace(/'/g,'~').replace(/"/g,'~')
            this.dataForm[elem['label'].replace(/ /g, '_')].value = tmpText;
          } else
            if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] != 'checkbox' &&
              this.dataForm[elem['label'].replace(/ /g, '_')]['type'] != 'selectMultiple' &&
              this.dataForm[elem['label'].replace(/ /g, '_')]['type'] != 'savefile' &&
              !elem['label'].includes('Repertoire')) {
                console.log('elem  value ! text ',elem['label'].replace(/ /g, '_'))
              this.dataForm[elem['label'].replace(/ /g, '_')].value = this.myFormGroup.get(elem['label'])?.value
            }
          if (elem['label'].includes('fichier1')) {
            this.dataForm[elem['label'].replace(/ /g, '_')].value = this.filename //csv['name']
          }
          if (elem['label'].includes('Repertoire')) {
            this.dataForm[elem['label'].replace(/ /g, '_')].value = this.csvFolder
            //console.log(' fichier   ffffffffff  ',JSON.stringify(this.myFormGroup.get(elem['label'])))
          }
          if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'selectMultiple') {
            this.dataForm[elem['label'].replace(/ /g, '_')].value = this.multipleSelectedValue
          }

           if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'pickDate'  ||  
           elem['label'] == "Date"
         // ||           this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'startDate' 
         // ||           this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'endDate'
          ) {
         
            let pdate=new Date(this.dataForm[elem['label'].replace(/ /g, '_')].value )
            console.log(elem['label'].replace(/ /g, '_'),' Date |||| ',pdate)
            this.dataForm[elem['label'].replace(/ /g, '_')].value=pdate.getFullYear() + '-' + ('0' +(pdate.getMonth()+1)).slice(-2)  + '-' + ('0' + pdate.getDate()).slice(-2) 
 
        }

        if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'startDate'  ) {
                console.log(' this.startDate ',this.startDate)
                let sdate=new Date(this.startDate.value)
                this.dataForm[elem['label'].replace(/ /g, '_')].value=sdate.getFullYear() + '-' + ('0' +(sdate.getMonth()+1)).slice(-2)  + '-' + ('0' + sdate.getDate()).slice(-2) 
     
            }
        if (this.dataForm[elem['label'].replace(/ /g, '_')]['type'] == 'endDate') {
          let  edate=new Date(this.endDate.value)
          this.dataForm[elem['label'].replace(/ /g, '_')].value=edate.getFullYear() + '-' + ('0' +(edate.getMonth()+1)).slice(-2)  + '-' + ('0' + edate.getDate()).slice(-2) 
         
            }
        })

     
      if (this.echangeObject.action =="add"){
        
        let data =this.buildOjectFromDataForm(this.dataForm)
        console.log('  this.dataForm length 0000000',JSON.stringify(data))
        /*await this.mainService.insertJsonDataToSheet(data,'dataObject').subscribe(data => {   
         
         console.log(' retour 0000000',data);
        }
        ) */
        this.spinerSelectedField=true
		    console.log(' base64 ' ,this.fileBase64);
        data["Attached_File"]=this.selectedFileName;
        data["base64"]=this.fileBase64;
		

        let responseData = await this.insertJsonDataToSheet(data)
        this.spinerSelectedField=false
        let help:any={}
        /*help["image"]="info.jpg";
        help["text_top"]=" Top Top Top "
        help["text_bottom"]=" Bottom  "
        this.showHelp(help)*/
        console.log(' before   getAll test ',responseData)
        this.countChanged.emit(this.dataForm);
        return 0 
      }
      if (this.echangeObject.action =="details"){ 
        let data =this.buildOjectFromDataForm(this.dataForm)
        console.log(JSON.stringify(this.echangeData),'  this.dataForm length 0000000',JSON.stringify(data))
        /*await this.mainService.insertJsonDataToSheet(data,'dataObject').subscribe(data => {   
         
         console.log(' retour 0000000',data);
        }
        ) */
        this.spinerSelectedField=true
        let responseData = await this.updateJsonDataToSheet(data)
        this.spinerSelectedField=false
        console.log(' before   getAll test ',responseData)
      this.countChanged.emit(this.dataForm); 
      return 0   
      }

      if (this.echangeObject.action =="update"){ 
        let data =this.buildOjectFromDataForm(this.dataForm)
        console.log(JSON.stringify(this.echangeData),'  this.dataForm length 0000000',JSON.stringify(data))
		data["Attached_File"]=this.selectedFileName;
        data["base64"]=this.fileBase64;
        /*await this.mainService.insertJsonDataToSheet(data,'dataObject').subscribe(data => {   
         
         console.log(' retour 0000000',data);
        }
        ) */
        this.spinerSelectedField=true
        let responseData = await this.insertJsonDataToSheet(data)
        this.spinerSelectedField=false
        console.log(' before   getAll test ',responseData)
      this.countChanged.emit(this.dataForm); 
      return 0   
      }
      return 0
    }
   
    public insertJsonDataToSheet(data: any): Promise<any> {
      // let paramString1='colName=Ref_Request&colValue='+this.echangeData['Ref_Request']+'&sheet=userRequestValidation'
  
      return this.mainService.insertJsonDataToSheet(data, this.sheet).toPromise()
    }
  
    public async updateJsonDataToSheet(data: any): Promise<any> {
      try {
        console.log(this.sheet, ' update data', JSON.stringify(data));
        const response = await firstValueFrom(this.mainService.updateJsonDataToSheet(data, this.sheet).pipe(defaultIfEmpty('default value')));
        return response;
      } catch (error) {
        console.error('Error updating JSON data:', error);
        throw error;
      }
    }
  
    ngAfterViewInit (){
  
     /* for (var i in this.formInputLoop) {
            
        console.log(this.myFormGroup.controls[this.formInputLoop[i]['label']], 'required ',this.myFormGroup.get(this.formInputLoop[i]['label'])['error'])
         
  
        }*/
      if ( localStorage.getItem('data') != null ) {
        //this.updateProject()
        }
    
    }
    
 getObjectString(obj:any){

  return Object.keys(obj)
 }

    onReset() {

      //location.replace('/ListUser');

      this.countChanged.emit(null); 
      return 0   
  }
    
    
    
   
  }
  

