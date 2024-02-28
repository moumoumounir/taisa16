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
  AbstractControl
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HelpComponent } from 'src/app/components/help/help.component';
import { MainService } from 'src/app/services/main.service';
import { firstValueFrom } from 'rxjs';
import { MatTableListComponent } from 'src/app/components/mat-table-list/mat-table-list.component'
import { DomSanitizer } from '@angular/platform-browser';
import { defaultIfEmpty } from 'rxjs/operators';
import { Location } from '@angular/common';
@Component({
  selector: 'app-data-object-crud',
  templateUrl: './data-object-crud.component.html',
  styleUrls: ['./data-object-crud.component.css']
})


export class DataObjectCrudComponent   implements OnInit {

  public displayedColumns = [];
  selectedFileName: string = '';

  myFormGroup: FormGroup;
  selectedDate: Date = new Date();
  FilterColumnType: boolean = false;
  group: any = {};
  formInput: any[] = [];
  formInputLoop: any[] = [];
  formInputLoop1: any[] = [];
  formInputLoop2: any[] = [];
  filename: String = '';
  uploadFilePath?: File;
  fileBase64: any;
  csv: string = '';
  UploadDirectory: any = '';
  submitLabel: string = 'validate';
  csvFolder: string[] = [];//| null = null;
  public multipleSelectedValue: string[] = [];

  startDate: FormControl = new FormControl(new Date());
  endDate: FormControl = new FormControl(new Date());
  public spinerSelectedField: boolean = false
  public spinerSelectedFieldpopUp: boolean = false;

  color: ThemePalette = 'primary';
  disabled: boolean = false;
  multiple: boolean = false;
  accept: string = '';


  constructor(public matDialog: MatDialog, //private localStorageService: LocalstorageService,
    private mainService: MainService,
    //private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private location :Location) {

    this.myFormGroup = new FormGroup(this.group);
    this.accept = '';

this.group['Ref Object'] = new FormControl('')
this.group['Short Description'] = new FormControl('')
this.group['Type'] = new FormControl('')
this.group['Parent'] = new FormControl('')
this.group['Data Owner'] = new FormControl('')
this.group['Long Description'] = new FormControl('')
  }
  dataForm: any = []
  currentAction: string = '';
  data: {
    action: string, id: number, type: string, currentModule: string, droppedModules: [],
    form: any
  } = {
    action: '', id: 0, type: '', currentModule: '', droppedModules: [],
      form: {}
    }
  //@Input() message: [];
  @Input() echangeObject: any;

  @Output() countChanged: EventEmitter<any> = new EventEmitter();

  public dataConf: any = {};

