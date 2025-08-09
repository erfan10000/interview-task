import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserService } from '../../../../../core/services/user.service';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColDirective, NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  imports: [CommonModule, NzTableModule,NzMenuModule, NzInputModule, NzGridModule,NzIconModule,NzDropDownModule,
    NzButtonModule, NzSelectModule, FormsModule, NzModalModule, NzColDirective],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm = '';
  filterPublic: boolean | null = null;
  isShareModalVisible = false;
  shareUrl = '';
  isLoading = true;
  sortDirection: 'ascend' | 'descend' | null = null;
  private userSubscription: Subscription | undefined;
  

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private userService: UserService,
    private router: Router,
    private modalService: NzModalService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    // Subscribe to getCurrentUser observable
    this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
      const orgId = user?.activeOrganizationId; // Access activeOrganizationId after the observable resolves
      this.eventService.getEvents(orgId).subscribe(events => {
        this.events = events;
        this.filteredEvents = events;
        this.isLoading = false;
      });
    });

    // Fallback to the signal if getCurrentUser hasn't been called yet or failed
    const currentUser = this.userService.user();
    if (currentUser) {
      const orgId = currentUser.activeOrganizationId;
      this.eventService.getEvents(orgId).subscribe(events => {
        this.events = events;
        this.filteredEvents = events;
        this.isLoading = false;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(value: boolean | null): void {
    this.filterPublic = value;
    this.applyFilters();
  }

  sortByDate(data: Event[]): Event[] {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.startDateTime).getTime();
      const dateB = new Date(b.startDateTime).getTime();
      return this.sortDirection === 'ascend' ? dateA - dateB : dateB - dateA;
    });
  }

  applyFilters(): void {
    let filtered = [...this.events];
    if (this.searchTerm) {
      filtered = filtered.filter(e => e.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    if (this.filterPublic !== null) {
      filtered = filtered.filter(e => e.isPublic === this.filterPublic);
    }
    this.filteredEvents = this.sortByDate(filtered);
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'ascend' ? 'descend' : 'ascend';
    this.applyFilters(); // Reapply filters and sort with new direction
  }

  copyPublicLink(eventId: string): void {
    const publicUrl = `${window.location.origin}/p/events/${eventId}`;
    this.clipboard.copy(publicUrl);
    this.modalService.success({
      nzTitle: 'Copied!',
      nzContent: `The public link (${publicUrl}) has been copied to your clipboard.`,
      nzOkText: 'OK'
    });
  }

  showShareModal(eventId: string): void {
    this.shareUrl = `${window.location.origin}/p/events/${eventId}`;
    this.isShareModalVisible = true;
  
  }

   handleShareModalCancel(): void {
    this.isShareModalVisible = false;
  }

  shareOnSocial(platform: string): void {
    // Implement social sharing logic
    console.log(`Sharing ${this.shareUrl} on ${platform}`);
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/p/events', eventId, 'edit']);
  }

  deleteEvent(eventId: string): void {
    this.modalService.confirm({
      nzTitle: 'Confirm Deletion',
      nzContent: 'Are you sure you want to delete this event? This action cannot be undone.',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.eventService.deleteEvent(eventId),
      nzOnCancel: () => console.log('Deletion cancelled')
    });
  }

  createEvent(): void {
    this.router.navigate(['/p/events/create']);
  }
}