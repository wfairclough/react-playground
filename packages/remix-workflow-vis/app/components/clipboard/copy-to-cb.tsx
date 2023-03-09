import React from 'react';
// import { copyIcon } from './copy-to-cb.css';

export interface CopyToClipboardProps {
  value: string;
  children?: JSX.Element;
}

export function CopyToClipboard({ value, children }: CopyToClipboardProps) {
  const [copied, setCopied] = React.useState(false);
  const [copiedTimeout, setCopiedTimeout] = React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (copiedTimeout) {
        clearTimeout(copiedTimeout);
      }
    };
  }, [copiedTimeout]);

  const copy = (e: any) => {
    e.preventDefault();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setCopiedTimeout(
      setTimeout(() => {
        setCopied(false);
      }, 2000),
    );
  };

  return (
    <a
      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
      onClick={copy}
      href="#"
    >
      {children || (
        <svg style={{ width: '1rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M272 416C263.2 416 256 423.2 256 432V448c0 17.67-14.33 32-32 32H64c-17.67 0-32-14.33-32-32V192c0-17.67 14.33-32 32-32h112C184.8 160 192 152.8 192 144C192 135.2 184.8 128 176 128H63.99c-35.35 0-64 28.65-64 64l.0098 256C0 483.3 28.65 512 64 512h160c35.35 0 64-28.65 64-64v-16C288 423.2 280.8 416 272 416zM502.6 86.63l-77.25-77.25C419.4 3.371 411.2 0 402.7 0H288C252.7 0 224 28.65 224 64v256c0 35.35 28.65 64 64 64h160c35.35 0 64-28.65 64-64V109.3C512 100.8 508.6 92.63 502.6 86.63zM416 45.25L466.7 96H416V45.25zM480 320c0 17.67-14.33 32-32 32h-160c-17.67 0-32-14.33-32-32V64c0-17.67 14.33-32 32-32h96l.0026 64c0 17.67 14.33 32 32 32H480V320z" />
        </svg>
      )}
    </a>
  );
}
