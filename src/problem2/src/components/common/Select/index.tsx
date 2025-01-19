import classNames from 'classnames/bind';
import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

export type SelectProps = React.HTMLAttributes<HTMLInputElement> & {
  label?: string;
  classNames?: {
    wrapper?: string;
    select?: string;
    label?: string;
  };
  options?: {
    value: string;
    label: React.ReactNode;
  }[];
};

const Select: React.FC<SelectProps> = ({
  label,
  classNames,
  options,
  ...props
}) => {
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
      <div className={cx('container')}>
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
            ref={inputRef}
            aria-expanded={isOptionsOpen}
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

      <div className={cx('options-wrapper', { open: isOptionsOpen })}>
        <ul className={cx('options')} role="list">
          {options?.map((option) => (
            <li
              key={option.value}
              className={cx('option')}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = option.value;
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
};

export default Select;
