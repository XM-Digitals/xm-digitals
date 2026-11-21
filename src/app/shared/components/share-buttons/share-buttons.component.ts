import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    __sharethis__?: {
      initialize?: () => void;
      load?: (product: string, config: Record<string, unknown>) => void;
      config?: Record<string, any>;
    };
  }
}

let nextUniqueId = 0;

@Component({
  selector: 'app-share-buttons',
  imports: [],
  templateUrl: './share-buttons.component.html',
  styleUrl: './share-buttons.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ShareButtonsComponent implements AfterViewInit, OnChanges {
  @ViewChild('shareContainer', { static: true }) shareContainer!: ElementRef<HTMLDivElement>;

  @Input() propertyId = '6b00191607695c1d21494a97';
  @Input() alignment: 'left' | 'center' | 'right' = 'left';
  @Input() labels: 'cta' | 'counts' | 'none' = 'cta';
  @Input() networks?: string[];
  @Input() url?: string;
  @Input() title?: string;

  private readonly instanceNum = ++nextUniqueId;
  private renderCount = 0;
  containerId = `st-inline-share-${this.instanceNum}-0`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAndRender();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hasRelevantChange =
      changes['url'] ||
      changes['title'] ||
      changes['networks'] ||
      changes['labels'] ||
      changes['alignment'];

    if (isPlatformBrowser(this.platformId) && hasRelevantChange && window.__sharethis__?.load) {
      this.renderButtons();
    }
  }

  private loadAndRender(): void {
    const existingScript = document.getElementById('sharethis-sdk');

    if (existingScript && window.__sharethis__?.load) {
      this.renderButtons();
      return;
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'sharethis-sdk';
      script.src = `https://platform-api.sharethis.com/js/sharethis.js#property=${this.propertyId}`;
      script.async = true;
      script.onload = () => this.waitAndRender();
      document.head.appendChild(script);
    } else {
      this.waitAndRender();
    }
  }

  private waitAndRender(attempt = 0): void {
    if (window.__sharethis__?.load) {
      this.renderButtons();
    } else if (attempt < 20) {
      setTimeout(() => this.waitAndRender(attempt + 1), 150);
    }
  }

  private renderButtons(): void {
    const st = window.__sharethis__;
    if (!st?.load) return;

    this.renderCount++;
    this.containerId = `st-inline-share-${this.instanceNum}-${this.renderCount}`;

    const el = this.shareContainer.nativeElement;
    el.id = this.containerId;
    el.className = '';
    el.innerHTML = '';

    const serverConfig = st.config?.['inline-share-buttons'] || {};
    const activeNetworks = this.networks?.length
      ? [...this.networks]
      : serverConfig.networks || ['linkedin', 'whatsapp', 'twitter', 'facebook'];

    const finalConfig: Record<string, unknown> = {
      color: 'social',
      font_size: 12,
      language: 'en',
      padding: 10,
      radius: 4,
      show_total: false,
      size: 40,
      ...serverConfig,
      enabled: true,
      id: this.containerId,
      alignment: this.alignment,
      labels: this.labels,
      networks: activeNetworks,
      url: this.url || window.location.href,
      title: this.title || document.title
    };

    if (st.config) {
      st.config['inline-share-buttons'] = { ...finalConfig };
    }

    st.load('inline-share-buttons', finalConfig);
  }
}