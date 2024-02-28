    group = {};
    formInput = [];
    formInputLoop = [];
    //myFormGroup = new FormGroup(group);
    let myDate = new Date();

    let today = myDate.getFullYear() + '-' + (('0' + (myDate.getMonth() + 1)).slice(-2)) + '-' + ('0' + myDate.getDate()).slice(-2);

    data = {
      action: 'action', id: 5, type: 'type', currentModule: 'module321', droppedModules: []
	 // ,       form: form
    }
	
const fs = require('fs');
var  jsonObject={};
// Specify the path to your JSON file
const filePath = '../assets/dbObjectForm.json';

// Read the contents of the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data into a JavaScript object
     jsonObject = JSON.parse(data);

    // Now you can use the jsonObject as a regular JavaScript object
    //console.log('Parsed JSON object:', jsonObject);
	formInput = jsonObject["form"];
	
console.log("import {                                                                                                 ");
console.log("  Component,                                                                                             ");
console.log("  OnInit,                                                                                                ");
console.log("  Input,                                                                                                 ");
console.log("  Output,                                                                                                ");
console.log("  EventEmitter                                                                                           ");
console.log("} from '@angular/core';                                                                                  ");
console.log("import {                                                                                                 ");
console.log("  FormGroup,                                                                                             ");
console.log("  FormControl,                                                                                           ");
console.log("  FormBuilder,                                                                                           ");
console.log("  Validators,                                                                                            ");
console.log("  ValidatorFn,                                                                                           ");
console.log("  AbstractControl                                                                                        ");
console.log("} from '@angular/forms';                                                                                 ");
console.log("import { ThemePalette } from '@angular/material/core';                                                   ");
console.log("import { MatDialog, MatDialogConfig } from '@angular/material/dialog';                                   ");
console.log("import { HelpComponent } from 'src/app/components/help/help.component';                                  ");
console.log("import { MainService } from 'src/app/services/main.service';                                             ");
console.log("import { firstValueFrom } from 'rxjs';                                                                   ");
console.log("import { MatTableListComponent } from 'src/app/components/mat-table-list/mat-table-list.component'       ");
console.log("import { DomSanitizer } from '@angular/platform-browser';                                                ");
console.log("import { defaultIfEmpty } from 'rxjs/operators';                                                         ");
console.log("import { Location } from '@angular/common';                                                              ");


console.log("@Component({                                                                                               ");
console.log("  selector: 'app-data-object-crud',                                                                        ");
console.log("  templateUrl: './data-object-crud.component.html',                                                        ");
console.log("  styleUrls: ['./data-object-crud.component.css']                                                          ");
console.log("})                                                                                                         ");
console.log("                                                                                                           ");
console.log("                                                                                                           ");
console.log("export class DataObjectCrudComponent implements OnInit {	                                                ");
console.log("	                                                                                                        ");

