
import * as http from 'http';
import * as https from 'https';
import * as URL from 'url';
import { CODES } from './codes';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export interface IFetchOptions {
  url: string;
  method?: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: { [keys: string]: string | number };
  data?: { [key: string]: any };
  wait?: boolean;
  timeout?: number;
}

export default function fetch(options: IFetchOptions): Promise<{statusCode: number, data: any }> {
  return new Promise((resolve, reject) => {
    
      let resData = "";
      let url = URL.parse(options.url);  
      let provider = url.protocol.charAt(url.protocol.length - 2) === 's' ? https : http;   
      let data = options.data ? JSON.stringify(options.data) : null;
      let method = options.method ? options.method.toUpperCase() : 'GET';
      let headers: { [keys: string]: string | number } = options.headers ? Object.assign(Object.assign({}, defaultHeaders), options.headers) : defaultHeaders;
      let wait = options.wait === false ? false : true;
      let timeout = wait === false ? 0 : options.timeout || 0;
      let timer: NodeJS.Timer;
  
      if (data)
        headers['Content-Length'] = Buffer.byteLength(data); 
  
      let req = (<typeof http>provider).request({
        hostname: url.hostname,
        port: url.port || 80,
        path: `${url.path}`,
        method: method,
        headers: headers
      }, (response: http.IncomingMessage) => {
        
        if (!wait)
          return;

        let statusCode = response.statusCode;
  
        response.on('data', (chunk: string) => {
          resData += chunk;
        });
  
        response.on('end', () => {
          clearTimeout(timer);
          if (statusCode >= 200 && statusCode < 300) {
            if (headers && headers.Accept === 'application/json')
              resolve({ statusCode: statusCode, data: JSON.parse(resData)});
            else
              resolve({ statusCode: statusCode, data: resData});
  
          } else {
            reject({ statusCode, error: JSON.parse(resData) });
          }
        });
      });
  
      req.on('error', (error: any) => {
        clearTimeout(timer);
        reject({ statusCode: CODES.SERVIC_UNAVAILABLE, error: error.message || error });
      });
  
      req.write(data);
      req.end();

      if (timeout > 0)
        timer = setTimeout(() => {
          req.abort();
          reject({ statusCode: CODES.GATEWAY_TIMEOUT, error: 'request taking too long' });
        }, timeout);
  });
}