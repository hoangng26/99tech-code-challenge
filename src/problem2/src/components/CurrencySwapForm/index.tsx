import { Coin, Swap } from '@/assets';
import tokenService from '@/core/services/TokenService';
import { Price } from '@/core/types';
import classNames from 'classnames/bind';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select, { SelectProps } from '../common/Select';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

type FormDataType = {
  amount: number;
  from: string;
  to: string;
};

const CurrencySwapFormComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue: formSetValue,
    watch,
  } = useForm<FormDataType>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [value, setValue] = useState<FormDataType>();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);

  const amountWatcher = watch('amount');
  const fromWatcher = watch('from');
  const toWatcher = watch('to');

  const priceFrom = useMemo(
    () => prices.find((price) => price.currency === fromWatcher)?.price,
    [fromWatcher, prices]
  );
  const priceTo = useMemo(
    () => prices.find((price) => price.currency === toWatcher)?.price,
    [toWatcher, prices]
  );

  const options: SelectProps['options'] = useMemo(() => {
    return prices.map((price): NonNullable<SelectProps['options']>[number] => {
      const iconUrl = tokenService.getIconUrl(price.currency);

      return {
        label: (
          <div className="flex items-center gap-2">
            <span className="w-6 h-6">
              <img
                src={iconUrl}
                alt={price.currency}
                className="w-full h-full"
                onError={function (e) {
                  e.currentTarget.src = Coin;
                }}
              />
            </span>

            <span>{price.currency}</span>
          </div>
        ),
        value: price.currency,
      };
    });
  }, [prices]);

  const formSubmitHandler = (data: FormDataType) => {
    new Promise<FormDataType>((resolve) => {
      setLoading(true);
      setTimeout(() => resolve(data), 1000);
    }).then((data) => {
      setLoading(false);
      setValue(data);
    });
  };

  const switchCurrenciesHandler = () => {
    const tempFrom = fromWatcher;
    formSetValue('from', toWatcher);
    formSetValue('to', tempFrom);
    // formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
  };

  const convertAmount = (amount: number, reverse?: boolean) => {
    return !reverse
      ? (amount * (priceTo ?? 1)) / (priceFrom ?? 1)
      : (amount * (priceFrom ?? 1)) / (priceTo ?? 1);
  };

  useEffect(() => {
    const fetchPricesHandler = async () => {
      const fetchPrices = await tokenService.getPrices();
      setPrices(fetchPrices);
    };

    fetchPricesHandler();
  }, []);

  useEffect(() => {
    let submitTimeout: number;

    if (value) {
      submitTimeout = setTimeout(() => {
        formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
      }, 1);
    }

    return () => {
      clearTimeout(submitTimeout);
    };
  }, [amountWatcher, fromWatcher, toWatcher]);

  return (
    <div className={cx('form-wrapper')}>
      <h1 className="text-2xl font-bold text-center">Currency Swap</h1>

      <form ref={formRef} onSubmit={handleSubmit(formSubmitHandler)}>
        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Amount"
            placeholder="1.00"
            aria-invalid={!!errors.amount}
            aria-errormessage={errors.amount?.message}
            loading={loading}
            {...register('amount', {
              required: 'Amount is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Amount must be greater than 0' },
            })}
          />

          <div className="col-span-2 relative grid grid-cols-2 gap-2">
            <Controller
              name="from"
              control={control}
              rules={{
                required: 'From is required',
              }}
              render={({ field }) => (
                <Select
                  options={options.filter(
                    (option) => option.value !== toWatcher
                  )}
                  label="From"
                  classNames={{
                    container: '!pr-10',
                  }}
                  id="from"
                  aria-invalid={!!errors.from}
                  aria-errormessage={errors.from?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="to"
              control={control}
              rules={{
                required: 'To is required',
              }}
              render={({ field }) => (
                <Select
                  options={options.filter(
                    (option) => option.value !== fromWatcher
                  )}
                  label="To"
                  classNames={{
                    container: '!pl-10',
                  }}
                  id="to"
                  aria-invalid={!!errors.to}
                  aria-errormessage={errors.to?.message}
                  {...field}
                />
              )}
            />

            <div className="absolute left-1/2 top-1/2 z-20 m-auto flex -translate-x-1/2 -translate-y-1/2 transform">
              <button
                className="inline-flex rounded-full border border-solid border-gray-250 bg-white p-4 hover:bg-gray-100 text-gray-700"
                aria-label="Swap currencies"
                type="button"
                onClick={switchCurrenciesHandler}
              >
                <Swap height={16} width={16} />
              </button>
            </div>
          </div>

          <div className={cx('result-wrapper')}>
            <div className="flex-1">
              {value && (
                <>
                  <p className={cx('input')}>
                    {value.amount ?? 1} {value.from} =
                  </p>

                  <p className={cx('output')}>
                    {convertAmount(value.amount)} {value.to}
                  </p>

                  <div className={cx('value.from-to-rate')}>
                    <p>
                      1 {value.from} = {convertAmount(1)} {value.to}
                    </p>

                    <p>
                      1 {value.to} = {convertAmount(1, true)} {value.from}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex-none h-fit grid gap-4">
              {value && (
                <p className="text-xs text-gray-500">
                  <span className="text-blue-700 font-semibold">
                    {value.from}
                  </span>{' '}
                  to{' '}
                  <span className="text-blue-700 font-semibold">
                    {value.to}
                  </span>{' '}
                  conversion — Last updated {new Date().toUTCString()}
                </p>
              )}

              {!value && (
                <button
                  type="submit"
                  className="rounded-xl bg-blue-500 px-6 py-3 text-center text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-400 w-[234px] ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CurrencySwapFormComponent;