console.log("  public displayedColumns = [];                                                                              ");
console.log("  selectedFileName: string = '';                                                                             ");
console.log("                                                                                                             ");
console.log("  myFormGroup: FormGroup;                                                                                    ");
console.log("  selectedDate: Date = new Date();                                                                           ");
console.log("  FilterColumnType: boolean = false;                                                                         ");
console.log("  group: any = {};                                                                                           ");
console.log("  formInput: any[] = [];                                                                                     ");
console.log("  formInputLoop: any[] = [];                                                                                 ");
console.log("  formInputLoop1: any[] = [];                                                                                ");
console.log("  formInputLoop2: any[] = [];                                                                                ");
console.log("  filename: String = '';                                                                                     ");
console.log("  uploadFilePath?: File;                                                                                     ");
console.log("  fileBase64: any;                                                                                           ");
console.log("  csv: string = '';                                                                                          ");
console.log("  UploadDirectory: any = '';                                                                                 ");
console.log("  submitLabel: string = 'validate';                                                                           ");
console.log("  csvFolder: string[] = [];//| null = null;                                                                  ");
console.log("  public multipleSelectedValue: string[] = [];                                                               ");
console.log("                                                                                                             ");
console.log("  startDate: FormControl = new FormControl(new Date());                                                      ");
console.log("  endDate: FormControl = new FormControl(new Date());                                                        ");
console.log("  public spinerSelectedField: boolean = false                                                                ");
console.log("  public spinerSelectedFieldpopUp: boolean = false;                                                          ");
console.log("                                                                                                             ");
console.log("  color: ThemePalette = 'primary';                                                                           ");
console.log("  disabled: boolean = false;                                                                                 ");
console.log("  multiple: boolean = false;                                                                                 ");
console.log("  accept: string = '';                                                                                       ");
console.log("                                                                                                             ");
console.log("                                                                                                             ");
console.log("  constructor(public matDialog: MatDialog, //private localStorageService: LocalstorageService,               ");
console.log("    private mainService: MainService,                                                                        ");
console.log("    //private formBuilder: FormBuilder,                                                                      ");
console.log("    public sanitizer: DomSanitizer,                                                                          ");
console.log("    private location :Location) {                                                                            ");
console.log("                                                                                                             ");
console.log("    this.myFormGroup = new FormGroup(this.group);                                                            ");
console.log("    this.accept = '';                                                                                        ");
console.log("                                                                                                             ");
                                                                                                      

	
//    console.log('myFormGroup: FormGroup;\ngroup: any = {};');
//	console.log('this.myFormGroup = new FormGroup(this.group)');
	
	for (var i in formInput) {

        //console.log(i, ' ', formInput[i]['label'], ' ', JSON.stringify(formInput[i]));
        if (formInput[i]['hide'] != 1) {
          //if ( formInput[i]['label'].replace(/ /g, '_') != 'Date' ) 
         // formInputLoop.push(formInput[i])
          console.log("this.group['"+formInput[i]['label']+"'] = new FormControl('')")

		  }
	}
	console.log("  }  ")
	
