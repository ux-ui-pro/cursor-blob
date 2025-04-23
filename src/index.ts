import gsap from 'gsap';

const DOT_FACTOR = 0.1;
const MAX_SCALE_DISTANCE = 485;
const MAX_SCALE = 0.35;
const DEGREE_CONVERSION = 180;
const SCALE_DIVISOR = Math.PI;
const DEFAULT_DURATION = 0.95;
const OFFSET_DIVISOR = 2;

export interface CursorBlobOptions {
  cursorEl: HTMLElement;
  cursorRimEl: HTMLElement;
  cursorDotEl: HTMLElement;
  duration?: number;
  ease?: string;
}

export default class CursorBlob {
  private static gsap = gsap;

  private cursor: HTMLElement;
  private readonly cursorRim: HTMLElement;
  private readonly cursorDot: HTMLElement;

  private readonly duration: number;
  private readonly ease: string;

  private pos = { x: 0, y: 0 };
  private vel = { x: 0, y: 0 };

  private animFrame: number | null = null;
  private readonly boundMove: (e: PointerEvent) => void = this.setFromEvent.bind(this);

  private rimX!: (v: number) => void;
  private rimY!: (v: number) => void;
  private rimRotate!: (v: number) => void;
  private rimScaleX!: (v: number) => void;
  private rimScaleY!: (v: number) => void;
  private dotX!: (v: number) => void;
  private dotY!: (v: number) => void;

  static registerGSAP(gsapInstance: typeof gsap): void {
    CursorBlob.gsap = gsapInstance;
  }

  private static getScale(dx: number, dy: number): number {
    const dist = Math.hypot(dx, dy);

    return Math.min(dist / MAX_SCALE_DISTANCE, MAX_SCALE);
  }

  private static getAngle(dx: number, dy: number): number {
    return (Math.atan2(dy, dx) * DEGREE_CONVERSION) / SCALE_DIVISOR;
  }

  constructor({
    cursorEl,
    cursorRimEl,
    cursorDotEl,
    duration = DEFAULT_DURATION,
    ease = 'expo.out',
  }: CursorBlobOptions) {
    this.cursor = cursorEl;
    this.cursorRim = cursorRimEl;
    this.cursorDot = cursorDotEl;
    this.duration = duration;
    this.ease = ease;

    this.setupQuickSetters();

    window.addEventListener('pointermove', this.boundMove);

    this.animate();
  }

  private setupQuickSetters(): void {
    const gsapInstance = CursorBlob.gsap;
    this.rimX = gsapInstance.quickSetter(this.cursorRim, 'x', 'px') as (v: number) => void;
    this.rimY = gsapInstance.quickSetter(this.cursorRim, 'y', 'px') as (v: number) => void;
    this.rimRotate = gsapInstance.quickSetter(this.cursorRim, 'rotate', 'deg') as (
      v: number,
    ) => void;
    this.rimScaleX = gsapInstance.quickSetter(this.cursorRim, 'scaleX') as (v: number) => void;
    this.rimScaleY = gsapInstance.quickSetter(this.cursorRim, 'scaleY') as (v: number) => void;
    this.dotX = gsapInstance.quickSetter(this.cursorDot, 'x', 'px') as (v: number) => void;
    this.dotY = gsapInstance.quickSetter(this.cursorDot, 'y', 'px') as (v: number) => void;
  }

  private loop(): void {
    const { x, y } = this.pos;
    const { x: vx, y: vy } = this.vel;

    const rotation = CursorBlob.getAngle(vx, vy);
    const scale = CursorBlob.getScale(vx, vy);

    this.rimX(x);
    this.rimY(y);
    this.rimRotate(rotation);
    this.rimScaleX(1 + scale);
    this.rimScaleY(1 - scale);

    this.dotX(x + vx * DOT_FACTOR);
    this.dotY(y + vy * DOT_FACTOR);
  }

  private animate = (): void => {
    this.loop();
    this.animFrame = requestAnimationFrame(this.animate);
  };

  private setFromEvent(e: PointerEvent): void {
    const { clientX, clientY } = e;
    const offsetX = this.cursorRim.offsetWidth / OFFSET_DIVISOR;
    const offsetY = this.cursorRim.offsetHeight / OFFSET_DIVISOR;

    CursorBlob.gsap.killTweensOf(this.pos);

    CursorBlob.gsap.to(this.pos, {
      x: clientX - offsetX,
      y: clientY - offsetY,
      duration: this.duration,
      ease: this.ease,
      onUpdate: (): void => {
        this.vel.x = clientX - offsetX - this.pos.x;
        this.vel.y = clientY - offsetY - this.pos.y;
        this.applyStyle(e);
      },
    });
  }

  private applyStyle(e: PointerEvent): void {
    let target: HTMLElement | null = e.target as HTMLElement;

    while (target && !target.dataset?.cursorStyle && target !== document.body) {
      target = target.parentElement;
    }

    const style = target?.dataset?.cursorStyle ?? 'default';

    this.cursor.className = `cursor cursor--${style}`;
  }

  public destroy(): void {
    window.removeEventListener('pointermove', this.boundMove);

    CursorBlob.gsap.killTweensOf(this.pos);

    if (this.animFrame !== null) cancelAnimationFrame(this.animFrame);
  }
}
