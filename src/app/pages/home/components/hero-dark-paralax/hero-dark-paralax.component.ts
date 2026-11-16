import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { HERO_BASE64_COLOR, HERO_BASE64_DEPTH } from '../../../../core/mock/hero-paralax-home.mock';

@Component({
  selector: 'app-hero-dark-paralax',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero-dark-paralax.component.html',
  styleUrl: './hero-dark-paralax.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeroDarkParalaxComponent implements OnDestroy {
  @ViewChild('threeCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  private isDestroyed = false;
  private texturesReady = false;
  private loadedCount = 0;
  private resizeObserver?: ResizeObserver;

  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private renderer?: THREE.WebGLRenderer;
  private mesh?: THREE.Mesh;
  private material?: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private animationId?: number;

  private currentPointer = new THREE.Vector2(0.5, 0.5);
  private targetPointer = new THREE.Vector2(0.5, 0.5);

  private hasUserInteracted = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    afterNextRender(() => {
      if (!this.isBrowser || this.isDestroyed) return;
      setTimeout(() => {
        if (this.isDestroyed) return;
        this.initThree();
        this.ngZone.runOutsideAngular(() => {
          this.animate();
        });
      }, 0);
    });
  }

  // ngOnDestroy(): void {
  //   this.isDestroyed = true;
  //   if (!this.isBrowser) return;

  //   this.resizeObserver?.disconnect();
  //   if (this.animationId) {
  //     cancelAnimationFrame(this.animationId);
  //   }

  //   this.mesh?.geometry.dispose();
  //   this.material?.uniforms['uColor']?.value?.dispose();
  //   this.material?.uniforms['uDepth']?.value?.dispose();
  //   this.material?.dispose();
  //   this.renderer?.dispose();
  // }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (!this.isBrowser) return;

    this.resizeObserver?.disconnect();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.mesh?.geometry.dispose();
    this.material?.uniforms['uColor']?.value?.dispose();
    this.material?.uniforms['uDepth']?.value?.dispose();
    this.material?.dispose();

    if (this.renderer) {
      // Melepas konteks GPU secara instan agar tidak menumpuk saat reload berkali-kali
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
  }

  private onTextureLoaded(tex?: THREE.Texture): void {
    const img = tex?.image as HTMLImageElement | undefined;
    if (img && img.width && img.height && this.material) {
      this.material.uniforms['uImageRes'].value.set(img.width, img.height);
    }

    this.loadedCount++;

    if (this.loadedCount >= 2 && this.material) {
      this.clock.start();
      this.texturesReady = true;
      this.hasUserInteracted = false; // Reset status interaksi untuk intro sway saat load
      this.material.uniforms['uReady'].value = 1.0;
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);

    const loader = new THREE.TextureLoader();
    const colorTex = loader.load(HERO_BASE64_COLOR.trim(), (tex) => {
      tex.needsUpdate = true;
      this.onTextureLoaded(tex);
    });

    colorTex.minFilter = THREE.LinearFilter;
    colorTex.magFilter = THREE.LinearFilter;

    const depthTex = loader.load(HERO_BASE64_DEPTH.trim(), (tex) => {
      tex.needsUpdate = true;
      this.onTextureLoaded(tex);
    });

    depthTex.minFilter = THREE.LinearFilter;
    depthTex.magFilter = THREE.LinearFilter;
    depthTex.colorSpace = THREE.NoColorSpace;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uColor;
      uniform sampler2D uDepth;
      uniform float uTime;
      uniform float uReady;
      uniform vec2 uResolution;
      uniform vec2 uImageRes;
      uniform vec2 uPointer;
      uniform float uParallaxStrength;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

      float cellNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p) - 0.5;
        float r = 0.2 + 0.3 * hash(i);
        return 1.0 - smoothstep(r * 0.5, r, length(f));
      }

      // Mengatur rasio gambar seperti CSS object-fit: cover agar tidak gepeng di mobile
      vec2 getCoverUv(vec2 uv, vec2 resolution, vec2 imageRes) {
        vec2 s = resolution;
        vec2 i = imageRes;
        float rs = s.x / max(s.y, 1.0);
        float ri = i.x / max(i.y, 1.0);
        vec2 newUv = rs < ri
          ? vec2(i.x * s.y / i.y, s.y)
          : vec2(s.x, i.y * s.x / i.x);
        vec2 offset = (rs < ri
          ? vec2((newUv.x - s.x) / 2.0, 0.0)
          : vec2(0.0, (newUv.y - s.y) / 2.0)) / newUv;
        return uv * s / newUv + offset;
      }

      void main() {
        if (uReady < 0.5) {
          gl_FragColor = vec4(0.02, 0.0, 0.04, 1.0);
          return;
        }

        // 1. Terapkan proporsi aspect-ratio cover terlebih dahulu
        vec2 coverUv = getCoverUv(vUv, uResolution, uImageRes);

        // 2. Zoom-out moderat (0.96) dari titik tengah
        vec2 uv = (coverUv - 0.5) * 0.96 + 0.5;

        vec2 pointerOffset = (uPointer - 0.5);
        vec3 rawDepthColor = texture2D(uDepth, uv).rgb;
        float depth = dot(rawDepthColor, vec3(0.299, 0.587, 0.114));

        vec2 parallax = pointerOffset * (depth - 0.5) * uParallaxStrength;
        vec2 finalUv = clamp(uv + parallax, 0.001, 0.999);

        vec3 baseColor = texture2D(uColor, finalUv).rgb;
        vec3 alignedDepthColor = texture2D(uDepth, finalUv).rgb;
        float alignedDepth = dot(alignedDepthColor, vec3(0.299, 0.587, 0.114));

        float speed = 0.25;
        float progress = fract(uTime * speed);
        float flow = 1.0 - smoothstep(0.0, 0.035, abs(alignedDepth - progress));

        // Pertahankan titik grid tetap bulat proporsional terhadap rasio gambar
        float imgAspect = uImageRes.x / max(uImageRes.y, 1.0);
        float dots = cellNoise(finalUv * vec2(150.0 * imgAspect, 150.0));
        float mask = dots * flow;

        vec3 scanColor = vec3(176.0 / 255.0, 38.0 / 255.0, 255.0 / 255.0);
        vec3 glowDots = scanColor * mask * 3.5;
        vec3 glowArea = scanColor * flow * 0.3;

        vec3 finalColor = baseColor + glowDots + glowArea;
        float grain = (hash(vUv * uResolution + uTime) - 0.5) * 0.02;
        finalColor += grain;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: colorTex },
        uDepth: { value: depthTex },
        uTime: { value: 0 },
        uReady: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImageRes: { value: new THREE.Vector2(1920, 1080) }, // Otomatis ditimpa dimensi asli gambar di onTextureLoaded
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uParallaxStrength: { value: 0.08 },
      },
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(this.mesh);
  }

  private animate = (): void => {
    if (this.isDestroyed || !this.renderer || !this.scene || !this.camera) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = this.texturesReady ? this.clock.getElapsedTime() : 0;

    // Efek goyang lembut otomatis selama 2.8 detik pertama jika user belum menggerakkan pointer
    if (this.texturesReady && !this.hasUserInteracted) {
      const introDuration = 3.8;
      if (elapsed < introDuration) {
        // Amplitudo mereda perlahan ke 0 agar kembali mulus ke tengah (0.5, 0.5)
        const progress = elapsed / introDuration;
        const decay = Math.pow(1.0 - progress, 2.0);
        const angle = elapsed * 3.2; // Kecepatan ayunan

        this.targetPointer.set(
          0.5 + Math.sin(angle) * 0.28 * decay,
          0.5 + Math.cos(angle * 0.8) * 0.16 * decay
        );
      } else {
        this.targetPointer.set(0.5, 0.5);
      }
    }

    this.currentPointer.x += (this.targetPointer.x - this.currentPointer.x) * 0.06;
    this.currentPointer.y += (this.targetPointer.y - this.currentPointer.y) * 0.06;

    if (this.material) {
      if (this.texturesReady) {
        this.material.uniforms['uTime'].value = elapsed;
      }
      this.material.uniforms['uPointer'].value.copy(this.currentPointer);
    }

    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(e: PointerEvent): void {
    if (!this.isBrowser) return;
    this.hasUserInteracted = true;
    this.targetPointer.set(
      e.clientX / window.innerWidth,
      1.0 - e.clientY / window.innerHeight
    );
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onResize(): void {
    if (!this.isBrowser || !this.renderer) return;

    const updateSize = () => {
      const canvas = this.canvasRef?.nativeElement;
      if (!canvas || !this.renderer) return;
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        this.renderer.setSize(w, h, false);
        this.material?.uniforms['uResolution'].value.set(w, h);
      }
    };

    // Update instan + update ulang setelah animasi rotasi browser mobile selesai
    updateSize();
    setTimeout(updateSize, 150);
  }
}