console.log("  dataForm: any = []                                                                      ")
console.log("  currentAction: string = '';                                                             ")
console.log("  data: {                                                                                 ")
console.log("    action: string, id: number, type: string, currentModule: string, droppedModules: [],  ")
console.log("    form: any                                                                             ")
console.log("  } = {                                                                                   ")
console.log("    action: '', id: 0, type: '', currentModule: '', droppedModules: [],                   ")
console.log("      form: {}                                                                            ")
console.log("    }                                                                                     ")
console.log("  //@Input() message: [];                                                                 ")
console.log("  @Input() echangeObject: any;                                                            ")
console.log("                                                                                          ")
console.log("  @Output() countChanged: EventEmitter<any> = new EventEmitter();                         ")
console.log("                                                                                          ")
console.log("  public dataConf: any = {};                                                              ")
console.log("                                                                                          ")
console.log("  public form: any = {};                                                                  ")
console.log("  public formTitle: string = '';                                                          ")
console.log("  public echangeData: any = {};                                                           ")
console.log("  public sheet: string = \"dataObject\"                                                     ")

	
	console.log("  async ngOnInit() { ")
	

		console.log("    if (this.echangeObject != undefined && this.echangeObject['data'] != undefined){  ");
		console.log("       this.echangeData = this.echangeObject['data']                                  ");
		console.log("       this.location.replaceState('/ListDataObject/'+this.echangeData['Ref_Object'])  ");
		console.log("    }                                                                                 ");
	
		for (var i in formInput) {
		  
		  if (formInput[i]['validator'] != undefined) {
            let validator = formInput[i]['validator']
            //let vt:ValidatorFn=eval(st);
            //    for ( let vt in validator){
            // stringPatternValidator
            console.log('validatorName ', formInput[i]['label'], '  ', formInput[i]['validator'])
           // this.myFormGroup.controls[this.formInput[i]['label']].setValidators(this.getValidators(validator))
            //  }
          }
		   if (formInput[i]['required'] == 1) {
             console.log("this.myFormGroup.controls['"+formInput[i]['label']+"'].setValidators(Validators.required)");
          }
		  
	            }
			
			console.log("if ( this.echangeObject.action.toUpperCase() == 'ADD') {")
			for (var i in formInput) {
			 
            let value = formInput[i]['value']
            if (typeof formInput[i]['value'] === 'string') {
              if (formInput[i]['value'].toUpperCase() == 'SYSDATE' /*&& this.echangeObject.action.toUpperCase() == 'ADD'*/) {
                let myDate = new Date()

                value = myDate//.getFullYear() + '-' + (myDate.getMonth()+1) + '-' + ('0' + myDate.getDate()).slice(-2) ;
              //  console.log(myDate, this.formInput[i]['value'], ' sysdate ', value)
              }
              if (formInput[i]['value'].toUpperCase().includes('LOCALSTORAGE') /* && this.echangeObject.action.toUpperCase() == 'ADD' */) {

                value = eval(this.formInput[i]['value']);
               // console.log(this.formInput[i]['value'], ' localStorage ', value)
                //
              }
             // console.log(' value ' + value)
              console.log("this.myFormGroup.controls['"+formInput[i]['label']+"'].setValue('"+value+"')");
            }
			

			
			
			
			
			}
			console.log("}")
						console.log("if ( this.echangeObject.action.toUpperCase() != 'ADD') {")
			for (var i in formInput) {
			 
           console.log(" if (this.echangeData['"+formInput[i]['label'].replace(/ /g, '_')+"'] != undefined) {");
          console.log(" this.myFormGroup.controls['"+formInput[i]['label']+"'].setValue(this.echangeData['"+formInput[i]['label'].replace(/ /g, '_')+"'])");
 
 			if (formInput[i]['type'] == 'startDate') {
            console.log("let value = new Date(this.echangeData['"+formInput[i]['label'].replace(/ /g, '_')+"'])")
            console.log("this.startDate.setValue(value)")
            //console.log(this.formInput[i]['value'], ' *startDate ***  ', this.myFormGroup.controls[this.formInput[i]['label']])

          }
          if (formInput[i]['type'] == 'endDate') {
            console.log("let value = new Date(this.echangeData['"+formInput[i]['label'].replace(/ /g, '_')+"'])")
			console.log("this.endDate.setValue(value)")
           

          }
 
 
         console.log(" } ")
			}
			console.log("}")
			
			console.log("}")
			
			
			formInputLoop1=[]
			formInputLoop2=[]
		//	console.log(" formInput ",JSON.stringify(formInput));
		   //     let keys = Object.keys(formInput)
		//		 console.log(" keys ",keys)
		
		//////////////////////////:    start HTML  /////////////////////////
		

	  
	  
		//  console.log(" formInputLoop1 ",formInputLoop1)
		//   console.log(" formInputLoop2 ",formInputLoop2)
		
		///////////////////////////////////////////
		
		
	//	   console.log("   formInput ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ",JSON.stringify(formInput));
   // formInput.map(elem => {
	   console.log("  async onSubmit() {");
			  for ( var elem in formInput ){
				 if (formInput[i]['hide'] != 1) {
				 console.log(" this.dataForm['"+elem.replace(/ /g, '_')+"']=this.myFormGroup.get('"+formInput[elem]['label']+"')?.value")
					} 
			  }	
			  
		console.log("	  let data = this.buildOjectFromDataForm(this.dataForm)                   ");  	  
		console.log("	  data['Attached_File'] = this.selectedFileName; "); 
		console.log("      data['base64'] = this.fileBase64;             ");
		console.log("      console.log('  this.dataForm length 0000000', JSON.stringify(data))    ");
		console.log("      this.spinerSelectedField = true;	             ");
			  
		console.log("    if (this.echangeObject.action == 'add') {                                                ");
		console.log("      let responseData = await this.insertJsonDataToSheet(data)                              ");
		console.log("    }                                                                                        ");
		console.log("    if (this.echangeObject.action == 'update' || this.echangeObject.action == 'details') {   ");
		console.log("      let responseData = await this.updateJsonDataToSheet(data)                              ");
		console.log("    }                                                                                        ");


		console.log("      this.spinerSelectedField = false;                                      ");
		console.log("      this.countChanged.emit(this.dataForm);                                 ");
		console.log("      return 0                                                               ");

		console.log(" } ");	

		console.log("  public async insertJsonDataToSheet(data: any): Promise<any> {                                                                               ");
		console.log("    try {                                                                                                                                     ");
		console.log("      const response = await firstValueFrom(this.mainService.insertJsonDataToSheet(data, this.sheet).pipe(defaultIfEmpty('default value')));  ");
		console.log("      return response;                                                                                                                        ");
		console.log("    } catch (error) {                                                                                                                         ");
		console.log("      console.error('Error updating JSON data:', error);                                                                                      ");
		console.log("      throw error;                                                                                                                            ");
		console.log("    }                                                                                                                                         ");
		console.log("  }                                                                                                                                           ");
	   
		console.log("  public async updateJsonDataToSheet(data: any): Promise<any> {                                                                               ");
		console.log("    try {                                                                                                                                     ");
		console.log("      const response = await firstValueFrom(this.mainService.updateJsonDataToSheet(data, this.sheet).pipe(defaultIfEmpty('default value')));  ");
		console.log("      return response;                                                                                                                        ");
		console.log("    } catch (error) {                                                                                                                         ");
		console.log("      console.error('Error updating JSON data:', error);                                                                                      ");
		console.log("      throw error;                                                                                                                            ");
		console.log("    }                                                                                                                                         ");
		console.log("  }                                                                                                                                           ");
																																								   

		console.log("  async loadSelectionList(label: any) {                                      ");
		console.log("                                                                             ");
		console.log("    {                                                                        ");
		console.log("      const dialogConfig = new MatDialogConfig();                            ");
		console.log("      //The user can't close the dialog by clicking outside its body         ");
		console.log("      //dialogConfig.disableClose = true;                                    ");
		console.log("      console.log(' openFolderServerModal  ')                                ");
		console.log("      dialogConfig.position = { top: '0%', left: '20%' }                     ");
		console.log("      dialogConfig.id = \"modal-component\";                                 ");
		console.log("      dialogConfig.height = \"800px\";                                       ");
		console.log("      dialogConfig.width = \"800px\";                                        ");
		console.log("      dialogConfig.autoFocus = false;                                        ");
		console.log("      dialogConfig.height = '100%';                                          ");
		console.log("      this.spinerSelectedFieldpopUp = true;                                  ");
		console.log("                                                                             ");
		console.log("      let echangeData: any = {}                                              ");
		console.log("      let val = await this.getDataForSelect()                                ");
		console.log("      this.spinerSelectedFieldpopUp = false;                                 ");
		console.log("      console.log('  getAllUsers ', JSON.stringify(val))                     ");
		console.log("                                                                             ");
		console.log("      echangeData['data'] = val;                                             ");
		console.log("      echangeData['displayedColumns'] = ['Designation', 'Statut'];           ");
		console.log("      echangeData['actionColumns'] = ['Action']                              ");
		console.log("                                                                             ");
		console.log("      dialogConfig.data = echangeData;                                       ");
		console.log("                                                                             ");
		console.log("      const modalDialog = this.matDialog.open(MatTableListComponent          ");
		console.log("        , dialogConfig); // load the help component                          ");
		console.log("      modalDialog.afterClosed().subscribe(result => {                        ");
		console.log("          let value=JSON.parse(result.data)['data'][0]['Designation'];       ");
		console.log("        console.log(this.myFormGroup,' close dialog ', value);               ");
		console.log("        this.myFormGroup.controls[label].setValue(value);                    ");
		console.log("                                                                             ");
		console.log("      });                                                                    ");
		console.log("    }                                                                        ");
		console.log("                                                                             ");
		console.log("  }                                                                          ");


		console.log("  async  getDataForSelect(): Promise<any> {                                                                                       ");
		console.log("    let o = {}                                                                                                                    ");
		console.log("    let sheet = 'Composant'                                                                                                       ");
		console.log("    //return this.mainService.getDataByCols(sheet, o).toPromise();                                                                ");
		console.log("    try {                                                                                                                         ");
		console.log("          const response = await firstValueFrom(this.mainService.getDataByCols(sheet, o).pipe(defaultIfEmpty('default value')));  ");
		console.log("          return response;                                                                                                        ");
		console.log("    } catch (error) {                                                                                                             ");
		console.log("      console.error('Error updating JSON data:', error);                                                                          ");
		console.log("      throw error;                                                                                                                ");
		console.log("    }                                                                                                                             ");
		console.log("  }                                                                                                                               ");



																																								   
		console.log("  buildOjectFromDataForm(obj: any) {                     ");
		console.log("    var data: any = {}                                   ");
		console.log("    if (Object.keys(this.echangeData).length > 1) {      ");
		console.log("      let id = this.sheet + '_id'                        ");
		console.log("      data[id] = this.echangeData[id]                    ");
		console.log("    }                                                    ");
		console.log("    for (var el in obj) {                                ");
		console.log("      console.log(el, obj[el])                  ");
		console.log("      data[el] = obj[el]                        ");
		console.log("    }                                                    ");
		console.log("    return data                                          ");
		console.log("  }                                                      ");
			   
		console.log(" getObjectString(obj: any) {       ")
		console.log("                                   ")
		console.log("    return Object.keys(obj)        ")
		console.log("  }                                ")
		console.log("                                   ")
		console.log("  onReset() {                      ")
		console.log("    this.countChanged.emit(null);  ")
		console.log("    return 0                       ")
		console.log("  }                                ")

		console.log("  cancel() {                                 ")
		console.log("    this.countChanged.emit(this.dataForm);   ")
		console.log("  }                                          ")

		console.log("  download() {                                                  ")
		console.log("    let vfileToBeName = this.echangeData['Attached_File']       ")
		console.log("    const source = this.echangeData['base64'];                  ")
		console.log("    const link = document.createElement(\"a\");                   ")
		console.log("    link.href = source;                                         ")
		console.log("    link.download = `${vfileToBeName}`                          ")
		console.log("    link.click();                                               ")
		console.log("                                                                ")
		console.log("  }                                                             ")
		console.log("                                                                ")
		console.log("  uploadFile(file: File) {                                      ")
		console.log("                                                                ")
		console.log("    const uploadData = new FormData();                          ")
		console.log("                                                                ")
		console.log("    let filename = file                                         ")
		console.log("    let user: string = localStorage.getItem('user')!;           ")
		console.log("    uploadData.append('filename', filename);                    ")
		console.log("    uploadData.append('folder', this.UploadDirectory);          ")
		console.log("    uploadData.append('user', user);                            ")
		console.log("    console.log(' uploadFile ', uploadData)                     ")
		console.log("                                                                ")
		console.log("  }                                                             ")
		console.log("                                                                ")
		console.log("                                                                ")
		console.log("  onFolderChanged(event: any) {                                 ")
		console.log("    console.log(' onFolderChanged ', event.target.files)        ")
		console.log("    var filesSelected = event.target.files                      ")
		console.log("    let output = document.getElementById(\"listing\");            ")
		console.log("    var tmpArr = [];                                            ")
		console.log("                                                                ")
		console.log("    for (let item of filesSelected) {                           ")
		console.log("                                                                ")
		console.log("      tmpArr.push(item.webkitRelativePath)                      ")
		console.log("    }                                                           ")
		console.log("    this.csvFolder = tmpArr; // get the file name               ")
		console.log("  }                                                             ")

		console.log("  onFileChanged(event: any) {                                                        ");
		console.log("    this.uploadFilePath = event.target.files[0]; // get the file name                ");
		console.log("    if ( this.uploadFilePath != undefined)                                           ");
		console.log("    this.selectedFileName = this.uploadFilePath.name;                                ");
		console.log("                                                                                     ");
		console.log("    var reader = new FileReader();                                                   ");
		console.log("                                                                                     ");
		console.log("    if (this.uploadFilePath instanceof File) {                                       ");
		console.log("      const reader = new FileReader();                                               ");
		console.log("                                                                                     ");
		console.log("      reader.onload = (event) => {                                                   ");
		console.log("        if (event.target?.result) {                                                  ");
		console.log("          this.fileBase64 = event.target.result.toString();                          ");
		console.log("          console.log(this.fileBase64);                                              ");
		console.log("        }                                                                            ");
		console.log("      };                                                                             ");
		console.log("                                                                                     ");
		console.log("      reader.readAsDataURL(this.uploadFilePath);                                     ");
		console.log("    } else {                                                                         ");
		console.log("      console.error(\"Upload file path is undefined or not a File.\");                 ");
		console.log("    }                                                                                ");
		console.log("                                                                                     ");
		console.log("  }                                                                                  ");

		console.log("  onSelectMultipleChange(event: any) {    ");
		console.log("    this.multipleSelectedValue = event;   ");
		console.log("  }                                       ");

		console.log("  SelectOnChange(event: any) {                                                                                         ");
		console.log("     this.FilterColumnType = event.value.toUpperCase().includes('DATE') || event.value.toUpperCase().includes('DAY')   ");
		console.log("  }                                                                                                                    ");

		console.log("  showHelp(help: any) {                                                                                    ");
		console.log("    const dialogConfig = new MatDialogConfig();                                                            ");
		console.log("    dialogConfig.id = \"modal-help\";                                                                        ");
		console.log("    dialogConfig.height = \"450px\";                                                                         ");
		console.log("    dialogConfig.width = \"800px\";                                                                          ");
		console.log("    dialogConfig.data = help // pass help variable to the helpcomponent                                    ");
		console.log("    const modalDialog = this.matDialog.open(HelpComponent, dialogConfig); // load the help component       ");
		console.log("                                                                                                           ");
		console.log("  }                                                                                                        ");
				

		
		
