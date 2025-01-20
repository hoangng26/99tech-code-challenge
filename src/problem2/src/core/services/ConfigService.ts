class ConfigService {
  private readonly PRICE_BASE_URL = import.meta.env
    .ENV_PRICE_BASE_URL as string;
  private readonly ICON_BASE_URL = import.meta.env.ENV_ICON_BASE_URL as string;

  public getPriceBaseUrl(): string {
    return this.PRICE_BASE_URL;
  }

  public getIconBaseUrl(): string {
    return this.ICON_BASE_URL;
  }
}

const configService = new ConfigService();

export default configService;
