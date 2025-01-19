import { Coin } from '@/assets';
import classNames from 'classnames/bind';
import React from 'react';
import Input from '../common/Input';
import Select, { SelectProps } from '../common/Select';
import styles from './index.module.scss';
import prices, { iconBaseUrl } from './prices';

const cx = classNames.bind(styles);

const CurrencySwapFormComponent: React.FC = () => {
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

  return (
    <div className={cx('form-wrapper')}>
      <div>Currency Swap</div>
      <div className="grid grid-cols-3 gap-2">
        <Input label="Amount" placeholder="1.00" />

        <div className="col-span-2 relative grid grid-cols-2 gap-2">
          <Select options={options} label="From" id="from" />

          <Select options={options} label="To" id="to" />
        </div>
      </div>
    </div>
  );
};

export default CurrencySwapFormComponent;
