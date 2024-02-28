import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginComponent } from './authenticate/login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate/authenticate.component';
import { AuthenticatorGuard } from './guard/authenticator.guard'
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { HttpClientModule } from "@angular/common/http";
//import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [

  { path: '', redirectTo: '/authenticate', pathMatch: 'full' },
  

  {
    path: 'authenticate', component: AuthenticateComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  //{ path: 'schedule', component: ScheduleComponent, canActivate: [AuthenticatorGuard]},

  { path: 'workspace', component: WorkspaceComponent, canActivate: [AuthenticatorGuard]},

  { path: 'workspace/:projectName', component: WorkspaceComponent, canActivate: [AuthenticatorGuard]}
  //,

  //{ path:'choice' ,component : ChoiceComponent},
 // { path: 'workspace', redirectTo: 'workspace', pathMatch: 'full' }
  //{ path: 'choice', component :ChoiceComponent},
  //{ path: 'workspace/project', component: DragdropComponent }
  //{ path: 'bigdata', component : BigdataComponent },
  //{ path : 'administration' ,component : BackendComponent},
  
  //{ path: 'allmodules', component : AllmodulesComponent },
  //{ path: 'module/details', component : ModuledetailsComponent }
]


export function tokenGetter() {
    return localStorage.getItem('token');
  }
  
  const JWT_Module_Options: JwtModuleOptions = {
    config: {
      tokenGetter: tokenGetter
    }
  };
   
   
  
  @NgModule({
    imports: [RouterModule.forRoot(routes),
    JwtModule.forRoot(JWT_Module_Options),
      HttpClientModule],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }

