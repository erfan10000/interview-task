import { Routes } from "@angular/router";
import { PrivatePagesComponent } from "./private-pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const PRIVATE_PAGES_ROUTES: Routes = [
  {
    path: "",
    component: PrivatePagesComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
    ],
  },
];