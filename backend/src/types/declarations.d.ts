// Объявления для модулей без встроенных типов
declare module 'express' {
  import { Express as ExpressCore } from 'express-serve-static-core';
  const express: () => ExpressCore;
  export = express;
}

declare module 'cors' {
  import { RequestHandler } from 'express-serve-static-core';

  function cors(options?: cors.CorsOptions | cors.CorsOptionsDelegate): RequestHandler;

  namespace cors {
    interface CorsOptions {
      origin?: boolean | string | RegExp | (string | RegExp)[] | 
        ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    }

    interface CorsOptionsDelegate {
      (req: Request, callback: (err: Error | null, options?: CorsOptions) => void): void;
    }
  }

  export = cors;
}

declare module 'morgan' {
  import { RequestHandler } from 'express-serve-static-core';

  function morgan(format: string, options?: morgan.Options): RequestHandler;
  namespace morgan {
    function token<T extends Request, U extends Response>(
      name: string,
      callback: (req: T, res: U) => string,
    ): morgan;

    interface Options {
      stream?: { write: (str: string) => void };
      skip?: (req: Request, res: Response) => boolean;
    }
  }

  export = morgan;
}

declare module 'helmet' {
  import { RequestHandler } from 'express-serve-static-core';
  
  function helmet(options?: helmet.HelmetOptions): RequestHandler;
  namespace helmet {
    interface HelmetOptions {
      contentSecurityPolicy?: boolean | object;
      crossOriginEmbedderPolicy?: boolean | object;
      crossOriginOpenerPolicy?: boolean | object;
      crossOriginResourcePolicy?: boolean | object;
      dnsPrefetchControl?: boolean | object;
      expectCt?: boolean | object;
      frameguard?: boolean | object;
      hidePoweredBy?: boolean | object;
      hsts?: boolean | object;
      ieNoOpen?: boolean | object;
      noSniff?: boolean | object;
      originAgentCluster?: boolean | object;
      permittedCrossDomainPolicies?: boolean | object;
      referrerPolicy?: boolean | object;
      xssFilter?: boolean | object;
    }
  }

  export = helmet;
} 