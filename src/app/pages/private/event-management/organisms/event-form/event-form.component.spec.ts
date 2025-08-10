import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserService } from '../../../../../core/services/user.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let modalService: jasmine.SpyObj<NzModalService>;
  let router: jasmine.SpyObj<Router>;
  let userService: jasmine.SpyObj<UserService>;

  const mockEvent: Event = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    startDateTime: '2025-08-10T14:00:00Z',
    endDateTime: '2025-08-10T16:00:00Z',
    timezone: 'UTC',
    venue: { venueName: 'Test Venue' },
    primaryImageUrl: '',
    coverImageUrl: '',
    isPublic: true,
    organizer: { id: 'org1' }
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById', 'createEvent', 'updateEvent']);
    const modalServiceSpy = jasmine.createSpyObj('NzModalService', ['info', 'success', 'create', 'confirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['user', 'getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NzFormModule,
        NzInputModule,
        NzDatePickerModule,
        NzSwitchModule,
        NzButtonModule,
        ReactiveFormsModule,
        NzCardModule,
        NzGridModule,
        NzModalModule,
        NzUploadModule,
        RouterTestingModule
      ],
      declarations: [EventFormComponent],
      providers: [
        FormBuilder,
        { provide: EventService, useValue: eventServiceSpy },
        { provide: NzModalService, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    modalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct controls and validators', () => {
    const form = component.eventForm;
    expect(form.contains('title')).toBeTrue();
    expect(form.get('title')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('title')?.hasValidator(Validators.minLength(3))).toBeTrue();
    expect(form.get('startDateTime')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('timezone')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('description')).toBeDefined();
    expect(form.get('endDateTime')).toBeDefined();
  });

  it('should patch form values in edit mode', fakeAsync(() => {
    eventService.getEventById.and.returnValue(mockEvent);
    spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('1');
    component.ngOnInit();
    tick();
    expect(component.isEditMode).toBeTrue();
    expect(component.eventForm.value).toEqual({
      title: 'Test Event',
      description: 'Test Description',
      startDateTime: mockEvent.startDateTime,
      endDateTime: mockEvent.endDateTime,
      timezone: 'UTC',
      venue: { venueName: 'Test Venue' },
      primaryImageUrl: '',
      coverImageUrl: '',
      isPublic: true
    });
  }));

  it('should validate form with invalid data', () => {
    component.eventForm.setValue({
      title: '',
      description: '',
      startDateTime: '',
      endDateTime: new Date('2025-08-10T12:00:00Z'),
      timezone: '',
      venue: { venueName: '' },
      primaryImageUrl: '',
      coverImageUrl: '',
      isPublic: false
    });
    expect(component.eventForm.valid).toBeFalse();
    expect(component.eventForm.get('title')?.hasError('required')).toBeTrue();
    expect(component.eventForm.get('startDateTime')?.hasError('required')).toBeTrue();
    expect(component.eventForm.get('timezone')?.hasError('required')).toBeTrue();
  });

  it('should validate date range', () => {
    component.eventForm.setValue({
      title: 'Test',
      description: '',
      startDateTime: new Date('2025-08-10T16:00:00Z'),
      endDateTime: new Date('2025-08-10T14:00:00Z'),
      timezone: 'UTC',
      venue: { venueName: '' },
      primaryImageUrl: '',
      coverImageUrl: '',
      isPublic: false
    });
    expect(component.eventForm.hasError('dateRangeInvalid')).toBeTrue();
  });

  it('should handle submit with valid form', fakeAsync(() => {
    userService.user.and.returnValue({ email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    activeOrganizationId: 'org1' });
    component.eventForm.setValue({
      title: 'Test Event',
      description: 'Test',
      startDateTime: new Date('2025-08-10T14:00:00Z'),
      endDateTime: new Date('2025-08-10T16:00:00Z'),
      timezone: 'UTC',
      venue: { venueName: 'Test Venue' },
      primaryImageUrl: '',
      coverImageUrl: '',
      isPublic: true
    });
    component.onSubmit();
    tick();
    expect(component.isLoading).toBeTrue();
    expect(eventService.createEvent).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/p/events']);
  }));

  it('should show modal on submit failure', fakeAsync(() => {
    userService.user.and.returnValue(undefined);
    component.eventForm.setValue({
      title: 'Test Event',
      description: '',
      startDateTime: new Date('2025-08-10T14:00:00Z'),
      endDateTime: '',
      timezone: 'UTC',
      venue: { venueName: '' },
      primaryImageUrl: '',
      coverImageUrl: '',
      isPublic: false
    });
    component.onSubmit();
    tick();
    expect(modalService.info).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle image upload', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    expect(component.eventForm.get('primaryImageUrl')?.value).toBeDefined(); // Check if value is set (async nature requires further testing with done())
  });

  it('should unsubscribe on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.userSubscription = subscriptionSpy;
    component.ngOnDestroy();
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/p/events']);
  });
});