'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

const AntdRegistry = ({ children }: { children: React.ReactNode }) => {
  const cache = React.useMemo(() => createCache(), []);
  const isInserted = React.useRef(false);

  useServerInsertedHTML(() => {
    if (isInserted.current) {
      return null;
    }
    isInserted.current = true;
    const styleText = extractStyle(cache, true);
    return <style id="antd" dangerouslySetInnerHTML={{ __html: styleText }} />;
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdRegistry;
