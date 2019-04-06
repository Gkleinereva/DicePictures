import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import{UploadComponent} from './upload/upload.component';
import{OptionsComponent} from './options/options.component';
import { OutputComponent } from './output/output.component';

const routes: Routes = [
	{path: '', component: UploadComponent},
  {path: 'options', component: OptionsComponent},
  {path: 'likeOmgMyPictureIsPrettyDicey', component: OutputComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
