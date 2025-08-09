import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService , Theme } from '../../../../../core/services/theme.service';
import { Subscription } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-event-management-page',
  templateUrl: './event-management-page.component.html',
  styleUrls: ['./event-management-page.component.scss'],
  imports: [CommonModule, RouterModule, NzIconModule],
})
export class EventManagementPageComponent implements OnInit, OnDestroy {
  theme: Theme = 'light';
  private sub?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.sub = this.themeService.theme.subscribe(t => this.theme = t);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
