# mac-scrollbar

**English** | [中文](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/mac-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/mac-scrollbar) [![mac-scrollbar](https://badgen.net/bundlephobia/minzip/mac-scrollbar)](https://github.com/MinJieLiu/mac-scrollbar) [![mac-scrollbar](https://badgen.net/npm/dt/mac-scrollbar)](https://github.com/MinJieLiu/mac-scrollbar)

> Scrollbar React component with macOS style.

## Why `mac-scrollbar`

The scroll bar of each browser has a unique style and the width is also inconsistent, thus compressing the display of the content area. Now, we need a beautiful and simple scroll bar from macOS style.

- Use native browser to scroll
- Does not affect the design layout
- No additional DOM hierarchy
- Automatically adapt to change in width and height
- 2KB compressed size
- Support Chrome, Firefox >= 64, Microsoft Edge >= 79

**Note** This component is not compatible with IE11, it needs to be compatible with lower version browsers.

## Usage

```shell
yarn add mac-scrollbar
```

Import style

```jsx
import 'mac-scrollbar/dist/mac-scrollbar.css';
```

Basic

```tsx
import { MacScrollbar } from 'mac-scrollbar';

function Foo() {
  return (
    <MacScrollbar>
      <div>Content</div>
    </MacScrollbar>
  );
}
```

Global window scrollbar

```tsx
import { GlobalScrollbar } from 'mac-scrollbar';

function App() {
  return <GlobalScrollbar />;
}
```

### API

#### Common

| Name | Type | Description |
| :-- | :-- | :-- |
| skin | 'light' \| 'dark' | Adapt to the background color of the container. Default 'light' |
| trackGap | number \| [startX: number, endX: number, startY: number, endY: number] | Gap at the cross end of the scroll bar. Default 16 |
| trackStyle | (horizontal?: boolean) => CSSProperties |  |
| thumbStyle | (horizontal?: boolean) => CSSProperties |  |
| minThumbSize | number | Minimum thumb bar size. Default 20 |
| suppressAutoHide | boolean | When set to true, the scrollbar will not be automatically hidden. |

#### MacScrollbar

| Name | Type | Description |
| :-- | :-- | :-- |
| suppressScrollX | number | When set to true, the scrollbar in X-axis will not be available, regardless of the content width. |
| suppressScrollY | number | When set to true, the scroll bar in Y-axis will not be available, regardless of the content height. |
| as | string | Custom element type. Default 'div' |
