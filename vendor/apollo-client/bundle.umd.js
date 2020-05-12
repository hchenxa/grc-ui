(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-link'), require('symbol-observable'), require('apollo-utilities'), require('graphql/language/printer'), require('apollo-link-dedup')) :
    typeof define === 'function' && define.amd ? define(['exports', 'apollo-link', 'symbol-observable', 'apollo-utilities', 'graphql/language/printer', 'apollo-link-dedup'], factory) :
    (factory((global.apollo = global.apollo || {}, global.apollo.core = {}),global.apolloLink.core,global.$$observable,global.apollo.utilities,global.print,global.apolloLink.dedup));
}(this, (function (exports,apolloLink,$$observable,apolloUtilities,printer,apolloLinkDedup) { 'use strict';

    $$observable = $$observable && $$observable.hasOwnProperty('default') ? $$observable['default'] : $$observable;

    (function (NetworkStatus) {
        NetworkStatus[NetworkStatus["loading"] = 1] = "loading";
        NetworkStatus[NetworkStatus["setVariables"] = 2] = "setVariables";
        NetworkStatus[NetworkStatus["fetchMore"] = 3] = "fetchMore";
        NetworkStatus[NetworkStatus["refetch"] = 4] = "refetch";
        NetworkStatus[NetworkStatus["poll"] = 6] = "poll";
        NetworkStatus[NetworkStatus["ready"] = 7] = "ready";
        NetworkStatus[NetworkStatus["error"] = 8] = "error";
    })(exports.NetworkStatus || (exports.NetworkStatus = {}));
    function isNetworkRequestInFlight(networkStatus) {
        return networkStatus < 7;
    }

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Observable = (function (_super) {
        __extends(Observable, _super);
        function Observable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Observable.prototype[$$observable] = function () {
            return this;
        };
        Observable.prototype['@@observable'] = function () {
            return this;
        };
        return Observable;
    }(apolloLink.Observable));

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    function isApolloError(err) {
        return err.hasOwnProperty('graphQLErrors');
    }
    var generateErrorMessage = function (err) {
        var message = '';
        if (Array.isArray(err.graphQLErrors) && err.graphQLErrors.length !== 0) {
            err.graphQLErrors.forEach(function (graphQLError) {
                var errorMessage = graphQLError
                    ? graphQLError.message
                    : 'Error message not found.';
                message += "GraphQL error: " + errorMessage + "\n";
            });
        }
        if (err.networkError) {
            message += 'Network error: ' + err.networkError.message + '\n';
        }
        message = message.replace(/\n$/, '');
        return message;
    };
    var ApolloError = (function (_super) {
        __extends$1(ApolloError, _super);
        function ApolloError(_a) {
            var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError, errorMessage = _a.errorMessage, extraInfo = _a.extraInfo;
            var _this = _super.call(this, errorMessage) || this;
            _this.graphQLErrors = graphQLErrors || [];
            _this.networkError = networkError || null;
            if (!errorMessage) {
                _this.message = generateErrorMessage(_this);
            }
            else {
                _this.message = errorMessage;
            }
            _this.extraInfo = extraInfo;
            _this.__proto__ = ApolloError.prototype;
            return _this;
        }
        return ApolloError;
    }(Error));

    (function (FetchType) {
        FetchType[FetchType["normal"] = 1] = "normal";
        FetchType[FetchType["refetch"] = 2] = "refetch";
        FetchType[FetchType["poll"] = 3] = "poll";
    })(exports.FetchType || (exports.FetchType = {}));

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var hasError = function (storeValue, policy) {
        if (policy === void 0) { policy = 'none'; }
        return storeValue &&
            ((storeValue.graphQLErrors &&
                storeValue.graphQLErrors.length > 0 &&
                policy === 'none') ||
                storeValue.networkError);
    };
    var ObservableQuery = (function (_super) {
        __extends$2(ObservableQuery, _super);
        function ObservableQuery(_a) {
            var scheduler = _a.scheduler, options = _a.options, _b = _a.shouldSubscribe, shouldSubscribe = _b === void 0 ? true : _b;
            var _this = _super.call(this, function (observer) {
                return _this.onSubscribe(observer);
            }) || this;
            _this.isCurrentlyPolling = false;
            _this.isTornDown = false;
            _this.options = options;
            _this.variables = options.variables || {};
            _this.queryId = scheduler.queryManager.generateQueryId();
            _this.shouldSubscribe = shouldSubscribe;
            _this.scheduler = scheduler;
            _this.queryManager = scheduler.queryManager;
            _this.observers = [];
            _this.subscriptionHandles = [];
            return _this;
        }
        ObservableQuery.prototype.result = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var subscription;
                var observer = {
                    next: function (result) {
                        resolve(result);
                        if (!that.observers.some(function (obs) { return obs !== observer; })) {
                            that.queryManager.removeQuery(that.queryId);
                        }
                        setTimeout(function () {
                            subscription.unsubscribe();
                        }, 0);
                    },
                    error: function (error) {
                        reject(error);
                    },
                };
                subscription = that.subscribe(observer);
            });
        };
        ObservableQuery.prototype.currentResult = function () {
            if (this.isTornDown) {
                return {
                    data: this.lastError ? {} : this.lastResult ? this.lastResult.data : {},
                    error: this.lastError,
                    loading: false,
                    networkStatus: exports.NetworkStatus.error,
                };
            }
            var queryStoreValue = this.queryManager.queryStore.get(this.queryId);
            if (hasError(queryStoreValue, this.options.errorPolicy)) {
                return {
                    data: {},
                    loading: false,
                    networkStatus: queryStoreValue.networkStatus,
                    error: new ApolloError({
                        graphQLErrors: queryStoreValue.graphQLErrors,
                        networkError: queryStoreValue.networkError,
                    }),
                };
            }
            var _a = this.queryManager.getCurrentQueryResult(this), data = _a.data, partial = _a.partial;
            var queryLoading = !queryStoreValue ||
                queryStoreValue.networkStatus === exports.NetworkStatus.loading;
            var loading = (this.options.fetchPolicy === 'network-only' && queryLoading) ||
                (partial && this.options.fetchPolicy !== 'cache-only');
            var networkStatus;
            if (queryStoreValue) {
                networkStatus = queryStoreValue.networkStatus;
            }
            else {
                networkStatus = loading ? exports.NetworkStatus.loading : exports.NetworkStatus.ready;
            }
            var result = {
                data: data,
                loading: isNetworkRequestInFlight(networkStatus),
                networkStatus: networkStatus,
            };
            if (queryStoreValue &&
                queryStoreValue.graphQLErrors &&
                this.options.errorPolicy === 'all') {
                result.errors = queryStoreValue.graphQLErrors;
            }
            if (!partial) {
                this.lastResult = __assign({}, result, { stale: false });
                this.lastResultSnapshot = apolloUtilities.cloneDeep(this.lastResult);
            }
            return __assign({}, result, { partial: partial });
        };
        ObservableQuery.prototype.isDifferentFromLastResult = function (newResult) {
            var snapshot = this.lastResultSnapshot;
            return !(snapshot && newResult &&
                snapshot.networkStatus === newResult.networkStatus &&
                snapshot.stale === newResult.stale &&
                apolloUtilities.isEqual(snapshot.data, newResult.data));
        };
        ObservableQuery.prototype.getLastResult = function () {
            return this.lastResult;
        };
        ObservableQuery.prototype.getLastError = function () {
            return this.lastError;
        };
        ObservableQuery.prototype.resetLastResults = function () {
            delete this.lastResult;
            delete this.lastResultSnapshot;
            delete this.lastError;
            this.isTornDown = false;
        };
        ObservableQuery.prototype.refetch = function (variables) {
            var fetchPolicy = this.options.fetchPolicy;
            if (fetchPolicy === 'cache-only') {
                return Promise.reject(new Error('cache-only fetchPolicy option should not be used together with query refetch.'));
            }
            if (!apolloUtilities.isEqual(this.variables, variables)) {
                this.variables = Object.assign({}, this.variables, variables);
            }
            if (!apolloUtilities.isEqual(this.options.variables, this.variables)) {
                this.options.variables = Object.assign({}, this.options.variables, this.variables);
            }
            var isNetworkFetchPolicy = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';
            var combinedOptions = __assign({}, this.options, { fetchPolicy: isNetworkFetchPolicy ? fetchPolicy : 'network-only' });
            return this.queryManager
                .fetchQuery(this.queryId, combinedOptions, exports.FetchType.refetch)
                .then(function (result) { return result; });
        };
        ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
            var _this = this;
            if (!fetchMoreOptions.updateQuery) {
                throw new Error('updateQuery option is required. This function defines how to update the query data with the new results.');
            }
            var combinedOptions;
            return Promise.resolve()
                .then(function () {
                var qid = _this.queryManager.generateQueryId();
                if (fetchMoreOptions.query) {
                    combinedOptions = fetchMoreOptions;
                }
                else {
                    combinedOptions = __assign({}, _this.options, fetchMoreOptions, { variables: Object.assign({}, _this.variables, fetchMoreOptions.variables) });
                }
                combinedOptions.fetchPolicy = 'network-only';
                return _this.queryManager.fetchQuery(qid, combinedOptions, exports.FetchType.normal, _this.queryId);
            })
                .then(function (fetchMoreResult) {
                _this.updateQuery(function (previousResult) {
                    return fetchMoreOptions.updateQuery(previousResult, {
                        fetchMoreResult: fetchMoreResult.data,
                        variables: combinedOptions.variables,
                    });
                });
                return fetchMoreResult;
            });
        };
        ObservableQuery.prototype.subscribeToMore = function (options) {
            var _this = this;
            var subscription = this.queryManager
                .startGraphQLSubscription({
                query: options.document,
                variables: options.variables,
            })
                .subscribe({
                next: function (subscriptionData) {
                    if (options.updateQuery) {
                        _this.updateQuery(function (previous, _a) {
                            var variables = _a.variables;
                            return options.updateQuery(previous, {
                                subscriptionData: subscriptionData,
                                variables: variables,
                            });
                        });
                    }
                },
                error: function (err) {
                    if (options.onError) {
                        options.onError(err);
                        return;
                    }
                    console.error('Unhandled GraphQL subscription error', err);
                },
            });
            this.subscriptionHandles.push(subscription);
            return function () {
                var i = _this.subscriptionHandles.indexOf(subscription);
                if (i >= 0) {
                    _this.subscriptionHandles.splice(i, 1);
                    subscription.unsubscribe();
                }
            };
        };
        ObservableQuery.prototype.setOptions = function (opts) {
            var oldOptions = this.options;
            this.options = Object.assign({}, this.options, opts);
            if (opts.pollInterval) {
                this.startPolling(opts.pollInterval);
            }
            else if (opts.pollInterval === 0) {
                this.stopPolling();
            }
            var tryFetch = (oldOptions.fetchPolicy !== 'network-only' &&
                opts.fetchPolicy === 'network-only') ||
                (oldOptions.fetchPolicy === 'cache-only' &&
                    opts.fetchPolicy !== 'cache-only') ||
                (oldOptions.fetchPolicy === 'standby' &&
                    opts.fetchPolicy !== 'standby') ||
                false;
            return this.setVariables(this.options.variables, tryFetch, opts.fetchResults);
        };
        ObservableQuery.prototype.setVariables = function (variables, tryFetch, fetchResults) {
            if (tryFetch === void 0) { tryFetch = false; }
            if (fetchResults === void 0) { fetchResults = true; }
            this.isTornDown = false;
            var newVariables = variables ? variables : this.variables;
            if (apolloUtilities.isEqual(newVariables, this.variables) && !tryFetch) {
                if (this.observers.length === 0 || !fetchResults) {
                    return new Promise(function (resolve) { return resolve(); });
                }
                return this.result();
            }
            else {
                this.variables = newVariables;
                this.options.variables = newVariables;
                if (this.observers.length === 0) {
                    return new Promise(function (resolve) { return resolve(); });
                }
                return this.queryManager
                    .fetchQuery(this.queryId, __assign({}, this.options, { variables: this.variables }))
                    .then(function (result) { return result; });
            }
        };
        ObservableQuery.prototype.updateQuery = function (mapFn) {
            var _a = this.queryManager.getQueryWithPreviousResult(this.queryId), previousResult = _a.previousResult, variables = _a.variables, document = _a.document;
            var newResult = apolloUtilities.tryFunctionOrLogError(function () {
                return mapFn(previousResult, { variables: variables });
            });
            if (newResult) {
                this.queryManager.dataStore.markUpdateQueryResult(document, variables, newResult);
                this.queryManager.broadcastQueries();
            }
        };
        ObservableQuery.prototype.stopPolling = function () {
            if (this.isCurrentlyPolling) {
                this.scheduler.stopPollingQuery(this.queryId);
                this.options.pollInterval = undefined;
                this.isCurrentlyPolling = false;
            }
        };
        ObservableQuery.prototype.startPolling = function (pollInterval) {
            if (this.options.fetchPolicy === 'cache-first' ||
                this.options.fetchPolicy === 'cache-only') {
                throw new Error('Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
            }
            if (this.isCurrentlyPolling) {
                this.scheduler.stopPollingQuery(this.queryId);
                this.isCurrentlyPolling = false;
            }
            this.options.pollInterval = pollInterval;
            this.isCurrentlyPolling = true;
            this.scheduler.startPollingQuery(this.options, this.queryId);
        };
        ObservableQuery.prototype.onSubscribe = function (observer) {
            var _this = this;
            if (observer._subscription &&
                observer._subscription._observer &&
                !observer._subscription._observer.error) {
                observer._subscription._observer.error = function (error) {
                    console.error('Unhandled error', error.message, error.stack);
                };
            }
            this.observers.push(observer);
            if (observer.next && this.lastResult)
                observer.next(this.lastResult);
            if (observer.error && this.lastError)
                observer.error(this.lastError);
            if (this.observers.length === 1)
                this.setUpQuery();
            return function () {
                _this.observers = _this.observers.filter(function (obs) { return obs !== observer; });
                if (_this.observers.length === 0) {
                    _this.tearDownQuery();
                }
            };
        };
        ObservableQuery.prototype.setUpQuery = function () {
            var _this = this;
            if (this.shouldSubscribe) {
                this.queryManager.addObservableQuery(this.queryId, this);
            }
            if (!!this.options.pollInterval) {
                if (this.options.fetchPolicy === 'cache-first' ||
                    this.options.fetchPolicy === 'cache-only') {
                    throw new Error('Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
                }
                this.isCurrentlyPolling = true;
                this.scheduler.startPollingQuery(this.options, this.queryId);
            }
            var observer = {
                next: function (result) {
                    _this.lastResult = result;
                    _this.lastResultSnapshot = apolloUtilities.cloneDeep(result);
                    _this.observers.forEach(function (obs) { return obs.next && obs.next(result); });
                },
                error: function (error) {
                    _this.lastError = error;
                    _this.observers.forEach(function (obs) { return obs.error && obs.error(error); });
                },
            };
            this.queryManager.startQuery(this.queryId, this.options, this.queryManager.queryListenerForObserver(this.queryId, this.options, observer));
        };
        ObservableQuery.prototype.tearDownQuery = function () {
            this.isTornDown = true;
            if (this.isCurrentlyPolling) {
                this.scheduler.stopPollingQuery(this.queryId);
                this.isCurrentlyPolling = false;
            }
            this.subscriptionHandles.forEach(function (sub) { return sub.unsubscribe(); });
            this.subscriptionHandles = [];
            this.queryManager.removeObservableQuery(this.queryId);
            this.queryManager.stopQuery(this.queryId);
            this.observers = [];
        };
        return ObservableQuery;
    }(Observable));

    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var QueryScheduler = (function () {
        function QueryScheduler(_a) {
            var queryManager = _a.queryManager, ssrMode = _a.ssrMode;
            this.inFlightQueries = {};
            this.registeredQueries = {};
            this.intervalQueries = {};
            this.pollingTimers = {};
            this.ssrMode = false;
            this.queryManager = queryManager;
            this.ssrMode = ssrMode || false;
        }
        QueryScheduler.prototype.checkInFlight = function (queryId) {
            var query = this.queryManager.queryStore.get(queryId);
            return (query &&
                query.networkStatus !== exports.NetworkStatus.ready &&
                query.networkStatus !== exports.NetworkStatus.error);
        };
        QueryScheduler.prototype.fetchQuery = function (queryId, options, fetchType) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.queryManager
                    .fetchQuery(queryId, options, fetchType)
                    .then(function (result) {
                    resolve(result);
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        };
        QueryScheduler.prototype.startPollingQuery = function (options, queryId, listener) {
            if (!options.pollInterval) {
                throw new Error('Attempted to start a polling query without a polling interval.');
            }
            if (this.ssrMode)
                return queryId;
            this.registeredQueries[queryId] = options;
            if (listener) {
                this.queryManager.addQueryListener(queryId, listener);
            }
            this.addQueryOnInterval(queryId, options);
            return queryId;
        };
        QueryScheduler.prototype.stopPollingQuery = function (queryId) {
            delete this.registeredQueries[queryId];
        };
        QueryScheduler.prototype.fetchQueriesOnInterval = function (interval) {
            var _this = this;
            this.intervalQueries[interval] = this.intervalQueries[interval].filter(function (queryId) {
                if (!(_this.registeredQueries.hasOwnProperty(queryId) &&
                    _this.registeredQueries[queryId].pollInterval === interval)) {
                    return false;
                }
                if (_this.checkInFlight(queryId)) {
                    return true;
                }
                var queryOptions = _this.registeredQueries[queryId];
                var pollingOptions = __assign$1({}, queryOptions);
                pollingOptions.fetchPolicy = 'network-only';
                _this.fetchQuery(queryId, pollingOptions, exports.FetchType.poll).catch(function () { });
                return true;
            });
            if (this.intervalQueries[interval].length === 0) {
                clearInterval(this.pollingTimers[interval]);
                delete this.intervalQueries[interval];
            }
        };
        QueryScheduler.prototype.addQueryOnInterval = function (queryId, queryOptions) {
            var _this = this;
            var interval = queryOptions.pollInterval;
            if (!interval) {
                throw new Error("A poll interval is required to start polling query with id '" + queryId + "'.");
            }
            if (this.intervalQueries.hasOwnProperty(interval.toString()) &&
                this.intervalQueries[interval].length > 0) {
                this.intervalQueries[interval].push(queryId);
            }
            else {
                this.intervalQueries[interval] = [queryId];
                this.pollingTimers[interval] = setInterval(function () {
                    _this.fetchQueriesOnInterval(interval);
                }, interval);
            }
        };
        QueryScheduler.prototype.registerPollingQuery = function (queryOptions) {
            if (!queryOptions.pollInterval) {
                throw new Error('Attempted to register a non-polling query with the scheduler.');
            }
            return new ObservableQuery({
                scheduler: this,
                options: queryOptions,
            });
        };
        return QueryScheduler;
    }());

    var MutationStore = (function () {
        function MutationStore() {
            this.store = {};
        }
        MutationStore.prototype.getStore = function () {
            return this.store;
        };
        MutationStore.prototype.get = function (mutationId) {
            return this.store[mutationId];
        };
        MutationStore.prototype.initMutation = function (mutationId, mutationString, variables) {
            this.store[mutationId] = {
                mutationString: mutationString,
                variables: variables || {},
                loading: true,
                error: null,
            };
        };
        MutationStore.prototype.markMutationError = function (mutationId, error) {
            var mutation = this.store[mutationId];
            if (!mutation) {
                return;
            }
            mutation.loading = false;
            mutation.error = error;
        };
        MutationStore.prototype.markMutationResult = function (mutationId) {
            var mutation = this.store[mutationId];
            if (!mutation) {
                return;
            }
            mutation.loading = false;
            mutation.error = null;
        };
        MutationStore.prototype.reset = function () {
            this.store = {};
        };
        return MutationStore;
    }());

    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };
    var QueryStore = (function () {
        function QueryStore() {
            this.store = {};
        }
        QueryStore.prototype.getStore = function () {
            return this.store;
        };
        QueryStore.prototype.get = function (queryId) {
            return this.store[queryId];
        };
        QueryStore.prototype.initQuery = function (query) {
            var previousQuery = this.store[query.queryId];
            if (previousQuery &&
                previousQuery.document !== query.document &&
                printer.print(previousQuery.document) !== printer.print(query.document)) {
                throw new Error('Internal Error: may not update existing query string in store');
            }
            var isSetVariables = false;
            var previousVariables = null;
            if (query.storePreviousVariables &&
                previousQuery &&
                previousQuery.networkStatus !== exports.NetworkStatus.loading) {
                if (!apolloUtilities.isEqual(previousQuery.variables, query.variables)) {
                    isSetVariables = true;
                    previousVariables = previousQuery.variables;
                }
            }
            var networkStatus;
            if (isSetVariables) {
                networkStatus = exports.NetworkStatus.setVariables;
            }
            else if (query.isPoll) {
                networkStatus = exports.NetworkStatus.poll;
            }
            else if (query.isRefetch) {
                networkStatus = exports.NetworkStatus.refetch;
            }
            else {
                networkStatus = exports.NetworkStatus.loading;
            }
            var graphQLErrors = [];
            if (previousQuery && previousQuery.graphQLErrors) {
                graphQLErrors = previousQuery.graphQLErrors;
            }
            this.store[query.queryId] = {
                document: query.document,
                variables: query.variables,
                previousVariables: previousVariables,
                networkError: null,
                graphQLErrors: graphQLErrors,
                networkStatus: networkStatus,
                metadata: query.metadata,
            };
            if (typeof query.fetchMoreForQueryId === 'string' &&
                this.store[query.fetchMoreForQueryId]) {
                this.store[query.fetchMoreForQueryId].networkStatus =
                    exports.NetworkStatus.fetchMore;
            }
        };
        QueryStore.prototype.markQueryResult = function (queryId, result, fetchMoreForQueryId) {
            if (!this.store || !this.store[queryId])
                return;
            this.store[queryId].networkError = null;
            this.store[queryId].graphQLErrors =
                result.errors && result.errors.length ? result.errors : [];
            this.store[queryId].previousVariables = null;
            this.store[queryId].networkStatus = exports.NetworkStatus.ready;
            if (typeof fetchMoreForQueryId === 'string' &&
                this.store[fetchMoreForQueryId]) {
                this.store[fetchMoreForQueryId].networkStatus = exports.NetworkStatus.ready;
            }
        };
        QueryStore.prototype.markQueryError = function (queryId, error, fetchMoreForQueryId) {
            if (!this.store || !this.store[queryId])
                return;
            this.store[queryId].networkError = error;
            this.store[queryId].networkStatus = exports.NetworkStatus.error;
            if (typeof fetchMoreForQueryId === 'string') {
                this.markQueryResultClient(fetchMoreForQueryId, true);
            }
        };
        QueryStore.prototype.markQueryResultClient = function (queryId, complete) {
            if (!this.store || !this.store[queryId])
                return;
            this.store[queryId].networkError = null;
            this.store[queryId].previousVariables = null;
            this.store[queryId].networkStatus = complete
                ? exports.NetworkStatus.ready
                : exports.NetworkStatus.loading;
        };
        QueryStore.prototype.stopQuery = function (queryId) {
            delete this.store[queryId];
        };
        QueryStore.prototype.reset = function (observableQueryIds) {
            var _this = this;
            this.store = Object.keys(this.store)
                .filter(function (queryId) {
                return observableQueryIds.indexOf(queryId) > -1;
            })
                .reduce(function (res, key) {
                res[key] = __assign$2({}, _this.store[key], { networkStatus: exports.NetworkStatus.loading });
                return res;
            }, {});
        };
        return QueryStore;
    }());

    var __assign$3 = (undefined && undefined.__assign) || function () {
        __assign$3 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var QueryManager = (function () {
        function QueryManager(_a) {
            var link = _a.link, _b = _a.queryDeduplication, queryDeduplication = _b === void 0 ? false : _b, store = _a.store, _c = _a.onBroadcast, onBroadcast = _c === void 0 ? function () { return undefined; } : _c, _d = _a.ssrMode, ssrMode = _d === void 0 ? false : _d;
            this.mutationStore = new MutationStore();
            this.queryStore = new QueryStore();
            this.idCounter = 1;
            this.queries = new Map();
            this.fetchQueryPromises = new Map();
            this.queryIdsByName = {};
            this.link = link;
            this.deduplicator = apolloLink.ApolloLink.from([new apolloLinkDedup.DedupLink(), link]);
            this.queryDeduplication = queryDeduplication;
            this.dataStore = store;
            this.onBroadcast = onBroadcast;
            this.scheduler = new QueryScheduler({ queryManager: this, ssrMode: ssrMode });
        }
        QueryManager.prototype.mutate = function (_a) {
            var _this = this;
            var mutation = _a.mutation, variables = _a.variables, optimisticResponse = _a.optimisticResponse, updateQueriesByName = _a.updateQueries, _b = _a.refetchQueries, refetchQueries = _b === void 0 ? [] : _b, _c = _a.awaitRefetchQueries, awaitRefetchQueries = _c === void 0 ? false : _c, updateWithProxyFn = _a.update, _d = _a.errorPolicy, errorPolicy = _d === void 0 ? 'none' : _d, fetchPolicy = _a.fetchPolicy, _e = _a.context, context = _e === void 0 ? {} : _e;
            if (!mutation) {
                throw new Error('mutation option is required. You must specify your GraphQL document in the mutation option.');
            }
            if (fetchPolicy && fetchPolicy !== 'no-cache') {
                throw new Error("fetchPolicy for mutations currently only supports the 'no-cache' policy");
            }
            var mutationId = this.generateQueryId();
            var cache = this.dataStore.getCache();
            (mutation = cache.transformDocument(mutation)),
                (variables = apolloUtilities.assign({}, apolloUtilities.getDefaultValues(apolloUtilities.getMutationDefinition(mutation)), variables));
            var mutationString = printer.print(mutation);
            this.setQuery(mutationId, function () { return ({ document: mutation }); });
            var generateUpdateQueriesInfo = function () {
                var ret = {};
                if (updateQueriesByName) {
                    Object.keys(updateQueriesByName).forEach(function (queryName) {
                        return (_this.queryIdsByName[queryName] || []).forEach(function (queryId) {
                            ret[queryId] = {
                                updater: updateQueriesByName[queryName],
                                query: _this.queryStore.get(queryId),
                            };
                        });
                    });
                }
                return ret;
            };
            this.mutationStore.initMutation(mutationId, mutationString, variables);
            this.dataStore.markMutationInit({
                mutationId: mutationId,
                document: mutation,
                variables: variables || {},
                updateQueries: generateUpdateQueriesInfo(),
                update: updateWithProxyFn,
                optimisticResponse: optimisticResponse,
            });
            this.broadcastQueries();
            return new Promise(function (resolve, reject) {
                var storeResult;
                var error;
                var operation = _this.buildOperationForLink(mutation, variables, __assign$3({}, context, { optimisticResponse: optimisticResponse }));
                var completeMutation = function () { return __awaiter(_this, void 0, void 0, function () {
                    var refetchQueryPromises, _i, refetchQueries_1, refetchQuery, promise, queryOptions;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    this.mutationStore.markMutationError(mutationId, error);
                                }
                                this.dataStore.markMutationComplete({
                                    mutationId: mutationId,
                                    optimisticResponse: optimisticResponse,
                                });
                                this.broadcastQueries();
                                if (error) {
                                    throw error;
                                }
                                if (typeof refetchQueries === 'function') {
                                    refetchQueries = refetchQueries(storeResult);
                                }
                                refetchQueryPromises = [];
                                for (_i = 0, refetchQueries_1 = refetchQueries; _i < refetchQueries_1.length; _i++) {
                                    refetchQuery = refetchQueries_1[_i];
                                    if (typeof refetchQuery === 'string') {
                                        promise = this.refetchQueryByName(refetchQuery);
                                        if (promise) {
                                            refetchQueryPromises.push(promise);
                                        }
                                        continue;
                                    }
                                    queryOptions = {
                                        query: refetchQuery.query,
                                        variables: refetchQuery.variables,
                                        fetchPolicy: 'network-only',
                                    };
                                    if (refetchQuery.context) {
                                        queryOptions.context = refetchQuery.context;
                                    }
                                    refetchQueryPromises.push(this.query(queryOptions));
                                }
                                if (!awaitRefetchQueries) return [3, 2];
                                return [4, Promise.all(refetchQueryPromises)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                this.setQuery(mutationId, function () { return ({ document: undefined }); });
                                if (errorPolicy === 'ignore' &&
                                    storeResult &&
                                    apolloUtilities.graphQLResultHasError(storeResult)) {
                                    delete storeResult.errors;
                                }
                                return [2, storeResult];
                        }
                    });
                }); };
                apolloLink.execute(_this.link, operation).subscribe({
                    next: function (result) {
                        if (apolloUtilities.graphQLResultHasError(result) && errorPolicy === 'none') {
                            error = new ApolloError({
                                graphQLErrors: result.errors,
                            });
                            return;
                        }
                        _this.mutationStore.markMutationResult(mutationId);
                        if (fetchPolicy !== 'no-cache') {
                            _this.dataStore.markMutationResult({
                                mutationId: mutationId,
                                result: result,
                                document: mutation,
                                variables: variables || {},
                                updateQueries: generateUpdateQueriesInfo(),
                                update: updateWithProxyFn,
                            });
                        }
                        storeResult = result;
                    },
                    error: function (err) {
                        _this.mutationStore.markMutationError(mutationId, err);
                        _this.dataStore.markMutationComplete({
                            mutationId: mutationId,
                            optimisticResponse: optimisticResponse,
                        });
                        _this.broadcastQueries();
                        _this.setQuery(mutationId, function () { return ({ document: undefined }); });
                        reject(new ApolloError({
                            networkError: err,
                        }));
                    },
                    complete: function () { return completeMutation().then(resolve, reject); },
                });
            });
        };
        QueryManager.prototype.fetchQuery = function (queryId, options, fetchType, fetchMoreForQueryId) {
            var _this = this;
            var _a = options.variables, variables = _a === void 0 ? {} : _a, _b = options.metadata, metadata = _b === void 0 ? null : _b, _c = options.fetchPolicy, fetchPolicy = _c === void 0 ? 'cache-first' : _c;
            var cache = this.dataStore.getCache();
            var query = cache.transformDocument(options.query);
            var storeResult;
            var needToFetch = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';
            if (fetchType !== exports.FetchType.refetch &&
                fetchPolicy !== 'network-only' &&
                fetchPolicy !== 'no-cache') {
                var _d = this.dataStore.getCache().diff({
                    query: query,
                    variables: variables,
                    returnPartialData: true,
                    optimistic: false,
                }), complete = _d.complete, result = _d.result;
                needToFetch = !complete || fetchPolicy === 'cache-and-network';
                storeResult = result;
            }
            var shouldFetch = needToFetch && fetchPolicy !== 'cache-only' && fetchPolicy !== 'standby';
            if (apolloUtilities.hasDirectives(['live'], query))
                shouldFetch = true;
            var requestId = this.generateRequestId();
            var cancel = this.updateQueryWatch(queryId, query, options);
            this.setQuery(queryId, function () { return ({
                document: query,
                lastRequestId: requestId,
                invalidated: true,
                cancel: cancel,
            }); });
            this.invalidate(true, fetchMoreForQueryId);
            this.queryStore.initQuery({
                queryId: queryId,
                document: query,
                storePreviousVariables: shouldFetch,
                variables: variables,
                isPoll: fetchType === exports.FetchType.poll,
                isRefetch: fetchType === exports.FetchType.refetch,
                metadata: metadata,
                fetchMoreForQueryId: fetchMoreForQueryId,
            });
            this.broadcastQueries();
            var shouldDispatchClientResult = !shouldFetch || fetchPolicy === 'cache-and-network';
            if (shouldDispatchClientResult) {
                this.queryStore.markQueryResultClient(queryId, !shouldFetch);
                this.invalidate(true, queryId, fetchMoreForQueryId);
                this.broadcastQueries();
            }
            if (shouldFetch) {
                var networkResult = this.fetchRequest({
                    requestId: requestId,
                    queryId: queryId,
                    document: query,
                    options: options,
                    fetchMoreForQueryId: fetchMoreForQueryId,
                }).catch(function (error) {
                    if (isApolloError(error)) {
                        throw error;
                    }
                    else {
                        var lastRequestId = _this.getQuery(queryId).lastRequestId;
                        if (requestId >= (lastRequestId || 1)) {
                            _this.queryStore.markQueryError(queryId, error, fetchMoreForQueryId);
                            _this.invalidate(true, queryId, fetchMoreForQueryId);
                            _this.broadcastQueries();
                        }
                        _this.removeFetchQueryPromise(requestId);
                        throw new ApolloError({ networkError: error });
                    }
                });
                if (fetchPolicy !== 'cache-and-network') {
                    return networkResult;
                }
                else {
                    networkResult.catch(function () { });
                }
            }
            return Promise.resolve({ data: storeResult });
        };
        QueryManager.prototype.queryListenerForObserver = function (queryId, options, observer) {
            var _this = this;
            var previouslyHadError = false;
            return function (queryStoreValue, newData) {
                _this.invalidate(false, queryId);
                if (!queryStoreValue)
                    return;
                var observableQuery = _this.getQuery(queryId).observableQuery;
                var fetchPolicy = observableQuery
                    ? observableQuery.options.fetchPolicy
                    : options.fetchPolicy;
                if (fetchPolicy === 'standby')
                    return;
                var errorPolicy = observableQuery
                    ? observableQuery.options.errorPolicy
                    : options.errorPolicy;
                var lastResult = observableQuery
                    ? observableQuery.getLastResult()
                    : null;
                var lastError = observableQuery ? observableQuery.getLastError() : null;
                var shouldNotifyIfLoading = (!newData && queryStoreValue.previousVariables != null) ||
                    fetchPolicy === 'cache-only' ||
                    fetchPolicy === 'cache-and-network';
                var networkStatusChanged = Boolean(lastResult &&
                    queryStoreValue.networkStatus !== lastResult.networkStatus);
                var errorStatusChanged = errorPolicy &&
                    (lastError && lastError.graphQLErrors) !==
                        queryStoreValue.graphQLErrors &&
                    errorPolicy !== 'none';
                if (!isNetworkRequestInFlight(queryStoreValue.networkStatus) ||
                    (networkStatusChanged && options.notifyOnNetworkStatusChange) ||
                    shouldNotifyIfLoading) {
                    if (((!errorPolicy || errorPolicy === 'none') &&
                        queryStoreValue.graphQLErrors &&
                        queryStoreValue.graphQLErrors.length > 0) ||
                        queryStoreValue.networkError) {
                        var apolloError_1 = new ApolloError({
                            graphQLErrors: queryStoreValue.graphQLErrors,
                            networkError: queryStoreValue.networkError,
                        });
                        previouslyHadError = true;
                        if (observer.error) {
                            try {
                                observer.error(apolloError_1);
                            }
                            catch (e) {
                                setTimeout(function () {
                                    throw e;
                                }, 0);
                            }
                        }
                        else {
                            setTimeout(function () {
                                throw apolloError_1;
                            }, 0);
                            if (!apolloUtilities.isProduction()) {
                                console.info('An unhandled error was thrown because no error handler is registered ' +
                                    'for the query ' +
                                    printer.print(queryStoreValue.document));
                            }
                        }
                        return;
                    }
                    try {
                        var data = void 0;
                        var isMissing = void 0;
                        if (newData) {
                            if (fetchPolicy !== 'no-cache') {
                                _this.setQuery(queryId, function () { return ({ newData: null }); });
                            }
                            data = newData.result;
                            isMissing = !newData.complete || false;
                        }
                        else {
                            if (lastResult && lastResult.data && !errorStatusChanged) {
                                data = lastResult.data;
                                isMissing = false;
                            }
                            else {
                                var document_1 = _this.getQuery(queryId).document;
                                var readResult = _this.dataStore.getCache().diff({
                                    query: document_1,
                                    variables: queryStoreValue.previousVariables ||
                                        queryStoreValue.variables,
                                    optimistic: true,
                                });
                                data = readResult.result;
                                isMissing = !readResult.complete;
                            }
                        }
                        var resultFromStore = void 0;
                        if (isMissing && fetchPolicy !== 'cache-only') {
                            resultFromStore = {
                                data: lastResult && lastResult.data,
                                loading: isNetworkRequestInFlight(queryStoreValue.networkStatus),
                                networkStatus: queryStoreValue.networkStatus,
                                stale: true,
                            };
                        }
                        else {
                            resultFromStore = {
                                data: data,
                                loading: isNetworkRequestInFlight(queryStoreValue.networkStatus),
                                networkStatus: queryStoreValue.networkStatus,
                                stale: false,
                            };
                        }
                        if (errorPolicy === 'all' &&
                            queryStoreValue.graphQLErrors &&
                            queryStoreValue.graphQLErrors.length > 0) {
                            resultFromStore.errors = queryStoreValue.graphQLErrors;
                        }
                        if (observer.next) {
                            if (previouslyHadError ||
                                !observableQuery ||
                                observableQuery.isDifferentFromLastResult(resultFromStore)) {
                                try {
                                    observer.next(resultFromStore);
                                }
                                catch (e) {
                                    setTimeout(function () {
                                        throw e;
                                    }, 0);
                                }
                            }
                        }
                        previouslyHadError = false;
                    }
                    catch (error) {
                        previouslyHadError = true;
                        if (observer.error)
                            observer.error(new ApolloError({ networkError: error }));
                        return;
                    }
                }
            };
        };
        QueryManager.prototype.watchQuery = function (options, shouldSubscribe) {
            if (shouldSubscribe === void 0) { shouldSubscribe = true; }
            if (options.fetchPolicy === 'standby') {
                throw new Error('client.watchQuery cannot be called with fetchPolicy set to "standby"');
            }
            var queryDefinition = apolloUtilities.getQueryDefinition(options.query);
            if (queryDefinition.variableDefinitions &&
                queryDefinition.variableDefinitions.length) {
                var defaultValues = apolloUtilities.getDefaultValues(queryDefinition);
                options.variables = apolloUtilities.assign({}, defaultValues, options.variables);
            }
            if (typeof options.notifyOnNetworkStatusChange === 'undefined') {
                options.notifyOnNetworkStatusChange = false;
            }
            var transformedOptions = __assign$3({}, options);
            return new ObservableQuery({
                scheduler: this.scheduler,
                options: transformedOptions,
                shouldSubscribe: shouldSubscribe,
            });
        };
        QueryManager.prototype.query = function (options) {
            var _this = this;
            if (!options.query) {
                throw new Error('query option is required. You must specify your GraphQL document ' +
                    'in the query option.');
            }
            if (options.query.kind !== 'Document') {
                throw new Error('You must wrap the query string in a "gql" tag.');
            }
            if (options.returnPartialData) {
                throw new Error('returnPartialData option only supported on watchQuery.');
            }
            if (options.pollInterval) {
                throw new Error('pollInterval option only supported on watchQuery.');
            }
            var requestId = this.idCounter;
            return new Promise(function (resolve, reject) {
                _this.addFetchQueryPromise(requestId, resolve, reject);
                return _this.watchQuery(options, false)
                    .result()
                    .then(function (result) {
                    _this.removeFetchQueryPromise(requestId);
                    resolve(result);
                })
                    .catch(function (error) {
                    _this.removeFetchQueryPromise(requestId);
                    reject(error);
                });
            });
        };
        QueryManager.prototype.generateQueryId = function () {
            var queryId = this.idCounter.toString();
            this.idCounter++;
            return queryId;
        };
        QueryManager.prototype.stopQueryInStore = function (queryId) {
            this.queryStore.stopQuery(queryId);
            this.invalidate(true, queryId);
            this.broadcastQueries();
        };
        QueryManager.prototype.addQueryListener = function (queryId, listener) {
            this.setQuery(queryId, function (_a) {
                var _b = _a.listeners, listeners = _b === void 0 ? [] : _b;
                return ({
                    listeners: listeners.concat([listener]),
                    invalidate: false,
                });
            });
        };
        QueryManager.prototype.updateQueryWatch = function (queryId, document, options) {
            var _this = this;
            var cancel = this.getQuery(queryId).cancel;
            if (cancel)
                cancel();
            var previousResult = function () {
                var previousResult = null;
                var observableQuery = _this.getQuery(queryId).observableQuery;
                if (observableQuery) {
                    var lastResult = observableQuery.getLastResult();
                    if (lastResult) {
                        previousResult = lastResult.data;
                    }
                }
                return previousResult;
            };
            return this.dataStore.getCache().watch({
                query: document,
                variables: options.variables,
                optimistic: true,
                previousResult: previousResult,
                callback: function (newData) {
                    _this.setQuery(queryId, function () { return ({ invalidated: true, newData: newData }); });
                },
            });
        };
        QueryManager.prototype.addFetchQueryPromise = function (requestId, resolve, reject) {
            this.fetchQueryPromises.set(requestId.toString(), {
                resolve: resolve,
                reject: reject,
            });
        };
        QueryManager.prototype.removeFetchQueryPromise = function (requestId) {
            this.fetchQueryPromises.delete(requestId.toString());
        };
        QueryManager.prototype.addObservableQuery = function (queryId, observableQuery) {
            this.setQuery(queryId, function () { return ({ observableQuery: observableQuery }); });
            var queryDef = apolloUtilities.getQueryDefinition(observableQuery.options.query);
            if (queryDef.name && queryDef.name.value) {
                var queryName = queryDef.name.value;
                this.queryIdsByName[queryName] = this.queryIdsByName[queryName] || [];
                this.queryIdsByName[queryName].push(observableQuery.queryId);
            }
        };
        QueryManager.prototype.removeObservableQuery = function (queryId) {
            var _a = this.getQuery(queryId), observableQuery = _a.observableQuery, cancel = _a.cancel;
            if (cancel)
                cancel();
            if (!observableQuery)
                return;
            var definition = apolloUtilities.getQueryDefinition(observableQuery.options.query);
            var queryName = definition.name ? definition.name.value : null;
            this.setQuery(queryId, function () { return ({ observableQuery: null }); });
            if (queryName) {
                this.queryIdsByName[queryName] = this.queryIdsByName[queryName].filter(function (val) {
                    return !(observableQuery.queryId === val);
                });
            }
        };
        QueryManager.prototype.clearStore = function () {
            this.fetchQueryPromises.forEach(function (_a) {
                var reject = _a.reject;
                reject(new Error('Store reset while query was in flight(not completed in link chain)'));
            });
            var resetIds = [];
            this.queries.forEach(function (_a, queryId) {
                var observableQuery = _a.observableQuery;
                if (observableQuery)
                    resetIds.push(queryId);
            });
            this.queryStore.reset(resetIds);
            this.mutationStore.reset();
            var reset = this.dataStore.reset();
            return reset;
        };
        QueryManager.prototype.resetStore = function () {
            var _this = this;
            return this.clearStore().then(function () {
                return _this.reFetchObservableQueries();
            });
        };
        QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
            var observableQueryPromises = this.getObservableQueryPromises(includeStandby);
            this.broadcastQueries();
            return Promise.all(observableQueryPromises);
        };
        QueryManager.prototype.startQuery = function (queryId, options, listener) {
            this.addQueryListener(queryId, listener);
            this.fetchQuery(queryId, options)
                .catch(function () { return undefined; });
            return queryId;
        };
        QueryManager.prototype.startGraphQLSubscription = function (options) {
            var _this = this;
            var query = options.query;
            var isCacheEnabled = !(options.fetchPolicy && options.fetchPolicy === 'no-cache');
            var cache = this.dataStore.getCache();
            var transformedDoc = cache.transformDocument(query);
            var variables = apolloUtilities.assign({}, apolloUtilities.getDefaultValues(apolloUtilities.getOperationDefinition(query)), options.variables);
            var sub;
            var observers = [];
            return new Observable(function (observer) {
                observers.push(observer);
                if (observers.length === 1) {
                    var handler = {
                        next: function (result) {
                            if (isCacheEnabled) {
                                _this.dataStore.markSubscriptionResult(result, transformedDoc, variables);
                                _this.broadcastQueries();
                            }
                            observers.forEach(function (obs) {
                                if (apolloUtilities.graphQLResultHasError(result) && obs.error) {
                                    obs.error(new ApolloError({
                                        graphQLErrors: result.errors,
                                    }));
                                }
                                else if (obs.next) {
                                    obs.next(result);
                                }
                            });
                        },
                        error: function (error) {
                            observers.forEach(function (obs) {
                                if (obs.error) {
                                    obs.error(error);
                                }
                            });
                        },
                    };
                    var operation = _this.buildOperationForLink(transformedDoc, variables);
                    sub = apolloLink.execute(_this.link, operation).subscribe(handler);
                }
                return function () {
                    observers = observers.filter(function (obs) { return obs !== observer; });
                    if (observers.length === 0 && sub) {
                        sub.unsubscribe();
                    }
                };
            });
        };
        QueryManager.prototype.stopQuery = function (queryId) {
            this.stopQueryInStore(queryId);
            this.removeQuery(queryId);
        };
        QueryManager.prototype.removeQuery = function (queryId) {
            var subscriptions = this.getQuery(queryId).subscriptions;
            subscriptions.forEach(function (x) { return x.unsubscribe(); });
            this.queries.delete(queryId);
        };
        QueryManager.prototype.getCurrentQueryResult = function (observableQuery, optimistic) {
            if (optimistic === void 0) { optimistic = true; }
            var _a = observableQuery.options, variables = _a.variables, query = _a.query;
            var lastResult = observableQuery.getLastResult();
            var newData = this.getQuery(observableQuery.queryId).newData;
            if (newData && newData.complete) {
                return { data: newData.result, partial: false };
            }
            else {
                try {
                    var data = this.dataStore.getCache().read({
                        query: query,
                        variables: variables,
                        previousResult: lastResult ? lastResult.data : undefined,
                        optimistic: optimistic,
                    });
                    return { data: data, partial: false };
                }
                catch (e) {
                    return { data: {}, partial: true };
                }
            }
        };
        QueryManager.prototype.getQueryWithPreviousResult = function (queryIdOrObservable) {
            var observableQuery;
            if (typeof queryIdOrObservable === 'string') {
                var foundObserveableQuery = this.getQuery(queryIdOrObservable).observableQuery;
                if (!foundObserveableQuery) {
                    throw new Error("ObservableQuery with this id doesn't exist: " + queryIdOrObservable);
                }
                observableQuery = foundObserveableQuery;
            }
            else {
                observableQuery = queryIdOrObservable;
            }
            var _a = observableQuery.options, variables = _a.variables, query = _a.query;
            var data = this.getCurrentQueryResult(observableQuery, false).data;
            return {
                previousResult: data,
                variables: variables,
                document: query,
            };
        };
        QueryManager.prototype.broadcastQueries = function () {
            var _this = this;
            this.onBroadcast();
            this.queries.forEach(function (info, id) {
                if (!info.invalidated || !info.listeners)
                    return;
                info.listeners
                    .filter(function (x) { return !!x; })
                    .forEach(function (listener) {
                    listener(_this.queryStore.get(id), info.newData);
                });
            });
        };
        QueryManager.prototype.getObservableQueryPromises = function (includeStandby) {
            var _this = this;
            var observableQueryPromises = [];
            this.queries.forEach(function (_a, queryId) {
                var observableQuery = _a.observableQuery;
                if (!observableQuery)
                    return;
                var fetchPolicy = observableQuery.options.fetchPolicy;
                observableQuery.resetLastResults();
                if (fetchPolicy !== 'cache-only' &&
                    (includeStandby || fetchPolicy !== 'standby')) {
                    observableQueryPromises.push(observableQuery.refetch());
                }
                _this.setQuery(queryId, function () { return ({ newData: null }); });
                _this.invalidate(true, queryId);
            });
            return observableQueryPromises;
        };
        QueryManager.prototype.fetchRequest = function (_a) {
            var _this = this;
            var requestId = _a.requestId, queryId = _a.queryId, document = _a.document, options = _a.options, fetchMoreForQueryId = _a.fetchMoreForQueryId;
            var variables = options.variables, context = options.context, _b = options.errorPolicy, errorPolicy = _b === void 0 ? 'none' : _b, fetchPolicy = options.fetchPolicy;
            var operation = this.buildOperationForLink(document, variables, __assign$3({}, context, { forceFetch: !this.queryDeduplication }));
            var resultFromStore;
            var errorsFromStore;
            return new Promise(function (resolve, reject) {
                _this.addFetchQueryPromise(requestId, resolve, reject);
                var subscription = apolloLink.execute(_this.deduplicator, operation).subscribe({
                    next: function (result) {
                        var lastRequestId = _this.getQuery(queryId).lastRequestId;
                        if (requestId >= (lastRequestId || 1)) {
                            if (fetchPolicy !== 'no-cache') {
                                try {
                                    _this.dataStore.markQueryResult(result, document, variables, fetchMoreForQueryId, errorPolicy === 'ignore' || errorPolicy === 'all');
                                }
                                catch (e) {
                                    reject(e);
                                    return;
                                }
                            }
                            else {
                                _this.setQuery(queryId, function () { return ({
                                    newData: { result: result.data, complete: true },
                                }); });
                            }
                            _this.queryStore.markQueryResult(queryId, result, fetchMoreForQueryId);
                            _this.invalidate(true, queryId, fetchMoreForQueryId);
                            _this.broadcastQueries();
                        }
                        if (result.errors && errorPolicy === 'none') {
                            reject(new ApolloError({
                                graphQLErrors: result.errors,
                            }));
                            return;
                        }
                        else if (errorPolicy === 'all') {
                            errorsFromStore = result.errors;
                        }
                        if (fetchMoreForQueryId || fetchPolicy === 'no-cache') {
                            resultFromStore = result.data;
                        }
                        else {
                            try {
                                resultFromStore = _this.dataStore.getCache().read({
                                    variables: variables,
                                    query: document,
                                    optimistic: false,
                                });
                            }
                            catch (e) { }
                        }
                    },
                    error: function (error) {
                        _this.removeFetchQueryPromise(requestId);
                        _this.setQuery(queryId, function (_a) {
                            var subscriptions = _a.subscriptions;
                            return ({
                                subscriptions: subscriptions.filter(function (x) { return x !== subscription; }),
                            });
                        });
                        reject(error);
                    },
                    complete: function () {
                        _this.removeFetchQueryPromise(requestId);
                        _this.setQuery(queryId, function (_a) {
                            var subscriptions = _a.subscriptions;
                            return ({
                                subscriptions: subscriptions.filter(function (x) { return x !== subscription; }),
                            });
                        });
                        resolve({
                            data: resultFromStore,
                            errors: errorsFromStore,
                            loading: false,
                            networkStatus: exports.NetworkStatus.ready,
                            stale: false,
                        });
                    },
                });
                _this.setQuery(queryId, function (_a) {
                    var subscriptions = _a.subscriptions;
                    return ({
                        subscriptions: subscriptions.concat([subscription]),
                    });
                });
            });
        };
        QueryManager.prototype.refetchQueryByName = function (queryName) {
            var _this = this;
            var refetchedQueries = this.queryIdsByName[queryName];
            if (refetchedQueries === undefined)
                return;
            return Promise.all(refetchedQueries
                .map(function (id) { return _this.getQuery(id).observableQuery; })
                .filter(function (x) { return !!x; })
                .map(function (x) { return x.refetch(); }));
        };
        QueryManager.prototype.generateRequestId = function () {
            var requestId = this.idCounter;
            this.idCounter++;
            return requestId;
        };
        QueryManager.prototype.getQuery = function (queryId) {
            return this.queries.get(queryId) || {
                listeners: [],
                invalidated: false,
                document: null,
                newData: null,
                lastRequestId: null,
                observableQuery: null,
                subscriptions: [],
            };
        };
        QueryManager.prototype.setQuery = function (queryId, updater) {
            var prev = this.getQuery(queryId);
            var newInfo = __assign$3({}, prev, updater(prev));
            this.queries.set(queryId, newInfo);
        };
        QueryManager.prototype.invalidate = function (invalidated, queryId, fetchMoreForQueryId) {
            if (queryId)
                this.setQuery(queryId, function () { return ({ invalidated: invalidated }); });
            if (fetchMoreForQueryId) {
                this.setQuery(fetchMoreForQueryId, function () { return ({ invalidated: invalidated }); });
            }
        };
        QueryManager.prototype.buildOperationForLink = function (document, variables, extraContext) {
            var cache = this.dataStore.getCache();
            return {
                query: cache.transformForLink
                    ? cache.transformForLink(document)
                    : document,
                variables: variables,
                operationName: apolloUtilities.getOperationName(document) || undefined,
                context: __assign$3({}, extraContext, { cache: cache, getCacheKey: function (obj) {
                        if (cache.config) {
                            return cache.config.dataIdFromObject(obj);
                        }
                        else {
                            throw new Error('To use context.getCacheKey, you need to use a cache that has a configurable dataIdFromObject, like apollo-cache-inmemory.');
                        }
                    } }),
            };
        };
        return QueryManager;
    }());

    var DataStore = (function () {
        function DataStore(initialCache) {
            this.cache = initialCache;
        }
        DataStore.prototype.getCache = function () {
            return this.cache;
        };
        DataStore.prototype.markQueryResult = function (result, document, variables, fetchMoreForQueryId, ignoreErrors) {
            if (ignoreErrors === void 0) { ignoreErrors = false; }
            var writeWithErrors = !apolloUtilities.graphQLResultHasError(result);
            if (ignoreErrors && apolloUtilities.graphQLResultHasError(result) && result.data) {
                writeWithErrors = true;
            }
            if (!fetchMoreForQueryId && writeWithErrors) {
                this.cache.write({
                    result: result.data,
                    dataId: 'ROOT_QUERY',
                    query: document,
                    variables: variables,
                });
            }
        };
        DataStore.prototype.markSubscriptionResult = function (result, document, variables) {
            if (!apolloUtilities.graphQLResultHasError(result)) {
                this.cache.write({
                    result: result.data,
                    dataId: 'ROOT_SUBSCRIPTION',
                    query: document,
                    variables: variables,
                });
            }
        };
        DataStore.prototype.markMutationInit = function (mutation) {
            var _this = this;
            if (mutation.optimisticResponse) {
                var optimistic_1;
                if (typeof mutation.optimisticResponse === 'function') {
                    optimistic_1 = mutation.optimisticResponse(mutation.variables);
                }
                else {
                    optimistic_1 = mutation.optimisticResponse;
                }
                var changeFn_1 = function () {
                    _this.markMutationResult({
                        mutationId: mutation.mutationId,
                        result: { data: optimistic_1 },
                        document: mutation.document,
                        variables: mutation.variables,
                        updateQueries: mutation.updateQueries,
                        update: mutation.update,
                    });
                };
                this.cache.recordOptimisticTransaction(function (c) {
                    var orig = _this.cache;
                    _this.cache = c;
                    try {
                        changeFn_1();
                    }
                    finally {
                        _this.cache = orig;
                    }
                }, mutation.mutationId);
            }
        };
        DataStore.prototype.markMutationResult = function (mutation) {
            var _this = this;
            if (!apolloUtilities.graphQLResultHasError(mutation.result)) {
                var cacheWrites_1 = [];
                cacheWrites_1.push({
                    result: mutation.result.data,
                    dataId: 'ROOT_MUTATION',
                    query: mutation.document,
                    variables: mutation.variables,
                });
                if (mutation.updateQueries) {
                    Object.keys(mutation.updateQueries)
                        .filter(function (id) { return mutation.updateQueries[id]; })
                        .forEach(function (queryId) {
                        var _a = mutation.updateQueries[queryId], query = _a.query, updater = _a.updater;
                        var _b = _this.cache.diff({
                            query: query.document,
                            variables: query.variables,
                            returnPartialData: true,
                            optimistic: false,
                        }), currentQueryResult = _b.result, complete = _b.complete;
                        if (!complete) {
                            return;
                        }
                        var nextQueryResult = apolloUtilities.tryFunctionOrLogError(function () {
                            return updater(currentQueryResult, {
                                mutationResult: mutation.result,
                                queryName: apolloUtilities.getOperationName(query.document) || undefined,
                                queryVariables: query.variables,
                            });
                        });
                        if (nextQueryResult) {
                            cacheWrites_1.push({
                                result: nextQueryResult,
                                dataId: 'ROOT_QUERY',
                                query: query.document,
                                variables: query.variables,
                            });
                        }
                    });
                }
                this.cache.performTransaction(function (c) {
                    cacheWrites_1.forEach(function (write) { return c.write(write); });
                });
                var update_1 = mutation.update;
                if (update_1) {
                    this.cache.performTransaction(function (c) {
                        apolloUtilities.tryFunctionOrLogError(function () { return update_1(c, mutation.result); });
                    });
                }
            }
        };
        DataStore.prototype.markMutationComplete = function (_a) {
            var mutationId = _a.mutationId, optimisticResponse = _a.optimisticResponse;
            if (!optimisticResponse)
                return;
            this.cache.removeOptimistic(mutationId);
        };
        DataStore.prototype.markUpdateQueryResult = function (document, variables, newResult) {
            this.cache.write({
                result: newResult,
                dataId: 'ROOT_QUERY',
                variables: variables,
                query: document,
            });
        };
        DataStore.prototype.reset = function () {
            return this.cache.reset();
        };
        return DataStore;
    }());

    var version = "2.4.5";

    var __assign$4 = (undefined && undefined.__assign) || function () {
        __assign$4 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$4.apply(this, arguments);
    };
    var hasSuggestedDevtools = false;
    var ApolloClient = (function () {
        function ApolloClient(options) {
            var _this = this;
            this.defaultOptions = {};
            this.resetStoreCallbacks = [];
            var link = options.link, cache = options.cache, _a = options.ssrMode, ssrMode = _a === void 0 ? false : _a, _b = options.ssrForceFetchDelay, ssrForceFetchDelay = _b === void 0 ? 0 : _b, connectToDevTools = options.connectToDevTools, _c = options.queryDeduplication, queryDeduplication = _c === void 0 ? true : _c, defaultOptions = options.defaultOptions;
            if (!link || !cache) {
                throw new Error("\n        In order to initialize Apollo Client, you must specify link & cache properties on the config object.\n        This is part of the required upgrade when migrating from Apollo Client 1.0 to Apollo Client 2.0.\n        For more information, please visit:\n          https://www.apollographql.com/docs/react/basics/setup.html\n        to help you get started.\n      ");
            }
            var supportedCache = new Map();
            var supportedDirectives = new apolloLink.ApolloLink(function (operation, forward) {
                var result = supportedCache.get(operation.query);
                if (!result) {
                    result = apolloUtilities.removeConnectionDirectiveFromDocument(operation.query);
                    supportedCache.set(operation.query, result);
                    supportedCache.set(result, result);
                }
                operation.query = result;
                return forward(operation);
            });
            this.link = supportedDirectives.concat(link);
            this.cache = cache;
            this.store = new DataStore(cache);
            this.disableNetworkFetches = ssrMode || ssrForceFetchDelay > 0;
            this.queryDeduplication = queryDeduplication;
            this.ssrMode = ssrMode;
            this.defaultOptions = defaultOptions || {};
            if (ssrForceFetchDelay) {
                setTimeout(function () { return (_this.disableNetworkFetches = false); }, ssrForceFetchDelay);
            }
            this.watchQuery = this.watchQuery.bind(this);
            this.query = this.query.bind(this);
            this.mutate = this.mutate.bind(this);
            this.resetStore = this.resetStore.bind(this);
            this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this);
            var defaultConnectToDevTools = !apolloUtilities.isProduction() &&
                typeof window !== 'undefined' &&
                !window.__APOLLO_CLIENT__;
            if (typeof connectToDevTools === 'undefined'
                ? defaultConnectToDevTools
                : connectToDevTools && typeof window !== 'undefined') {
                window.__APOLLO_CLIENT__ = this;
            }
            if (!hasSuggestedDevtools && !apolloUtilities.isProduction()) {
                hasSuggestedDevtools = true;
                if (typeof window !== 'undefined' &&
                    window.document &&
                    window.top === window.self) {
                    if (typeof window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
                        if (window.navigator &&
                            window.navigator.userAgent &&
                            window.navigator.userAgent.indexOf('Chrome') > -1) {
                            console.debug('Download the Apollo DevTools ' +
                                'for a better development experience: ' +
                                'https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm');
                        }
                    }
                }
            }
            this.version = version;
        }
        ApolloClient.prototype.watchQuery = function (options) {
            if (this.defaultOptions.watchQuery) {
                options = __assign$4({}, this.defaultOptions.watchQuery, options);
            }
            if (this.disableNetworkFetches &&
                (options.fetchPolicy === 'network-only' ||
                    options.fetchPolicy === 'cache-and-network')) {
                options = __assign$4({}, options, { fetchPolicy: 'cache-first' });
            }
            return this.initQueryManager().watchQuery(options);
        };
        ApolloClient.prototype.query = function (options) {
            if (this.defaultOptions.query) {
                options = __assign$4({}, this.defaultOptions.query, options);
            }
            if (options.fetchPolicy === 'cache-and-network') {
                throw new Error('cache-and-network fetchPolicy can only be used with watchQuery');
            }
            if (this.disableNetworkFetches && options.fetchPolicy === 'network-only') {
                options = __assign$4({}, options, { fetchPolicy: 'cache-first' });
            }
            return this.initQueryManager().query(options);
        };
        ApolloClient.prototype.mutate = function (options) {
            if (this.defaultOptions.mutate) {
                options = __assign$4({}, this.defaultOptions.mutate, options);
            }
            return this.initQueryManager().mutate(options);
        };
        ApolloClient.prototype.subscribe = function (options) {
            return this.initQueryManager().startGraphQLSubscription(options);
        };
        ApolloClient.prototype.readQuery = function (options, optimistic) {
            if (optimistic === void 0) { optimistic = false; }
            return this.initProxy().readQuery(options, optimistic);
        };
        ApolloClient.prototype.readFragment = function (options, optimistic) {
            if (optimistic === void 0) { optimistic = false; }
            return this.initProxy().readFragment(options, optimistic);
        };
        ApolloClient.prototype.writeQuery = function (options) {
            var result = this.initProxy().writeQuery(options);
            this.initQueryManager().broadcastQueries();
            return result;
        };
        ApolloClient.prototype.writeFragment = function (options) {
            var result = this.initProxy().writeFragment(options);
            this.initQueryManager().broadcastQueries();
            return result;
        };
        ApolloClient.prototype.writeData = function (options) {
            var result = this.initProxy().writeData(options);
            this.initQueryManager().broadcastQueries();
            return result;
        };
        ApolloClient.prototype.__actionHookForDevTools = function (cb) {
            this.devToolsHookCb = cb;
        };
        ApolloClient.prototype.__requestRaw = function (payload) {
            return apolloLink.execute(this.link, payload);
        };
        ApolloClient.prototype.initQueryManager = function () {
            var _this = this;
            if (!this.queryManager) {
                this.queryManager = new QueryManager({
                    link: this.link,
                    store: this.store,
                    queryDeduplication: this.queryDeduplication,
                    ssrMode: this.ssrMode,
                    onBroadcast: function () {
                        if (_this.devToolsHookCb) {
                            _this.devToolsHookCb({
                                action: {},
                                state: {
                                    queries: _this.queryManager
                                        ? _this.queryManager.queryStore.getStore()
                                        : {},
                                    mutations: _this.queryManager
                                        ? _this.queryManager.mutationStore.getStore()
                                        : {},
                                },
                                dataWithOptimisticResults: _this.cache.extract(true),
                            });
                        }
                    },
                });
            }
            return this.queryManager;
        };
        ApolloClient.prototype.resetStore = function () {
            var _this = this;
            return Promise.resolve()
                .then(function () {
                return _this.queryManager
                    ? _this.queryManager.clearStore()
                    : Promise.resolve(null);
            })
                .then(function () { return Promise.all(_this.resetStoreCallbacks.map(function (fn) { return fn(); })); })
                .then(function () {
                return _this.queryManager && _this.queryManager.reFetchObservableQueries
                    ? _this.queryManager.reFetchObservableQueries()
                    : Promise.resolve(null);
            });
        };
        ApolloClient.prototype.clearStore = function () {
            var queryManager = this.queryManager;
            return Promise.resolve().then(function () { return (queryManager ? queryManager.clearStore() : Promise.resolve(null)); });
        };
        ApolloClient.prototype.onResetStore = function (cb) {
            var _this = this;
            this.resetStoreCallbacks.push(cb);
            return function () {
                _this.resetStoreCallbacks = _this.resetStoreCallbacks.filter(function (c) { return c !== cb; });
            };
        };
        ApolloClient.prototype.reFetchObservableQueries = function (includeStandby) {
            return this.queryManager
                ? this.queryManager.reFetchObservableQueries(includeStandby)
                : Promise.resolve(null);
        };
        ApolloClient.prototype.extract = function (optimistic) {
            return this.initProxy().extract(optimistic);
        };
        ApolloClient.prototype.restore = function (serializedState) {
            return this.initProxy().restore(serializedState);
        };
        ApolloClient.prototype.initProxy = function () {
            if (!this.proxy) {
                this.initQueryManager();
                this.proxy = this.cache;
            }
            return this.proxy;
        };
        return ApolloClient;
    }());

    exports.printAST = printer.print;
    exports.ApolloClient = ApolloClient;
    exports.default = ApolloClient;
    exports.ObservableQuery = ObservableQuery;
    exports.ApolloError = ApolloError;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map