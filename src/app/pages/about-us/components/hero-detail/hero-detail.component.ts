import { Component, Input, ViewEncapsulation } from '@angular/core';

import { DetailProject } from '../../../../core/model/project.model';

@Component({
  selector: 'app-hero-detail',
  imports: [],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeroDetailComponent {
  @Input() detailProject?: DetailProject;
}
