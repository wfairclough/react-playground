import { type ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string | JSX.Element;
  children?: React.ReactNode;
}

export default function IconButton({ icon, children, ...props }: IconButtonProps) {
  const Icon = icon && (typeof icon === 'string' ? icon : () => icon);
  const { style, ...buttonAttr } = props;
  return (
    <button
      style={{
        ...style,
        display: 'grid',
        placeItems: 'center',
        width: '2rem',
        height: '2rem',
      }}
      {...buttonAttr}
      className="icon-button"
    >
      {Icon ? <Icon /> : children}
    </button>
  );
}
