import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventManagementRoutingModule } from './event-management-routing.module';
import { EventListComponent } from './organisms/event-list/event-list.component';
import { EventFormComponent } from './organisms/event-form/event-form.component';
import { EventDetailsComponent } from './organisms/event-details/event-details.component';
import { EventManagementPageComponent } from './templates/event-management-page/event-management-page.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    EventManagementRoutingModule,
    NzTableModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzImageModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    EventListComponent,
    EventFormComponent,
    EventDetailsComponent,
    EventManagementPageComponent
  ]
})
export class EventManagementModule { }