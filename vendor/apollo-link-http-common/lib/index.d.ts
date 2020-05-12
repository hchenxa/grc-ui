import { Operation } from 'apollo-link';
export declare type ServerError = Error & {
    response: Response;
    result: Record<string, any>;
    statusCode: number;
};
export declare type ServerParseError = Error & {
    response: Response;
    statusCode: number;
    bodyText: string;
};
export declare type ClientParseError = Error & {
    parseError: Error;
};
export interface HttpQueryOptions {
    includeQuery?: boolean;
    includeExtensions?: boolean;
}
export interface HttpConfig {
    http?: HttpQueryOptions;
    options?: any;
    headers?: any;
    credentials?: any;
}
export interface UriFunction {
    (operation: Operation): string;
}
export interface Body {
    query?: string;
    operationName?: string;
    variables?: Record<string, any>;
    extensions?: Record<string, any>;
}
export interface HttpOptions {
    /**
     * The URI to use when fetching operations.
     *
     * Defaults to '/graphql'.
     */
    uri?: string | UriFunction;
    /**
     * Passes the extensions field to your graphql server.
     *
     * Defaults to false.
     */
    includeExtensions?: boolean;
    /**
     * A `fetch`-compatible API to use when making requests.
     */
    fetch?: GlobalFetch['fetch'];
    /**
     * An object representing values to be sent as headers on the request.
     */
    headers?: any;
    /**
     * The credentials policy you want to use for the fetch call.
     */
    credentials?: string;
    /**
     * Any overrides of the fetch options argument to pass to the fetch call.
     */
    fetchOptions?: any;
}
export declare const fallbackHttpConfig: {
    http: HttpQueryOptions;
    headers: {
        accept: string;
        'content-type': string;
    };
    options: {
        method: string;
    };
};
export declare const throwServerError: (response: any, result: any, message: any) => never;
export declare const parseAndCheckHttpResponse: (operations: any) => (response: Response) => Promise<any>;
export declare const checkFetcher: (fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>) => void;
export declare const createSignalIfSupported: () => {
    controller: any;
    signal: any;
};
export declare const selectHttpOptionsAndBody: (operation: Operation, fallbackConfig: HttpConfig, ...configs: HttpConfig[]) => {
    options: HttpConfig & Record<string, any>;
    body: Body;
};
export declare const serializeFetchParameter: (p: any, label: any) => any;
export declare const selectURI: (operation: any, fallbackURI?: string | ((operation: Operation) => string)) => any;