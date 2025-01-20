import mergeRefs from '@/core/utils/mergeRefs';
import classNames from 'classnames/bind';
import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

export type SelectProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  classNames?: {
    wrapper?: string;
    container?: string;
    select?: string;
    label?: string;
  };
  options?: {
    value: string;
    label: React.ReactNode;
  }[];
  onChange?: (value: unknown) => void;
};

const Select: React.ForwardRefExoticComponent<SelectProps> = React.forwardRef<
  HTMLInputElement,
  SelectProps
>(
  (
    {
      label,
      classNames,
      options,
      value,
      onChange: changeEventHandler,
      ...props
    },
    ref
  ) => {
    const { id } = props;
    const selectId = useId();
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (event.target instanceof HTMLElement) {
          if (!event.target.closest(`#${id ?? selectId}`)) {
            setIsOptionsOpen(false);
          }
        }
      };

      window.addEventListener('click', handleClickOutside);

      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }, [id, selectId]);

    return (
      <div className={cx('wrapper', classNames?.wrapper)}>
        <div className={cx('container', classNames?.container)}>
          <label
            className={cx('label', classNames?.label)}
            htmlFor={id ?? selectId}
          >
            {label}
          </label>

          <div className={cx('select-container')}>
            <input
              className={cx('input', classNames?.select)}
              readOnly
              placeholder="Select currency"
              role="combobox"
              id={selectId}
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              ref={mergeRefs(ref, inputRef)}
              aria-expanded={isOptionsOpen}
              value={options?.find((opt) => opt.value === value)?.value || ''}
              onChange={changeEventHandler}
              {...props}
            />

            <label
              htmlFor={id ?? selectId}
              className={cx('value', classNames?.select)}
            >
              {
                options?.find(
                  (option) => option.value === inputRef.current?.value
                )?.label
              }
            </label>
          </div>
        </div>

        {props['aria-invalid'] && (
          <span className={cx('error')}>
            {props['aria-errormessage'] ||
              `${label ?? 'This field'} is invalid`}
          </span>
        )}

        <div className={cx('options-wrapper', { open: isOptionsOpen })}>
          <ul className={cx('options')} role="list">
            {options?.map((option) => (
              <li
                key={option.value}
                className={cx('option')}
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = option.value;
                    changeEventHandler?.(option.value);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);

export default Select;
