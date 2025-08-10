import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService} from '../event-management/services/event.service';
import { Event } from '../event-management/models/event.model';
import { NzCardComponent } from "ng-zorro-antd/card";
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzCardModule } from 'ng-zorro-antd/card'; 
import { NzGridModule } from 'ng-zorro-antd/grid'; 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [NzCardComponent, CommonModule, NzListModule, NzButtonModule,NzStatisticModule, NzCardModule, NzGridModule]
})
export class DashboardComponent implements OnInit {
  upcomingEvents: Event[] = [];
  totalEvents: number = 0;
  publicEvents: number = 0;
  privateEvents: number = 0;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.upcomingEvents = events
        .filter(event => new Date(event.startDateTime) > new Date())
        .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
        .slice(0, 3);

        this.totalEvents = events.length;
        this.publicEvents = events.filter(event => event.isPublic).length;
        this.privateEvents = events.filter(event => !event.isPublic).length;
    });
  }

  goToEventManagement(): void {
    this.router.navigate(['/p/events']);
  }
}