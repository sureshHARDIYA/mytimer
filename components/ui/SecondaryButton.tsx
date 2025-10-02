import Link from "next/link";
import React, { ReactNode } from "react";

import styles from "./SecondaryButton.module.scss";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: React.ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    if (props.href) {
      return (
        <Link
          href={props.href}
          className={`${styles.secondary} ${props.isActive && styles.active} ${
            props.className
          }`}
        >
          {props.children}
        </Link>
      );
    }

    return (
      <button
        className={`${styles.secondary} ${props.isActive && styles.active} ${
          props.className
        }`}
        onClick={props.onClick}
        type={props.type || "button"}
        ref={ref}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    );
  }
);

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
