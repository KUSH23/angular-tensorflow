import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';
import { DigitComponent } from './digit/digit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'digit-recognizer', pathMatch: 'prefix' },
  {path: 'home', component: HomeComponent},
  {path: 'digit-recognizer', component: DigitComponent},
  {path: 'test', component: TestComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
