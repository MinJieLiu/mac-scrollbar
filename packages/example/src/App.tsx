import React from 'react';
import { GlobalScrollbar, MacScrollbar } from 'mac-scrollbar/src';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
`;

const NoWrap = styled.div`
  white-space: nowrap;
`;

const WrapperAutoScrollbar = styled(MacScrollbar)`
  flex: 1;
  height: 500px;
  padding: 20px;
  background: whitesmoke;
`;

const LightThemeScrollbar = styled(MacScrollbar)`
  padding: 20px;
  background: whitesmoke;
`;

const DarkThemeScrollbar = styled(MacScrollbar)`
  flex: 1;
  height: 500px;
  padding: 20px;
  background: darkslategray;
  color: white;
`;

const baseIntro = (
  <>
    <p>React is a JavaScript library for building user interfaces.</p>

    <p>
      Declarative: React makes it painless to create interactive UIs. Design simple views for each
      state in your application, and React will efficiently update and render just the right
      components when your data changes. Declarative views make your code more predictable, simpler
      to understand, and easier to debug.
    </p>
    <p>
      Component-Based: Build encapsulated components that manage their own state, then compose them
      to make complex UIs. Since component logic is written in JavaScript instead of templates, you
      can easily pass rich data through your app and keep state out of the DOM.
    </p>
    <p>
      Learn Once, Write Anywhere: We don&apos;t make assumptions about the rest of your technology
      stack, so you can develop new features in React without rewriting existing code. React can
      also render on the server using Node and power mobile apps using React Native.
    </p>

    <p>Learn how to use React in your own project.</p>

    <h3>Installation</h3>
    <p>
      React has been designed for gradual adoption from the start, and you can use as little or as
      much React as you need:
    </p>

    <p>Use Online Playgrounds to get a taste of React.</p>
    <p>Add React to a Website as a script tag in one minute.</p>
    <p>Create a New React App if you&apos;re looking for a powerful JavaScript toolchain.</p>
    <p>You can use React as a script tag from a CDN, or as a react package on npm.</p>

    <h3>Documentation</h3>
    <p>You can find the React documentation on the website.</p>

    <p>Check out the Getting Started page for a quick overview.</p>

    <p>The documentation is divided into several sections:</p>

    <p>Tutorial</p>
    <p>Main Concepts</p>
    <p>Advanced Guides</p>
    <p>API Reference</p>
    <p>Where to Get Support</p>
    <p>Contributing Guide</p>
    <p>You can improve it by sending pull requests to this repository.</p>
  </>
);

const baseIntro2 = (
  <>
    React is a JavaScript library for building user interfaces. Declarative: React makes it painless
    to create interactive UIs. Design simple views for each state in your application, and React
    will efficiently update and render just the right components when your data changes. Declarative
    views make your code more predictable, simpler to understand, and easier to debug.
    Component-Based: Build encapsulated components that manage their own state, then compose them to
    make complex UIs. Since component logic is written in JavaScript instead of templates, you can
    easily pass rich data through your app and keep state out of the DOM. Learn Once, Write
    Anywhere: We don&apos;t make assumptions about the rest of your technology stack, so you can
    develop new features in React without rewriting existing code. React can also render on the
    server using Node and power mobile apps using React Native.
  </>
);

function App() {
  return (
    <>
      <GlobalScrollbar />
      <Main>
        <WrapperAutoScrollbar forwardedAs="section">{baseIntro}</WrapperAutoScrollbar>
        <WrapperAutoScrollbar>
          <NoWrap>{baseIntro}</NoWrap>
        </WrapperAutoScrollbar>
      </Main>
      <Main>
        <LightThemeScrollbar suppressScrollY>
          <NoWrap>{baseIntro2}</NoWrap>
        </LightThemeScrollbar>
      </Main>
      <Main>
        <DarkThemeScrollbar skin="dark">{baseIntro}</DarkThemeScrollbar>
        <DarkThemeScrollbar skin="dark" minThumbSize={400}>
          {baseIntro}
        </DarkThemeScrollbar>
        <MacScrollbar as="main" style={{ flex: 1, height: 500 }}>
          {baseIntro}
        </MacScrollbar>
      </Main>

      <Main>
        <NoWrap>{baseIntro2}</NoWrap>
        <div>{baseIntro}</div>
      </Main>
    </>
  );
}

export default App;
