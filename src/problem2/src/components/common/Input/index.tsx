import classNames from 'classnames/bind';
import React, { PropsWithoutRef, useId } from 'react';
import styles from './index.module.scss';

type BaseProps = {
  label?: string;
  classNames?: {
    wrapper?: string;
    input?: string;
    label?: string;
  };
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

type InputProps = PropsWithoutRef<
  React.InputHTMLAttributes<HTMLInputElement> & BaseProps
>;

const cx = classNames.bind(styles);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, classNames, prefix, suffix, ...props }, ref) => {
    const { id } = props;
    const inputId = useId();

    return (
      <div className={cx('wrapper', classNames?.wrapper)}>
        <div className={cx('container')}>
          <label
            htmlFor={id ?? inputId}
            className={cx('label', classNames?.label)}
          >
            {label}
          </label>

          <div className={cx('input-container')}>
            {prefix && <span className={cx('prefix')}>{prefix}</span>}

            <input
              id={inputId}
              className={cx('input', className, classNames?.input)}
              ref={ref}
              {...props}
            />

            {suffix && <span className={cx('suffix')}>{suffix}</span>}
          </div>
        </div>

        {props['aria-invalid'] && (
          <span className={cx('error')}>
            {props['aria-errormessage'] ||
              `${label ?? 'This field'} is invalid`}
          </span>
        )}
      </div>
    );
  }
) as React.ForwardRefExoticComponent<InputProps>;

export default Input;
