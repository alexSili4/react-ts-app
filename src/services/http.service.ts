import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface HttpConfig<T> extends AxiosRequestConfig {
  url: string;
  data?: T;
  signal?: AbortSignal;
}

// Базовий клас для сервісів API: спадкоємець (app.service.ts) описує методи
// бекенду, а адресу, версію API й токен бере звідси. Адреса бекенду —
// VITE_API_URL (.env); порожня — той самий домен.
class HttpService {
  constructor(
    public baseUrl: string = import.meta.env.VITE_API_URL ?? '',
    public fetchingService: AxiosInstance = axios,
    public apiVersion: string = 'api'
  ) {
    this.baseUrl = baseUrl;
    this.fetchingService = fetchingService;
    this.apiVersion = apiVersion;
  }

  private getFullApiUrl(url: string): string {
    return `${this.baseUrl}/${this.apiVersion}/${url}`;
  }

  // Токен у проєкті поки ніхто не записує — метод лишається на майбутнє. Тому
  // порожнє сховище тут не виняткова ситуація, а нормальний стан: віддаємо
  // порожні заголовки, і запит просто йде без авторизації.
  //
  // Раніше тут стояло JSON.parse(localStorage.getItem('token') || ''), а
  // JSON.parse('') кидає SyntaxError. Оскільки withAuth за замовчуванням
  // увімкнений у всіх п'яти методів, будь-який виклик без явного withAuth:false
  // падав би на першому ж рядку.
  private populateTokenToHeaderConfig(): Record<string, string> {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.parseToken(storedToken)}`,
    };
  }

  // Токен можуть покласти і через JSON.stringify, і сирим рядком. Перший
  // випадок розбираємо, на другому JSON.parse кидає — отже, у сховищі вже
  // лежить готове значення.
  private parseToken(storedToken: string): string {
    try {
      const parsedToken: unknown = JSON.parse(storedToken);

      return typeof parsedToken === 'string' ? parsedToken : storedToken;
    } catch {
      return storedToken;
    }
  }

  private extractUrlAndDataFromConfig<T>(
    config: HttpConfig<T>
  ): AxiosRequestConfig {
    const updatedConfig = { ...config };
    updatedConfig.url = '';
    updatedConfig.data = undefined;

    return updatedConfig;
  }

  private withAuthHeaders<T>(
    config: HttpConfig<T>,
    withAuth: boolean
  ): HttpConfig<T> {
    if (!withAuth) {
      return config;
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        ...this.populateTokenToHeaderConfig(),
      },
    };
  }

  get<T>(config: HttpConfig<T>, withAuth = true): Promise<AxiosResponse<T>> {
    const requestConfig = this.withAuthHeaders(config, withAuth);

    return this.fetchingService.get<T>(
      this.getFullApiUrl(requestConfig.url),
      this.extractUrlAndDataFromConfig(requestConfig)
    );
  }

  post<T, K>(
    config: HttpConfig<K>,
    withAuth = true
  ): Promise<AxiosResponse<T>> {
    const requestConfig = this.withAuthHeaders(config, withAuth);

    return this.fetchingService.post<T>(
      this.getFullApiUrl(requestConfig.url),
      requestConfig.data,
      this.extractUrlAndDataFromConfig(requestConfig)
    );
  }

  patch<T, K>(
    config: HttpConfig<K>,
    withAuth = true
  ): Promise<AxiosResponse<T>> {
    const requestConfig = this.withAuthHeaders(config, withAuth);

    return this.fetchingService.patch<T>(
      this.getFullApiUrl(requestConfig.url),
      requestConfig.data,
      this.extractUrlAndDataFromConfig(requestConfig)
    );
  }

  put<T, K>(config: HttpConfig<K>, withAuth = true): Promise<AxiosResponse<T>> {
    const requestConfig = this.withAuthHeaders(config, withAuth);

    return this.fetchingService.put<T>(
      this.getFullApiUrl(requestConfig.url),
      requestConfig.data,
      this.extractUrlAndDataFromConfig(requestConfig)
    );
  }

  delete<T>(config: HttpConfig<T>, withAuth = true): Promise<AxiosResponse<T>> {
    const requestConfig = this.withAuthHeaders(config, withAuth);

    return this.fetchingService.delete<T>(
      this.getFullApiUrl(requestConfig.url),
      this.extractUrlAndDataFromConfig(requestConfig)
    );
  }
}

export default HttpService;
