import { Injectable } from '@nestjs/common';
import { HttpClientBaseMehod } from '../dtos/http-client.dto';

@Injectable()
export class HttpClientService {
    async post(
        url: string,
        data: any,
        headers?: [string, string][]
      ): Promise<any> {
        const opts: RequestInit = {
          method: HttpClientBaseMehod.POST,
          body: JSON.stringify(data),
          headers: headers
        };
    
        return await this.processRequest(url, opts);
      }
    
      async get(url: string, query: any, headers?: [string, string][]) {
        url = await this.processUrl(url, query);
    
        const opts: RequestInit = {
          method: HttpClientBaseMehod.GET,
          headers: headers
        };
    
        return await this.processRequest(url, opts);
      }
    
      async put(
        url: string,
        query: any,
        data: any,
        headers?: [string, string][]
      ): Promise<any> {
        url = await this.processUrl(url, query);
    
        const opts: RequestInit = {
          method: HttpClientBaseMehod.PUT,
          body: JSON.stringify(data),
          headers: headers
        };
    
        return await this.processRequest(url, opts);
      }
    
      async processUrl(url: string, query: any) {
        return query
          ? url +
              '?' +
              Object.keys(query)
                .map(
                  (k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
                )
                .join('&')
          : url;
      }
    
      async processRequest(url: string, opts: RequestInit): Promise<any> {
        const response = await fetch(url, opts);
        return await response.json();
      }
}
