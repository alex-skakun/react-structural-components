import { ButtonHTMLAttributes } from 'react';


import style from './CleanButton.scss';

interface CleanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

export function CleanButton({ type = 'button', className, children, ...attrs }: CleanButtonProps): JSX.Element {
  const cssClasses = [style.cleanButton, className].join(' ');

  return <button type={type} className={cssClasses} {...attrs}>{children}</button>;
}
