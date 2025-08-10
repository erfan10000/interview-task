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
import { NzUploadModule, NzUploadComponent , NzUploadChangeParam } from 'ng-zorro-antd/upload'

// AI Prompt: "Generate a basic Angular component with a reactive form for an event using NG-ZORRO components"
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  imports: [CommonModule, NzFormModule, NzInputModule,
    NzDatePickerModule, NzSwitchModule, NzButtonModule,NzUploadModule,
    ReactiveFormsModule, NzCardModule, NzGridModule, NzColDirective, NzUploadComponent],
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  public userSubscription: Subscription | undefined;
  isLoading = false;

  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private userService: UserService,
    private modalService: NzModalService,
  ) {
    // AI Prompt: "Add form validation with required fields and custom validators for an Angular reactive form"
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [''],
      startDateTime: ['', Validators.required],
      endDateTime: [''],
      timezone: ['UTC', [Validators.required, Validators.pattern(/^UTC[+-]\d{2}:\d{2}$|^UTC$/)]],
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
    // AI-prompt: Add Modal logic to handle mock data limitation
    this.modalService.info({
      nzTitle: 'Cannot Save Data',
      nzContent: 'Saving is not available with the current mock data setup. Please contact the administrator to enable editing functionality.',
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

  // AI Prompt: "Implement file upload handling for an Angular form with NG-ZORRO upload component"
  handleUploadChange({ file, fileList }: NzUploadChangeParam, controlName: string): void {
    const isImage = file.type && file.type.startsWith('image/');
    if (isImage && file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.eventForm.get(controlName)?.setValue(e.target?.result as string); // Set base64 string
      };
      reader.readAsDataURL(file.originFileObj as Blob);
    } else if (file.status === 'error') {
      console.error('Upload failed:', file.name);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}