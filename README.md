<div align="center">
<br>

<h1>cursor-blob</h1>

<p><sup>Lightweight library for animated, interactive cursors using GSAP</sup></p>

[![npm](https://img.shields.io/npm/v/cursor-blob.svg?colorB=brightgreen)](https://www.npmjs.com/package/cursor-blob)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/cursor-blob.svg)](https://github.com/ux-ui-pro/cursor-blob)
[![NPM Downloads](https://img.shields.io/npm/dm/cursor-blob.svg?style=flat)](https://www.npmjs.org/package/cursor-blob)

<sup>1.2kB gzipped</sup>

<a href="https://codepen.io/ux-ui/full/bNNgBwZ">Demo</a>

</div>
<br>

&#10148; **Install**
```console
$ yarn add gsap
$ yarn add cursor-blob
```
<br>

&#10148; **Import**
```javascript
import gsap from 'gsap';
import CursorBlob from 'cursor-blob';
```
<br>

&#10148; **Usage**
```html
<div class="cursor">
  <div class="cursor__rim"></div>
  <div class="cursor__dot"></div>
</div>
```
```javascript
CursorBlob.registerGSAP(gsap);

const cursorEl = document.querySelector('.cursor');
const cursorRimEl = document.querySelector('.cursor__rim');
const cursorDotEl = document.querySelector('.cursor__dot');

const cursorBlob = new CursorBlob({
  cursorEl,
  cursorRimEl,
  cursorDotEl,
  duration: 0.8,
  ease: 'expo.out',
});
```

The CursorBlob plugin supports dynamically changing the cursor's appearance using the `data-cursor-style` attribute. You can add this data attribute to any HTML element to define custom behavior and cursor style on hover.

##### How it works
Each element with the attribute `data-cursor-style="your-style"` will switch the cursor’s class to `cursor--your-style`. For example:

```html
<div data-cursor-style="blend">...</div>
```

This will add the class `.cursor--blend` to the cursor element. You can then define the necessary styles in CSS using this class. [Examples](https://codepen.io/ux-ui/full/bNNgBwZ).

<br>

&#10148; **Options**

| Option        |     Type      |   Default    | Description                                                                                             |
|:--------------|:-------------:|:------------:|:--------------------------------------------------------------------------------------------------------|
| `cursorEl`    | `HTMLElement` |     `–`      | Main cursor wrapper element.                                                                            |
| `cursorRimEl` | `HTMLElement` |     `–`      | Outer ring of the cursor that stretches and rotates based on velocity.                                  |
| `cursorDotEl` | `HTMLElement` |     `–`      | 	Inner dot of the cursor that lags slightly behind.                                                     |
| `duration`    |   `number`    |     `–`      | Duration of the GSAP animation when the cursor moves.                                                   |
| `ease`        |   `string`    | `'expo.out'` | Easing function used by GSAP for smooth motion. See [gsap easing](https://greensock.com/docs/v3/Eases). |
<br>

&#10148; **API**

| Method      | Description                                                 |
|:------------|:------------------------------------------------------------|
| `destroy()` | Removes all event listeners and cancels the animation loop. |
<br>

&#10148; **License**
cursor-blob is released under MIT license.
