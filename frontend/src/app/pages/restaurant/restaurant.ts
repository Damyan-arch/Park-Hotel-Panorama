import { Component } from '@angular/core';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-restaurant',
  imports: [PageHero],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.scss',
})
export class Restaurant {}
