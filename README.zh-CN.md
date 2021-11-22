# mac-scrollbar

**中文** | [English](./README.md)

> macOS 样式的 React 滚动条组件

## 安装

```shell
yarn add mac-scrollbar
```

基本使用

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

全局滚动条

```tsx
import { GlobalScrollbar } from 'mac-scrollbar';

function App() {
  return <GlobalScrollbar />;
}
```

### API

#### MacScrollbar

| Name            | Type             | Description                                                |
| :-------------- | :--------------- | :--------------------------------------------------------- |
| theme           | 'white' I 'dark' | 适应容器的滚动条主题，默认 'white'                         |
| suppressMacOS   | false            | 设置为 true 时，macOS 的浏览器将使用原生滚动条             |
| suppressScrollX | false            | 设置为 true 时，无论内容宽度如何，X 轴上的滚动条都将不可用 |
| suppressScrollY | false            | 设置为 true 时，无论内容高度如何，Y 轴的滚动条都将不可用   |

#### GlobalScrollbar

| Name          | Type             | Description                                    |
| :------------ | :--------------- | :--------------------------------------------- |
| theme         | 'white' I 'dark' | 适应容器的滚动条主题，默认 'white'             |
| suppressMacOS | false            | 设置为 true 时，macOS 的浏览器将使用原生滚动条 |
