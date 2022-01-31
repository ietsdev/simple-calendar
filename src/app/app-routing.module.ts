import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: '**', component: IndexComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
