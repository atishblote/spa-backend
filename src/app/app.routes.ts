import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ServiceComponent } from './pages/service/service.component';
import { SignupComponent } from './pages/signup/signup.component';
import { VarificationComponent } from './pages/varification/varification.component';
import { AllListingComponent } from './pages/all-listing/all-listing.component';
import { CreateListingComponent } from './pages/create-listing/create-listing.component';
import { EditListingComponent } from './pages/edit-listing/edit-listing.component';
import { AddAreaComponent } from './pages/add-area/add-area.component';
import { EmailVarifySendComponent } from './pages/email-varify-send/email-varify-send.component';
import { ConfirmedComponent } from './pages/confirmed/confirmed.component';
import { loginGuard } from './auth/login.guard';
import { AdvertiseComponent } from './pages/advertise/advertise.component';

export const routes: Routes = [
    { path:"", component: LoginComponent },
    { path:"login", component: LoginComponent },
    { path:"signup", component: SignupComponent },
    { path:"varification", component: VarificationComponent },
    { path:"confirmed", component: ConfirmedComponent },
    { path:"email-varify/:id", component: EmailVarifySendComponent },
    { path:"admin", canActivate:[loginGuard] , component: AdminComponent  , children:[
        { path: "all-listing" , canActivate:[loginGuard], component: AllListingComponent},
        { path: "create-listing" ,  canActivate:[loginGuard], component: CreateListingComponent},
        { path: "edit-listing/:id" ,  canActivate:[loginGuard], component: EditListingComponent},
        // { path: "service" ,  canActivate:[loginGuard], component: ServiceComponent},
        { path: "advertise" ,  canActivate:[loginGuard], component: AdvertiseComponent},
        { path: "add-area" ,  canActivate:[loginGuard], component: AddAreaComponent},
        { path: "profile" ,  canActivate:[loginGuard], component: ProfileComponent}
    ]}
];