  public form: any = {};
  public formTitle: string = '';
  public echangeData: any = {};
  public sheet: string = "dataObject"
  async ngOnInit() {
    if (this.echangeObject != undefined && this.echangeObject['data'] != undefined){
       this.echangeData = this.echangeObject['data']
       this.location.replaceState('/ListDataObject/'+this.echangeData['Ref_Object'])
    }
this.myFormGroup.controls['Short Description'].setValidators(Validators.required)
if ( this.echangeObject.action.toUpperCase() == 'ADD') {
this.myFormGroup.controls['Ref Object'].setValue('')
this.myFormGroup.controls['Short Description'].setValue('')
this.myFormGroup.controls['Type'].setValue('DB')
this.myFormGroup.controls['Parent'].setValue('BI')
this.myFormGroup.controls['Data Owner'].setValue('')
this.myFormGroup.controls['Long Description'].setValue('')
}
if ( this.echangeObject.action.toUpperCase() != 'ADD') {
 if (this.echangeData['Ref_Object'] != undefined) {
 this.myFormGroup.controls['Ref Object'].setValue(this.echangeData['Ref_Object'])
 }
 if (this.echangeData['Short_Description'] != undefined) {
 this.myFormGroup.controls['Short Description'].setValue(this.echangeData['Short_Description'])
 }
 if (this.echangeData['Type'] != undefined) {
 this.myFormGroup.controls['Type'].setValue(this.echangeData['Type'])
 }
 if (this.echangeData['Parent'] != undefined) {
 this.myFormGroup.controls['Parent'].setValue(this.echangeData['Parent'])
 }
 if (this.echangeData['Data_Owner'] != undefined) {
 this.myFormGroup.controls['Data Owner'].setValue(this.echangeData['Data_Owner'])
 }
 if (this.echangeData['Long_Description'] != undefined) {
 this.myFormGroup.controls['Long Description'].setValue(this.echangeData['Long_Description'])
 }
}
}
  async onSubmit() {
 this.dataForm['Ref_Object']=this.myFormGroup.get('Ref Object')?.value
 this.dataForm['Short_Description']=this.myFormGroup.get('Short Description')?.value
 this.dataForm['Type']=this.myFormGroup.get('Type')?.value
 this.dataForm['Parent']=this.myFormGroup.get('Parent')?.value
 this.dataForm['Data_Owner']=this.myFormGroup.get('Data Owner')?.value
 this.dataForm['Long_Description']=this.myFormGroup.get('Long Description')?.value
          let data = this.buildOjectFromDataForm(this.dataForm)
          data['Attached_File'] = this.selectedFileName;
      data['base64'] = this.fileBase64;
      console.log('  this.dataForm length 0000000', JSON.stringify(data))
      this.spinerSelectedField = true;
    if (this.echangeObject.action == 'add') {
      let responseData = await this.insertJsonDataToSheet(data)
    }
    if (this.echangeObject.action == 'update' || this.echangeObject.action == 'details') {
      let responseData = await this.updateJsonDataToSheet(data)
    }
      this.spinerSelectedField = false;
      this.countChanged.emit(this.dataForm);
      return 0
 }
  public async insertJsonDataToSheet(data: any): Promise<any> {                                                         
    try {                                                                                                               
      const response = await firstValueFrom(this.mainService.insertJsonDataToSheet(data, this.sheet).pipe(defaultIfEmpty('default value')));
      return response;                                                                                                  
    } catch (error) {                                                                                                   
      console.error('Error updating JSON data:', error);                                                                
      throw error;                                                                                                      
    }                                                                                                                   
  }                                                                                                                     
  public async updateJsonDataToSheet(data: any): Promise<any> {                                                         
    try {                                                                                                               
      const response = await firstValueFrom(this.mainService.updateJsonDataToSheet(data, this.sheet).pipe(defaultIfEmpty('default value')));
      return response;                                                                                                  
    } catch (error) {                                                                                                   
      console.error('Error updating JSON data:', error);                                                                
      throw error;                                                                                                      
    }                                                                                                                   
  }                                                                                                                     
  async loadSelectionList(label: any) {

    {
      const dialogConfig = new MatDialogConfig();
      //The user can't close the dialog by clicking outside its body
      //dialogConfig.disableClose = true;
      console.log(' openFolderServerModal  ')
      dialogConfig.position = { top: '0%', left: '20%' }
      dialogConfig.id = "modal-component";
      dialogConfig.height = "800px";
      dialogConfig.width = "800px";
      dialogConfig.autoFocus = false;
      dialogConfig.height = '100%';
      this.spinerSelectedFieldpopUp = true;

      let echangeData: any = {}
      let val = await this.getDataForSelect()
      this.spinerSelectedFieldpopUp = false;
      console.log('  getAllUsers ', JSON.stringify(val))

      echangeData['data'] = val;
      echangeData['displayedColumns'] = ['Designation', 'Statut'];
      echangeData['actionColumns'] = ['Action']

      dialogConfig.data = echangeData;

      const modalDialog = this.matDialog.open(MatTableListComponent
        , dialogConfig); // load the help component
      modalDialog.afterClosed().subscribe(result => {
          let value=JSON.parse(result.data)['data'][0]['Designation'];
        console.log(this.myFormGroup,' close dialog ', value);
        this.myFormGroup.controls[label].setValue(value);

      });
    }

  }
  async  getDataForSelect(): Promise<any> {                                                                             
    let o = {}                                                                                                          
    let sheet = 'Composant'                                                                                             
    //return this.mainService.getDataByCols(sheet, o).toPromise();                                                      
    try {                                                                                                               
          const response = await firstValueFrom(this.mainService.getDataByCols(sheet, o).pipe(defaultIfEmpty('default value')));
          return response;                                                                                              
    } catch (error) {                                                                                                   
      console.error('Error updating JSON data:', error);                                                                
      throw error;                                                                                                      
    }                                                                                                                   
  }                                                                                                                     
  buildOjectFromDataForm(obj: any) {
    var data: any = {}
    if (Object.keys(this.echangeData).length > 1) {
      let id = this.sheet + '_id'
      data[id] = this.echangeData[id]
    }
    for (var el in obj) {
      console.log(el, obj[el])
      data[el] = obj[el]
    }
    return data
  }
 getObjectString(obj: any) {

    return Object.keys(obj)
  }

  onReset() {
    this.countChanged.emit(null);
    return 0
  }
  cancel() {
    this.countChanged.emit(this.dataForm);
  }
  download() {
    let vfileToBeName = this.echangeData['Attached_File']
    const source = this.echangeData['base64'];
    const link = document.createElement("a");
    link.href = source;
    link.download = `${vfileToBeName}`
    link.click();

  }

  uploadFile(file: File) {

    const uploadData = new FormData();

    let filename = file
    let user: string = localStorage.getItem('user')!;
    uploadData.append('filename', filename);
    uploadData.append('folder', this.UploadDirectory);
    uploadData.append('user', user);
    console.log(' uploadFile ', uploadData)

  }


  onFolderChanged(event: any) {
    console.log(' onFolderChanged ', event.target.files)
    var filesSelected = event.target.files
    let output = document.getElementById("listing");
    var tmpArr = [];

    for (let item of filesSelected) {

      tmpArr.push(item.webkitRelativePath)
    }
    this.csvFolder = tmpArr; // get the file name
  }
  onFileChanged(event: any) {
    this.uploadFilePath = event.target.files[0]; // get the file name
    if ( this.uploadFilePath != undefined)
    this.selectedFileName = this.uploadFilePath.name;

    var reader = new FileReader();

    if (this.uploadFilePath instanceof File) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          this.fileBase64 = event.target.result.toString();
          console.log(this.fileBase64);
        }
      };

      reader.readAsDataURL(this.uploadFilePath);
    } else {
      console.error("Upload file path is undefined or not a File.");
    }

  }
  onSelectMultipleChange(event: any) {
    this.multipleSelectedValue = event;
  }
  SelectOnChange(event: any) {
     this.FilterColumnType = event.value.toUpperCase().includes('DATE') || event.value.toUpperCase().includes('DAY')
  }
  showHelp(help: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-help";
    dialogConfig.height = "450px";
    dialogConfig.width = "800px";
    dialogConfig.data = help // pass help variable to the helpcomponent
    const modalDialog = this.matDialog.open(HelpComponent, dialogConfig); // load the help component

  }



  }