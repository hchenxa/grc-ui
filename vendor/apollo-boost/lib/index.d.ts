export * from 'apollo-client';
export * from 'apollo-link';
export * from 'apollo-cache-inmemory';
import { Operation } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { ClientStateConfig } from 'apollo-link-state';
import { ErrorLink } from 'apollo-link-error';
import { ApolloCache } from 'apollo-cache';
import { CacheResolverMap } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
export { gql, HttpLink };
export interface PresetConfig {
    request?: (operation: Operation) => Promise<void>;
    uri?: string;
    credentials?: string;
    headers?: any;
    fetch?: GlobalFetch['fetch'];
    fetchOptions?: HttpLink.Options;
    clientState?: ClientStateConfig;
    onError?: ErrorLink.ErrorHandler;
    cacheRedirects?: CacheResolverMap;
    cache?: ApolloCache<any>;
}
export default class DefaultClient<TCache> extends ApolloClient<TCache> {
    constructor(config?: PresetConfig);
}
//# sourceMappingURL=index.d.ts.map