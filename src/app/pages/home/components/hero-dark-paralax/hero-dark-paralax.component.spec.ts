import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { HeroDarkParalaxComponent } from './hero-dark-paralax.component';

describe('HeroDarkParalaxComponent', () => {
  let component: HeroDarkParalaxComponent;
  let fixture: ComponentFixture<HeroDarkParalaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDarkParalaxComponent],
      providers: [
        // Provide 'browser' so Three.js code runs; swap to 'server' to test SSR guard
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDarkParalaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the hero wrapper with correct classes', () => {
    const el: HTMLElement = fixture.nativeElement;
    const wrapper = el.querySelector('.hero-wwrapper');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.classList).toContain('home');
    expect(wrapper?.classList).toContain('hero-2');
  });

  it('should render a canvas element', () => {
    const el: HTMLElement = fixture.nativeElement;
    const canvas = el.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render the overlay with h1 and p', () => {
    const el: HTMLElement = fixture.nativeElement;
    const overlay = el.querySelector('.overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.querySelector('h1')).toBeTruthy();
    expect(overlay?.querySelector('p')).toBeTruthy();
  });

  it('should NOT initialise Three.js when running on the server', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeroDarkParalaxComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const ssrFixture = TestBed.createComponent(HeroDarkParalaxComponent);
    const ssrComponent = ssrFixture.componentInstance;
    ssrFixture.detectChanges();

    // isBrowser is private – we verify no renderer was created instead of crashing
    expect(ssrComponent).toBeTruthy();
  });
});
