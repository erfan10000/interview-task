import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-management-page',
  templateUrl: './event-management-page.component.html',
  styleUrls: ['./event-management-page.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class EventManagementPageComponent {}