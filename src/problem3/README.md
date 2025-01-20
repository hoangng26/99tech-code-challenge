# Refactoring `index.tsx`

## Issues in the Original Code

The original code in `index.tsx` had several issues that could be improved for better readability, maintainability, and performance. Here are the key issues:

1. **TypeScript Type Issues**:

   - The `WalletBalance` interface was missing the `blockchain` property, which is used in the `getPriority` function.
   - The `FormattedWalletBalance` interface duplicated properties from `WalletBalance`.

2. **Logic Complexity**:

   - The filter condition in `sortedBalances` was overly complex with nested conditions.
   - The sorting logic used multiple `if` statements, making it harder to read and maintain.

3. **Formatting**:

   - The amount formatting logic was not clearly defined.

4. **Code Readability**:
   - The code had unnecessary nested conditions and could be made more concise.

## Improvements Made

The refactored code addresses the above issues with the following improvements:

1. **TypeScript Type Improvements**:

   - Added the `blockchain` property to the `WalletBalance` interface to ensure it is available for the `getPriority` function.
   - Extended `FormattedWalletBalance` from `WalletBalance` to avoid redundancy.

2. **Logic Simplification**:

   - Simplified the filter condition in `sortedBalances` to check both priority and amount in a single return statement.
   - Simplified the sorting logic by directly returning the difference between priorities.

3. **Formatting**:

   - Used `toFixed(2)` for formatting amounts to two decimal places.

4. **Code Readability**:
   - Improved readability by removing unnecessary nested conditions and making the code more concise.

## Refactored Code

Here is the refactored code:

```tsx
import React, { useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: balance.amount.toFixed(2),
  }));

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
```
