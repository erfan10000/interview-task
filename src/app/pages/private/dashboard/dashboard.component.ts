import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService} from '../event-management/services/event.service';
import { Event } from '../event-management/models/event.model';
import { NzCardComponent } from "ng-zorro-antd/card";
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [NzCardComponent, CommonModule, NzListModule, NzButtonModule]
})
export class DashboardComponent implements OnInit {
  upcomingEvents: Event[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.upcomingEvents = events
        .filter(event => new Date(event.startDateTime) > new Date())
        .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
        .slice(0, 3);
    });
  }

  goToEventManagement(): void {
    this.router.navigate(['/p/events']);
  }
}