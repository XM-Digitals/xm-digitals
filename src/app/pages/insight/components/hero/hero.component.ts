import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Insight } from '../../../../core/model/insight.model';

@Component({
  selector: 'app-hero',
  imports: [DatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent {
  @Input() insight?: Insight;
}
