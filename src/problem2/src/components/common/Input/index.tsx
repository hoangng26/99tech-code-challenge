import { Progress } from '@/assets';
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
  loading?: boolean;
};

type InputProps = PropsWithoutRef<
  React.InputHTMLAttributes<HTMLInputElement> & BaseProps
>;

const cx = classNames.bind(styles);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, classNames, prefix, suffix, loading, ...props },
    ref
  ) => {
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

            {loading && (
              <div className={cx('loading')}>
                <Progress width={24} height={24} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {props['aria-invalid'] && (
          <span className={cx('error')} role="alert">
            {props['aria-errormessage'] ||
              `${label ?? 'This field'} is invalid`}
          </span>
        )}
      </div>
    );
  }
) as React.ForwardRefExoticComponent<InputProps>;

export default Input;
