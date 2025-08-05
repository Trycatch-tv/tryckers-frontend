import { Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { MainLayoutComponent } from "../shared/layouts/main-layout.component";

export const AuthRoutes: Routes = [
  {
   path: '',
   component: MainLayoutComponent,

   children: [
    {
      path: 'login',
      component: LoginPageComponent,
   },
   {
    path: 'register',
    component: RegisterPageComponent,

   },
   {
    path: '**',
    redirectTo: 'login',

   }
  ]

  },

]

export default AuthRoutes;
