'use client';

import { useEffect, useMemo, useRef } from 'react';

type PrototypeDocumentProps = {
  html: string;
};

type ScriptBlock = {
  src?: string;
  content: string;
};

function parsePrototype(html: string) {
  const links = Array.from(html.matchAll(/<link\b[^>]*>/gi)).map((match) => match[0]);
  const styles = Array.from(html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1])
    .join('\n');
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const scripts = Array.from(body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)).map((match) => {
    const src = match[1].match(/\bsrc=["']([^"']+)["']/i)?.[1];
    return { src, content: match[2] };
  });

  return {
    links,
    styles,
    body: body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''),
    scripts,
  };
}

export function PrototypeDocument({ html }: PrototypeDocumentProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { links, styles, body, scripts } = useMemo(() => parsePrototype(html), [html]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const mountedScripts: HTMLScriptElement[] = [];

    scripts.forEach((scriptBlock: ScriptBlock) => {
      if (scriptBlock.src?.includes('/cdn-cgi/')) return;

      const script = document.createElement('script');
      if (scriptBlock.src) {
        script.src = scriptBlock.src;
        script.async = false;
      } else {
        script.text = scriptBlock.content;
      }
      mount.appendChild(script);
      mountedScripts.push(script);
    });

    return () => {
      mountedScripts.forEach((script) => script.remove());
    };
  }, [scripts]);

  return (
    <>
      {links.map((link, index) => (
        <span key={`link-${index}`} dangerouslySetInnerHTML={{ __html: link }} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={mountRef} dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
