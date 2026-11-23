import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Service } from '../../../../core/model/service.model';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeroComponent {
  @Input() service?: Service;
  private router = inject(Router);

  isXmCreative(): boolean {
    return this.router.url.includes('xm-creative');
  }

  isXmTech(): boolean {
    return this.router.url.includes('xm-tech');
  }

  isXmAi(): boolean {
    return this.router.url.includes('xm-ai');
  }

  isXmGrowth(): boolean {
    return this.router.url.includes('xm-growth');
  }
  
}