console.log("\n\n\n  }                                          ")
	//////////////////////////////:   add here 
	
	    formInput = []
    //submitLabel='Close'
    if (!(typeof data['form'] === 'undefined')) {
      console.log('  data form   ', JSON.stringify(data['form']))
      const dataFormClone = cloneDeep(data['form']);

      dataForm = dataFormClone
      formInput = Object.values(jsonObject);
      

      for (var i in formInput) {

        console.log(i, ' ', formInput[i]['label'], ' ', JSON.stringify(formInput[i]));
        if (formInput[i]['hide'] != 1) {
          //if ( formInput[i]['label'].replace(/ /g, '_') != 'Date' ) 
          formInputLoop.push(formInput[i])
          group[formInput[i]['label']] = new FormControl('')

          if (formInput[i]['type'] == "file") {
            selectedFileName = echangeData[formInput[i]['label'].replace(/ /g, '_')] || '';
            fileBase64 = echangeData['base64']
            console.log('selectedFileName  ', selectedFileName, ' fileBase64 ', fileBase64)

          }
          if (formInput[i]['validator'] != undefined) {
            let validator = formInput[i]['validator']
            //let vt:ValidatorFn=eval(st);
            //    for ( let vt in validator){
            // stringPatternValidator
            console.log('validatorName ', formInput[i]['label'], '  ', formInput[i]['validator'])
           // myFormGroup.controls[formInput[i]['label']].setValidators(getValidators(validator))
            //  }
          }

          if (formInput[i]['validator_pattern1'] != undefined) {
            let validator = formInput[i]['validator_pattern']
            //let vt:ValidatorFn=eval(st);
            //    for ( let vt in validator){
            // stringPatternValidator

            //   myFormGroup.controls[formInput[i]['label']].get   (stringPatternValidator(validator))
            //  }
          }


          if (formInput[i]['required'] == 1) {
            myFormGroup.controls[formInput[i]['label']].setValidators(Validators.required)
          }
          if (echangeData[formInput[i]['label'].replace(/ /g, '_')] != undefined) {
            myFormGroup.controls[formInput[i]['label']].setValue(echangeData[formInput[i]['label'].replace(/ /g, '_')])
            console.log(echangeData[formInput[i]['label'].replace(/ /g, '_')], ' *startDat ', myFormGroup.controls[formInput[i]['label']])

          } else {
            let value = formInput[i]['value']
            if (typeof formInput[i]['value'] === 'string') {
              if (formInput[i]['value'].toUpperCase() == 'SYSDATE' && echangeObject.action.toUpperCase() == 'ADD') {
                let myDate = new Date()

                value = myDate//.getFullYear() + '-' + (myDate.getMonth()+1) + '-' + ('0' + myDate.getDate()).slice(-2) ;
                console.log(myDate, formInput[i]['value'], ' sysdate ', value)
              }
              if (formInput[i]['value'].toUpperCase().includes('LOCALSTORAGE') && echangeObject.action.toUpperCase() == 'ADD') {

                value = eval(formInput[i]['value']);
                console.log(formInput[i]['value'], ' localStorage ', value)
                //
              }
              console.log(' value ' + value)
              myFormGroup.controls[formInput[i]['label']].setValue(value)
            }

          }


          if (formInput[i]['type'] == 'startDate') {
            let value = new Date(echangeData[formInput[i]['label'].replace(/ /g, '_')])
            startDate.setValue(value)
            console.log(formInput[i]['value'], ' *startDate ***  ', myFormGroup.controls[formInput[i]['label']])

          }
          if (formInput[i]['type'] == 'endDate') {
            let value = new Date(echangeData[formInput[i]['label'].replace(/ /g, '_')])
            endDate.setValue(value)

            //console.log( i, ' *startDate ***  ', myFormGroup.controls[formInput[i]['label']] ) 

          }

        }
      }
      //  prepare data for two column 

    }// else formInput = []
    spinerSelectedFieldpopUp=false;
	
	

	
	/////////////////////////////////////////
	
	
  } catch (jsonError) {
    console.error('Error parsing JSON:', jsonError);
  }
});






