import { Routes } from '@angular/router';
import { adminGuard } from './admin/auth/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'rooms', loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms) },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
  },
  {
    path: 'restaurant',
    loadComponent: () => import('./pages/restaurant/restaurant').then((m) => m.Restaurant),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'location',
    loadComponent: () => import('./pages/location/location').then((m) => m.Location),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/admin-login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      {
        path: 'rooms',
        loadComponent: () => import('./admin/rooms/admin-rooms').then((m) => m.AdminRooms),
      },
      {
        path: 'gallery',
        loadComponent: () => import('./admin/gallery/admin-gallery').then((m) => m.AdminGallery),
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/settings/admin-settings').then((m) => m.AdminSettings),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
