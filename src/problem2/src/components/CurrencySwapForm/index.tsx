import { Coin, Swap } from '@/assets';
import classNames from 'classnames/bind';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select, { SelectProps } from '../common/Select';
import styles from './index.module.scss';
import prices, { iconBaseUrl } from './prices';

const cx = classNames.bind(styles);

type FormDataType = {
  amount: number;
  from: string;
  to: string;
};

const CurrencySwapFormComponent: React.FC = () => {
  // const [value, setValue] = useDebounce(0, 1000);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormDataType>();
  const formRef = React.useRef<HTMLFormElement>(null);

  const options: SelectProps['options'] = prices.map(
    (price): NonNullable<SelectProps['options']>[number] => ({
      label: (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6">
            <img
              src={`${iconBaseUrl}/${price.currency}.svg`}
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
    })
  );

  const formSubmitHandler = (data: FormDataType) => {
    console.log(data);
  };

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
                  options={options}
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
                  options={options}
                  label="To"
                  classNames={{
                    container: '!pr-10',
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
              >
                <Swap height={16} width={16} />
              </button>
            </div>
          </div>

          <div className={cx('result-wrapper')}>
            <div className="flex-1">
              <p className={cx('input')}>
                {100.0} {'BLUR'} =
              </p>

              <p className={cx('output')}>
                {100.0} {'BLUR'}
              </p>

              <div className={cx('from-to-rate')}>
                <p>
                  1 {'BLUR'} = 1 {'USD'}
                </p>

                <p>
                  1 {'BLUR'} = 1 {'USD'}
                </p>
              </div>
            </div>

            <div className="flex-none">
              <button type="submit">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CurrencySwapFormComponent;
