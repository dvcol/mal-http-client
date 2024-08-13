import { BaseHeaderContentType } from '@dvcol/base-http-client';
import { BaseApiHeaders } from '@dvcol/base-http-client/utils/http';
import { HttpMethod } from '@dvcol/common-utils/http';
import { CancellableFetch } from '@dvcol/common-utils/http/fetch';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BaseMalClient, parseResponse } from './base-mal-client';

import type { BaseBody, BaseInit } from '@dvcol/base-http-client';

import type { IMalClientAuthentication } from '~/models/mal-authentication.model';

import type { MalApiParams, MalApiTemplate } from '~/models/mal-client.model';

import { malClientSettingsMock } from '~/mocks/mal-settings.mock';
import { MalClientAuthentication } from '~/models/mal-authentication.model';
import { ApiVersion, MalApiHeader, MalAuthType } from '~/models/mal-client.model';

class TestableMalClient extends BaseMalClient {
  publicUpdateAuth(auth: IMalClientAuthentication) {
    return this.updateAuth(new MalClientAuthentication(auth));
  }

  publicCall<P extends MalApiParams>(template: MalApiTemplate<P>, params: P = {} as P, init?: BaseInit) {
    return this._call<P>(template, params, init);
  }

  publicParseBody<T extends MalApiParams = MalApiParams>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return this._parseBody(template, params);
  }

  publicParse<T extends MalApiParams>(template: MalApiTemplate<T>, params: T) {
    return this._parseUrl(template, params).toString();
  }
}

describe('base-mal-client.ts', () => {
  const client = new TestableMalClient(malClientSettingsMock);

  afterEach(() => {
    client.publicUpdateAuth({});
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect.assertions(2);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  type Params = {
    requiredQuery: string;
    optionalQuery?: string;
    requiredPath: string;
    optionalPath?: string;
    requiredBody: string;
    optionalBody?: string;
    [key: string]: string;
  };

  // Mock data for testing
  const mockParams: Params = {
    requiredQuery: 'requiredQuery',
    requiredPath: 'requiredPath',
    requiredBody: 'requiredBody',
    optionalQuery: 'optionalQuery',
  };

  // Mock MalApiTemplate for testing
  const mockTemplate: MalApiTemplate<Params> = {
    url: '/manga/:requiredPath/:optionalPath/popular',
    method: HttpMethod.PATCH,
    opts: {
      version: ApiVersion.v2,
      parameters: {
        query: {
          requiredQuery: true,
          optionalQuery: false,
        },
        path: {
          requiredPath: true,
          optionalPath: false,
        },
      },
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    body: {
      requiredBody: true,
      optionalBody: false,
    },
  };

  const mockAuth: IMalClientAuthentication = {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
  };

  describe('parseParams', () => {
    it('should construct a valid URL for Mal API request', async () => {
      expect.assertions(1);

      const result = client.publicParse(mockTemplate, mockParams);

      expect(result).toBe(
        `${malClientSettingsMock.endpoint}/${mockTemplate.opts.version}/manga/requiredPath/popular?requiredQuery=requiredQuery&optionalQuery=optionalQuery`,
      );
    });

    it('should throw an error for missing mandatory query parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredQuery: '' });
      expect(testFunction).toThrow("Missing mandatory query parameter: 'requiredQuery'");
    });

    it('should throw an error for missing mandatory path parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredPath: '' });
      expect(testFunction).toThrow("Missing mandatory path parameter: 'requiredPath'");
    });
  });

  describe('parseBody', () => {
    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const result = client.publicParseBody<MalApiParams>(mockTemplate.body!, mockParams);
      expect(result).toStrictEqual(new URLSearchParams({ requiredBody: 'requiredBody' }));
    });

    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const mockBody: Record<string, unknown> = { ...mockParams, optionalBody: 'optionalBody' };
      delete mockBody.requiredBody;
      const testFunction = () => client.publicParseBody(mockTemplate.body!, mockBody);
      expect(testFunction).toThrow("Missing mandatory body parameter: 'requiredBody'");
    });
  });

  describe('parseResponse', () => {
    it('should return simple response as is', () => {
      expect.assertions(1);

      const response = { success: true };
      const result = parseResponse(response);
      expect(result).toBe(response);
    });

    it('should parse paginated response', () => {
      expect.assertions(1);

      const response = {
        data: [
          {
            node: {
              id: 2,
              title: 'Berserk',
              main_picture: {
                medium: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
                large: 'https://cdn.myanimelist.net/images/manga/1/157897l.jpg',
              },
            },
            ranking: {
              rank: 1,
            },
          },
          {
            node: {
              id: 1706,
              title: 'JoJo no Kimyou na Bouken Part 7: Steel Ball Run',
              main_picture: {
                medium: 'https://cdn.myanimelist.net/images/manga/3/179882.jpg',
                large: 'https://cdn.myanimelist.net/images/manga/3/179882l.jpg',
              },
            },
            ranking: {
              rank: 2,
            },
          },
        ],
        paging: {
          next: 'https://api.myanimelist.net/v2/manga/ranking?offset=4&limit=4',
        },
      };
      const result = parseResponse(response);
      expect(result).toStrictEqual({
        data: response.data,
        pagination: {
          next: { offset: 4, limit: 4, link: response.paging.next },
        },
      });
    });
  });

  it('should make a PATCH call to the Mal API', async () => {
    expect.assertions(3);

    const response = new Response();

    const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

    const result = await client.publicCall(mockTemplate, mockParams);

    expect(spyFetch).toHaveBeenCalledWith(
      `${malClientSettingsMock.endpoint}/${mockTemplate.opts.version}/manga/requiredPath/popular?requiredQuery=requiredQuery&optionalQuery=optionalQuery`,
      {
        body: new URLSearchParams({ requiredBody: 'requiredBody' }),
        headers: {
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.FormUrlEncoded,
          [BaseApiHeaders.UserAgent]: malClientSettingsMock.useragent,
          [MalApiHeader.MalClientId]: malClientSettingsMock.client_id,
          [MalApiHeader.MalApiVersion]: mockTemplate.opts?.version,
        },
        method: HttpMethod.PATCH,
      },
    );

    expect(result).toBe(response);

    expect(spyFetch).toHaveBeenCalledTimes(1);
  });

  it('should add authorize header when auth is required', async () => {
    expect.assertions(3);

    const response = new Response();

    const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

    client.publicUpdateAuth(mockAuth);
    const result = await client.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: MalAuthType.User } }, mockParams);

    expect(spyFetch).toHaveBeenCalledWith(
      `${malClientSettingsMock.endpoint}/${mockTemplate.opts.version}/manga/requiredPath/popular?requiredQuery=requiredQuery&optionalQuery=optionalQuery`,
      {
        body: new URLSearchParams({ requiredBody: 'requiredBody' }),
        headers: {
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.FormUrlEncoded,
          [BaseApiHeaders.UserAgent]: malClientSettingsMock.useragent,
          [MalApiHeader.MalClientId]: malClientSettingsMock.client_id,
          [MalApiHeader.MalApiVersion]: mockTemplate.opts?.version,
          [BaseApiHeaders.Authorization]: `Bearer ${mockAuth.access_token}`,
        },
        method: HttpMethod.PATCH,
      },
    );

    expect(result).toBe(response);

    expect(spyFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if auth is missing', async () => {
    expect.assertions(1);

    const testFunction = () => client.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: MalAuthType.User } }, mockParams);
    expect(testFunction).toThrow('OAuth required: access_token is missing');
  });
});
