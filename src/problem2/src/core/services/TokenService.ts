import axios from 'axios';
import { Price } from '../types';
import configService from './ConfigService';

class TokenService {
  private readonly BASE_URL;
  private readonly ICON_BASE_URL;

  constructor() {
    this.BASE_URL = configService.getPriceBaseUrl();
    this.ICON_BASE_URL = configService.getIconBaseUrl();
  }

  public async getPrices(): Promise<Price[]> {
    try {
      const response = await axios.get(this.BASE_URL);
      const prices: Price[] = response.data;

      const uniquePrices = prices.filter(
        (price, index, self) =>
          index === self.findIndex((p) => p.currency === price.currency)
      );

      return uniquePrices;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public getIconUrl(currency: string): string {
    return `${this.ICON_BASE_URL}/${currency}.svg`;
  }
}

const tokenService = new TokenService();

export default tokenService;
