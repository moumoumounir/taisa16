const fs = require('fs');
var  jsonObject={};
formInput = [];
let myDate = new Date();

let today = myDate.getFullYear() + '-' + (('0' + (myDate.getMonth() + 1)).slice(-2)) + '-' + ('0' + myDate.getDate()).slice(-2);

    data = {
      action: 'action', id: 5, type: 'type', currentModule: 'module321', droppedModules: []
	 // ,       form: form
    }
	

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
//	for (var i in formInput) {

		//	console.log(" formInput ",JSON.stringify(formInput));
		        let keys = Object.keys(formInput)
		//		 console.log(" keys ",keys)
		
		//////////////////////////:    start HTML  /////////////////////////
		
	console.log("<div style=\"font-size: smaller;\">                         ");
    console.log("<form [formGroup]=\"myFormGroup\" (ngSubmit)=\"onSubmit()\">  ");
    console.log("  <div class=\"text-center\">                               ");
    console.log("  <legend> {{formTitle}}  </legend>                       ");
    console.log("   </div>                                                 ");
    console.log("  <BR />                                                  ");
    console.log("  <BR />                                                  ");
	console.log("  <BR />                                                  ");
		
		
		
		
	console.log("<div  class=\"col\">")
		console.log("<div>")
  
        
      for (var el = 0; el < keys.length; el++) {
		 // console.log(el ," formInput ",formInput[keys[el]])
        if (el % 2 == 0){
			
         // formInputLoop1.push(formInput[keys[el]])
		  
		  	if ( formInput[keys[el]]['type'] == "pickDate" ) {	  
	//console.log("	     <div  class=\"row col-10\">                                                                    ")
	console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
 
    console.log("          <mat-form-field>                                                                                                             ")
    console.log("              <input id=\"test\" class=\"field\"  matInput [matDatepicker]=\"picker\" placeholder=\""+ formInput[keys[el]]['label'] +"\" formControlName=\""+ formInput[keys[el]]['label'] +"\" >   ")
    console.log("              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>                                                 ")
    console.log("              <mat-datepicker #picker></mat-datepicker>                                                                                ")
    console.log("          </mat-form-field>                                                                                                            ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "startDate" ) {	
    //console.log("      <div class=\"row col-10\">                                                                     ")
    console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")

	
	console.log("            <mat-form-field>                                                                                                           ")
    console.log("                <input  id=\"test\" class=\"field\"  matInput [matDatepicker]=\"picker1\" placeholder=\"Start Date\" [formControl]=\"startDate\">                          ")
    console.log("                <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>                                              ")
    console.log("                <mat-datepicker #picker1></mat-datepicker>                                                                             ")
    console.log("            </mat-form-field>                                                                                                          ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "endDate" ) {	
    //console.log("      <div class=\"row col-10\">                                                                     ")
    console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
    console.log("          <mat-form-field>                                                                                                             ")
    console.log("              <input id=\"test\" class=\"field\"  matInput [matDatepicker]=\"picker2\" placeholder=\"End Date\"                                                         ")
    console.log("               [min]=\"startDate.value\" [formControl]=\"endDate\">                                                                        ")
    console.log("              <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>                                                ")
    console.log("              <mat-datepicker #picker2></mat-datepicker>                                                                               ")
    console.log("          </mat-form-field>                                                                                                            ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "password" ) {	
    console.log("      <div>                                                                                       ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("            ><b>"+ formInput[keys[el]]['label'] +"</b>                                                                                              ")
    console.log("            <img                                                                                                                       ")
    console.log("              class=\"info\"                                                                                                             ")
    console.log("              (click)=\"showHelp(form_elem.help)\"                                                                                       ")
    console.log("              src=\"assets/info.png\"                                                                                                    ")
    console.log("          /></label>                                                                                                                   ")
    console.log("          <input  class=\"field\"  type=\"password\" formControlName=\""+ formInput[keys[el]]['label'] +"\" />                                                            ")
    console.log("        </div>                                                                                                                         ")
	}
	if ( formInput[keys[el]]['type'] == "Nothing" ) {	
    console.log("        <div >                                                                                      ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("             for=\"test\"                                                                                                                ")
    console.log("            ><b></b>                                                                                                                   ")
    console.log("          </label>                                                                                                                     ")
    console.log("                                                                                                                                       ")
    console.log("                                                                                                                                       ")
    console.log("        </div>                                                                                                                         ")
    }
	if ( formInput[keys[el]]['type'] == "NothiNothingDateng" ) {	
	console.log("        <div >                                                                                  ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("             for=\"test\"                                                                                                                ")
    console.log("            ><b></b>                                                                                                                   ")
    console.log("          </label>                                                                                                                     ")
    console.log("                                                                                                                                       ")
    console.log("                                                                                                                                       ")
    console.log("        </div>                                                                                                                         ")
	}	  
		  

		  
		  
		  
		  if ( formInput[keys[el]]['type'] == "text" || formInput[keys[el]]['type'] == "number") {
		  console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
		  console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
              
           console.log("\t:<input  class=\"field\"  ")
		    if ( formInput[keys[el]]['disabled'] != undefined ){
		   console.log("\t[ngClass]=\"{'disable':"+formInput[keys[el]]['disabled']+",'enable':!"+formInput[keys[el]]['disabled']+"}\"")
		   console.log("\t[readonly]=\""+formInput[keys[el]]['disabled']+"\" ")
			}  
           console.log("\tid=\"test\"  type=\""+formInput[keys[el]]['type']+"\" ")
		   console.log("\tformControlName=\""+formInput[keys[el]]['label']+"\" >")
		   console.log("\t</div>");
		   //console.log("\t</div>");
		  
		  }
		  

		  if ( formInput[keys[el]]['type'] == "select" ){
         console.log("     <div>                                                                   ")
         console.log("       <label class=\"label\"                                                                ")
         console.log("         style=\"width: 30%\"                                                  ")
         console.log("         for=\"test\"                                                          ")
         console.log("         ><b>"+ formInput[keys[el]]['label']+"</b>                           ")
         console.log("       </label>                                                              ")
         console.log("       :<select                                                              ")
         console.log("         class=\"field\"                                                  ")
		 
		 if ( formInput[keys[el]]['disabled'] != undefined ){
		   console.log("         [attr.disabled]=\""+formInput[keys[el]]['disabled']+" == 1 ? '' : null\"               ")
		
		 
         console.log("         [attr.disabled]=\""+formInput[keys[el]]['disabled']+" == 1 ? '' : null\"               ") 
		 }
         console.log("         id=\"test\"                                                           ")
         console.log("         (change)=\"SelectOnChange($event.target)\"                            ")
         console.log("         formControlName=\""+formInput[keys[el]]['label']+"\"                ")
         console.log("       >                                                                     ")
         console.log("         <option value='' disabled selected>Select your option</option>      ")
         console.log("         <option                                                             ")
		 const st = ''+formInput[keys[el]]['paramValue'];
		 const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
        console.log("           *ngFor=\"let item of ",array,"\"           ")
        console.log("           [ngValue]=\"item\"                                                  ")
         console.log("         >                                                                   ")
         console.log("           {{ item }}                                                        ")
         console.log("         </option>                                                           ")
         console.log("       </select>                                                             ")
         console.log("     </div>                                                                  ")
         //console.log("   </div>                                                                    ")
		                                                                                         
		  }
		  
		  /////
		  

if ( formInput[keys[el]]['type'] == "selectMultiple" ) {	 
	console.log("<div>        ");
	console.log("  <label class=\"label\">       ");
	console.log("<b>"+ formInput[keys[el]]['label'] +"</b> </label>")

	console.log("  <mat-select                                           ");
	console.log("    class=\"field\"                                 ");
	console.log("\tformControlName=\""+formInput[keys[el]]['label']+"\" ")
	console.log("    multiple                                            ");
	console.log("    (ngModelChange)=\"onSelectMultipleChange($event)\"    ");
	console.log("  >                                                     ");
	console.log("    <mat-option                                         ");
	const st = ''+formInput[keys[el]]['paramValue'];
	const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
	console.log("           *ngFor=\"let topping of ",array,"\"           ")
	console.log("      [value]=\"topping\"                                 ");
	console.log("      >{{ topping }}</mat-option                        ");
	console.log("    >                                                   ");
	console.log("  </mat-select>                                         ");
	console.log("</div>                                                  ");
}
if ( formInput[keys[el]]['type'] == "checkbox" ) {
	console.log("<div>        ");
	console.log("  <label class=\"label\">     ");
	console.log("<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
	const st = ''+formInput[keys[el]]['paramValue'];
	const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
	console.log("           *ngFor=\"let block of ",array,"\"           ")
	console.log("    <input                                              ");
	console.log("      type=\"checkbox\"                                   ");
	console.log("      value=\"{{ block }}\"                               ");
	console.log("formControlName=\""+formInput[keys[el]]['label']+"\" >")
	console.log("      (change)=\"onCheckChangesNext($event)\"             ");
	console.log("    />{{ block }}                                       ");
	console.log("  </div>                                                ");
	console.log("</div>                                                  ");
}
	  
		  ////////
		  
		  
		} 
      }
	  console.log("</div>")
	  console.log("<div>")
	  for (var el = 0; el < keys.length; el++) {
		//  console.log(el ," formInput ",formInput[keys[el]])
        if (el % 2 != 0){
			
       //   formInputLoop1.push(formInput[keys[el]])
	if ( formInput[keys[el]]['type'] == "pickDate" ) {	  
    //console.log("      <div class=\"row col-10\">                                                                     ")
    console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
    console.log("          <mat-form-field>                                                                                                             ")
    console.log("              <input  id=\"test\" class=\"field\" matInput [matDatepicker]=\"picker\" placeholder="+ formInput[keys[el]]['label'] +" formControlName=\""+ formInput[keys[el]]['label'] +"\" >   ")
    console.log("              <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>                                                 ")
    console.log("              <mat-datepicker #picker></mat-datepicker>                                                                                ")
    console.log("          </mat-form-field>                                                                                                            ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "startDate" ) {	
    //console.log("      <div class=\"row col-10\">                                                                     ")
    console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
    console.log("            <mat-form-field>                                                                                                           ")
    console.log("                <input id=\"test\" class=\"field\"  matInput [matDatepicker]=\"picker1\" placeholder=\"Start Date\" [formControl]=\"startDate\">                          ")
    console.log("                <mat-datepicker-toggle matSuffix [for]=\"picker1\"></mat-datepicker-toggle>                                              ")
    console.log("                <mat-datepicker #picker1></mat-datepicker>                                                                             ")
    console.log("            </mat-form-field>                                                                                                          ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "endDate" ) {	
    //console.log("      <div class=\"row col-10\">                                                                     ")
    console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
	console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
    console.log("          <mat-form-field>                                                                                                             ")
    console.log("              <input  cid=\"test\" class=\"field\"lass=\"field\"  matInput [matDatepicker]=\"picker2\" placeholder=\"End Date\"                                                         ")
    console.log("               [min]=\"startDate.value\" [formControl]=\"endDate\">                                                                        ")
    console.log("              <mat-datepicker-toggle matSuffix [for]=\"picker2\"></mat-datepicker-toggle>                                                ")
    console.log("              <mat-datepicker #picker2></mat-datepicker>                                                                               ")
    console.log("          </mat-form-field>                                                                                                            ")
    console.log("      </div>                                                                                                                           ")
	}
	if ( formInput[keys[el]]['type'] == "password" ) {	
    console.log("      <div>                                                                                       ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("            ><b>"+ formInput[keys[el]]['label'] +"</b>                                                                                              ")
    console.log("            <img                                                                                                                       ")
    console.log("              class=\"info\"                                                                                                             ")
    console.log("              (click)=\"showHelp("+ formInput[keys[el]]['help'] +")\"                                                                                       ")
    console.log("              src=\"assets/info.png\"                                                                                                    ")
    console.log("          /></label>                                                                                                                   ")
    console.log("          <input  class=\"field\"  type=\"password\" formControlName=\""+ formInput[keys[el]]['label'] +"\" />                                                            ")
    console.log("        </div>                                                                                                                         ")
	}
	if ( formInput[keys[el]]['type'] == "Nothing" ) {	
    console.log("        <div >                                                                                      ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("             for=\"test\"                                                                                                                ")
    console.log("            ><b></b>                                                                                                                   ")
    console.log("          </label>                                                                                                                     ")
    console.log("                                                                                                                                       ")
    console.log("                                                                                                                                       ")
    console.log("        </div>                                                                                                                         ")
    }
	if ( formInput[keys[el]]['type'] == "NothiNothingDateng" ) {	
	console.log("        <div >                                                                                  ")
    console.log("          <label class=\"label\"                                                                                                                       ")
    console.log("             for=\"test\"                                                                                                                ")
    console.log("            ><b></b>                                                                                                                   ")
    console.log("          </label>                                                                                                                     ")
    console.log("                                                                                                                                       ")
    console.log("                                                                                                                                       ")
    console.log("        </div>                                                                                                                         ")
	}	  
		  
		  
		  
		  
		  
		  if ( formInput[keys[el]]['type'] == "text" || formInput[keys[el]]['type'] == "number") {
		  console.log("\t<div>\n\t<label class=\"label\"\n\tfor='test'>")
		  console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
              
           console.log("\t:<input  class=\"field\"  ")
		    if ( formInput[keys[el]]['disabled'] != undefined ){
		   console.log("\t[ngClass]=\"{'disable':"+formInput[keys[el]]['disabled']+",'enable':!"+formInput[keys[el]]['disabled']+"}\"")
		   console.log("\t[readonly]=\""+formInput[keys[el]]['disabled']+"\" ")
			}
  
           console.log("\tid=\"test\"  type=\""+formInput[keys[el]]['type']+"\" ")
		   console.log("\tformControlName=\""+formInput[keys[el]]['label']+"\">                ")
		   console.log("\t</div>");
		  
		  }
		  
		  if ( formInput[keys[el]]['type'] == "select" ){
         console.log("     <div>                                                                   ")
         console.log("       <label class=\"label\"                                                                ")
         console.log("         style=\"width: 30%\"                                                  ")
         console.log("         for=\"test\"                                                          ")
         console.log("         ><b>"+ formInput[keys[el]]['label']+"</b>                           ")
         console.log("       </label>                                                              ")
         console.log("       :<select                                                              ")
         console.log("         class=\"field\"                                                  ")
		 
		 if ( formInput[keys[el]]['disabled'] != undefined ){
		   console.log("         [attr.disabled]=\""+formInput[keys[el]]['disabled']+" == 1 ? '' : null\"               ")
		
		 
         console.log("         [attr.disabled]=\""+formInput[keys[el]]['disabled']+" == 1 ? '' : null\"               ") 
		 }
         console.log("         id=\"test\"                                                           ")
         console.log("         (change)=\"SelectOnChange($event.target)\"                            ")
         console.log("         formControlName=\""+formInput[keys[el]]['label']+"\"                ")
         console.log("       >                                                                     ")
         console.log("         <option value='' disabled selected>Select your option</option>      ")
         console.log("         <option                                                             ")
		 const st = ''+formInput[keys[el]]['paramValue'];
		 const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
        console.log("           *ngFor=\"let item of ",array,"\"           ")
        console.log("           [ngValue]=\"item\"                                                  ")
         console.log("         >                                                                   ")
         console.log("           {{ item }}                                                        ")
         console.log("         </option>                                                           ")
         console.log("       </select>                                                             ")
         console.log("     </div>                                                                  ")
         //console.log("   </div>                                                                    ")
		                                                                                         
		  }

		  
if ( formInput[keys[el]]['type'] == "selectMultiple" ) {	 
	console.log("<div>        ");
	console.log("  <label class=\"label\">       ");
	console.log("<b>"+ formInput[keys[el]]['label'] +"</b> </label>")

	console.log("  <mat-select                                           ");
	console.log("    class=\"field\"                                 ");
	console.log("\tformControlName=\""+formInput[keys[el]]['label']+"\" ")
	console.log("    multiple                                            ");
	console.log("    (ngModelChange)=\"onSelectMultipleChange($event)\"    ");
	console.log("  >                                                     ");
	console.log("    <mat-option                                         ");
	const st = ''+formInput[keys[el]]['paramValue'];
	const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
	console.log("           *ngFor=\"let topping of ",array,"\"           ")
	console.log("      [value]=\"topping\"                                 ");
	console.log("      >{{ topping }}</mat-option                        ");
	console.log("    >                                                   ");
	console.log("  </mat-select>                                         ");
	console.log("</div>                                                  ");
}
if ( formInput[keys[el]]['type'] == "checkbox" ) {
	console.log("<div>        ");
	console.log("  <label class=\"label\">     ");
	console.log("<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
	const st = ''+formInput[keys[el]]['paramValue'];
	const array = st.split(',').map(item => item.trim()).filter(item => item !== '');
	console.log("           *ngFor=\"let block of ",array,"\"           ")
	console.log("    <input                                              ");
	console.log("      type=\"checkbox\"                                   ");
	console.log("      value=\"{{ block }}\"                               ");
	console.log("formControlName=\""+formInput[keys[el]]['label']+"\" >")
	console.log("      (change)=\"onCheckChangesNext($event)\"             ");
	console.log("    />{{ block }}                                       ");
	console.log("  </div>                                                ");
	console.log("</div>                                                  ");
}

	
		  
		  
		} 
      }
		console.log("   </div>                                               ");

		  
		console.log("</div>")
		
	   for (var el = 0; el < keys.length; el++) {
	  		  	if ( formInput[keys[el]]['type'] == "textarea" ){	  
			console.log("	          <div class=\"row\">              ");
			console.log("       <label>                                           ");
			console.log("\t<b>"+ formInput[keys[el]]['label'] +"</b> </label>")
			console.log("       <textarea                                        ");
			console.log("         class=\"form-control\"                           ");
			console.log("         rows='3'                                       ");
			console.log("         cols='35'                                      ");
			console.log("         spellcheck=\"false\"                             ");
			console.log("         style=\"font-size: 10px\"                        ");
			if ( formInput[keys[el]]['disabled'] != undefined ){
					console.log("\t[readonly]=\""+formInput[keys[el]]['disabled']+"\" ")
			}
				console.log("\tformControlName=\""+formInput[keys[el]]['label']+"\"                ")
			console.log("       >                                                ");
			console.log("       </textarea>                                      ");
			console.log("     </div>                                             ");
			
		}
		
		if ( formInput[keys[el]]['type'] == "file" ) {
	console.log("<div>        ");
	console.log("  <label for=\"fileInput\">                               ");
	console.log("    <mat-icon  style=\"cursor: pointer;color:yellow\">folder</mat-icon> Choose a File : {{ selectedFileName}}                  ");
	console.log("  </label>                                                                                                                   ");
	console.log("  <input id=\"fileInput\" type=\"file\"  (change)=\"onFileChanged($event)\" style=\"display: none;\">                                ");
	console.log("                                                                                                                             ");
	console.log("  <div >                                                                                                                     ");
	console.log("    <br>                                                                                                                     ");
	console.log("          <div class=\"card \" *ngIf=\"selectedFileName !='' \" >                                                                ");
	console.log("              <div class=\"card-header\" id=\"header-finalizado\">Preview File :{{ selectedFileName }}</div>                     ");
	console.log("                  <div class=\"card-body\">                                                                                    ");
	console.log("                  <iframe  [src]=\"sanitizer.bypassSecurityTrustResourceUrl(fileBase64)\" width=\"80%\" height=\"200px\"></iframe> ");
	console.log("                                                                                                                             ");
	console.log("                  </div>                                                                                                     ");
	console.log("          </div>                                                                                                             ");
	console.log("    </div>                                                                                                                   ");
	console.log("                                                                                                                             ");
	console.log("</div>                                                                                                                       ");
}


if (formInput[keys[el]]['type'] == "ValueApiSelect" ) {
console.log("              <div>                                                                      ");
console.log("                <div                                                                     ");
console.log("                  *ngIf=\"spinerSelectedFieldpopUp\"                                       ");
console.log("                  class=\"wrapper\"                                                        ");
console.log("                  style=\"height: 20px; align-self: center\"                               ");
console.log("                >                                                                        ");
console.log("                  <mat-progress-spinner                                                  ");
console.log("                    style=\"left: 50%\"                                                    ");
console.log("                    class=\"inner\"                                                        ");
console.log("                    mode=\"indeterminate\"                                                 ");
console.log("                    diameter=\"40\"                                                        ");
console.log("                  ></mat-progress-spinner>                                               ");
console.log("                </div>                                                                   ");
console.log("                <div>                                                                    ");
console.log("                  <label class=\"label\"    >                                             ");
console.log("<b>"+ formInput[keys[el]]['label'] +"</b> </label>")

console.log("                  :<button                                                               ");
console.log("                    type=\"button\"                                                        ");
console.log("                    matTooltip=\"select file\"                                             ");
console.log("                    class=\"btn btn-default\"                                              ");
console.log("                    (click)=\"loadSelectionList('"+ formInput[keys[el]]['label'] +"')\"                               ");
console.log("                  >                                                                      ");
console.log("                    <mat-icon style=\"margin-top: 10%\">collections</mat-icon>             ");
console.log("                  </button>                                                              ");
console.log("                  <input                                                                 ");
console.log("                    style=\"                                                              ");
console.log("                      background-color: transparent;                                     ");
console.log("                      border: none;                                                      ");
console.log("                      outline: none;                                                     ");
console.log("                    \"                                                                    ");

if ( formInput[keys[el]]['disabled'] != undefined ){
		   console.log("[readonly]=\""+formInput[keys[el]]['disabled']+"\" ")
}
console.log("                    type=\"text\"                                                          ");
console.log("formControlName=\""+formInput[keys[el]]['label']+"\" >")
console.log("                </div>                                                                   ");
console.log("              </div>  ")
}

		
	   }		
		
	  
		console.log("	       <BR>																							");
		console.log("          <BR>                                                                                         ");
		console.log("              <div class=\"text-center\">                                                                ");
		console.log("                  <button type=\"submit\" class=\"btn btn-primary mr-1\">Register</button>&nbsp;&nbsp;     ");
		console.log("                  <button class=\"btn btn-secondary\" type=\"reset\" (click)=\"onReset()\">Cancel</button>   ");
		console.log("              </div>                                                                                   ");
		console.log("                                                                                                       ");
		console.log("                                                                                                       ");
		console.log("                                                                                                       ");
		console.log("    </form>                                                                                            ");
		console.log("  </div> ")
	  

	  
//	}
	
  } catch (jsonError) {
    console.error('Error parsing JSON:', jsonError);
  }
});






