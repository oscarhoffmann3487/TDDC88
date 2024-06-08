import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { HomeComponent } from './home/home.component';
import { BrowsingpageComponent } from './browsingpage/browsingpage.component';
import { CreateComponent } from './create/create.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: 'placeholder', component: PlaceholderComponent },
  { path: 'home', component: HomeComponent },
  { path: 'browsing', component: BrowsingpageComponent },
  { path: 'create', component: CreateComponent },
  { path: 'search', component:SearchComponent},
  { path: 'about', component:AboutComponent},
  { path: 'create/:id', component: CreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
