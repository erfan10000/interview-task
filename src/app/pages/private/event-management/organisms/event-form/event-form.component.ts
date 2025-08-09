import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserService } from '../../../../../core/services/user.service';
import { EventService} from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Subscription } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzColDirective, NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  imports: [CommonModule, NzFormModule, NzInputModule,
  NzDatePickerModule, NzSwitchModule, NzButtonModule,NzModalModule,
  ReactiveFormsModule, NzCardModule, NzGridModule, NzColDirective],
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  private userSubscription: Subscription | undefined;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private userService: UserService,
    private modalService: NzModalService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDateTime: ['', Validators.required],
      endDateTime: [''],
      timezone: ['UTC', Validators.required],
      venue: this.fb.group({ venueName: [''] }),
      primaryImageUrl: [''],
      coverImageUrl: [''],
      isPublic: [false]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.isEditMode = true;
      const event = this.eventService.getEventById(this.eventId);
      if (event) {
        this.eventForm.patchValue({
          ...event,
          venue: event.venue
        });
      }
    }
  }

 onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true; // Set loading state
      const formValue = this.eventForm.value;
      const currentUser = this.userService.user(); // Try the signal first

      if (currentUser && currentUser.activeOrganizationId) {
        const event: Event = {
          ...formValue,
          id: this.eventId || '',
          organizer: { id: currentUser.activeOrganizationId }
        };
        this.handleEventSubmission(event);
      } else {
        this.showCannotEditModal();
        // Fallback to observable if signal is undefined
        this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
          if (user && user.activeOrganizationId) {
            const event: Event = {
              ...formValue,
              id: this.eventId || '',
              organizer: { id: user.activeOrganizationId }
            };
            this.handleEventSubmission(event);
          } else {
            console.error('No user or organization ID available');
            // Optionally, show an error message or redirect to login
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/p/events']); // Navigate back to event list on cancel
  }

  private showCannotEditModal(): void {
    this.modalService.info({
      nzTitle: 'Cannot Edit Data',
      nzContent: 'Editing is not available with the current mock data setup. Please contact the administrator to enable editing functionality.',
      nzOkText: 'OK',
      nzOnOk: () => this.router.navigate(['/p/events']) 
    });
  }

  private handleEventSubmission(event: Event): void {
    if (this.isEditMode) {
      this.eventService.updateEvent(event);
    } else {
      this.eventService.createEvent(event);
    }
    this.router.navigate(['/p/events']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}