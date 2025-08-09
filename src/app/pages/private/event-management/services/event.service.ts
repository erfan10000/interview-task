import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.http.get<any>('/mock-data/mock.json').subscribe(data => {
      const events = data.events.map((e: any) => ({
        ...e,
        isPublic: e.isPublic ?? true,
        venue: { venueName: e.venue.venueName }
      }));
      this.eventsSubject.next(events);
    });
  }

  getEvents(orgId?: string): Observable<Event[]> {
    return this.events$.pipe(
      map(events => orgId ? events.filter(event => event.organizer.id === orgId) : events)
    );
  }

  getEventById(eventId: string): Event | undefined {
    return this.eventsSubject.value.find(e => e.id === eventId);
  }

  createEvent(event: Event): void {
    const newEvent = { ...event, id: `event-${this.eventsSubject.value.length + 1}` };
    const currentEvents = this.eventsSubject.value;
    this.eventsSubject.next([...currentEvents, newEvent]);
  }

  updateEvent(updatedEvent: Event): void {
    const currentEvents = this.eventsSubject.value;
    const index = currentEvents.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      currentEvents[index] = updatedEvent;
      this.eventsSubject.next([...currentEvents]);
    }
  }

  deleteEvent(eventId: string): void {
    const currentEvents = this.eventsSubject.value;
    this.eventsSubject.next(currentEvents.filter(e => e.id !== eventId));
  }
}