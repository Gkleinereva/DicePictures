import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import{UploadComponent} from './upload/upload.component';
import{OptionsComponent} from './options/options.component';

const routes: Routes = [
	{path: '', component: UploadComponent},
	{path: 'options', component: OptionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
