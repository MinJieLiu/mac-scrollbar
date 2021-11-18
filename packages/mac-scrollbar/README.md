# mac-scrollbar

> Scrollbar component with macOS style.

## Usage

```shell
yarn add mac-scrollbar
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

#### GlobalScrollbar

| Name | Type | Description |
| :-- | :-- | :-- |
| theme | 'white' I 'dark' | Adapt to the background color of the container. Default 'white' |
| suppressMacOS | false | When set to true, macOS browsers will use native scrollbar. |
