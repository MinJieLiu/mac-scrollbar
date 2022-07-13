# mac-scrollbar

**中文** | [English](./README.md)

[![npm](https://img.shields.io/npm/v/mac-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/mac-scrollbar) [![mac-scrollbar](https://badgen.net/bundlephobia/minzip/mac-scrollbar)](https://github.com/MinJieLiu/mac-scrollbar) [![mac-scrollbar](https://badgen.net/npm/dt/mac-scrollbar)](https://github.com/MinJieLiu/mac-scrollbar)

> macOS 样式的 React 滚动条组件

## 为什么使用 `mac-scrollbar`

每个浏览器的滚动条都带有独特的样式，并且宽度也不一致，从而压缩内容区域的展示。现在，我们需要一个漂亮而又简约来自 macOS 样式的滚动条。

- 使用原生浏览器滚动
- 不影响设计布局
- 不占用额外的 DOM 层级
- 自动适应宽高的变化
- 2KB 压缩尺寸
- 支持 Chrome、Firefox >= 64、Microsoft Edge >= 79

**注意** 此组件不兼容 IE11，需要兼容低版本浏览器勿用。

## 安装

```shell
yarn add mac-scrollbar
```

引入样式

```jsx
import 'mac-scrollbar/dist/mac-scrollbar.css';
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

#### 公共

| Name | Type | Description |
| :-- | :-- | :-- |
| skin | 'light' \| 'dark' | 适应容器的滚动条主题，默认 'light' |
| trackGap | number \| [startX: number, endX: number, startY: number, endY: number] | 滚动条交叉末端的间隙，默认 16 |
| trackStyle | (horizontal?: boolean) => CSSProperties |  |
| thumbStyle | (horizontal?: boolean) => CSSProperties |  |
| minThumbSize | number | 最小的拇指条尺寸，默认 20 |
| suppressAutoHide | boolean | 设置为 true 时，滚动条都不会自动隐藏 |

#### MacScrollbar

| Name            | Type   | Description                                                |
| :-------------- | :----- | :--------------------------------------------------------- |
| suppressScrollX | number | 设置为 true 时，无论内容宽度如何，X 轴上的滚动条都将不可用 |
| suppressScrollY | number | 设置为 true 时，无论内容高度如何，Y 轴的滚动条都将不可用   |
| as              | string | 自定义元素类型。默认 'div'                                 |
