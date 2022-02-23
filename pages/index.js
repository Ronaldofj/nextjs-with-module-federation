import dynamic from "next/dynamic";

import React from 'react';

function loadComponent(scope, module) {
  return async () => {
    await __webpack_init_sharing__('default');
    const container = window[scope]; 
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const urlCache = new Set();

const useDynamicScript = url => {
  const [ready, setReady] = React.useState(false);
  const [errorLoading, setErrorLoading] = React.useState(false);

  React.useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    errorLoading,
    ready,
  };
};

const componentCache = new Map();

export const useFederatedComponent = (remoteUrl, scope, module) => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = React.useState(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);

  React.useEffect(() => {
    if (Component) setComponent(null);
  }, [key]);

  React.useEffect(() => {
    if (ready && !Component) {
      const Comp = dynamic(loadComponent(scope, module));

      componentCache.set(key, Comp);
      
      setComponent(Comp);
    }
  }, [Component, ready, key]);

  return { errorLoading, Component };
};

function App() {
  const { Component: FederatedComponent, errorLoading } = useFederatedComponent('http://localhost:3002/remoteEntry.js', 'teamDs', './Header');

  return (
    <>
      {errorLoading
        ? `Error loading module`
        : FederatedComponent && <FederatedComponent text='teste' />}
    </>
  );
}

export default App;