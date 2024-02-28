import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarUserComponent } from './components/navbar-user/navbar-user.component';
import { ModalComponent }  from './components/modal/modal.component';
import { SidenavUserComponent } from './components/sidenav-user/sidenav-user.component';
import { DynamicTableListComponent } from './components/dynamic-table-list/dynamic-table-list.component';
import { SidenavListAdminComponent } from './components/sidenav-list-admin/sidenav-list-admin.component';
import { LoginComponent } from './authenticate/login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate/authenticate.component';
import { LayoutComponent } from './layout/layout.component';
import { HelpComponent } from './components/help/help.component';
import { MatTableListComponent } from './components/mat-table-list/mat-table-list.component';
import { MatDialogModule } from '@angular/material/dialog';
//import { MatCheckbox } from '@angular/material/checkbox';
//import { MatRadioButton } from '@angular/material/radio';
import { DataObjectListComponent } from './mainComponent/data-object-list/data-object-list.component';
import { DataObjectCrudComponent } from './mainComponent/data-object-crud/data-object-crud.component';
import { UserListComponent } from './mainComponent/user/user-list/user-list.component';
import { UserCrudComponent } from './mainComponent/user/user-crud/user-crud.component';
import { composantCrudComponent } from "./mainComponent/composant/composant-crud/composant-crud.component";
import { composantListComponent } from "./mainComponent/composant/composant-list/composant-list.component";
import { WorkspaceComponent } from './workspace/workspace.component';
import { ConfigComponent } from './config/config.component';
import { FileTreeMultiComponent } from './components/file-tree-multi/file-tree-multi.component';
//import { TreeviewModule } from 'ngx-treeview';
import { FormsModule } from '@angular/forms';
import { SaveComponent } from './save/save.component';
import { PlotComponent } from './plot/plot.component';
import { NavbarComponent } from './navbar/navbar.component';
//import { DragdropModule } from './dragdrop/dragdrop.module';
import { DragDropModule } from "@angular/cdk/drag-drop";
//import { ResizableDirective } from './resizable.directive';
import { ShipComponent } from './ship/ship.component';
import { PieGraphComponent } from './pie-graph/pie-graph.component';
import { TableFilSortPagComponent } from './table-fil-sort-pag/table-fil-sort-pag.component';
import { SelectColumnFramComponent } from './select-column-fram/select-column-fram.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent 			,
    DynamicTableListComponent,
    NavbarUserComponent 		,
    ModalComponent				,
    SidenavUserComponent 		,  
	  SidenavListAdminComponent,
    LoginComponent, AuthenticateComponent, DataObjectListComponent, 
    LayoutComponent, DataObjectCrudComponent,UserListComponent, 
    HelpComponent, MatTableListComponent, UserCrudComponent,
 composantCrudComponent ,
 composantListComponent,
 WorkspaceComponent,SaveComponent,
 ConfigComponent , FileTreeComponent, FileTreeMultiComponent, PlotComponent, NavbarComponent, ShipComponent, PieGraphComponent,  TableFilSortPagComponent, SelectColumnFramComponent
 
  ],
  imports: [HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,MatDialogModule,
    AppRoutingModule,FormsModule,//TreeviewModule,
    ReactiveFormsModule, DragDropModule
    //, ResizableDirective
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
 
  
 
  
 
  
 
  
 
  
export class AppModule { }
