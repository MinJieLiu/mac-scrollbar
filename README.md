# mac-scrollbar

**English** | [中文](./packages/mac-scrollbar/README.zh-CN.md)

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

![demo](./packages/mac-scrollbar/demo.gif)

## Usage

```shell
yarn add mac-scrollbar
```

Import style

```jsx
import 'mac-scrollbar/dist/style.css';
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

#### MacScrollbar

| Name | Type | Description |
| :-- | :-- | :-- |
| theme | 'white' I 'dark' | Adapt to the background color of the container. Default 'white' |
| suppressMacOS | false | When set to true, macOS browsers will use native scrollbar. |
| suppressScrollX | false | When set to true, the scrollbar in X-axis will not be available, regardless of the content width. |
| suppressScrollY | false | When set to true, the scroll bar in Y-axis will not be available, regardless of the content height. |
| as | string | Custom element type. Default 'div' |

#### GlobalScrollbar

| Name | Type | Description |
| :-- | :-- | :-- |
| theme | 'white' I 'dark' | Adapt to the background color of the container. Default 'white' |
| suppressMacOS | false | When set to true, macOS browsers will use native scrollbar. |
