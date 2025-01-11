import { Injectable } from '@nestjs/common';
import { AuthTokenDTO } from '../dtos/auth-token.dto';
import { HttpClientService } from './http-client.service';

import { SIIGO_AUTH_URL, SIIGO_API_URL, SIIGO_USERNAME, SIIGO_ACCESSKEY, SIIGO_PARTNERID } from '../../config/envs'
import { HttpClientContentType } from '../dtos/http-client.dto';
import { SiigoProductDTO } from '../dtos/siigo-product.dto';
import { SiigoInvoiceDTO } from '../dtos/siigo-invoice.dto';

@Injectable()
export class SiigoService {
    accessKey: string;
    authUrl: string;
    authToken: AuthTokenDTO;
    apiUrl: string;
    partnerId: string;
    username: string;
    timeout: number = 10000;
    tokenRefreshInterval: NodeJS.Timeout;

    constructor(private httpClientService: HttpClientService) {
        this.getSiigoConfig();
        this.startTokenRefreshTimer();
    }

    getSiigoConfig(): void {
        this.authUrl = SIIGO_AUTH_URL;
        this.apiUrl = SIIGO_API_URL;
        this.partnerId = SIIGO_PARTNERID;
        this.username = SIIGO_USERNAME;
        this.accessKey = SIIGO_ACCESSKEY;
    }

    private async startTokenRefreshTimer() {
        await this.refreshToken();
        let expirationTime;
        if (this.authToken.expires_in > 86400) {
          expirationTime = 86400;
        } else {
          expirationTime = this.authToken.expires_in;
        }
        const refreshTime = expirationTime * 1000;
        this.tokenRefreshInterval = setInterval(async () => {
          await this.refreshToken();
        }, refreshTime);
    }

    private async refreshToken() {
        try {
          const response = await this.httpClientService.post(
            this.authUrl,
            {
              username: this.username,
              access_key: this.accessKey
            },
            [
              ['Content-Type', HttpClientContentType.JSON],
              ['Partner-Id', this.partnerId]
            ]
          );
          this.authToken = response;
          //console.log('Token refreshed:', this.authToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
    }

    async getHeaders(): Promise<[string, string][]> {
        return [
          ['Content-Type', HttpClientContentType.JSON],
          [
            'Authorization',
            `${this.authToken.token_type} ${this.authToken.access_token}`
          ],
          ['Partner-Id', this.partnerId]
        ];
    }

    async CreateProduct(payload: SiigoProductDTO): Promise<any> {
        return await this.httpClientService.post(
          `${this.apiUrl}/products`,
          payload,
          await this.getHeaders()
        );
    }

    async CreateInvoice(payload: SiigoInvoiceDTO): Promise<any> {
        return await this.httpClientService.post(
          `${this.apiUrl}/invoices`,
          payload,
          await this.getHeaders()
        );
    }

    async invoicePDF(siigo_id: string, filter?: any): Promise<any> {
        return await this.httpClientService.get(
          `${this.apiUrl}/invoices/${siigo_id}/pdf`,
          filter,
          await this.getHeaders()
        );
    }

    async getAllResolutions(filter?: any): Promise<any> {
        return await this.httpClientService.get(
          `${this.apiUrl}/document-types?type=FV`,
          filter,
          await this.getHeaders()
        );
    }
}
