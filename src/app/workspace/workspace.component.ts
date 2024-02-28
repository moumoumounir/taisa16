import swal from 'sweetalert2';
//import { FolderTreeComponent } from './../folder-tree/folder-tree.component';
import { EchangeData } from 'src/app/_interface/EchangeData';
import { EchangeDataConf } from 'src/app/_interface/EchangeDataConf'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, ViewChild, ElementRef, OnInit , AfterViewInit, HostListener} from "@angular/core";
import { cloneDeep, replace } from 'lodash';
import { RunCodeService } from '../services/run-code.service';
import { PlotComponent } from '../plot/plot.component';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ModuleApiService } from '../shared/module-api.service';
import { BehaviorService } from '../shared/behavior.service';
import { ConfigComponent } from '../config/config.component';
//import { SelectColumnFramComponent } from '../select-column-fram/select-column-fram.component'; 
//import { saveAs } from 'file-saver';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';
//import { saveAs } from 'file-saver';
import { SaveComponent } from 'src/app/save/save.component';
import { FileTreeComponent } from 'src/app/components/file-tree/file-tree.component';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

export interface IBox {
  selected?: boolean;
  ships?: number;
};

export interface dataColumnDf {
  selected?: boolean;
  ships?: number;
};


@Component({
selector: 'app-workspace',
templateUrl: './workspace.component.html',
styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {

  
  public board: Array<Array<any>> = []
  public widthBox = 25;//-10;
  public boardWidth = 15; //hauteur
  public boardLarge = 25;//+10;  //largeur
  public gridLarge = 600;
  public gridWith = 900;
  public selectedColor = "rgb(161, 152, 152)"; //"#ff0000"
  public primaryColor = "#ffffff"
  public selectedButton = '';
  public exceptionCode=0
  public mainScreen=true;
  public lastExecusionIdModule='';
  public showConf=true; //false
  public showModule=true; //false
  public largeColMain="col-7";
  public systemSelectedValue="";
  public extend=">";
  public reduce="<";
  public langage="Python";

  //public modules: any[]; //all modules
  public  message: []=[];
  myDate: Date = new Date();
  stringDate: string;
  public logInfoFlag=true
  public logInfoFlagGo=false
  public getScreenWidth: any;
  public getScreenHeight: any;
  public statDataDf:any[]=[] 
   

  constructor(public matDialog: MatDialog,
    public httpclient: HttpClient, 
    private runCodeService:RunCodeService,
    public send: BehaviorService,
    public loadApi: ModuleApiService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { 
    this.subscription = new Subscription();
    this.stringDate = this.myDate.getFullYear() + '-' + (this.myDate.getMonth()+1) + '-' + ('0' + this.myDate.getDate()).slice(-2) ;
  
  }

  @ViewChild('cdkBoard', { read: ElementRef, static: false }) public boardElement:any;
  @ViewChild(ConfigComponent, { static: false })  childC!: ConfigComponent;
  //@ViewChild(SelectColumnFramComponent, { static: false }) childSelectCol: SelectColumnFramComponent;
      //@ViewChild(SelectColumnAggFramComponent, { static: false }) childSelectAggCol: SelectColumnAggFramComponent;
      //@ViewChild(SelectColumnFramComponent, { static: false }) childColumn: SelectColumnFramComponent;
 

  showChild: boolean = true;

  subscription: Subscription;
  intervalId: number=0;

plateformForm = this.formBuilder.group({
  plateform: ['SQL'],
});
  public index: number = -1;

  public traitModule :any[]= [
    { id:13,name:"pythonCode", action:"pythonCode",type:"treat","origin":"local",previous:[],columns:[],initColumns:[],form:{Python_Code:{type:'textarea',label:'Python Code',value:'#use previous df as  df_previousModule and current as df_currentModule \ndf_currentModule=df_previousModule \n #for series use df_currentModule=series.to_frame(name=vals).reset_index() \n#for value to dataFrame  d={val:[val]}  df_currentModule=pd.DataFrame.from_dict(d)',paramValue:'',help:""}}, size: 1, next: [], outPutColumns:[],img:"assets/python.png", color: "white","description":"Python Code"},
    { id:21,name:"aggGroupBy", action:"aggGroupBy", type:"treat",  paramValue:[["Agg_Column"]]  ,previous:[], size: 1, next: [], outPutColumns:[],img:"assets/agg.png", color: "white" ,columns:[],initColumns:[],aggColumns:[],form:{Function:{type:'select',label:'Function',value:'',paramValue:['count','sum','max','min','moyenne1'],help:""},Agg_Column:{type:'select',label:'Agg Column',value:'',paramValue:[''],help:""}},groupByField:["id"],verbeField:["'montant': 'sum'"],top:50, left:100},
    { id:23,name:"ImpalaAgg", action:"ImpalaAgg", type:"treat", paramValue:[["Agg_Column"]],previous:[], size: 1, next: [], outPutColumns:[],img:"assets/ImpalaAgg.png", color: "white" ,columns:[],initColumns:[],aggColumns:[],form:{Function:{type:'select',label:'Function',value:'',paramValue:['count','sum','max','min','moyenne2','ecartype'],help:""},Agg_Column:{type:'select',label:'Agg Column',value:'',paramValue:[''],help:""},Impala_Code:{type:'textarea',label:'Impala Code',value:'',paramValue:'',help:""}},groupByField:["id"],verbeField:["'montant': 'sum'"],top:50, left:100},
    { id:13,name:"ImpalaLimit", action:"ImpalaLimit",type:"treat","origin":"local",previous:[],next: [],columns:[],initColumns:[],form:{Row_Number:{type:'text',label:'Row Number',value:'',paramValue:[],help:""}}, size: 1, outPutColumns:[],img:"assets/ImpalaLimit.png", color: "white","description":"Python Code"},
    { id:20,name:"filter",action:"filter", type:"treat", previous:[],paramValue:[["Filter_Column"]], size: 1, next: [], outPutColumns:[],form:{Filter_Column:{type:'select',label:'Filter Column',value:'',paramValue:[],help:""},Filter_Condition:{type:'select',label:'Filter Condition',value:'',paramValue:['==','!=','>','>=','<=','<'],help:""},Filter_Value:{type:'text',label:'Filter Value',value:'',paramValue:[],help:""}},columns:[],initColumns:[], img:"assets/dfilter.png", color: "white" ,column:"id",condition:">=2",top:50, left:100},
    { id:22,name:"Impala",action:"Impala", type:"treat", previous:[],paramValue:[["Filter_Column"]], size: 1, next: [], outPutColumns:[],form:{Filter_Column:{type:'select',label:'Filter Column',value:'',paramValue:[],help:""},Filter_Condition:{type:'select',label:'Filter Condition',value:'',paramValue:['=','!=','>','>=','<=','<','like'],help:""},Filter_Value:{type:'text',label:'Filter Value',value:'',paramValue:[],help:""},Impala_Code:{type:'textarea',label:'Impala Code',value:'',paramValue:'',help:""}},columns:[],initColumns:[], img:"assets/impalaFilter.png", color: "white" ,column:"id",condition:">=2",top:50, left:100},
   // { id: 3,name:"concat", type:"treat", action:"concat", paramValue:[[]],previous:[], size: 1, next: [],img:"assets/concat.png",columns:[], initColumns:[],outPutColumns:[],form:{How:{type:'select',label:'How',value:'',paramValue:['left','append'],help:""}}, color: "white" ,column:"id",condition:">=2",top:50, left:100},
    { id: 3,name:"concat", type:"treat", action:"concat", paramValue:[[]],previous:[], size: 1, next: [],img:"assets/concat.png",columns:[], initColumns:[],outPutColumns:[],form:{}, color: "white" ,column:"id",condition:">=2",top:50, left:100},
    
    { id: 3,name:"setIndex", type:"treat", action:"setIndex", paramValue:[["Column"]],previous:[], size: 1, next: [],img:"assets/concat.png",columns:[], initColumns:[],outPutColumns:[],form:{Column:{type:'select',label:'Column',value:'',paramValue:[],help:""},Python_Code:{type:'textarea',label:'Python Code',value:'#use previous df as  df_previousModule and current as df_currentModule \ndf_currentModule=df_previousModule \ndf_currentModule=df_previousModule \ndf_currentModule.set_index("$Value")',help:""}}, color: "white" ,column:"id",condition:">=2",top:50, left:100}, 
    { id: 3,name:"sort", type:"treat", action:"pythonCode", paramValue:[["Column"]],previous:[], size: 1, next: [],img:"assets/concat.png",columns:[], initColumns:[],outPutColumns:[],form:{Column:{type:'select',label:'Column',value:'',paramValue:[],help:""},Python_Code:{type:'textarea',label:'Python Code',value:'#use previous df as  df_previousModule and current as df_currentModule \ndf_currentModule=df_previousModule  \ndf_currentModule.sort_values(by="$Value", inplace=True)',help:""}}, color: "white" ,column:"id",condition:">=2",top:50, left:100}, 
  
    //{ id: 3,name:"concatFiles", type:"treat", action:"concatFiles",link_from:['folderInput'], paramValue:[[]],previous:[],form:{Separateur:{type:'text',label:'Separateur',value:',',paramValue:[]}}, size: 1, next: [],img:"assets/concatFiles.png", outPutColumns:[], color: "white" ,columns:[],initColumns:[],top:50, left:100},
    { id: 4,name:"fillna",  type:"treat", action: "fillna",paramValue:[["fillNa_Column"]] , previous:[], size: 1, next: [],img:"assets/fillNa1.png",columns:[],initColumns:[], outPutColumns:[],form:{fillNa_Column:{type:'selectMultiple',label:'fillNa Column',value:'',paramValue:[],help:""},fillNa_Value:{type:'select',label:'fillNa Value',value:'',paramValue:['min','max','mean','0','1','-1'],help:""}}, color: "white" ,df_field:"Group",value_na:"'Gp'",top:50, left:200 },
    { id: 4,name:"dropNa",  type:"treat", action: "Code_dropNa",paramValue:[[]] , previous:[], size: 1, next: [],img:"assets/dropNull.png",columns:[],initColumns:[], outPutColumns:[],text_code:"df_currentModule=df_previousModule.dropna()", color: "white" ,df_field:"Group",value_na:"'Gp'",top:50, left:200 },
    { id: 4,name:"replace", type:"treat", action: "replace", paramValue:[["Column"]] , previous:[], size: 1, next: [],img:"assets/replace.png",columns:[],initColumns:[], outPutColumns:[],form:{Column:{type:'selectMultiple',label:'Column',value:'',paramValue:[],help:""},Init_String:{type:'text',label:'Init String',value:'',help:""},Replaced_String:{type:'text',label:'Replaced String',value:'',help:""}}, color: "white" ,df_field:"Group",value_na:"'Gp'",top:50, left:200 }, 
    { id: 4,name:"asType", type:"treat", action: "asType", paramValue:[["Column"]] , previous:[], size: 1, next: [],img:"assets/AsType.png",columns:[],initColumns:[], outPutColumns:[],form:{Column:{type:'selectMultiple',label:'Column',value:'',paramValue:[],help:""},convert_to:{type:'select',label:'convert to',value:'',paramValue:['str','int','float'],help:""}}, color: "white" ,df_field:"Group",value_na:"'Gp'",top:50, left:200 },  
    { id: 5,name: "merge", type:"treat",action: "merge",paramValue:[["Merge_left"],["Merge_right"]], previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Merge_how:{type:'select',label:'Merge how',value:'',paramValue:['left','inner','outer'],help:""},Merge_left:{type:'select',label:'Merge left',value:'',paramValue:[]},Merge_right:{type:'select',label:'Merge right',value:'',paramValue:[]}},img:"assets/merge.png", color: "white" ,top:50, left:100,merge_how:"left"},
    //{ id: 5,name: "mergeFiles", type:"treat",action: "mergeFiles",link_from:['folderInput'],paramValue:[], previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Separateur:{type:'text',label:'Separateur',value:',',paramValue:[]}},img:"assets/mergeFiles.png", color: "white" ,top:50, left:100,merge_how:"left"},
    { id:51,name: "ImpalaMerge", type:"treat",action: "ImpalaMerge", previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Merge_how:{type:'select',label:'Merge how',value:'',paramValue:['left','inner','outer'],help:""},Merge_left:{type:'select',label:'Merge left',value:'',paramValue:[]},Merge_right:{type:'select',label:'Merge right',value:'',paramValue:[]},Impala_Code:{type:'textarea',label:'Impala Code',value:'',paramValue:'',help:""}},img:"assets/ImpalaMerge.png", color: "white" ,top:50, left:100,merge_how:"left"},
    { id:51,name: "ImpalaOrderBy", type:"treat",action: "ImpalaOrderBy", paramValue:[["order_by"]],previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{order_how:{type:'select',label:'order how',value:'DESC',paramValue:['ASC','DESC'],help:""},order_by:{type:'select',label:'order by',value:'',paramValue:[]}},img:"assets/orderBy.png", color: "white" ,top:50, left:100},
    { id:51,name: "ImpalaRank" , type:"treat",action: "ImpalaRank", paramValue:[["partition_by","order_by"]] , previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{partition_by:{type:'selectMultiple',label:'partition by',value:'',paramValue:['ali','salam','mounir'],help:""},order_how:{type:'select',label:'order how',value:'DESC',paramValue:['ASC','DESC'],help:""},order_by:{type:'select',label:'order by',value:'',paramValue:[]},column_name:{type:'text',label:'column name',value:'rank',paramValue:[]}},img:"assets/ImpalaRank.png", color: "white" ,top:50, left:100},
    { id:51,name: "ImpalaLag" , type:"treat",action: "ImpalaLag", paramValue:[["Filed_Column","partition_by","order_by"]] , previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Filed_Column:{type:'selectMultiple',label:'Filed Column',value:'',paramValue:[],help:""},partition_by:{type:'selectMultiple',label:'partition by',value:'',paramValue:['ali','salam','mounir'],help:""},order_how:{type:'select',label:'order how',value:'DESC',paramValue:['ASC','DESC'],help:""},order_by:{type:'select',label:'order by',value:'',paramValue:[]},col_name:{type:'text',label:'col name',value:'rank',paramValue:[]}},img:"assets/ImpalaRank.png", color: "white" ,top:50, left:100},
   
    { id:51,name: "ImpalaFormatDate",  type:"treat",action: "ImpalaFormatDate", paramValue:[['column_date']],previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Date_Func:{type:'select',label:'Date Func',value:'day',paramValue:['day','month','year'],help:""},column_date:{type:'select',label:'column date',value:'',paramValue:[]},column_name:{type:'text',label:'column name',value:'',paramValue:[]}},img:"assets/ImpalaFormatDate.png", color: "white" ,top:50, left:100},
    { id:51,name: "ImpalaFunctCol" , type:"treat",action: "ImpalaFunctCol",  paramValue:[['column_func']],previous:[],size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],form:{Function_Column:{type:'textarea',label:'Function Column',value:'',paramValue:[],help:""},column_func:{type:'select',label:'column func',value:'',paramValue:[]},column_name:{type:'text',label:'column name',value:'',paramValue:[]}},img:"assets/ImpalaFunctCol.png", color: "white" ,top:50, left:100},
    { id: 6,name: "normalize", type:"treat", action: "normalize", previous:[],size: 1, next: [],img:"assets/Normalize.png",columns:[],initColumns:[], outPutColumns:[], color: "white" ,top:50, ignore_index:"True", merge_on:"id"},
    { id :7,name:"sCol", type:"treat", action:"sCol",previous:[],size:1,next:[],form:{},img:"assets/cfilter.png",columns:[],initColumns:[],outPutColumns:[]},
    { id:13,name:"sql", action:"sql",type:"treat","origin":"local",previous:[],columns:[],initColumns:[],form:{SQL_Code:{type:'textarea',label:'SQL Code',value:'--use df_previousModule to select previous dataframe \n '}}, size: 1, next: [], outPutColumns:[],img:"assets/sql.png", color: "white","description":"Python Code"}, 
    { id:13,name:"SplitTrainTest", action:"SplitTrainTest",type:"treat","origin":"local",paramValue:[["flag_column"]],previous:[],columns:[],initColumns:[],link_to:['xDf','yDf'],form:{flag_column:{type:'select',label:'flag column',value:'',paramValue:[],help:""}, random_state:{type:'text',label:'random state',value:'',help:"With random_state=None , \nwe get different train and test sets across different executions \n and the shuffling process is out of control.\n\nWith random_state=0 or 42 , \nwe get the same train and test sets across different executions\n recommanded value 0"},test_size:{type:'text',label:'test size',value:'',help:"test_size is given as 0.25 ,\n\nit means 25% of our data goes into our test size."}} , size: 1, next: [], outPutColumns:[],img:"assets/TrainTest.png", color: "white","description":"Python Code"},
    { id:24,name:"BuildModel",action:"BuildModel","type":"treat","origin":"local",previous:[],link_from:['xDf','yDf'],form:{module_name:{type:'select',label:'module name',value:'',paramValue:['RandomForestClassifier','DecisionTreeClassifier','LinearRegression','KNeighborsClassifier'],help:""}}, size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],img:"assets/ML.png", color: "white","description":"save ML model"},
    { id:24,name:"ClusterModel",action:"ClusterModel","type":"treat","origin":"local",previous:[],form:{module_name:{type:'select',label:'module name',value:'',paramValue:['KMeans'],help:""},Nombre_Cluster:{type:'text',label:'Nombre Cluster',value:'',paramValue:['KMeans'],help:""}}, size: 1, next: [],columns:['clusters'], outPutColumns:[],img:"assets/CusterModel.png", color: "white","description":"save ML model"},
    { id:24,name:"ReduceData",action:"ClusteReduceDatarModel","type":"treat","origin":"local",previous:[],form:{Nombre_Composant:{type:'text',label:'Nombre_Composant',value:'2',paramValue:['KMeans'],help:""}}, size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],img:"assets/reduceData.png", color: "white","description":"save ML model"},  
    { id:24,name:"MLPredict",action:"MLPredict","type":"treat","origin":"local",previous:[],form:{}, size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],link_from:['BuildModel','xDf'],img:"assets/MLPredict.png", color: "white","description":"print score"},
    { id:24,name:"xDf",action:"xDf","type":"treat","origin":"local",previous:[], size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],link_from:['SplitTrainTest'],form:{DF_Column:{type:'select',label:'DF Column',value:'',paramValue:['xtrain','xtest'],help:""}},img:"assets/xDf.png", color: "white","description":"print score"},
    { id:24,name:"yDf",action:"yDf","type":"treat","origin":"local",previous:[], size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],link_from:['SplitTrainTest'],form:{DF_Column:{type:'select',label:'DF Column',value:'',paramValue:['ytrain','ytest'],help:""}},img:"assets/yDf.png", color: "white","description":"print score"},
    //{ id:19,name:"normalizing","idmodule":21,"type":"treat","origin":"local",previous:[],form:{}, size: 1, next: [], columns:[],initColumns:[],outPutColumns:[],img:"assets/Normalize.png", color: "white","description":"normalizing"},
    { id: 4,name:"statCol",  type:"debug", action: "statCol",paramValue:[[]] , previous:[], size: 1, next: [],img:"assets/colStat.png",columns:[],initColumns:[], outPutColumns:[], color: "white" ,df_field:"Group",value_na:"'Gp'",top:50, left:200 },
   
    //{ id:20,name:"SplitToTrainTest","idmodule":22,"type":"treat","origin":"local",previous:[],form:{}, size: 1, next: [] ,columns:[],initColumns:[],outPutColumns:[],img:"assets/plit.png", color: "white","description":"Split DatSet to Train &Test"},
    //{ id:21,name:"RandomForestModel","idmodule":23,"type":"treat","origin":"local",previous:[],form:{}, size: 1, next: [], outPutColumns:[],img:"assets/ML.png", color: "white","description":"RandomForestModel"},
 	{ id:5 ,name:"desc",  type:"debug",action:"desc","origin":"local",previous:[],form:{}, size: 1, next: [],columns:[],initColumns:[], outPutColumns:[],img:"assets/imgShape.png", color: "white","description":"read from csv 1"},
    { id:13,name:"shape", action:"shape",type:"debug","origin":"local",previous:[],form:{},columns:[],initColumns:[],valueCode:'df_currentModule=df_previousModule \nval=df_currentModule.shape \ndf_currentModule=pd.DataFrame.from_dict({\'val\':list(val)}) \ndf_currentModule=df_currentModule', size: 1, next: [], outPutColumns:[],img:"assets/imgShape1.png", color: "white","description":"Python Code"},
    { id:13,name:"corr", action:"corr",type:"debug","origin":"local",previous:[],form:{},columns:[],initColumns:[],valueCode:'df_currentModule=df_previousModule \ndf_currentModule=df_currentModule.corr()', size: 1, next: [], outPutColumns:[],img:"assets/corr.png", color: "white","description":"Python Code"}
  ];
  
  public  modules:any[]= 
  [
   //{"id":35,"idmodule":37,"name":"folderInput0","type":"input","origin":"local",previous:[],link_to:['concatFiles','mergeFiles'], form:{Input_Folder:{type:'multiFileServer',label:'Input Folder',value:"",folder:"input",help:"SSSS  selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/folder.png",color: "white","description":"inout csv"},
   {"id":35,"idmodule":37,"name":"folderInput","type":"input","action":"folderInput","origin":"local",previous:[],form:{Nom_fichier:{type:'multiFileServer',label:'Nom fichier',value:"",folder:"input",help:"SSSS  selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"},Separateur:{type:'text',label:'Separateur',value:",",help:{text_top:"Separateur111 \n",text_buttom:" \nhelp",image:"assets/logoAnalytics.png"}},Action:{type:'select',label:'Action',value:'Concat',paramValue:['Concat','Merge'],help:""}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/folder.png",color: "white","description":"inout csv"},
   {"id":35,"idmodule":37,"name":"inputCSV","type":"input","action":"inputCSV","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"input",content:[],help:{text_top:"selection un fichier de format CSV \n la premier ligne doit contenir les noms des colonnes"}},Separateur:{type:'text',label:'Separateur',value:",",help:{text_top:"Separateur111 \n",text_buttom:" \nhelp",image:"assets/logoAnalytics.png"}},Delete_After:{type:'checkbox1',label:'Delete After',value:0}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/csv.png",color: "white","description":"inout csv"},
   {"id":35,"idmodule":37,"name":"inputImpalaSql","type":"input","action":"inputImpalaSql","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"input",content:[],help:"selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"},Query:{type:'textarea',label:'Query',value:"", disable:1}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/sql.png",color: "white","description":"inout csv"},
   //{"id":35,"idmodule":37,"name":"inputPKL","type":"input","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"input",content:[],help:"selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/csv.png",color: "white","description":"inout csv"},
   {"id":35,"idmodule":37,"name":"inputExcel","type":"input","action":"inputExcel","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"input",content:[],help:"selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/excel.png",color: "white","description":"inout csv"},
   {"id":35,"idmodule":37,"name":"inputJSON","type":"input","action":"inputJSON","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"input",help:"selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"},Separateur:{type:'text',label:'Separateur',value:","}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/json.png",color: "white","description":"inout csv"}, 
   {"id":13,"idmodule":1,"name":"pythonInput","type":"input","action":"pythonInput","origin":"local",previous:[],form:{Python_Code:{type:'textarea',label:'Python Code',value:'#use  df as  df_$currentModule \n',paramValue:'',help:"Example \nimport seaborn as sns\n  df_$currentModule = sns.load_dataset(\'iris\')"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[],img:"assets/python.png", color: "white","description":"Python Code"},
   {"id":35,"idmodule":37,"name":"ImpalaDb","type":"input","action":"ImpalaDb","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"DB",help:"selection un fichier de format CSV <br> la premier ligne doit contenir les noms des colonnes"}, Query:{type:'textarea',label:'Query',value:"", disable:1}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/impalaDb.png",color: "white","description":"Select Data Fram Impala"},
   {"id":36,"idmodule":37,"name":"ImpalaSql","type":"input","action":"ImpalaSql","origin":"local",previous:[],form:{Query:{type:'textarea',label:'Query',value:"", disable:1}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/impalaSql.png",color: "white","description":"Select Data Fram Impala"},
   {"id":25,"idmodule":28,"name":"loadML","type":"input","action":"loadML","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"ML_Model"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[],img:"assets/ML.png", color: "white","description":"load ML"},
   //{"id":30,"idmodule":32,"name":"inputModule","type":"input","origin":"local",previous:[],form:{Nom_fichier:{type:'fileServer',label:'Nom fichier',value:"",folder:"Code"}}, size: 1, next: [], columns:[],initColumns:[],outPutColumns:[],img:"assets/Module.png", color: "white","description":"input from pipe line module"},
   {"id":4,"idmodule":2,"name":"FileMail","type":"sending","action":"FileMail","origin":"local",form:{FileName:{type:'text',label:'FileName',value:""},Destination:{type:'text',label:'Destination',value:""},Objet:{type:'text',label:'Objet',value:""},body:{type:'textarea',label:'body',value:""}},previous:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], img:"assets/attachFileMail.png", color: "white","description":"write to csv"},
   {"id":4,"idmodule":2,"name":"Mails","type":"sending","action":"Mails","origin":"local",paramValue:[["Destination","body"]],form:{Destination:{type:'select',label:'Destination',value:"",paramValue:[]},Objet:{type:'text',label:'Objet',value:""},body:{type:'select',label:'body',value:"",paramValue:[]}},previous:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], img:"assets/mails1.png", color: "white","description":"write to csv"},
   {"id":4,"idmodule":2,"name":"FixMails","type":"sending","action":"FixMails","origin":"local",paramValue:[["Destination"]],form:{Destination:{type:'select',label:'Destination',value:"",paramValue:[]},Objet:{type:'text',label:'Objet',value:""},body:{type:'textarea',label:'body',value:""}},previous:[], size: 1, next: [],columns:[],initColumns:[],outPutColumns:[], img:"assets/fixmails.png", color: "white","description":"write to csv"},
   {"id":4,"idmodule":2,"name":"Sms","type":"sending","action":"Sms","origin":"local",paramValue:[["Destination","body"]],form:{Destination:{type:'select',label:'Destination',value:"",paramValue:[]},Objet:{type:'text',label:'Objet',value:""},body:{type:'select',label:'body',value:"",paramValue:[]}},previous:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], img:"assets/sms.png", color: "white","description":"write to csv"},
   {"id":4,"idmodule":2,"name":"FixSms","type":"sending","action":"FixSms","origin":"local",paramValue:[["Destination"]],form:{Destination:{type:'select',label:'Destination',value:"",paramValue:[]},Objet:{type:'text',label:'Objet',value:""},body:{type:'textarea',label:'body',value:""}},previous:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], img:"assets/fixsms.png", color: "white","description":"write to csv"},
   {"id":24,"idmodule":2,action:"pScore",name:"pScore","type":"output","origin":"local",previous:[],form:{}, size: 1, next: [],columns:[],initColumns:[],outPutColumns:[],img:"assets/pScore.png", color: "white","description":"print score","controlePrevious":['yDf','MLPredict']},
   {"id":24,"idmodule":2,action:"saveMl",name:"saveML","type":"output","origin":"local",previous:[],form:{}, size: 1, next: [], columns:[],initColumns:[],outPutColumns:[],img:"assets/saveML.png", color: "white","description":"print score"},  
   {"id":4 ,"idmodule":2,"name":"outputCSV","type":"output","action":"outputCSV","origin":"local",form:{Destination:{type:'fileServer',label:'Destination',value:"",folder:"."},folder:{type:'savefile',label:'folder',value:"folder"},Target_Nom:{type:'text',label:'Target Nom',value:"output.csv"}},previous:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], img:"assets/csv.png", color: "white","description":"write to csv"},
   {"id":4 ,"idmodule":2,"name":"ImpalaOutputCSV","type":"output","action":"ImpalaOutputCSV","origin":"local",form:{Destination:{type:'fileServer',label:'Destination',value:"", folder:"."},folder:{type:'savefile',label:'folder',value:"folder"},Nom_fichier:{type:'text',label:'Nom fichier',value:"output.csv"}},previous:[], size: 1, next: [],columns:[],initColumns:[],outPutColumns:[], img:"assets/csv.png", color: "white","description":"write to csv"},
   {"id":5 ,"idmodule":5,"name":"concatUpdated","type":"treat","origin":"local",previous:[],form:[], size: 1, next: [], columns:[],initColumns:[],outPutColumns:[], color: "white","description":"read from csv 1"},
   {"id":31,"idmodule":5,"type":"output", "action":"plot", "name": "plot",paramValue:[["Plot_X","Plot_Y"]],  size: 1,previous:[], next: [], outPutColumns:[],form:{Plot_Type1:{type:'select',label:'Plot Type1',value:'',paramValue:['plot','hist','bar','scatter','pie'],help:""},Plot_X:{type:'select',label:'Plot X',value:'',paramValue:[],help:""},Plot_Y:{type:'select',label:'Plot Y',value:'',paramValue:[]}},img:"assets/plot.png", color: "white",x_label:"id",y_label:"montant",plot_title:"title",plot_type:"bar",top:50, left:300 },
   {"id":51,"idmodule":5, "type":"output", "action":"plotGausPDF", "name": "plotGausPDF",  paramValue:[["Plot_Column"]],size: 1,previous:[], next: [], outPutColumns:[],form:{Plot_Column:{type:'select',label:'Plot Column',value:'',paramValue:[],help:""}}, color: "white",x_label:"id",y_label:"montant",plot_title:"title",plot_type:"bar",top:50, left:300 },
   {"id":61,"idmodule":5, "type":"output", "action":"plotGausse", "name": "plotGausse", paramValue:[["Plot_Column"]],size: 1,previous:[], next: [], outPutColumns:[],form:{Plot_Column:{type:'select',label:'Plot Column',value:'',paramValue:[],help:""}}, color: "white",x_label:"id",y_label:"montant",plot_title:"title",plot_type:"bar",top:50, left:300 },
   {"id":9 ,"idmodule":9,"name":"plotHistogramAttributes","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plot.png", color: "white","description":"plot histogram of the attributes"},
   {"id":10,"idmodule":10,"name":"plotBox","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plot.png", color: "white","description":"plot box"},
   {"id":11,"idmodule":11,"name":"plotClustering","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plot.png", color: "white","description":"plot clustering"},
   {"id":12,"idmodule":12,"name":"plotDendrograms","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plot.png", color: "white","description":"plot Dendrograms"},
 
   {"id":14,"idmodule":14,"name":"plotAcpCoude","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plotAcp.png", color: "white","description":"plot for debug"},
   {"id":14,"idmodule":14,"name":"plotAcpVariance","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/plotAcpVariance.png", color: "white","description":"plot for debug"},
   {"id":14,"idmodule":14,"name":"plotKmeans","type":"output","origin":"local",previous:[],form:{Nombre_Cluster:{type:'text',label:'Nombre Cluster',value:''}}, size: 1, next: [], outPutColumns:[],img:"assets/plotKmeans.png", color: "white","description":"plot for debug"},
   {"id":14,"idmodule":14,"name":"plotdebug","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[], color: "white","description":"plot for debug"},
   {"id":23,"idmodule":26,"name":"plotConfusionMatrix","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], img:"assets/confusionMatrix.png",outPutColumns:[], color: "white","description":"plotConfusionMatrix"},
   {"id":24,"idmodule":27,"name":"saveML_Model","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],img:"assets/ML.png", color: "white","description":"save ML model"}, 
   {"id":34,"idmodule":36,"name":"plotfeatureimportance","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],columns:[],initColumns:[],img:"assets/plot.png", color: "white","description":"plot feature importance"},
   {"id":36,"idmodule":38,"name":"accuracyScorePlot","type":"output","origin":"local",previous:[],form:[], size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], color: "white","description":"plot ML score"},
   {"id":37,"idmodule":39,"name":"DecisionTreeModel","type":"treat","origin":"local",previous:[],form:[], size: 1,next: [], outPutColumns:[],columns:[],initColumns:[],img:"assets/ML.png", color: "white","description":"DecisionTreeModel"},
   { "id": 7,"type":"treat","name":"sCol",previous:[],size:1,next:[],img:"sfilter.png",columns:[],initColumns:[]},
   {"id": 31,"type":"output", "action":"plotCorrelMatrix", "name": "plotCorrelMatrix", size: 1,previous:[], next: [], outPutColumns:[], color: "white",img:"assets/plot.png",x_label:"id",y_label:"montant",plot_title:"title",plot_type:"bar",top:50, left:300 },
   {"id":136,"idmodule":137,"name":"ImpalaDbOut","type":"output","origin":"local",previous:[],form:{Action:{type:'select',label:'Action',value:'',paramValue:['Create','Insert']},Target_table:{type:'text',label:'Target table',value:"output.csv"}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/impalaSql.png",color: "white","description":"Select Data Fram Impala"},
   
   {"id":138,"idmodule":138,"name":"schedular","type":"input","origin":"local",previous:[],form:{Destination:{type:'fileServer',label:'Destination',value:"",help:"",folder:"code"},Active:{type:'select',label:'Active',value:'0',paramValue:['0','1']},Minute:{type:'select',label:'Minute',value:'*',paramValue:['*','0','5','10','15','20','25','30','35','40','45','50','55']},
   Hour:{type:'select',label:'Hour',value:'*',paramValue:['*','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']},
   day_of_month:{type:'select',label:'day of month',value:'*',paramValue:['*','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']},
   Month:{type:'select',label:'Month',value:'*',paramValue:['*','1','2','3','4','5','6','7','8','9','10','11','12']},
   day_of_week:{type:'select',label:'day of week',value:'*',paramValue:['*','1','2','3','4','5','6','7']}}, size: 1, next: [], outPutColumns:[],columns:[],initColumns:[], img:"assets/Cron.png",color: "white","description":"Select Data Fram Impala"}
   
]


  title = ""
  public shipsInBoard: any[] = [];
  public projectConf:any={}
  public narrowArray: any[] = []
  public narArray: any[] = []
  public cercleArray: any[] = []
  public linkOne = ''
  public shipColor = ''
  public paletteBar = false
  public  image = new Image();
  public user:string="";

  public shitImage="assets/Close.svg"
  public shitImage1="assets/icon_search.svg"

  public moduleInput: any[] = []; //input modules
  public moduleOutput: any[] = []; //output modules
  public moduleSending : any[] = []; //output modules
  public moduletreat: any[] = []; //treatements modules
  public moduleDebug: any[] = []; //treatements modules
  public moduleSpark: any[] = [];
  public moduleMachine: any[] = [];
  public spinerSelectedField =false;
  //public modules: any[]; //all modules
  public moduleToDo = []; //droped modules
  public barMenuFlag=true;
  public logFileBaseName='log_local_selfAnalytics'
  public logFileName='log_local_selfAnalytics'
  //public cursor = document.getElementById("cursor"); 

  data=[]

  echangeData : EchangeData ={displayedColumns:[],data:[],actionColumns:[],actionButton:[],type:'df'}

  echangeDataConf : EchangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}


  position: any
  mycurrentIndex = 0
  arrowFlag = true
  /*lines = [ 
    { weight: 0.4, x1: 86.69, y1: 50, x2: 98.91, y2: 50 },
    { weight: 0.5, x1: 85.31, y1: 100.67, x2: 198.23, y2: 200.67 }
  ];*/
  generateUUID() {
    let uuidValue
    uuidValue = Math.floor(Math.random() * (500 + 100) + 100).toString();
    return uuidValue;
  }
  
  onPlateformChange(event:any){ 
    console.log(' onPlateformChange ',event.value)   
    this.projectConf['langage']=event.value
    this.updateModulePanel()
  }
  updateModulePanel(){

    console.log(' updateModulePanel ', this.projectConf['langage'])
    this.moduleSending = this.modules.filter((elem) => elem.type == 'sending'  ); // filter output modules

    //if ( this.projectConf['langage'] == 'SQL' ) {
     
    if ( this.plateformForm.controls['plateform'].value == 'SQL' ) {
      this.moduleInput = this.modules.filter((elem) => elem.type == 'input' && elem.name.toUpperCase().includes('IMPALA')); // filter input modules
      this.moduletreat = this.traitModule.filter((elem) => elem.type == 'treat' && elem.name.toUpperCase().includes('IMPALA') ); // filter treat modules
      this.moduleDebug = this.traitModule.filter((elem) => elem.type == 'debug' && elem.name.toUpperCase().includes('IMPALA') ); // filter treat modules
      this.moduleOutput = this.modules.filter((elem) => elem.type == 'output' && elem.name.toUpperCase().includes('IMPALA') ); // filter output modules

      this.moduleSpark = this.modules.filter((elem) => elem.type == 'spark' && elem.name.toUpperCase().includes('IMPALA') ); // filter spark modules
      this.moduleMachine = this.modules.filter((elem) => elem.type == 'machine' && elem.name.toUpperCase().includes('IMPALA') ); // filter machine learning modules

    }else {

      this.moduleInput = this.modules.filter((elem) => elem.type == 'input' && !elem.name.toUpperCase().includes('IMPALA')); // filter input modules
      this.moduletreat = this.traitModule.filter((elem) => elem.type == 'treat' && !elem.name.toUpperCase().includes('IMPALA') ); // filter treat modules
      this.moduleDebug = this.traitModule.filter((elem) => elem.type == 'debug' && !elem.name.toUpperCase().includes('IMPALA') ); // filter treat modules
      this.moduleOutput = this.modules.filter((elem) => elem.type == 'output' && !elem.name.toUpperCase().includes('IMPALA') ); // filter output modules

      this.moduleSpark = this.modules.filter((elem) => elem.type == 'spark' && !elem.name.toUpperCase().includes('IMPALA') ); // filter spark modules
      this.moduleMachine = this.modules.filter((elem) => elem.type == 'machine' && !elem.name.toUpperCase().includes('IMPALA') ); // filter machine learning modules

console.log(' this.moduleOutput ',JSON.stringify(this.moduleOutput))
    }

    console.log(this.projectConf['langage'],'onPlateformChange ', this.plateformForm.get('plateform')?.value)
  }


 clearSelect(){
  //this.showConf=false;
  //console.log('#####################  clearSelect  showConf',this.showConf)
   this.showChild=false;
  this.image.src = ''
  this.initColor();
  this.linkOne='';
  this.onUpdateChild()
  this.showChild=true;
  this.paletteBar=false;
  this.selectedButton='xxxxxxx'
  this.spinerSelectedField=false
  this.echangeData.data=[]
  this.echangeData.actionColumns=[]
  this.echangeData.type='df'
  this.statDataDf=[]
  this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
  ////console.log(' Button Board  :    this.selectedButton  ',this.selectedButton)
  ////console.log(' Button Board  :    this.linkOne  ',this.linkOne)
  this.send.SendMessage.next({});
  //console.log('#####################  clearSelect  showConf',this.shipsInBoard)

 }

  doubleClickFunction(event:any) {
    var ob: {}
    console.log(event,' doubleClickFunction ' ,JSON.stringify(this.shipsInBoard));
    this.paletteBar=false;
   
    if (this.shipColor == this.selectedColor) {
      this.initColor();
    } else {
      event['color'] = this.selectedColor;
      this.shipColor = this.selectedColor;
    }
   //////console.log(' doubleClickFunction selecttedButton',this.selectedButton)
    switch (this.selectedButton) {
      case 'Blink':   
      //////console.log(' doubleClickFunction ', event)
      if (this.linkOne == '') {
        this.linkOne = event['id']
       } else {
        //console.log(this.linkOne, ' next ', event['id'])
        ob = this.shipsInBoard.find((el : any) => el.id == this.linkOne)
        var index = this.shipsInBoard.findIndex((el : any) => el.id == this.linkOne)
          this.addElement(event,index)
        this.buildNarrow()
        this.linkOne = ''
              }
       break;
      case 'delete':
        //////console.log(' delete ');
        break;
      case 'save' :
        //////console.log(' save save  ')
      this.runCodeService.getResultApi().subscribe(
        resultat => {
          //////console.log(' runCodeService '+resultat)

        }
      );
         // expected outputCSV: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        /*if ( !this.checkUnlinkedObject() || event['type'] =='input'){
          alert(' Object should be linked before '+JSON.stringify(event:any))
          return 0
          }*/
          this.barMenuFlag=false;
          //this.onUpdateChild()

          //let project = JSON.parse(localStorage.getItem('projectConf'));
          //project.data=this.shipsInBoard
          //this.send.SendProject.next(project);

          //this.send.SendProject.next(this.projectConf);
          //this.childC.updateProject()
        
          this.linkOne = event['id']
          console.log(' this.linkOne = event[id]  id id id id   ',event)
          this.confFieldModule() 
          var index1 = this.shipsInBoard.findIndex((el : any) => el.id == this.linkOne)
          //if the initcolumn exist call echangedataConf with static
          this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
          console.log(' this.shipsInBoard[index1] (((((((((((())))))))))))  ',this.shipsInBoard[index1])
          if (this.shipsInBoard[index1]['initColumns'] !=undefined ) { // && 
            if (this.shipsInBoard[index1]['initColumns'].length>0){
              
             console.log(' default  this.linkOne jjjjjjjjjj  ',this.linkOne,'  index 1 ',index1,'  this.shipsInBoard[index1][columns] ', JSON.stringify(this.shipsInBoard[index1])) 
              this.echangeDataConf.data=this.shipsInBoard[index1]['initColumns']
              //if (this.shipsInBoard[index]['action']=="sCol" )  
              this.echangeDataConf.actionColumns=['Select']
              this.echangeDataConf.selectedRows=this.shipsInBoard[index1]['columns']
            }
          }

        event['color'] = this.selectedColor;
        this.shipColor = this.selectedColor;
        //////console.log(' defaul ',this.linkOne);
        this.paletteBar=true;
        ////console.log(' doubleClickFunction default   :    this.selectedButton  ',this.selectedButton)
        ////console.log(' doubleClickFunction default    :    this.linkOne  ',this.linkOne)
        //this.barMenuFlag=true;
        break;
    
    }
    
    this.selectedButton='conf'
    this.showConf=true
    console.log('#####################  conf showConf',this.showConf)
   
    //localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
  }

////////////////////   used to check if there is only one output or debug is droped
  shipsInBoardTypeLength(ship:any){
  let nbr=0;
    for (var i = 0; i < this.shipsInBoard.length; i++)
    {
      if ((this.shipsInBoard[i]['type'] == 'debug' || this.shipsInBoard[i]['type'] == 'output'  ) 
      && this.shipsInBoard[i]['idmodule']!=ship['idmodule'] ) {
      nbr=nbr+1
       }
   }
  console.log(' nbr  ',nbr)
  return nbr
  }

  initColor() {
    for (var i = 0; i < this.shipsInBoard.length; i++)
    {this.primaryColor = "#ffffff"
      this.shipsInBoard[i]['color'] = this.primaryColor
  }
    this.shipColor = this.primaryColor
  }
  setColor(idModule:string,color:string) {
    const partialObject=this.partialObjectIdModule(idModule)
    console.log(' set color  :::  partialObject ',partialObject)
    var tmpIdModule=""
   for (var i = 0; i < this.shipsInBoard.length; i++)
   { 
    tmpIdModule = this.shipsInBoard[i]['idmodule']
    //console.log(' tmpIdModule ',tmpIdModule)
     if (   this.getIndexIdModule(partialObject, tmpIdModule) >=0 )  {   
     this.shipsInBoard[i]['color'] = color //this.primaryColor
     //console.log(' this.shipsInBoard[i][color] = color    ',this.shipsInBoard[i]['color'] )
     }
  }
  }
  


@HostListener('window:resize', ['$event'])
onWindowResize() {
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
  //console.log(' screen  :::::::  '+this.getScreenWidth+'   '+this.getScreenHeight)
}

  ngOnInit() {

     
    var ar: any[] = []
    this.image.src = '';
    const userString=localStorage.getItem('user') ;
    if ( userString !== null ) this.user=userString 

     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;
      
      var source = interval(1000);
      const text = 'Your Text Here 111';
      this.subscription = source.subscribe(val => this.opensnack(text));

       this.moduleOutput = this.modules.filter((elem) => elem.type == 'output'  ); // filter output modules
    this.moduleSending = this.modules.filter((elem) => elem.type == 'sending'  ); // filter output modules
    
     this.shipColor = this.primaryColor;

    for (var j = 0; j < this.boardWidth; j++) {
      ar = []
      for (var i = 0; i < this.boardLarge; i++) {
        ar.push({})
      }
      this.board.push(ar)
    }

    ////console.log(' boad ', this.board)

    this.gridLarge = (this.widthBox * this.boardWidth);

    this.gridWith = 200+(this.widthBox * this.boardLarge);

    //console.log('this.widthBox ',this.widthBox ,'  ',' board width ', this.gridWith, ' large ', this.gridLarge)
    
    //this.buildNarrow();

   // console.log('thing rooooooooooooooooooooooooooooooooote ', this.activeRoute.snapshot.params.projectName);
    const dataSt = localStorage.getItem('data')!;
    ///////////////////////////////////////
    if (this.activeRoute.snapshot.params['projectName'] != undefined) {
      let fileName = this.user + ':' + this.activeRoute.snapshot.params['projectName'];
      this.runCodeService.getProjectContent(fileName).subscribe(
        content => {
          console.log(fileName, ' project content ', content.content.data)
          if (content.content.data != undefined && content.content.data.length > 0) {
            this.shipsInBoard = content.content.data;
            this.buildNarrow();
            this.projectConf = content.content;
            this.langage = content.content.langage;
            console.log(' this.plateformForm buggggggggggg  ', this.projectConf)
            this.plateformForm.controls['plateform'].setValue(this.langage)
            localStorage.setItem("data", JSON.stringify(this.shipsInBoard))
            localStorage.setItem("project", JSON.stringify(content.content))
            delete this.projectConf.data;
            localStorage.setItem("projectConf", JSON.stringify(this.projectConf));
            console.log(' updateModulePanel  addddddddd ProjectContent ddddddddddddd ', localStorage.getItem("projectConf"))
            this.updateModulePanel();
            this.send.SendProject.next(this.projectConf);
            //this.childC.updateProject()
          } else {
            alert(" project don't found ")
          }

        }, error => {
          console.log(" project don't found ");
          alert(" project don't found ")

        }
      );
    } else
    
    if (dataSt !== null) {
      this.shipsInBoard = JSON.parse(dataSt);
    

        this.buildNarrow();
        if (localStorage.getItem('projectConf') != undefined && localStorage.getItem('projectConf')) {
          this.projectConf = JSON.parse(localStorage.getItem('projectConf')!)
          this.langage = this.projectConf['langage']
          console.log(' this.projectConf  ', this.shipsInBoard)
          this.plateformForm.controls['plateform'].setValue(this.langage)
        }
        this.send.SendProject.next(this.projectConf);
        //this.childC.updateProject()
      } 
    
    //////////  Init Plateforme Buttom SQL or Python
    if (this.projectConf['langage'] != undefined) {
      this.plateformForm.controls['plateform'].setValue(this.projectConf['langage'])
    }
    else {
      this.plateformForm.controls['plateform'].setValue('Python')
    }
      
    ///////////////  Based on plateforme filter Module Pallete 
    if (this.plateformForm.controls['plateform'].value == 'SQL') {

      this.moduleInput = this.modules.filter((elem) => elem.type == 'input' && elem.name.toUpperCase().includes('IMPALA')); // filter input modules
      this.moduletreat = this.traitModule.filter((elem) => elem.type == 'treat' && elem.name.toUpperCase().includes('IMPALA')); // filter treat modules
      this.moduleDebug = this.traitModule.filter((elem) => elem.type == 'debug' && elem.name.toUpperCase().includes('IMPALA')); // filter treat modules

      this.moduleSpark = this.modules.filter((elem) => elem.type == 'spark' && elem.name.toUpperCase().includes('IMPALA')); // filter spark modules
      this.moduleMachine = this.modules.filter((elem) => elem.type == 'machine' && elem.name.toUpperCase().includes('IMPALA')); // filter machine learning modules

    } else {

      this.moduleInput = this.modules.filter((elem) => elem.type == 'input' && !elem.name.toUpperCase().includes('IMPALA')); // filter input modules
      this.moduletreat = this.traitModule.filter((elem) => elem.type == 'treat' && !elem.name.toUpperCase().includes('IMPALA')); // filter treat modules
      this.moduleDebug = this.traitModule.filter((elem) => elem.type == 'debug' && !elem.name.toUpperCase().includes('IMPALA')); // filter treat modules

      this.moduleSpark = this.modules.filter((elem) => elem.type == 'spark' && !elem.name.toUpperCase().includes('IMPALA')); // filter spark modules
      this.moduleMachine = this.modules.filter((elem) => elem.type == 'machine' && !elem.name.toUpperCase().includes('IMPALA')); // filter machine learning modules


    }

  }


  ngAfterViewInit() {


    console.log(' ngAfterViewInit ')

  }
restaureModulePanel(){
this.showModule=true;

}


restaureConfPanel(){
  this.showConf=true;
 }
  

  link() {
    this.selectedButton='Blink';
     console.log(" click   link B : this.selectedButton ",this.selectedButton)
    //this.buildNarrow()
     
  }

  link1() {
    this.selectedButton='delete';
     //console.log("  link ",this.selectedButton)
    //this.buildNarrow()
  }

  link2() {
    this.selectedButton='save';
     //console.log("   link ",this.selectedButton)
    //this.buildNarrow()
  }

  getXYAttachedPoint(sens: string, left: number, top: number, w: number, l: number) {
    var x = 0;
    var y = 0;
    switch (sens) {
      case 'up':
        x = left + w / 2
        y = top;
        //////console.log(' up ', x, '  ', y);
        break;
      case 'down':
        x = left + w / 2
        y = top + l;
        //////console.log(' Down ', x, '  ', y);
        break;
      case 'left':
        x = left
        y = top + w / 2;
        //////console.log(' left ', x, '  ', y);
        // expected outputCSV: "Mangoes and papayas are $2.79 a pound."
        break;
      case 'rigth':
        x = left + w
        y = top + w / 2;
        //////console.log(' rigth ', x, '  ', y);
        // expected outputCSV: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        //////console.log(' defaul ');
    }
    return { x: x, y: y };
  }

  ////////////  geometrie pointeur /////:
  angle(cx:number, cy:number, ex:number, ey:number) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    if (theta <= 0) return theta * -1;
    else return 360 - theta;
  }

  rotate(M:any, O:any, angle:number) {
    var xM, yM, x, y;
    angle *= Math.PI / 180;
    xM = M.x - O.x;
    yM = M.y - O.y;
    x = xM * Math.cos(angle) + yM * Math.sin(angle) + O.x;
    y = - xM * Math.sin(angle) + yM * Math.cos(angle) + O.y;
    return ({ x: Math.round(x), y: Math.round(y) });
  }

  choiseAttachedPoint(M0: any, M1: any) {
    var ang = this.angle(M0.x, M0.y, M1.x, M1.y)
    //////console.log(' angle ', ang)
    if (ang >= 0 && ang <= 45) return { f: 'rigth', l: 'left' }
    if (ang > 45 && ang <= 135) return { f: 'up', l: 'down' }
    if (ang > 135 && ang <= 225) return { f: 'left', l: 'rigth' }
    if (ang > 225 && ang <= 315) return { f: 'down', l: 'up' }
    if (ang > 315) return { f: 'rigth', l: 'left' }
    return {}
  }

  getNext(obName: string) {
    for (var i = 0; i < this.shipsInBoard.length; i++) {
      //////console.log(' getNext ', this.shipsInBoard[i].name, ' == ', obName)
      if (this.shipsInBoard[i].name == obName) {
        //console.log(obName, '== ', this.shipsInBoard[i].next);
        return i;
      }
    }
    return -1
  }

  getNextId(obId: string) {
    for (var i = 0; i < this.shipsInBoard.length; i++) {
      //////console.log(' getNextId ', this.shipsInBoard[i].idmodule, ' == ', obId)
      if (this.shipsInBoard[i].idmodule == obId) {
        //console.log(obId, '== ', this.shipsInBoard[i].next);
        return i;
      }
    }
    return -1
  }
  getColumns(ar:any[]){
    var ob1={
      'column':'',"value1":'',"value2":''};//,value1:string,value2:string};
    var ob={
        'column':''};//,value1:string,value2:string};
    const nb=1
    const colomns=Object.keys(ar[0]);
    var indice=0
    var result=[]
    //ob['column']='test';
    ////////console.log(' colomuns :::::::::::::::::::  ',colomns)
    for ( var j=0;j<colomns.length;j++ ){
      ob['column']=colomns[j];
 
    result.push(ob);
    ob={
      'column':''};
    ////////console.log(' Object <> :',ob)
  }
  //////console.log(' Object result :',result)
  return result
  }

  arrayToColumnsObject(colomns:[]){
     var ob={
        'column':''};//,value1:string,value2:string};
     var result=[]
    //ob['column']='test';
    ////////console.log(' colomuns :::::::::::::::::::  ',colomns)
    for ( var j=0;j<colomns.length;j++ ){
      ob['column']=colomns[j];
      result.push(ob);
    ob={
      'column':''};
    ////////console.log(' Object <> :',ob)
  }
  //////console.log(' Object result :',result)
  return result
  }
  showPlot(){
  const indexOfInvalid=this.getInvalidModule();
  if (indexOfInvalid >=0 ) {

    alert(' pipe line is Invalid check config file for all noeud: '+this.shipsInBoard[indexOfInvalid]['action'])
    return 0
  }
    this.echangeData.data = []
    this.echangeData.actionColumns=[]
    if (!this.checkUnlinkedObject()) {
      this.selectedButton = 'plot';
      const pipeObject = this.partialPipeObject();
      ////console.log(' getPlotImgBase64 ',pipeObject)
      const pipeProject = { logFile:this.logFileName,user:localStorage.getItem('user'), langage:this.plateformForm.controls['plateform'].value, pipeObject:pipeObject}
      this.runCodeService.getPlotImgBase64(pipeProject).subscribe(
        resultat => {
          //////console.log(' executePipeGetCode ',resultat[0]['data'][0].length)
          ////console.log(' getAllNews ',resultat[0])

          this.image.src = "data:image/jpg;base64," + resultat[0].data;
          //to be verifed
          //saveAs(this.image.src, 'plot.jpg');
          this.openPlotModal(this.image.src);
          this.echangeData.data = [{}]

        });
      //this.selectedButton = '';
    }
    else
      alert(' Pipe line Invalide : unlinked Object ')
    return 0;
    }

  /*
  savePlot(base64){
    console.log('file saved to plot.jpg')
    saveAs(base64, 'plot.jpg');

  }
*/
  GetSortOrder1(prop : any,order:any) {
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

  GetSortOrder(prop:string) {
    return function(a:any, b:any) {
          if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
          return 0;
      }
      return 0;
 }
 formatCode(data : any[]){
  //to be verified
  //data.sort(this.GetSortOrder("rank"));
  var jdata=[]
  for (var item in data){
    for (var el in data[item].code){
      if ( !data[item].code[el].includes('root_logger') && !data[item].code[el].includes('handler') )
      
      jdata.push({'code':data[item].code[el]})
    }

  }
  return jdata;
 }

  showCode(){
   
  this.echangeData.data=[]
  this.echangeData.type='code'
  this.echangeData.actionColumns=['Download']
  if ( !this.checkUnlinkedObject() ){
  this.selectedButton='run';
  const pipeObject=this.partialPipeObject();
  const pipeProject = { logFile:this.logFileName,user:localStorage.getItem('user'),langage:this.plateformForm.controls['plateform'].value, pipeObject:pipeObject}
  console.log('pipeObject ',JSON.stringify(pipeObject))
  this.runCodeService.executePipeGetCode(pipeProject).subscribe(
      resultat => {
        console.log(' executePipeGetCode ',JSON.stringify(resultat))
        console.log(' executePipeGetCode ',resultat[0])
        this.data=resultat;
        console.log(' data ',this.data)
        if (this.plateformForm.controls['plateform'].value=='SQL'){

          
          resultat.push({'code':resultat[0]['query'].replace(/~/g,'\'')})
          //resultat[0]['code']=resultat[0]['query'].replace(/~/g,'\'')
          resultat.shift()
          this.echangeData.data=resultat;
          this.echangeData.type ='code'
        }else {
        this.echangeData.data=this.formatCode(this.data)
        }
        console.log(' executePipeGetCode ',this.echangeData.data)

        //this.echangeData.data=this.data
      },
      error => console.log(' debug my error ',error) 
      
    );
  }
    else 
    alert(' Pipe line Invalide : unlinked Object ')
  }

  getInvalidModule(){
    //const pipeObject=this.partialPipeObject();
    const plotObjectIndex=this.shipsInBoard.findIndex((el : any) => this.isValidModule(el)==0)
    return plotObjectIndex
  
    }

  isValidModule(module:any){
    //const pipeObject=this.partialPipeObject();
    console.log(' isValidModule  ',module['form'])
    const form=module['form']
    
    var ar=[]
    if ( module['columns'] != undefined){
    let columns= module['columns']
    if (columns.map((el : any) => el.includes('error_class')).includes(true)) {
       //ar.push('error_class')
       console.log(' columns ffffff 11111 ffffffffff   ',columns)
    }

    }

    for (var key in form){
      console.log(form[key],' ffffffffffffffff  form key ',form[key].value)
      if (form[key].value.toString() == '' && (module['action']) !='select')
        ar.push(key)
      }
   
    console.log(' invalid fffffff 222222 fffffffff  error array  ',ar)
    if (ar.length == 0) {
      //alert(' Cannot  run Plot Pipe line  : select pipe without plot ')
      return 1
    } else
      return 0
  }
  

  isValidPlot(){
  //const pipeObject=this.partialPipeObject();
  const plotObjectIndex=this.shipsInBoard.findIndex((el : any) => el.action.includes('plot'))
  ////console.log(' isVVVVVVVVVVVVVVVVVVValidPlot  ',plotObjectIndex)
  if ( plotObjectIndex == -1 || this.linkOne !=''){
    //alert(' Cannot  run Plot Pipe line  : select pipe without plot ')
     return 0
  }else 
    return 1
  }

  showDf(){
  if (this.getTypeLastShip()=='statCol')   {
    this.selectedButton='run';
    this.showColStat()

    return 0
  }
   const indexOfInvalid=this.getInvalidModule();
  if (indexOfInvalid >=0  ) {

    alert(' pipe line is Invalid check config file for all noeud: \n'+this.shipsInBoard[indexOfInvalid]['action'])
    return 0
  }
  const checkedString=this.checkAllNoeaudControle();
  if (checkedString.length >0 ) {
  alert(' test checkAllNoeaudControle '+checkedString.toString())
  return 0;
  }

  this.echangeData.data=[]
  this.echangeData.type='df'
  this.echangeData.actionColumns=['Download']
    if ( !this.checkUnlinkedObject() ){
        const linkOneTmp=this.linkOne;
      this.clearSelect()
      this.linkOne=linkOneTmp;
      this.selectedButton='run';
      const pipeObject=this.partialPipeObject();
      const plotObject=pipeObject.find((el : any) => el.action.includes('plot'))
  if ( plotObject != undefined){
    alert(' Cannot  run Plot Pipe line  : select pipe without plot ')
     return 0
  }
  console.log(' showDf partialPipeObject ttttttttttttttttt  ',pipeObject)
  this.stringDate = this.myDate.getFullYear()  + this.myDate.getMonth()  + ('0' + this.myDate.getDate()).slice(-2)+this.myDate.getHours()+this.myDate.getMinutes()+this.myDate.getSeconds()+this.myDate.getUTCMilliseconds() ;

  this.logFileName=this.logFileBaseName+'_'+this.stringDate;

  this.logInfoFlagGo=true
  const pipeProject = { logFile:this.logFileName,user:localStorage.getItem('user'),langage:this.plateformForm.controls['plateform'].value, pipeObject:pipeObject}
  this.runCodeService.executePipeGetDf(pipeProject).subscribe(
      resultat => {
         this.data=resultat;
         
         
        if (  this.getTypeLastShip() == 'saveML_Model')
        {
         this.echangeData.actionColumns = ['Download']
         } 
         if (resultat.length>0 ){
        this.echangeData.data=this.data
        //this.statDataDf=  this.getStatDf()
        console.log(' stat df ',this.statDataDf)
        
         }   else 
        { this.echangeData.data=[{"dataFrame":[]}]
        alert('No Data to display !!!!!!!!!!!')
        }
        console.log(' lllllllllllllllllllllllog ',this.echangeData.data)
        
         if ( Object.keys(this.echangeData.data[0])[0].toUpperCase().includes('ERROR')) this.exceptionCode=1
        else this.exceptionCode=0
         //21/02/2022 add this.selectedButton to 'run'
         // this.selectedButton=''
         setTimeout(() => {
          this.logInfoFlagGo=false
      }, 5000);
        
      },
      error => {
                alert(' service Indisponible ');
                this.selectedButton='service Indisponible';
              }
    );
  }
    else 
    alert(' Pipe line Invalide : unlinked Object ')

  return 0;

  }

  showColStat(){

    if (!this.checkUnlinkedObject()) {
  //this.runCodeService.getResultApi().subscribe(

    var statData:any[]=[]
    var importedData:any[]=[ {'released': {"Yes":4334,"No":892}}, {'colour': {"White":3938,"Black":1288}}, {'year': {"2000":1270,"2001":1211,"1999":1099,"1998":877,"1997":492,"2002":277}}, {'age': {"18":476,"19":473,"17":443,"20":398,"21":382,"16":307,"22":287,"23":240,"24":219,"15":202}}, {'sex': {"Male":4774,"Female":442,"nan":10}}, {'employed': {"Yes":4111,"No":1115}}, {'citizen': {"Yes":4455,"No":771}}, {'checks': {"0":1851,"3":953,"1":854,"2":789,"4":643,"5":127,"6":9}}];
    const pipeProject = { logFile:this.logFileName,user:localStorage.getItem('user'),langage:this.plateformForm.controls['plateform'].value, pipeObject:this.shipsInBoard}
     
    this.runCodeService.executePipeGetColStat(pipeProject).subscribe(
        resultat => {
        importedData=resultat;
        console.log(' executePipeGetColStat ',JSON.stringify(Object.keys(resultat[0]).includes('Error')));
        if (!Object.keys(resultat[0]).includes('Error')){
        this.statDataDf=  this.formatStatData(importedData)
        //this.selectedButton='';
        
    }else alert("Error : fetch Data Error ")
    setTimeout(() => {
          //this.logInfoFlagGo=false
          console.log(' executePipeGetColStat TimeOut')
  
          this.selectedButton='';
      }, 1000);
      },error => {
        console.log(' executePipeGetColStat Error ',);
      
      });
    

  }else {
    alert(' Check Pipeline : Unlink Object ')
  }
  }

  showCount(){
  //to be verified
   // this.openFolderModal();
  this.checkUnlinkedObject()
  
  this.runCodeService.executePipeGetCount(this.shipsInBoard).subscribe(
      resultat => {
        //////console.log(' runCodeService ',resultat)
      }
    );

  }
  checkUnlinkedObject(){
  var ar:any[]=[]
  for (var i = 0; i < this.shipsInBoard.length; i++) {
      //////console.log(' checkUnlinkedObject previous', this.shipsInBoard[i]['previous'].length)
       //////console.log(' checkUnlinkedObject next', this.shipsInBoard[i]['next'].length)

      if (this.shipsInBoard[i]['previous'].length == 0 && this.shipsInBoard[i]['next'].length == 0) {
        ar.push(this.shipsInBoard[i]['previous']);
      }
    }
    ////console.log(' unlinked length ',ar.length,   '  type ',this.shipsInBoard[0]['type'])
    if (ar.length > 1 || (ar.length==1 && this.shipsInBoard[0]['type']!="input" ))
    return true 
    else 
    return false
    

  }

  deleteElement(flag:number){
    var event:any
    var index=0
    var indexToRemove=0;
    console.log(' deleteElement this.linkOne ',this.linkOne)
    var id=this.linkOne+''
    let  idmodule=this.shipsInBoard.find((el : any) => el.id==id)
    console.log(' deleteElement idmodule ',idmodule)
    if (this.linkOne != '') {
      // this.linkOne = event['id']
      event = this.shipsInBoard.find((el : any) => el.id == this.linkOne)
      //this.selectedButton=''
      console.log(' deleteElement object ',event)
      if (event['previous'].length > 0) {
        var previous = event['previous']
        // for  all previous remove next
        ////console.log(' previous ',previous)
        for (var i = 0; i < previous.length; i++) {
          index = this.shipsInBoard.findIndex((el : any) => el.idmodule == previous[i])
          ////console.log(' index ',index)
          ////console.log(' this.shipsInBoard[index][next] ',this.shipsInBoard[index]['next'])
          indexToRemove = this.shipsInBoard[index]['next'].findIndex((el : any) => el == idmodule)
          //////console.log(' indexToRemove ',indexToRemove)
          this.shipsInBoard[index]['next'].splice(indexToRemove, 1);
          ////console.log(' After this.shipsInBoard[index][next] ',this.shipsInBoard[index]['next'])
        }
      }
      // for  all previous remove next
      if (event['next'].length > 0) {
        var next = event['next']
        for (var i = 0; i < next.length; i++) {
          index = this.shipsInBoard.findIndex((el : any) => el.idmodule == next[i])
          indexToRemove = this.shipsInBoard[index]['previous'].findIndex((el : any) => el == idmodule)
          this.shipsInBoard[index]['previous'].splice(indexToRemove, 1);
          //////console.log(' After this.shipsInBoard[index][previous] ',this.shipsInBoard[index]['previous'])
        }
      }

      if (flag == 1) {
        this.shipsInBoard.splice(0, 1);
      } else {
        this.shipsInBoard[0]['next'] = []
        this.shipsInBoard[0]['previous'] = []
      }
      //
      this.clearSelect();
      this.buildNarrow();
      this.paletteBar = false
      this.selectedButton = 'buildNarrow'
      this.linkOne = ''
      this.initColor();
    }else

    if (window.confirm(' Delete the projet  : Are you sure ?')){
      this.shipsInBoard=[]
      localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
      this.paletteBar = false
      this.linkOne = ''
      this.buildNarrow()
      this.send.SendProject.next({});
      this.childC.updateProject()
    }
    
  }
////////////////////////////: last controle 23032022
arrayIsInclude(arr1:any,arr2:any){
  for (var i=0;i<arr1.length;i++)
    if (!arr2.includes(arr1[i])) return false
  return true
  }
  checkAllNoeaudControle(){
    var ar=[]
    var previous=[]
    //"controlePrevious":['yDf','MLPredict']
    for (var i = 0; i < this.shipsInBoard.length; i++) {
     // console.log(this.shipsInBoard[i]['idmodule'],' ---->>>>>>>>>>>>>>  ',this.shipsInBoard[i]['controlePrevious'])
      if ( this.shipsInBoard[i]['controlePrevious'] != undefined){
      previous=this.shipsInBoard[i]['previous'];
      previous=previous.map((el : any) => el=el.replace(/[0-9]/g, ''));
      console.log(previous,' ::::   ',this.arrayIsInclude(this.shipsInBoard[i]['controlePrevious'],previous))
      if (!this.arrayIsInclude(this.shipsInBoard[i]['controlePrevious'],previous)){
         ar.push(this.shipsInBoard[i]['idmodule']);
         
      }
      }
    }
      ////console.log(' unlinked length ',ar.length,   '  type ',this.shipsInBoard[0]['type'])
      //if (ar.length > 1 )
      //return true 
      //else 
      //return false
      return ar
  }

  getInitColumnSelected(module:any){
    const columns = module['columns']
    var t=[]
    for (var el in columns)
      t.push(module['initColumns'].find((e:any) => e.column==columns[el]))
    return t
  }

  saveProject1(){

  }


showSave(title:string) {
  let  projectConf:any={};

  const projectConfString = localStorage.getItem("projectConf");


  if (projectConfString !== null) {
    // Parse the string value to JSON
     projectConf = JSON.parse(projectConfString);

    // Now you can use the parsed JSON object
    console.log(projectConf);
} else {
    // Handle the case where the value is null
    console.error("No 'projectConf' found in localStorage.");
}
  
  console.log(' addddddddd showSave ddddddddddddd ',JSON.stringify(projectConf))

  const dialogConfig = new MatDialogConfig();
  dialogConfig.id = "modal-save"; //css style defined on style.scss
  dialogConfig.height = "450px"; //height
  dialogConfig.width = "800px"; //width
  dialogConfig.data = {"fileName":projectConf["fileName"],"title":title}; //width

  //https://material.angular.io/components/dialog/overview
  localStorage.setItem('data',JSON.stringify(this.shipsInBoard))

  const modalDialog = this.matDialog.open(SaveComponent, dialogConfig); //call the 
  
  modalDialog.afterClosed().subscribe(result => {
      if(result.fileName != ''){
         console.log(' addddddddd SaveComponent ddddddddddddd ',result.fileName)
         this.send.SendProject.next(result);
         this.childC.updateProject()
         
      }
     });
}


saveProjectServeur(){
const projectConfString = localStorage.getItem("projectConf");
if ( projectConfString !== null  ){
let project =JSON.parse(projectConfString)

if ( project["fileName"]==""){
  this.showSave(" Save Project As ")
  return 0
}
let dateCreation = moment().format('MMMM Do YYYY, h:mm:ss a'); // get the system date with moment library
   
console.log(' saveProjectServeur ',localStorage.getItem("projectConf"))
project.data=this.shipsInBoard
project.update=dateCreation
project.user=localStorage.getItem('user')
console.log(' saveProjectServeur ',JSON.stringify(project))
this.runCodeService.executeSavePipe(project).subscribe(
  resultat => {

    if (resultat[0]["data"]==1) {
      alert('  file     '+project.fileName+".json   "+"succefull saved")
      localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
      localStorage.setItem('projectConf',JSON.stringify(this.projectConf))

      }else {
      alert('Error   file     '+project.fileName+".json   "+"not  saved")

      }
  });
  return 0;
}
return 0;
}
saveCronServeur(){
  let dateCreation = moment().format('MMMM Do YYYY, h:mm:ss a'); // get the system date with moment library
     
  console.log(' saveCronServeur ',localStorage.getItem("projectConf"))
  let project =JSON.parse(localStorage.getItem("projectConf")!)
  project.data=this.shipsInBoard
  project.update=dateCreation
  console.log(' saveCronServeur ',JSON.stringify(project))
  project['user']=localStorage.getItem('user')
 
  this.runCodeService.executeSaveCron(project).subscribe(
    resultat => {
  
      if (resultat[0]["data"]==1) {
        alert('  file     '+project.fileName+".json   "+"succefull saved")
        localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
        localStorage.setItem('projectConf',JSON.stringify(this.projectConf))
  
        }else {
        alert('Error   file     '+project.fileName+".json   "+"not  saved")
  
        }
    });
  }
  



  saveProject(){
    let body = document.body;
          const a = document.createElement("a");
          let st=JSON.stringify(this.shipsInBoard, null, 2) 
          //this.dataSource.data.forEach((el : any) => st=st+el.code+'\n');
          a.href = URL.createObjectURL(new Blob([st], {
              type: "application/json"
          }));
          a.setAttribute("download", "data.json");
          body.appendChild(a);
          a.click();
          body.removeChild(a);
    
  }

  //add element : 
  //var index = this.shipsInBoard.findIndex((el : any) => el.id == this.linkOne)
  //event from doubleClickEvent : current Object 
  //Attachecd Next of index of previous  to event object
  //Attached add previous of event to module of index
  // 23/01/2022 add initColumns event to columns of previous 
  checkLinkObject(event:any,index:number){
    console.log(' add Element <<<<<<<<<<<<<<<<  event id ',event['idmodule'],' ship id ',this.shipsInBoard[index]['idmodule'])
 
    if ( this.shipsInBoard[index]['type'] =='output' || 
    this.shipsInBoard[index]['type'] =='debug' ||
    this.shipsInBoard[index]['type'] =='sending' ||
    (this.shipsInBoard[index]['type']=='treat' && this.shipsInBoard[index]['previous'].length==0)) return 0;
    if (event['type'] == 'input') return 0;
    if (event['idmodule']==this.shipsInBoard[index]['idmodule']) return 0;
    if (!this.isValidModule(this.shipsInBoard[index])) return 0;
    if ( event['link_from']!=undefined && !event['link_from'].includes(this.shipsInBoard[index]['name']) )
    return 0
 
    
    if ( this.shipsInBoard[index]['link_to']!=undefined && !this.shipsInBoard[index]['link_to'].includes(event['name']) )
    return 0
    else return 1
      
    
  }
  addElement(event:any,index:number){
      console.log(' add Element <<<<<<<<<<<<<<<<  event id ',event['idmodule'],' ship id ',this.shipsInBoard[index]['idmodule'])
      var addFalg=true
      var el =event['idmodule'];
      /*if ( this.shipsInBoard[index]['type'] =='output' ) return 0;
      if (event['type'] == 'input') return 0;*/
      if (!this.checkLinkObject(event,index)) {
        //////console.log('  erreur dont link the some object ')
      alert( "Error : link not alloweded ")
      return 0;
      }
      if (event['action'] == 'xDf' || event['action'] == 'yDf') 
        if (this.shipsInBoard[index]['action'] == 'SplitTrainTest')
        addFalg = true;
        else  addFalg = false

    if (this.shipsInBoard[index]['action'] == 'SplitTrainTest')
      if (event['action'] == 'xDf' || event['action'] == 'yDf') {
        //////console.log('  erreur dont link the some object ')
        addFalg = true;
      } else
        addFalg = false

      if ( !this.shipsInBoard[index]['next'].includes(el) && addFalg) {
        this.shipsInBoard[index]['next'].push(el);
        //var indexPrevious = this.shipsInBoard.findIndex((el : any) => el.id == el+'')
        this.shipsInBoard[0]['previous'].push(this.shipsInBoard[index]['idmodule']);
        //this.shipsInBoard[0]['columns']=this.shipsInBoard[index]['outPutColumns']
        // add columns with merge previous
        let ar1=this.shipsInBoard[0]['columns']
        let ar2=this.shipsInBoard[index]['outPutColumns']
        let intersection = ar1.filter((x:string) => ar2.includes(x))
        let inter=ar2.filter((x:string) => !(ar1.includes(x.toUpperCase())||ar1.includes(x.toLowerCase())))
        this.shipsInBoard[0]['columns']=ar1.concat(inter)
        console.log(' columns After Add ',this.shipsInBoard[0]['columns'])
        
        
        // 23/01/2022 add initColumns event to columns of previous 
        this.shipsInBoard[0]['initColumns']=this.arrayToColumnsObject(this.shipsInBoard[index]['outPutColumns']) //this.getInitColumnSelected(this.shipsInBoard[index])
        
        console.log('  after link previous  ',this.shipsInBoard[index])
        console.log('  after link colums ',this.shipsInBoard[0])
    
        /*if (  this.shipsInBoard[index]['action'] != 'aggGroupBy'){
          this.shipsInBoard[0]['outPutColumns']=this.shipsInBoard[index]['columns']
          }*/
          if ( this.shipsInBoard[index]['action'] =='aggGroupBy' ||  this.shipsInBoard[index]['action'] =='ImpalaAgg') {
            const col =(this.shipsInBoard[index]['form']['Function']['value']).concat(this.shipsInBoard[index]['form']['Agg_Column']['value'])
            this.shipsInBoard[index]['outPutColumns']=(this.shipsInBoard[index]['columns']).concat(col)
            console.log(' add Element outPutColumns  colfunction   ',col,'   ',this.shipsInBoard[index]['outPutColumns'])
         }
         else {
           this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns']
   
         }
         /*if ( this.shipsInBoard[0]['type']=='debug' ){
          console.log(' debug ship ',this.shipsInBoard[0])
          this.shipsInBoard[0]['valueCode']= this.shipsInBoard[0]['valueCode'].replace(/previousModule/g,this.shipsInBoard[index]['idmodule'] )
          this.shipsInBoard[0]['valueCode']= this.shipsInBoard[0]['valueCode'].replace(/currentModule/g,this.shipsInBoard[0]['idmodule'] )  
        }*/
        return 1;
      }else {
        return 0
      }
  }

  buildNarrow() {
    this.narrowArray = []
    this.narArray = []
    this.cercleArray = []
    var  ob1, ob2: {}
    var index = -1;
    //////console.log(' this.shipsInBoard ',this.shipsInBoard)
    // for ( var i=this.shipsInBoard.length-1;i>0;i--){
    for (var i = 0; i < this.shipsInBoard.length; i++) {
      ob1 = this.shipsInBoard[i]
      // ob2=this.shipsInBoard[i-1]
      //if (ob1.next != '') {
      if (ob1.next.length>0) {
        ////////console.log(' this.shipsInBoard ', this.shipsInBoard, '  this.getNext(ob1.name) ', this.getNext(ob1.name))
        //index = this.getNextId(ob1.next)
        
        for (var j = 0; j < ob1.next.length ; j++){

            index = this.getNextId(ob1.next[j])
        
            //////console.log(' index ', index)
            if (index >= 0) {
                ob2 = this.shipsInBoard[index]
                //////console.log(' ob1 & ob2 ', ob1, '   ', ob2)
                this.linkObject(ob1, ob2)
            }
        }   
      }
    }
   }

  linkObject(ob1:any, ob2:any) {
    var na = 0
    var ob: {}
    var start, end: any;
    var firstPointAttached = '';
    var lastPointAttached = '';
    var ang = 0;
    var p0, p1, p2: {}
    var index = -1;
    firstPointAttached = this.choiseAttachedPoint({ x: ob1['left'], y: ob1['top'] }, { x: ob2['left'], y: ob2['top'] }).f!;
    ////console.log('choiseAttachedPoint ', this.choiseAttachedPoint({ x: ob1['left'], y: ob1['top'] }, { x: ob2['left'], y: ob2['top'] }));
    lastPointAttached = this.choiseAttachedPoint({ x: ob1['left'], y: ob1['top'] }, { x: ob2['left'], y: ob2['top'] }).l!;
    //////console.log('  firstPointAttached  ', firstPointAttached, '  ', lastPointAttached);
    start = this.getXYAttachedPoint(firstPointAttached, ob1['left'], ob1['top'], this.widthBox, this.widthBox);
    //////console.log(' start ', start)
    end = this.getXYAttachedPoint(lastPointAttached, ob2['left'], ob2['top'], this.widthBox, this.widthBox);
    //////console.log(' end ', end)
    ob = { x1: start['x'], y1: start['y'], x2: end['x'], y2: end['y'] }
    ang = this.angle(start['x'], start['y'], end['x'], end['y'])
    this.narrowArray.push(ob)
    p0 = { x: end['x'], y: end['y'] }
    //////console.log(' p0 ', p0)
    p1 = this.rotate({ x: end['x'] - 5, y: end['y'] + 5 }, { x: end['x'], y: end['y'] }, ang)
    p2 = this.rotate({ x: end['x'] - 5, y: end['y'] - 5 }, { x: end['x'], y: end['y'] }, ang)
    ////console.log('ang  ', ang, ' p1   p2', p1, '  ', p2)
    this.narArray.push({ p0: p0, p1: p1, p2 })
    this.cercleArray.push({ x: start['x'], y: start['y'] })

  }

  getIndexId(ar: any[], value: number) {
    for (var i = 0; i < ar.length; i++) {
      if (ar[i].id == value) {
        return i
      }
    }
    return -1;
  }
  
  getIndexIdModule(ar: any[], value: String) {
    //console.log(value,' getIndexIdMMMMMMMMMModule ',ar)
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].idmodule == value) {
          return i
        }
      }
      return -1;
    }
    

  
  getPreviousById(ar:any,value:string){
    var i=this.getIndexIdModule(ar, value)
    if ( i >=0 ) return ar[i].previous
    else return []
    
    }
addElementToArray(tmpPrev:[],prev:any[]){
  for (var el in tmpPrev) {
    prev.push(tmpPrev[el])
  }
}
getAllPrevious(allObjs:any, valueArray:any, prev:any) {
  var tmpPrev = []
  for (var el in valueArray) {
    tmpPrev = this.getPreviousById(allObjs, valueArray[el])
    if (tmpPrev.length > 0) {
      for (var el in tmpPrev) {
        prev.push(tmpPrev[el])
      }
    }
    this.getAllPrevious(allObjs, tmpPrev, prev)

  }
}
    

  getIndex(ar: any[], value: string) {
    for (var i = 0; i < ar.length; i++) {
      if (ar[i].name == value) {
        return i
      }
    }
    return -1;
  }
  arraymove(arr:any, fromIndex:any, toIndex:any) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
  onMouseDown(event: any) {
    ////console.log('  onMouseDownonMouseDownonMouseDown  ', event);
    ////console.log(' MouseDown  :    this.selectedButton  ',this.selectedButton)
   // ////console.log(' MouseDown  :    this.linkOne  ',this.linkOne)
    this.echangeData.data=[]
    this.echangeData.actionColumns=[]
    this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
    //this.mycurrentIndex = this.getIndex(this.shipsInBoard, event["name"])
    this.mycurrentIndex = this.getIndexId(this.shipsInBoard, event["id"])
    this.arraymove(this.shipsInBoard, this.mycurrentIndex, 0)
    this.mycurrentIndex = 0
    //console.log(event["name"] + "   getIndex   ", this.getIndex(this.shipsInBoard, event["name"]))
    //this.arrowFlag=false
  }

  getLast(){
    let result=[]
    for (var i = 0; i < this.shipsInBoard.length; i++)
    {
      if  ( this.shipsInBoard[i].next == undefined || this.shipsInBoard[i].next.length ==0 )
        {
        console.log(' getLast has no next ', this.shipsInBoard[i] )
        result.push(this.shipsInBoard[i])
        }
    }
  
    return  result

  }

  getTypeLastShip(){
    if (this.linkOne != '') {
      let event = this.shipsInBoard.find((el : any) => el.id == this.linkOne)
      ////console.log(' getTypeLastShip()  ', event['action'])

      return event['action']
    } else {
      const module = this.shipsInBoard.find((el : any) => el.next.length == 0)
      return module['action']
    }

  }

  isLastShipHasNext(){
    if ( this.linkOne!='' ){
    let event=this.shipsInBoard.find((el : any) => el.id==this.linkOne)
    //console.log(' isLastShipHasNext ',event)
    return event['next'].length==0
    }else 
    return false
 
   }
  
 buildPartialPipe(moduleArray:any){
   var idmodule = ''
   var partialShitOnBoard :any= []
   var index = -1
   var ob = {}
   const initObjectArray = cloneDeep(this.shipsInBoard);
   for (var i in initObjectArray) {
     idmodule = initObjectArray[i]['idmodule']
     index = moduleArray.findIndex((element:any) => element == idmodule);
     //initObjectArray[i]['columns'] = []
     if (index >= 0) {
       ob = initObjectArray[i];
       partialShitOnBoard.push(ob);
       if (index == 0) {
         partialShitOnBoard[partialShitOnBoard.length - 1]['next'] = [];
       }
     }
   }
   return partialShitOnBoard;
 }

 buildPartialPipeConf(moduleArray:any){
  var idmodule = ''
  var partialShitOnBoard :any= []
  var index = -1
  var ob = {}
  const initObjectArray = cloneDeep(this.shipsInBoard);
  //last change 27/12/2021 23:26 indexObjectSelected
  var indexObjectSelected = initObjectArray.findIndex((el : any) => el.id == this.linkOne)
  for (var i in initObjectArray) {
    idmodule = initObjectArray[i]['idmodule']
    index = moduleArray.findIndex((element:any) => element == idmodule);
    //last change 27/12/2021 add if before for all 
    if ( i == indexObjectSelected+'' )   initObjectArray[i]['columns'] = []
    if (index >= 0) {
      ob = initObjectArray[i];
      partialShitOnBoard.push(ob);
      if (index == 0) {
        partialShitOnBoard[partialShitOnBoard.length - 1]['next'] = [];
      }
    }
  }
  return partialShitOnBoard;
}

buildPartial1PipeConf(moduleArray:any){
  var idmodule = ''
  var partialShitOnBoard :any = []
  var index = -1
  var ob = {}
  const initObjectArray = cloneDeep(this.shipsInBoard);
  //last change 27/12/2021 23:26 indexObjectSelected
  var indexObjectSelected = initObjectArray.findIndex((el : any) => el.id == this.linkOne)
  for (var i in initObjectArray) {
    idmodule = initObjectArray[i]['idmodule']
    index = moduleArray.findIndex((element:any) => element == idmodule);
    //last change 27/12/2021 add if before for all 
    if ( i == indexObjectSelected+'' )   initObjectArray[i]['columns'] = []
    if (index > 0) {
      ob = initObjectArray[i];
      partialShitOnBoard.push(ob);
      if (index == 1) {
        partialShitOnBoard[partialShitOnBoard.length - 1]['next'] = [];
      }
    }
  }
  return partialShitOnBoard;
}

partialObjectIdModule(idModule:any){
  var prev = []
  var index;
  //console.log(' partialObjectIdModule ',idModule)
  this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
  //////console.log(' this.selectedButton ',this.selectedButton)
  //console.log(' this.shipsInBoard.length this.shipsInBoard.length  ',this.shipsInBoard.length)
  if (this.shipsInBoard.length > 1 ) {
    index = this.getIndexIdModule(this.shipsInBoard, idModule)
    console.log(' partialObjectIdModule  index ',index)
    //this.arraymove(this.shipsInBoard, index, 0)

    prev.push(this.shipsInBoard[index]['idmodule'])
    if (this.shipsInBoard[index]['previous'].length > 0) {
      //////console.log('  prev[0]    ',prev[0])//prev[0]['next']=[]
      console.log(' previouuuuuuuuuuuuuuuuus ',this.shipsInBoard[index]['previous'])
      this.addElementToArray(this.shipsInBoard[index]['previous'], prev)
      ////console.log(' previouuuuuuuuuuuuuuuuus prev ',prev)
      this.getAllPrevious(this.shipsInBoard, this.shipsInBoard[index]['previous'], prev)
      //////console.log(' this.conf element prev ',prev)
      //////console.log(' shipInBoard ',this.shipsInBoard)
    }
    let  partialPipeObject = this.buildPartialPipe(prev);
    ////console.log(' partialPipeObject ttttttttttttttttttt ',partialPipeObject)
    return partialPipeObject;
  } else {
    return this.shipsInBoard
  }

}





 // when click return all precedent object
 partialPipeObject(){
   var prev = []
   var index;
   ////console.log(' partialPipeObject ttttt')
   this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
   //////console.log(' this.selectedButton ',this.selectedButton)
   //////console.log(' conf element link obj ',this.linkOne)
   if (this.shipsInBoard.length > 1 && this.linkOne != '') {
     index = this.getIndexId(this.shipsInBoard, Number(this.linkOne))
     this.arraymove(this.shipsInBoard, index, 0)

     prev.push(this.shipsInBoard[index]['idmodule'])
     if (this.shipsInBoard[index]['previous'].length > 0) {
       //////console.log('  prev[0]    ',prev[0])//prev[0]['next']=[]
       //////console.log(' previouuuuuuuuuuuuuuuuus ',this.shipsInBoard[index]['previous'])
       this.addElementToArray(this.shipsInBoard[index]['previous'], prev)
       //prev.push(this.shipsInBoard[index]['previous'])
       this.getAllPrevious(this.shipsInBoard, this.shipsInBoard[index]['previous'], prev)
       //////console.log(' this.conf element prev ',prev)
       //////console.log(' shipInBoard ',this.shipsInBoard)
     }
     let  partialPipeObject = this.buildPartialPipe(prev);
     ////console.log(' partialPipeObject ttttttttttttttttttt ',partialPipeObject)
     return partialPipeObject;
   } else {
     return this.shipsInBoard
   }

}


  
goConfElement(){
  if ( this.linkOne !='' ){
     return ((this.getTypeLastShip()=='sCol' || this.getTypeLastShip()=='aggGroupBy' || this.getTypeLastShip()=='ImpalaAgg' || this.getTypeLastShip()=='inputCSV' 
    || this.getTypeLastShip()=='ImpalaDb'  || this.getTypeLastShip()=='inputJSON' || this.getTypeLastShip()=='inputExcel' || this.getTypeLastShip()=='folderInput' ) 
    && this.isLastShipHasNext()  && this.shipsInBoard[this.mycurrentIndex]['initColumns'].length>0 && typeof this.echangeDataConf.data != undefined && this.echangeDataConf.data.length>0)
  }
  else 
  return false
}

// button select 
actionHandler1(data:any){
//  console.log('parent  validate data '+JSON.stringify(data))
let modelName =data.data[0]['model'];
alert(modelName+'  actionHandler 1'+JSON.stringify(data))
if ( data.action =='Download' ){
  this.runCodeService.downloadModel(data.data[0]['model']).subscribe(
    data=>{
      let downloadURL = window.URL.createObjectURL(data);
      // to be verified 
      //saveAs(downloadURL,modelName);
      this.downloadBase64Image(downloadURL,modelName);
    
    }
  );

  }
}


  actionHandler(data:any){
    var idModule;
    var groubyAxe=[]
    var aggVerbe=[]
    //console.log('parent  validate data '+JSON.stringify(data))
    if (this.linkOne == '' || this.linkOne == undefined ) {
      idModule=this.shipsInBoard[0]['id'];
    }else {
      idModule=this.linkOne;
    }
    ////console.log('all object  ',this.shipsInBoard)
    const index = this.getIndexId(this.shipsInBoard,Number(this.linkOne))
    ////console.log('selected object idModule ',idModule,' index ',index)
    
     const ar=data.data.map((el:any)=> el['column'])
    //console.log('parent  validate data ',ar)
    if (ar.length==0 && this.shipsInBoard[index]['action'] !='ImpalaAgg' ) alert('you should select one or more columns')
    else {
      //!!! modif 23/04/2022 this.shipsInBoard[index]['columns']=ar
      //console.log('parent  validate data ??????????????  ',this.shipsInBoard[index]['columns'])
      this.shipsInBoard[index]['columns']=ar;
      //this.shipsInBoard[index]['outPutColumns']=ar;
      if ( this.shipsInBoard[index]['action'] =='aggGroupBy'  || this.shipsInBoard[index]['action'] =='ImpalaAgg') {
        
        const col =(this.shipsInBoard[index]['form']['Function']['value']).concat(this.shipsInBoard[index]['form']['Agg_Column']['value'])
        this.shipsInBoard[index]['outPutColumns']=(this.shipsInBoard[index]['columns']).concat(col)
        //console.log(' actionHandler outPutColumns  colfunction  ',col,'   ',this.shipsInBoard[index]['outPutColumns'])
     }
     else {
       this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns']

     }
     if ( this.shipsInBoard[index]['form']['Query'] !=undefined ) {
     // console.log(' validate update querry ',this.shipsInBoard[index]['columns'].join(','))
      this.shipsInBoard[index]['form']['Query']['value']='select '+this.shipsInBoard[index]['columns'].join(',')+' from  '+this.shipsInBoard[index]['form']['Nom_fichier'].value.replace('.json',' ');
      
      let form =  this.shipsInBoard[index]['form']
 
      let data1 ={action:this.shipsInBoard[index]['action'],id:5,type:this.shipsInBoard[index]['type'],currentModule:[this.shipsInBoard[index]['idmodule']],droppedModules:[],form:form}
     
        this.send.SendMessage.next(data1); // call the subject behavior and send config object to config component
       }
    }

  }

  
  openPlotModal(imageSource:any) {
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus= false;
    dialogConfig.height= '100%',

    dialogConfig.data = imageSource;
    //https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(PlotComponent, dialogConfig);
  }

  
  openFolderModal() {
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus= false;
    dialogConfig.height= '100%';
    dialogConfig.data= 'files';
    //dialogConfig.data = imageSource;
    //https://material.angular.io/components/dialog/overview
   // const modalDialog = this.matDialog.open(FolderTreeComponent, dialogConfig);
    const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
  }
  
  checkDropObject(ship:any){
   if ( ship['type']=='output' || ship['type']=='debug' ){
    //console.log(' ship[type] ',ship['type'])
    return this.shipsInBoardTypeLength(ship)==0 
   }
   else return true

  }
  
  drop(event: CdkDragDrop<any[]>) {

    let clone1 = cloneDeep(event.previousContainer.data);
    console.log(' droppppppppppppp ',event)
    console.log(event.previousIndex, ' droppppppppppppp boardElement ',clone1[event.previousIndex].type)
    if ( !this.checkDropObject(clone1[event.previousIndex]))   return 1
 
    if (localStorage.getItem('projectConf') != null /*&& localStorage.getItem('projectConf').length  >10 */ ){
      
     
      this.clearSelect();
      event.previousContainer.data[event.previousIndex].top = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0
      event.previousContainer.data[event.previousIndex].left = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0
      if (event.previousContainer === event.container) {
        console.log(' dropppp  if 1errrrr    ppppppppp ')
        event.currentIndex = this.mycurrentIndex
        if (this.shipsInBoard.length > 1) { 
        this.buildNarrow()
        //this.link() 
        }
     
    } else {
      let clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      //clone['name'] = clone['name'] + '_' + (Math.random() * 1000).toFixed()
     
      clone['id'] = this.generateUUID().toString();
      clone['idmodule'] = clone['name']+this.generateUUID().toString();
      //////   Attention 15/03/2023
      //clone['action'] = clone['name'];
      clone['action'] = clone['action'];
      ////console.log('clone ', clone)
      console.log(' dropppp  else     ppppppppp ',clone)
      event.container.data.splice(event.currentIndex, 0, clone);

      //clone['name'] = 'test'
      //event.container.data.splice(event.currentIndex, 0, clone);


    }
  }
    //localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
    return 0;
  }

  confFieldModule() {
    let showConf=true 

    if ( this.linkOne =='' ) return; 
    this.selectedButton='conf';

    let index = this.getIndexId(this.shipsInBoard, Number(this.linkOne))
    
    console.log('confFieldModule  this.linkOne ',this.linkOne, ' this.shipsInBoard[index]  ',this.shipsInBoard[index])
   
    let id = Number(this.linkOne)
    let idmodule = this.shipsInBoard[index]['idmodule']
    let action = this.shipsInBoard[index]['action']
    let type = this.shipsInBoard[index]['type']
    console.log(index,' ConfField Object ',this.shipsInBoard)

    if ( ( type =='input') || (type !='input' && this.shipsInBoard[index]['previous'].length > 0)){

    if ( this.shipsInBoard[index]['action']=='pythonCode' && this.shipsInBoard[index]['previous'].length > 0  ){
      showConf=true;
      let idModulePrecedent = this.shipsInBoard[index]['previous'][0]
      let  indexPrecedent=this.shipsInBoard.findIndex((el : any) => el.idmodule==idModulePrecedent)
      
      this.shipsInBoard[index]['form']['Python_Code']['value']=this.shipsInBoard[index]['form']['Python_Code']['value'].replace(/previousModule/g,this.shipsInBoard[indexPrecedent]['idmodule'] )
      this.shipsInBoard[index]['form']['Python_Code']['value']=this.shipsInBoard[index]['form']['Python_Code']['value'].replace(/currentModule/g,this.shipsInBoard[index]['idmodule'] )
      ////console.log(' ConfField Object after replace ',this.shipsInBoard[index]['form']['Python_Code']['value'])
    
    }

    if ( this.shipsInBoard[index]['action']=='inputModule'){

      console.log('  (((((((((((()))))))))))) ')

    }
       
 
        // Generic ParamValue and column 28/01/2023
        if ( this.shipsInBoard[index]["paramValue"] != undefined /*&& this.shipsInBoard[index]["paramValue"].length>0 */){
            for (var i = 0; i < this.shipsInBoard[index]['previous'].length; i++)
                {
                  let idModulePrecedent1 = this.shipsInBoard[index]['previous'][i]
                  let indexPreceden1 = this.shipsInBoard.findIndex((el : any) => el.idmodule == idModulePrecedent1)
                  //let ar1=this.shipsInBoard[index]['columns']
                  //let ar2=this.shipsInBoard[indexPreceden1]['columns']
                  let ar1=this.shipsInBoard[index]['outPutColumns']
                  let ar2=this.shipsInBoard[indexPreceden1]['outPutColumns']
                  let intersection = ar1.filter((x:string) => ar2.includes(x))
                  let inter=ar2.filter((x:string) => !(ar1.includes(x.toUpperCase())||ar1.includes(x.toLowerCase())))
                  if ( this.shipsInBoard[index]['action']!='aggGroupBy')
                  this.shipsInBoard[index]['columns']=ar1.concat(inter)
                  
                  
                  if (this.shipsInBoard[index]["paramValue"][i] != undefined ){
                  let formParamValue=this.shipsInBoard[index]["paramValue"][i]
                  console.log(' formParamValue.length  >>>>>>>>>>>>>>> ', formParamValue.length )
                    for (var j = 0; j < formParamValue.length; j++){
                      console.log(formParamValue[j],' previous >>>>>>>>>>>>>>> ',this.shipsInBoard[index]['previous'][i])
                      console.log(this.shipsInBoard[index]['form'])
                      this.shipsInBoard[index]['form'][formParamValue[j]]['paramValue']=ar2
                    }
                  }
              }
            }
 
    }else {

      showConf=false
    }

    let form =  this.shipsInBoard[index]['form']

    let Projet="Not saved !!!"
    let Version="01"
    let CreatedBy = localStorage.getItem('user')
    let upDate = "10/01/2022"

    let data1 ={action:action,id:5,type:type,currentModule:[this.shipsInBoard[index]['idmodule']],droppedModules:[],form:form}
   
    if (showConf ){
      //if ( this.shipsInBoard[index]['previous'][0].includes("folderInput") )
      this.send.SendMessage.next(data1); // call the subject behavior and send config object to config component
    }
  
  }
//
getColunQuery(query:string){

  const searchFORM = 'FROM';
  const searchSelect = 'SELECT';
  const indexOfFirst = query.toUpperCase().indexOf(searchSelect)+7;
  const indexOfLast = query.toUpperCase().indexOf(searchFORM);

  const l=query.substring(indexOfFirst,indexOfLast ).split(',')
  
  let l1:any=[]
  l.forEach(function(value){
    l1.push(value.trim().split(' ').pop());
  });
  
  return l1

}

//config button
validateConfigField(data:any){
  
  if ( data.length==0 ){
      this.clearSelect()
      return 1
  }
 console.log('validateConfigField  form  ',data)
   var index = this.shipsInBoard.findIndex((el : any) => el.id == this.linkOne)
   this.selectedButton='conf'
 
   var prev=[]
   //collect data field from conf Form
   this.shipsInBoard[index]['form']=data;
    // add column if column_name is not undefine an d not ==''
   if ( this.shipsInBoard[index]['form']['column_name'] !=undefined 
   && this.shipsInBoard[index]['form']['column_name'].value !=''
   /*&& ( this.shipsInBoard[index]['action']=='ImpalaFormatDate' 
         || this.shipsInBoard[index]['action']=='ImpalaFunctCol' 
         || this.shipsInBoard[index]['action']=='ImpalaRank' )*/
   && !this.shipsInBoard[index]['columns'].includes(this.shipsInBoard[index]['form']['column_name'].value)){
  //console.log(this.shipsInBoard[index]['action'],'validateConfigField data columns  befffffffffffffffre '+JSON.stringify(this.shipsInBoard))
  const columnNameValue=this.shipsInBoard[index]['form']['column_name'].value
  const columnValue=this.shipsInBoard[index]['columns']

  this.shipsInBoard[index]['columns']=columnValue.concat([columnNameValue])
  this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns'] ; 
  return 1;
  }

  if ( this.shipsInBoard[index]['action']=='ImpalaDb' ||
  this.shipsInBoard[index]['action']=='ImpalaSql' ||
  this.shipsInBoard[index]['action']=='inputImpalaSql') {
    //let fileContent =this.shipsInBoard[index]['form']['Nom_fichier']['content']
    let columns  =this.shipsInBoard[index]['form']['Query']['columns']
    //fileContent.map(el=>columns.push(el.name))
             
    this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
           
    this.shipsInBoard[index]['columns']=columns
    console.log('validateConfigField data columnssssssssssssssssss ',this.shipsInBoard[index]['columns'])
    this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns'] ; 
    this.shipsInBoard[index]['initColumns'] =[]
    this.shipsInBoard[index]['columns'].forEach((a:string) => {let o:any={} ; o['column']=a; this.shipsInBoard[index]['initColumns'].push(o)})
    console.log('validateConfigField table-fil-sort-pag  data  initColumns  ', this.shipsInBoard[index]['initColumns'])
    //console.log('validateConfigField table-fil-sort-pag  data ',JSON.stringify(this.echangeDataConf.data))
    setTimeout(() => {
    //this.logInfoFlagGo=false
    this.echangeDataConf.selectedRows = this.shipsInBoard[index]['columns']
    this.echangeDataConf.data = this.shipsInBoard[index]['initColumns'] //this.getColumns(this.data)
    this.echangeDataConf.actionColumns = ['Select']
  }, 700);
  
    //this.childSelectCol.refresh()
    //this.childC.update()
    //this.linkOne=linkOneOld
    return 1;
  }
  

console.log('validateConfigField data ',this.shipsInBoard[index]['action'])
if ( this.shipsInBoard[index]['action'] =='aggGroupBy'  ){
  console.log('validateConfigField  action ',this.shipsInBoard[index]['action'])
  let cols =this.shipsInBoard[index]['form']['Function']
  let cols1 =this.shipsInBoard[index]['form']['Agg_Column']
  const col =(this.shipsInBoard[index]['form']['Function']['value']).concat(this.shipsInBoard[index]['form']['Agg_Column']['value'])
  this.shipsInBoard[index]['outPutColumns']=(this.shipsInBoard[index]['columns']).concat(col)
  
   return 1
}

if ( this.shipsInBoard[index]['action']=='folderInput' ||
    this.shipsInBoard[index]['action']=='inputCSV'  || 
    this.shipsInBoard[index]['action']=='inputJSON' ||
    this.shipsInBoard[index]['action']=='inputExcel' ) {
  let columns =this.shipsInBoard[index]['form']['Nom_fichier']['columns']
  this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
         
  this.shipsInBoard[index]['columns']=columns
   console.log('validateConfigField data columns folderInput sssssssssssssssss ',this.shipsInBoard[index]['columns'])
  this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns'] ; 
  this.shipsInBoard[index]['initColumns'] =[]
  this.shipsInBoard[index]['columns'].forEach((a:string) => {let o:any={} ; o['column']=a; this.shipsInBoard[index]['initColumns'].push(o)})
  console.log('validateConfigField table-fil-sort-pag  data  initColumns  ', this.shipsInBoard[index]['initColumns'])
  //console.log('validateConfigField table-fil-sort-pag  data ',JSON.stringify(this.echangeDataConf.data))
  setTimeout(() => {
  //this.logInfoFlagGo=false
  this.echangeDataConf.selectedRows = this.shipsInBoard[index]['columns']
  this.echangeDataConf.data = this.shipsInBoard[index]['initColumns'] //this.getColumns(this.data)
  this.echangeDataConf.actionColumns = ['Select']
}, 700);

  return 1;
}

if ( this.shipsInBoard[index]['action'].toUpperCase().includes('PYTHON')) {
  let columns =this.shipsInBoard[index]['form']['Python_Code']['columns']
  this.echangeDataConf={displayedColumns:[],data:[],actionColumns:[],selectedRows:[]}
  
  let ar1=this.shipsInBoard[index]['columns']
  let ar2=columns
  let intersection = ar1.filter((x:string) => ar2.includes(x))
  let inter=ar2.filter((x:string) => !(ar1.includes(x.toUpperCase())||ar1.includes(x.toLowerCase())))
  this.shipsInBoard[index]['columns']=ar1.concat(inter)


  //this.shipsInBoard[index]['columns']=columns
   console.log('validateConfigField data columns folderInput sssssssssssssssss ',this.shipsInBoard[index]['columns'])
  this.shipsInBoard[index]['outPutColumns']=this.shipsInBoard[index]['columns'] ; 
  this.shipsInBoard[index]['initColumns'] =[]
  this.shipsInBoard[index]['columns'].forEach((a:string) => {let o:any={} ; o['column']=a; this.shipsInBoard[index]['initColumns'].push(o)})
  console.log('validateConfigField table-fil-sort-pag  data  initColumns  ', this.shipsInBoard[index]['initColumns'])
  //console.log('validateConfigField table-fil-sort-pag  data ',JSON.stringify(this.echangeDataConf.data))
  setTimeout(() => {
  //this.logInfoFlagGo=false
  this.echangeDataConf.selectedRows = this.shipsInBoard[index]['columns']
  this.echangeDataConf.data = this.shipsInBoard[index]['initColumns'] //this.getColumns(this.data)
  this.echangeDataConf.actionColumns = ['Select']
}, 700);


  //this.childSelectCol.refresh()
  //this.childC.update()
  //this.linkOne=linkOneOld
  return 1;
}
    //this.childSelectCol.validData()
    console.log('<<<<<<<<<<<<<<<<<<<<<   ',JSON.stringify(this.shipsInBoard))
     return 0;
  }

  onUpdateChild() {
    console.log(' 2228  onUpdateChild()') 
    try {
    this.childC.update();
    }
    catch (err:any){    console.log(err.name + ': "' + err.message +  '" occurred when assigning x.');}
    //this.childSelectCol.update();
  }

  opensnack(text:any) {
var  index =-1
var idmoduleTmp=''
if ( this.logInfoFlagGo &&this.logInfoFlag && (this.selectedButton == 'run' || this.selectedButton == 'plot')){
this.logInfoFlag != this.logInfoFlag
this.runCodeService.getLogInfo(this.logFileName).subscribe(
  resultat => {
    console.log(' runCodeService',resultat['idModule'])
    
    index = this.getIndexIdModule(this.shipsInBoard, resultat['idModule'])
    idmoduleTmp=resultat['idModule']
    console.log(this.logFileName+'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiindex ',index)   
    if ( index >=0 && this.lastExecusionIdModule != idmoduleTmp) {
    this.lastExecusionIdModule = idmoduleTmp;
    this.mainScreen=false
    //this.shipsInBoard[index]['color']='green' 
    this.setColor(idmoduleTmp,"rgb(0, 255, 0)")
    const cloneShitBoard =cloneDeep(this.shipsInBoard)
    this.shipsInBoard=[]
     
    //this.primaryColor='green';
    //cloneShitBoard[index]['color']='green'
    this.shipsInBoard=cloneShitBoard
    this.mainScreen=!this.mainScreen
  }

  },
  error => {

    alert(' error back  !!!!! ');                              //Error callback
      console.error('error caught in component');
      this.selectedButton='service Indisponible';
      throw error;
  }
);
this.logInfoFlag != this.logInfoFlag
}


  // console.log('rrr');
  }

 
  ngOnDestroy() {
    // For method 1
    this.subscription && this.subscription.unsubscribe();

    // For method 2
    clearInterval(this.intervalId);
  }


  cronProject(){

    const uploadData = new FormData();
  
    //let form =  [{type:'uploadfile',label:'Nom fichier',value:""}]
    let form =  [
{type:'select',label:'Minute',value:'*',paramValue:['*','0','5','10','15','20','25','30','35','40','45','50','55']},
{type:'select',label:'Hour',value:'*',paramValue:['*','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']},
{type:'select',label:'day of month',value:'*',paramValue:['*','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']},
{type:'select',label:'Month',value:'*',paramValue:['*','1','2','3','4','5','6','7','8','9','10','11','12']},
{type:'select',label:'day of week',value:'*',paramValue:['*','1','2','3','4','5','6','7']},
{type:'fileServer',label:'Destination',value:"",folder:"cron"}]
  
let data1 ={action:'action',id:5,type:"cron",currentModule:"upload",droppedModules:[],form:form}
    
this.send.SendMessage.next(data1); // call the subject behavior and send config object to config component
      
    
  }

  openProject(){

    var fileName='';
    console.log(' openProject  ');
    if ( this.linkOne != '' ) {
      var index = this.shipsInBoard.findIndex((el : any) => el.id == this.linkOne)
      console.log(' this.linkOne ',this.linkOne)
   
      if ( this.shipsInBoard[index]['action'] =='inputModule') {
        console.log(' openProject    ',this.shipsInBoard[index]['form']['Nom_fichier']['value'])
        fileName=this.shipsInBoard[index]['form']['Nom_fichier']['value'];

        this.runCodeService.getModuleContent(fileName).subscribe(
          content => {
            console.log(fileName,' Module  content ', content.content.data)
            this.shipsInBoard = content.content.data;
            this.langage=content.content.langage;
            console.log(' this.plateformForm ',this.plateformForm)
            this.plateformForm.controls['plateform'].setValue(this.langage)
            this.buildNarrow(); 
            let projectConf = content.content;
            localStorage.setItem("data",JSON.stringify(this.shipsInBoard))
            localStorage.setItem("project",JSON.stringify(content.content))
            delete projectConf.data;
            localStorage.setItem("projectConf", JSON.stringify(projectConf));
            console.log(' addddddddd ProjectContent ddddddddddddd ', localStorage.getItem("projectConf"))
          
            this.send.SendProject.next(projectConf);
            this.childC.updateProject()
          }
        );
        
      } 
  }
  if ( fileName.length > 0  )  return 0 ;
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus = false;
    dialogConfig.height= '100%';
    dialogConfig.data= {user:localStorage.getItem('user'),folder:'projects'};
    //dialogConfig.data = imageSource;
    //https://material.angular.io/components/dialog/overview
    //const modalDialog = this.matDialog.open(FolderTreeComponent, dialogConfig);
    const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
    
  modalDialog.afterClosed().subscribe(result => {
   if(result != undefined && result.data.length>1 ){
        console.log(' adddddddddd  after Close dddddddddddd ',result.data)
        //this.myFormGroup.controls["Nom fichier"].setValue(result.data)
        fileName=localStorage.getItem('user') +':'+result.data
 
     this.runCodeService.getProjectContent(fileName).subscribe(
       content => {
        console.log(' after content  ',content)
        if (Object.keys(content.content).length>0){
         console.log(fileName,' After close  project content ', content.content.data)
         this.shipsInBoard = content.content.data;
         this.buildNarrow();
         this.projectConf = content.content;
         this.langage=content.content.langage;
         console.log(' this.plateformForm buggggggggggg  ',this.projectConf)
         this.plateformForm.controls['plateform'].setValue(this.langage)
         localStorage.setItem("data",JSON.stringify(this.shipsInBoard))
         localStorage.setItem("project",JSON.stringify(content.content))
         delete this.projectConf.data;
         localStorage.setItem("projectConf", JSON.stringify(this.projectConf));
         console.log(' updateModulePanel  addddddddd ProjectContent ddddddddddddd ', localStorage.getItem("projectConf"))
         this.updateModulePanel();
         this.send.SendProject.next(this.projectConf);
         this.childC.updateProject()
        }else alert(' Error wile openning project ')
       }
     );

    }
    //this.csv=result.data;
   });
 
    return 0;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);

  }

  openModuleCode(){
    const dialogConfig = new MatDialogConfig();
    //The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.position= {top: '0%', left: '20%'}
    dialogConfig.id = "modal-component";
    dialogConfig.height = "800px";
    dialogConfig.width = "800px";
    dialogConfig.autoFocus= false;
    dialogConfig.height= '100%';
    dialogConfig.data= {user:localStorage.getItem('user'),folder:'Module'};
    //dialogConfig.data = imageSource;
    //https://material.angular.io/components/dialog/overview
    //const modalDialog = this.matDialog.open(FolderTreeComponent, dialogConfig);
    const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
    
    modalDialog.afterClosed().subscribe(result => {
   if(result != undefined && result.data.length>1 ){
        //console.log(' adddddddddddddddddddddd ',result.data)
        //this.myFormGroup.controls["Nom fichier"].setValue(result.data)

     this.runCodeService.getModuleCodeContent(result.data).subscribe(
       content => {
         console.log(' open Module  code  project content ', content.content.data)
         this.shipsInBoard = content.content.data;
         this.buildNarrow();
         let projectConf = content.content;
         this.langage=content.content.langage;
         localStorage.setItem("data",JSON.stringify(this.shipsInBoard))
         localStorage.setItem("project",JSON.stringify(content.content))
         delete projectConf.data;
         localStorage.setItem("projectConf", JSON.stringify(projectConf));
         console.log(' addddddddd ProjectContent ddddddddddddd ', localStorage.getItem("projectConf"))
         this.send.SendProject.next(projectConf);
         this.childC.updateProject()
       }
     );
 
     }
     //this.csv=result.data;
    });

  }


   formatStatData(obj: { [key: string]: any }[]): any[] {
    let allObj: any[] = [];
  
    obj.forEach(function (app) {
      let label = Object.keys(app)[0];
      let labels = Object.keys(app[label]);
      let data = Object.values(app[label]);
      let oneParcielObj: any = {};
      let oneObj: any = { 'title': label, 'type': '' };
  
      if (labels.length > 1 && labels.length < 4) oneObj['type'] = 'pie';
      if (labels.length > 4) oneObj['type'] = 'bar';
  
      oneObj['labels'] = labels;
      oneParcielObj['data'] = data;
      oneParcielObj['label'] = label;
  
      oneObj['data'] = [oneParcielObj];
      allObj.push(oneObj);
    })
  
    return allObj;
  }
 /*
  formatStatDataOld(obj:any[]){
    let allObj:any=[]
    
    obj.forEach(function(app){
      let label=Object.keys(app)[0];
      let labels =Object.keys(Object.values(app)[0]);
      let data =Object.values(Object.values(app)[0]);
      let oneParcielObj:any={};
      let oneObj:any={'title':label,'type':''};

      if ( labels.length >1 && labels.length <4) oneObj['type']='pie';
      if ( labels.length >4 ) oneObj['type']='bar';
      
      oneObj['labels']=labels;
      oneParcielObj['data']=data;
      oneParcielObj['label']=label;
      
      oneObj['data']=[oneParcielObj]; 
      allObj.push(oneObj);})
    
return allObj


  }*/
getStatDf(){
var statData:any[]=[]
var importedData:any[]=[ {'released': {"Yes":4334,"No":892}}, {'colour': {"White":3938,"Black":1288}}, {'year': {"2000":1270,"2001":1211,"1999":1099,"1998":877,"1997":492,"2002":277}}, {'age': {"18":476,"19":473,"17":443,"20":398,"21":382,"16":307,"22":287,"23":240,"24":219,"15":202}}, {'sex': {"Male":4774,"Female":442,"nan":10}}, {'employed': {"Yes":4111,"No":1115}}, {'citizen': {"Yes":4455,"No":771}}, {'checks': {"0":1851,"3":953,"1":854,"2":789,"4":643,"5":127,"6":9}}];
const pipeProject = { logFile:this.logFileName,user:localStorage.getItem('user'),langage:this.plateformForm.controls['plateform'].value, pipeObject:this.shipsInBoard}
 
this.runCodeService.executePipeGetColStat(pipeProject).subscribe(
   resultat => {
    importedData=resultat;
    console.log(' executePipeGetColStat ',JSON.stringify(resultat));
    
    
  },error => {
    console.log(' executePipeGetColStat Error ',);
    return []
  });

return  this.formatStatData(importedData)

}


navActionHandler(event:any){
  //this.sidenav.close()

console.log(' navActionHandler ',event.data)

if (event.data=="New") {
  if ( this.activeSaveFlag() ) { 
    alert(' save before or cancel change by reload')
    return 0
  }
  //this.openProject() 
  this.shipsInBoard=[];
  this.clearSelect();
  this.buildNarrow();
  localStorage.setItem("data",JSON.stringify(this.shipsInBoard))
 
  let dateCreation = moment().format('MMMM Do YYYY, h:mm:ss a'); // get the system date with moment library
 
  this.projectConf = { fileName: "", version: "01", update:dateCreation,creationDate: dateCreation, auteur: this.user}
  console.log(' New ',this.projectConf)
  this.langage=this.plateformForm.controls['plateform'].value!;
  localStorage.setItem("projectConf",JSON.stringify(this.projectConf)) 
  let project = JSON.parse(localStorage.getItem('projectConf')!);
     project["fileName"]=''
     project["auteur"]=localStorage.getItem('user')
     project["user"]=localStorage.getItem('user')
     project.data=[]
     project.update=dateCreation
     //project["update"]=dateCreation
     delete project["logFile"]
     this.send.SendProject.next(project);
  this.showSave("Enter Project Name ") 

}

if (event.data=="Open") {
  if ( this.activeSaveFlag() ) { 
    alert(' save before or cancel change by reload')
    return 0
  }
  this.openProject()}
if (event.data=="cron") {

  this.router.navigate(['/schedule']);
  //this.cronProject()

}
if (event.data=="Save") {
  
  this.showSave("Save Project As ")
}
if (event.data=="Delete"  ) {
  if (window.confirm(' Delete the projet  : Are you sure ?')){
    this.shipsInBoard=[]
    localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
    localStorage.setItem('projectConf','')
    this.paletteBar = false
    this.linkOne = ''
    this.buildNarrow()
    this.send.SendProject.next({});
    this.childC.updateProject()
  }
  

}
if ( event.data=="Close" ) {
  if ( this.activeSaveFlag() )
  if (window.confirm('Sauvegarder les modifications  apportées au projet  ?')){
    this.saveProjectServeur()
  }
    this.shipsInBoard=[]
    this.projectConf={}
    localStorage.setItem('data',JSON.stringify(this.shipsInBoard))
    localStorage.setItem('projectConf','')
    localStorage.setItem('project','')
    this.paletteBar = false
    this.linkOne = ''
    this.buildNarrow()
    //this.send.SendProject.next({});
    this.send.SendMessage.next({});
    this.childC.updateProject() 
    this.plateformForm.controls['plateform'].setValue('Python')
    this.updateModulePanel()
  
}

if ( event.data=="Upload" ) {
this.uploadFile();

}

if ( event.data=="Download" ) {
  this.openDownLoadFile();
  }
  
  if ( event.data=="DeleteFile" ) {
    this.deleteRemoteFile();
    }
return 0;
}

activeSaveFlag(){
  if ( localStorage.getItem("data") != null){
   var cloneObject=cloneDeep(this.shipsInBoard)
   var cloneStoregeObject=JSON.parse(localStorage.getItem("data")!)
   for(var i=0;i<cloneObject.length;i++){
    delete cloneObject[i].color;
  }
  for(var i=0;i<cloneStoregeObject.length;i++){
    delete cloneStoregeObject[i].color;
  }
 // console.log(cloneObject.length,'cloneObject ',JSON.stringify(cloneObject)!=JSON.stringify(cloneStoregeObject))
  //console.log('cloneStoregeObject ',JSON.stringify(cloneStoregeObject))
      return cloneObject.length > 0 && JSON.stringify(cloneObject) != JSON.stringify(cloneStoregeObject)
  }else return false
  
  }

activeSaveFlag0(){
if ( localStorage.getItem("data") != null){
 const pipeObject=JSON.stringify(this.shipsInBoard)
 //console.log('  pipeObject length ',pipeObject.length)
 //console.log('  storage pipeObject length ',localStorage.getItem("data").length)
  return pipeObject.length > 0 && JSON.stringify(this.shipsInBoard) != localStorage.getItem("data")
}else return false

}
uploadFile(){
this.clearSelect()
  const uploadData = new FormData();

  //let form =  [{type:'uploadfile',label:'Nom fichier',value:""}]
  let form =  [{type:'fileServer',label:'Destination',value:"",folder:""},{type:'uploadfile',label:'Nom fichier',value:""}]


  let data1 ={action:'action',id:5,type:"uploadfile",currentModule:"upload",droppedModules:[],form:form}
  
  
  this.send.SendMessage.next(data1); // call the subject behavior and send config object to config component
    
  
}

deleteRemoteFile(){
  const dialogConfig = new MatDialogConfig();
  //The user can't close the dialog by clicking outside its body
  //dialogConfig.disableClose = true;
  dialogConfig.position= {top: '0%', left: '20%'}
  dialogConfig.id = "modal-component";
  dialogConfig.height = "800px";
  dialogConfig.width = "800px";
  dialogConfig.autoFocus= false;
  dialogConfig.height= '100%';
  dialogConfig.data= {user:localStorage.getItem('user'),folder:''};
  //dialogConfig.data = imageSource;
  //https://material.angular.io/components/dialog/overview
  //const modalDialog = this.matDialog.open(FolderTreeComponent, dialogConfig);
  const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
  
  modalDialog.afterClosed().subscribe(result => {
 if(result != undefined && result.data.length>1 ){
  console.log(' adddddddddddd /////////////////  ddddddd ',result)
  let filePath=result.data;
  const deleteData = new FormData();
  var projectName = "";

  //let projet =  localStorage.getItem('project')["fileName"];
  deleteData.append('filename', filePath);

  deleteData.append('user',localStorage.getItem('user')!);
  const projectString = localStorage.getItem('project');
  if ( projectString !== null ){
    let projectName = JSON.parse(projectString)["fileName"];
 
  //console.log(' deletData  ',localStorage.getItem('project')["fileName"])
  if (projectName !="" && filePath.includes(projectName)){
      alert(' you can t delete currente project')
  }else
  if (window.confirm(' Delete the File   : '+filePath+'\n Are you sure ?')){
      this.runCodeService.deleteFile(deleteData).subscribe(
     // this.httpclient.post<{ 'statut': string, 'fileName': string }>('http://localhost:3000/deleteFile/', deleteData).subscribe(
        content => {
          console.log(' downnloadModel //// ')
          swal.fire('file succeful delete ')
          swal.getConfirmButton()
       }
      
      );
    }
   }
  }
   //this.csv=result.data;
  });

}

openDownLoadFileOld(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.position= {top: '0%', left: '20%'}
  dialogConfig.id = "modal-component";
  dialogConfig.height = "800px";
  dialogConfig.width = "800px";
  dialogConfig.autoFocus= false;
  dialogConfig.height= '100%';
  dialogConfig.data= {user:localStorage.getItem('user'),folder:''};
  //const modalDialog = this.matDialog.open(FolderTreeComponent, dialogConfig);
  const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);
  
 modalDialog.afterClosed().subscribe(result => {
 if(result != undefined && result.data.length>1 ){
  console.log(' adddddddddddd /////////////////  ddddddd ',result)
  let filePath=result.data;
  this.runCodeService.getFileContent(filePath).subscribe(
     content => {
       console.log(' downnloadModel //// ')
      let downloadURL = window.URL.createObjectURL(content);
      let shortNme=filePath.split(':')[filePath.split(':').length-1]
      // to be verified : replace by openDownLoadFile
      //saveAs(downloadURL,shortNme);
     }
   );

   }

  });
}

openDownLoadFile() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.position = { top: '0%', left: '20%' };
  dialogConfig.id = "modal-component";
  dialogConfig.height = "800px";
  dialogConfig.width = "800px";
  dialogConfig.autoFocus = false;
  dialogConfig.height = '100%';
  dialogConfig.data = { user: localStorage.getItem('user'), folder: '' };

  const modalDialog = this.matDialog.open(FileTreeComponent, dialogConfig);

  modalDialog.afterClosed().subscribe(result => {
    if (result !== undefined && result.data.length > 1) {
      let filePath = result.data;
      this.runCodeService.getFileContent(filePath).subscribe(
        content => {
          const blob = new Blob([content], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filePath.split(':').pop()); // Set the filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('Error downloading file:', error);
        }
      );
    }
  });
}

// Create a function to trigger the file download
downloadBase64Image(base64String: string, filename: string) {
  // Create a blob from the base64 encoded string
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the type accordingly

  // Create an anchor element and set its attributes
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;

  // Programmatically trigger the download
  a.click();

  // Clean up
  URL.revokeObjectURL(a.href);
}



}
