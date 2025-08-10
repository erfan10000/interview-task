# Event Management Module Documentation

## Module Purpose
The `EventManagementModule`, located in `pages/private/`, enables logged-in users to manage events for their organization. using mock data from public/mock-data/mock.json Users can view a list of events, create new events, edit existing ones, view event details, at `/p/events`.

**Key Files/Folders:**
- `event-management.module.ts`: Feature module definition.
- `organisms/event-list/`: Component for listing events.
- `organisms/event-form/`: Shared component for creating/editing events.
- `organisms/event-details/`: Component for viewing event details.
- `templates/event-management-page/`: Layout for the /p/events route.
- `services/event.service.ts`: Service for data management.
- `models/event.model.ts`: Event interface.

## Architecture Overview
This module follows a hybrid design approach: NG-ZORRO provides atoms and molecules (e.g., buttons, forms), while custom organisms (e.g., event list, form, details) and templates (e.g., page layout) are built on top for higher-level functionality.

- **Components (Organisms):**
  - `EventListComponent`: Displays events with search, filter (public/private), and sort features using NG-ZORRO Table.
  - `EventFormComponent`: Handles event creation and editing with a reactive form.
  - `EventDetailsComponent`: Shows event details with a "Copy Public Link" feature.

- **Templates:**
  - `EventManagementPageComponent`: Acts as a layout for the /p/events route, hosting the event management organisms via routing.

- **Services:**
  - `EventService`: Fetches mock data via HttpClient, manages event CRUD operations, and provides an observable event stream.

- **State Handling:**
  -  Uses RxJS BehaviorSubject for event state in EventService.
  -  User state is managed by UserService with a signal for current user data.
  -  No global state management (e.g., NgRx); local to the module.

- **Data Flow:**
  - Login sets user in UserService.
  - Mock data is loaded into `EventService`.
  - Components subscribe to `events$` and filter based on the user's organization ID from `AuthService`.
  -Form submission simulates CRUD with mock data, showing a modal for limitations.
  - All components are standalone, importing NG-ZORRO dependencies locally.

## How to Extend
### Add a New Field to the Form
1. Update `Event` interface in `event.model.ts` with the new field.
2. Add a form control in `EventFormComponent`’s `eventForm`.
3. Update `event-form.component.html` with a new `nz-form-item`.
4. Modify `EventService`’s `createEvent` and `updateEvent` to handle the new field.
5. Patch the new field in ngOnInit for edit mode if needed.

### Add a New Filter to the List
1. Add a new property (e.g., `filterCategory`) in `EventListComponent`.
2. Update `event-list.component.html` with an `nz-select` or input for the filter.
3. Extend applyFilters() to include the new criterion (e.g., filtered = filtered.filter(e => e.category === this.filterCategory);).
4. Update onFilterChange to trigger applyFilters().

### Enhance the Detail View
1. Add new properties to display in `EventDetailsComponent` (e.g., add a new nz-descriptions-item for a new field).
2. Update `event-details.component.html` with additional `nz-descriptions-item` entries.
3. Ensure the new field is included in the Event model and fetched from EventService.

## AI Agent Notes
- **AI Usage:** Grok was used to generate boilerplate code for components, services, and templates, as well as suggest fixes for errors like standalone component imports and routing issues.
- **Naming Conventions:**
  - Components: PascalCase (e.g., `EventListComponent`).
  - Services: camelCase with suffix (e.g., `eventService`).
  - Variables: camelCase.
  - Folders: kebab-case (e.g., event-list).
- **Avoid Changing:**
  - Core data manipulation logic in `EventService`.
  - Routing structure in `event-management-routing.module.ts`.
  - User authentication flow in AuthService and UserService, to avoid security issues.

## Known Limitations / TODOs
- **Mock Data Only**: No real backend integration; all operations are in-memory. Implement HTTP calls in EventService for production.
- **Image Upload:** Simulated with URL inputs; actual file uploads not implemented due to mock data constraints.
- **Timezone Handling:** Basic string input; consider enhancing with a timezone picker.
- **Venue:** Simplified to `venueName`; could expand to a full venue object or selection.
- **Persistence:** Refresh resets changes; use local storage or a real DB.
- **Social Sharing**: Placeholders in share modal; integrate actual SDKs (e.g., Facebook, Twitter).

## Prompt Example (optional)
"Extend the EventFormComponent to add a 'category' field with a dropdown selector. Update the Event model, form group, template with a new nz-form-item in the grid layout, and EventService to handle the new field in create/update methods. Ensure the field is patched in edit mode and displayed in EventDetailsComponent."