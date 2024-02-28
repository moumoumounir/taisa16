import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
//import { MatSelect } from '@angular/material/select';
//import { MatOption } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule} from '@angular/material/slider'; 
import { MatExpansionModule } from '@angular/material/expansion'
import {MatSelectModule} from '@angular/material/select'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
//import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTreeModule} from '@angular/material/tree';
import {MatRadioModule} from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';




//import { MatButton } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    //MatSelect,
    //MatOption,

    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    //MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule, MatBadgeModule
  ],
  exports: [
    //MatSelect,
    //MatOption,
   
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSidenavModule,
    //MatSliderModule,
    //MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    //MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTreeModule,
    MatRadioModule, MatBadgeModule
  ]
})
export class MaterialModule { }
