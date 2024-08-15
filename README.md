<h1 align="center">@dvcol/mal-http-client</h1>
<p>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
  </a>
</p>

> Simple fetch based http client for the MyAnimeList API with full typescript support (request and response).

## Prerequisites

- pnpm >=9.0.0
- node >=20.0.0

## Install

```sh
pnpm install
```

## Usage

```sh
pnpm add @dvcol/mal-http-client
```

### Modular endpoint bundling

Mal-http-client is designed to be modular and flexible. Although it uses static classes, endpoints are instantiated at runtime and can be easily omitted, extended or overridden.
If your bundler does not support tree-shaking, you can omit unused endpoints by only importing the ones you need.

By default we provide a [full api](https://github.com/dvcol/mal-http-client/blob/main/lib/api/mal-api.endpoints.ts#L25) object with all supported endpoints, as well as a [minimal api](https://github.com/dvcol/mal-http-client/blob/main/lib/api/mal-api-minimal.endpoints.ts) object with only the essential authentication endpoints.
You can also import any [endpoint by common scope](https://github.com/dvcol/mal-http-client/tree/main/lib/api/endpoints).

```ts

import { MalClient } from '@dvcol/mal-http-client';
import { anime } from '@dvcol/mal-http-client/api/anime';
import { minimalMalApi } from '@dvcol/mal-http-client/api/minimal';
 
import { Config } from '@dvcol/mal-http-client/config';

import type { MalClientSettings } from '@dvcol/mal-http-client/models';


const malUsedApi = {
  ...minimalMalApi,
  anime
};

const malClientSettings: MalClientSettings = {
  client_id: '<Your mal ID>',
  client_secret: '<Your mal secret>',
  redirect_uri: '<Your mal redirect uri>',
  
  endpoint: Config.endpoint,
  TokenTTL: Config.TokenTTL,
  RefreshTokenTTL: Config.RefreshTokenTTL,

  useragent: '<Your user Agent>',
  corsProxy: '<Optional cors Proxy>',
  corsPrefix: '<Optional cors Proxy prefix>',
};

const initAuthentication = {}


const malClient = new MalClient(malClientSettings, initAuthentication, malUsedApi);
```

### Features 

[//]: # (TODO update this section)

* [Built-in cache support](https://github.com/dvcol/mal-http-client/blob/862718a3a51083a5f63f1ab15cc1e9aaf1b081af/lib/clients/mal-client.test.ts#L79-L155) (per client, endpoint, or query)
* [Extensible cache store](https://github.com/dvcol/mal-http-client/blob/862718a3a51083a5f63f1ab15cc1e9aaf1b081af/lib/clients/mal-client.test.ts#L135-L154) (in-memory, local storage, etc.)
* [Event observer](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L486-L575) (request, query, auth)
* [Built-in cancellation support](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L691-L758)
* [Code redirect authentication](https://github.com/dvcol/mal-http-client/blob/862718a3a51083a5f63f1ab15cc1e9aaf1b081af/lib/clients/mal-client.ts#L40-L130)
* [Token refresh](https://github.com/dvcol/mal-http-client/blob/862718a3a51083a5f63f1ab15cc1e9aaf1b081af/lib/clients/mal-client.ts#L132-L170)

### Documentation

See [Mal API documentation](https://myanimelist.net/apiconfig/references/api/v2) for more information.

## Author

* Github: [@dvcol](https://github.com/dvcol)

## 📝 License

This project is [MIT](https://github.com/dvcol/mal-http-client/blob/master/LICENSE) licensed.
