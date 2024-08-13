import { BaseHeaderContentType } from '@dvcol/base-http-client';
import { BaseApiHeaders } from '@dvcol/base-http-client/utils/http';
import { hasOwnProperty } from '@dvcol/base-http-client/utils/test';

import { HttpMethod } from '@dvcol/common-utils/http';
import { CancellableFetch } from '@dvcol/common-utils/http/fetch';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { minimalMalApi } from '../api/mal-api-minimal.endpoints';
import { malApi } from '../api/mal-api.endpoints';

import { malClientSettingsMock } from '../mocks/mal-settings.mock';

import { MalClientAuthentication } from '../models/mal-authentication.model';

import { MalInvalidCsrfError, MalInvalidParameterError } from '../models/mal-error.model';

import { MalClient } from './mal-client';

import type { MalAuthenticationToken } from '../models/mal-authentication.model';

import type { CacheStore } from '@dvcol/common-utils';

import type { MalApiResponse } from '~/models/mal-client.model';

import { ApiVersion, MalApiHeader } from '~/models/mal-client.model';

describe('mal-client.ts', () => {
  const malClient = new MalClient(malClientSettingsMock, {}, malApi);
  const fetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(new Response());

  const payload = {
    headers: {
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [BaseApiHeaders.UserAgent]: malClientSettingsMock.useragent,
      [MalApiHeader.MalClientId]: malClientSettingsMock.client_id,
      [MalApiHeader.MalApiVersion]: ApiVersion.v2,
    },
    method: HttpMethod.GET,
  };

  afterEach(async () => {
    await malClient.importAuthentication({});
    await malClient.clearCache();

    vi.clearAllMocks();
  });

  describe('malClient', () => {
    const animeUrl = `/${malApi.anime.list.opts.version}${malApi.anime.list.url}?q=one+piece`;
    const animeQuery = { q: 'one piece' };

    const state = '0e44c45dd73fb296';
    const code_challenge = 'code_challenge';
    const code = 'redirect_code';
    const code_verifier = 'code_verifier';

    it('should have every endpoint', () => {
      expect.hasAssertions();

      hasOwnProperty(malApi, malClient);
    });

    it('should have only minimal endpoint', () => {
      expect.hasAssertions();

      const minimalClient = new MalClient(malClientSettingsMock, {});
      hasOwnProperty(minimalMalApi, minimalClient);
    });

    it('should query certifications method', async () => {
      expect.assertions(1);

      await malClient.anime.list(animeQuery);

      expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
    });

    describe('cache', () => {
      it('should not cache calls', async () => {
        expect.assertions(2);

        await malClient.anime.list(animeQuery);
        await malClient.anime.list(animeQuery);
        await malClient.anime.list(animeQuery);

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
      });

      it('should cache subsequent calls', async () => {
        expect.assertions(2);

        await malClient.anime.list.cached(animeQuery);
        await malClient.anime.list.cached(animeQuery);
        await malClient.anime.list.cached(animeQuery);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache cleared', async () => {
        expect.assertions(2);

        await malClient.anime.list.cached(animeQuery);
        await malClient.anime.list.cached(animeQuery);
        await malClient.clearCache();
        await malClient.anime.list.cached(animeQuery);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
      });

      it('should clear cache after error', async () => {
        expect.assertions(3);

        const error = new Error('Error');
        fetch.mockRejectedValueOnce(error);

        let err: unknown;
        try {
          await malClient.anime.list.cached(animeQuery);
        } catch (e) {
          err = e;
        } finally {
          expect(err).toBe(error);
        }
        await malClient.anime.list.cached(animeQuery);
        await malClient.anime.list.cached(animeQuery);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache expired', async () => {
        expect.assertions(2);

        const cacheStore: CacheStore<MalApiResponse> = new Map();
        cacheStore.retention = 15;
        const _malClient = new MalClient({ ...malClientSettingsMock, cacheStore }, {}, malApi);

        await _malClient.anime.list.cached(animeQuery);
        await _malClient.anime.list.cached(animeQuery);

        // Wait for cache to expire
        await new Promise(resolve => {
          setTimeout(resolve, 20);
        });

        await _malClient.anime.list.cached(animeQuery);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL(animeUrl, malClientSettingsMock.endpoint).toString(), payload);
      });
    });

    const authentication: MalAuthenticationToken = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 10000,
      token_type: 'Bearer',
    };

    const clientAuthentication = new MalClientAuthentication(authentication);

    it('should redirect to authorization url', async () => {
      expect.assertions(1);

      const url = new URL(`/v1/oauth2/authorize`, malClientSettingsMock.endpoint);
      url.searchParams.append('client_id', malClientSettingsMock.client_id);
      url.searchParams.append('code_challenge', code_challenge);
      url.searchParams.append('state', state);
      url.searchParams.append('redirect_uri', malClientSettingsMock.redirect_uri);
      url.searchParams.append('response_type', 'code');

      await malClient.authorize({ state, code_challenge });

      expect(fetch).toHaveBeenCalledWith(url.toString(), {
        credentials: 'omit',
        headers: {
          ...payload.headers,
          [MalApiHeader.MalApiVersion]: ApiVersion.v1,
        },
        method: HttpMethod.GET,
        redirect: 'manual',
      });
    });

    it('should exchange code for token', async () => {
      expect.assertions(1);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await malClient.exchangeCodeForToken({ code, code_verifier });

      expect(fetch).toHaveBeenCalledWith(new URL('/v1/oauth2/token', malClientSettingsMock.endpoint).toString(), {
        ...payload,
        headers: {
          ...payload.headers,
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.FormUrlEncoded,
          [MalApiHeader.MalApiVersion]: ApiVersion.v1,
        },
        method: HttpMethod.POST,
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: malClientSettingsMock.client_id,
          client_secret: malClientSettingsMock.client_secret,
          code_verifier,
          redirect_uri: malClientSettingsMock.redirect_uri,
        }),
      });
    });

    it('should throw error while exchanging code with invalid CSRF', async () => {
      expect.assertions(3);

      await malClient.authorize({ state, code_challenge });

      const invalidState = 'invalid_state';

      let error: Error | undefined;
      try {
        await malClient.exchangeCodeForToken({ code, code_verifier }, invalidState);
      } catch (err) {
        error = err as Error;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(MalInvalidCsrfError);
        expect(error?.message).toBe(new MalInvalidCsrfError({ state: invalidState, expected: state }).message);
      }
    });

    it('should refreshing with existing token', async () => {
      expect.assertions(1);

      await malClient.importAuthentication(clientAuthentication);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await malClient.refreshAccessToken();

      expect(fetch).toHaveBeenCalledWith(new URL('/v1/oauth2/token', malClientSettingsMock.endpoint).toString(), {
        ...payload,
        headers: {
          ...payload.headers,
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.FormUrlEncoded,
          [MalApiHeader.MalApiVersion]: ApiVersion.v1,
        },
        method: HttpMethod.POST,
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: authentication.refresh_token,
          client_id: malClientSettingsMock.client_id,
          client_secret: malClientSettingsMock.client_secret,
        }),
      });
    });

    it('should refresh token when importing an expired auth', async () => {
      expect.assertions(1);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await malClient.importAuthentication({ ...clientAuthentication, expires: new Date().getTime() - 10000 });

      expect(fetch).toHaveBeenCalledWith(new URL('/v1/oauth2/token', malClientSettingsMock.endpoint).toString(), {
        ...payload,
        headers: {
          ...payload.headers,
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.FormUrlEncoded,
          [MalApiHeader.MalApiVersion]: ApiVersion.v1,
        },
        method: HttpMethod.POST,
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: authentication.refresh_token,
          client_id: malClientSettingsMock.client_id,
          client_secret: malClientSettingsMock.client_secret,
        }),
      });
    });

    it('should throw error while refreshing without existing token', async () => {
      expect.assertions(3);

      let error: Error | undefined;
      try {
        await malClient.refreshAccessToken();
      } catch (err) {
        error = err as Error;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(MalInvalidParameterError);
        expect(error?.message).toBe('No refresh token found.');
      }
    });
  });
});
