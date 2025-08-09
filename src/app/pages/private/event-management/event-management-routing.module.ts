import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './organisms/event-list/event-list.component';
import { EventFormComponent } from './organisms/event-form/event-form.component';
import { EventDetailsComponent } from './organisms/event-details/event-details.component';
import { EventManagementPageComponent } from './templates/event-management-page/event-management-page.component';

const routes: Routes = [
  {
    path: '',
    component: EventManagementPageComponent,
    children: [
      { path: '', component: EventListComponent },
      { path: 'create', component: EventFormComponent },
      { path: ':id', component: EventDetailsComponent },
      { path: ':id/edit', component: EventFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagementRoutingModule { }