import { ViewChild,Input,AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';  
//import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.css']
})



 

export class PieGraphComponent implements OnInit, AfterViewInit {



      /*public numeroError: number = 0;
      public numeroenProgreso: number = 0;
      public numeroFinalizado: number = 0;
    
      public pieChartLabels = ['Personnel','Fix:steg', 'fournisseur','Autre'];
      public pieChartType: ChartType = 'pie';
      public pieChartLegend = true;
      public pieChartPlugins = [];
      public pieChartData = [12540, 7220, 6000,8350];
      public pieCharColors;
    */
      @ViewChild('mycanvas') myCanvas!: ElementRef;

      /** Canvas 2d context */
      private context!: CanvasRenderingContext2D;

      
      @Input()  columnsStatData!: {title:string,type:string,labels:any[],data:any[]};
      /*={title:"Pie Char",labels:['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      data:[
        // {data: [55, 60, 75, 82, 56, 62, 80], label: 'Company A'},
         {data: [58, 55, 60, 79, 66, 57, 90], label: 'Company B'}]};
      */
      public pieChartLabels:string[]=[];// = this.columnsStatData.labels ;//*/['Chrome', 'Safari', 'Firefox','Internet Explorer','Other'];
      public pieChartData:number[]=[] ;//= [58, 55, 60, 79, 66] //this.columnsStatData.data[0].data;
      public pieChartType:string = 'bar'
    
      constructor() { }
    
      ngOnInit(): void {

      
    /*this.pieChartType= 'pie'
    this.pieChartData = this.columnsStatData.data[0].data
    this.pieChartLabels=this.columnsStatData.labels ;//['Chrome', 'Safari', 'Firefox','Internet Explorer','Other'];
    */console.log(' pie pieChartLabels ',this.pieChartLabels)
      
      }

      ngAfterViewInit (){

        this.context = (
          this.myCanvas.nativeElement as HTMLCanvasElement
        ).getContext('2d')!;
        let textLable=this.columnsStatData.labels[0]
        let textData=this.columnsStatData.data[0].data
        //this.context.font = '30px Arial';
        this.context.textBaseline = 'top';
        this.context.textAlign = 'start';
    
        var x = ((this.myCanvas.nativeElement as HTMLCanvasElement).width/ 2)- (textLable.length*4)/2;
        var y = (this.myCanvas.nativeElement as HTMLCanvasElement).height / 2;
        this.context.fillText(textLable, x, y-30);
         x = ((this.myCanvas.nativeElement as HTMLCanvasElement).width / 2)- (textData.length*4)/2;
         y = (this.myCanvas.nativeElement as HTMLCanvasElement).height / 2;
       
        this.context.fillText(textData, x, y);
      }
 

 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
      
    
    
  
  public pieChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false
      }
    }/*,
    tooltips: {
      enabled: true
    }*/
  };
      
    }
