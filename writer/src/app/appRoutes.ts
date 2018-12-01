import {RouterModule, Routes} from "@angular/router";
import {EditorComponent} from "./components/editor/editor.component";
import {BackOfficeComponent} from "./components/back-office/back-office.component";
import {UsersListComponent} from "./components/back-office/users-list/users-list.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginPageComponent} from "./components/login-page/login-page.component";

const appRoutes: Routes = [
	{
		path: '',
		component: EditorComponent
	},
	{
		path: 'auth',
		component: LoginPageComponent,
	},
	
	{
		path: 'backoffice',
		component: BackOfficeComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				canActivateChild: [AuthGuard],
				children: [
					{ path: '', redirectTo: 'userslist', pathMatch: 'full'},
					{ path: 'userslist', component: UsersListComponent},
				]
			},
	]},
];

export const AppRoutesModule = RouterModule.forRoot(appRoutes);