(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react-dom/server'), require('apollo-client'), require('prop-types'), require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react-dom/server', 'apollo-client', 'prop-types', 'react'], factory) :
    (factory((global['react-apollo'] = {}),global.server,global.apolloClient,global.PropTypes,global.React));
}(this, (function (exports,server,apolloClient,PropTypes,React) { 'use strict';

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
    var Trie = (function () {
        function Trie() {
            this.children = null;
            this.added = false;
        }
        Trie.prototype.has = function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var node = this;
            return keys.every(function (key) {
                var child = node.children && node.children.get(key);
                return !!(child && (node = child));
            }) && node.added;
        };
        Trie.prototype.add = function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var node = this;
            keys.forEach(function (key) {
                var map = node.children || (node.children = new Map);
                var child = map.get(key);
                if (child) {
                    node = child;
                }
                else {
                    map.set(key, node = new Trie());
                }
            });
            node.added = true;
        };
        return Trie;
    }());
    var RenderPromises = (function () {
        function RenderPromises() {
            this.queryPromises = new Map();
            this.queryGraveyard = new Trie();
        }
        RenderPromises.prototype.addQueryPromise = function (queryInstance, finish) {
            var _a = queryInstance.props, query = _a.query, variables = _a.variables;
            if (!this.queryGraveyard.has(query, JSON.stringify(variables))) {
                this.queryPromises.set(queryInstance, new Promise(function (resolve) {
                    resolve(queryInstance.fetchData());
                }));
                return null;
            }
            return finish();
        };
        RenderPromises.prototype.hasPromises = function () {
            return this.queryPromises.size > 0;
        };
        RenderPromises.prototype.consumeAndAwaitPromises = function () {
            var _this = this;
            var promises = [];
            this.queryPromises.forEach(function (promise, queryInstance) {
                var _a = queryInstance.props, query = _a.query, variables = _a.variables;
                _this.queryGraveyard.add(query, JSON.stringify(variables));
                promises.push(promise);
            });
            this.queryPromises.clear();
            return Promise.all(promises);
        };
        return RenderPromises;
    }());
    function getDataFromTree(tree, context) {
        if (context === void 0) { context = {}; }
        return getMarkupFromTree({
            tree: tree,
            context: context,
            renderFunction: server.renderToStaticMarkup,
        });
    }
    function getMarkupFromTree(_a) {
        var tree = _a.tree, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.renderFunction, renderFunction = _c === void 0 ? server.renderToStaticMarkup : _c;
        var renderPromises = new RenderPromises();
        var RenderPromisesProvider = (function (_super) {
            __extends(RenderPromisesProvider, _super);
            function RenderPromisesProvider() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RenderPromisesProvider.prototype.getChildContext = function () {
                return __assign({}, context, { renderPromises: renderPromises });
            };
            RenderPromisesProvider.prototype.render = function () {
                return tree;
            };
            RenderPromisesProvider.childContextTypes = {
                renderPromises: PropTypes.object,
            };
            return RenderPromisesProvider;
        }(React.Component));
        Object.keys(context).forEach(function (key) {
            RenderPromisesProvider.childContextTypes[key] = PropTypes.any;
        });
        function process() {
            var html = renderFunction(React.createElement(RenderPromisesProvider));
            return renderPromises.hasPromises()
                ? renderPromises.consumeAndAwaitPromises().then(process)
                : html;
        }
        return Promise.resolve().then(process);
    }

    var invariant = require('invariant');
    var ApolloConsumer = function (props, context) {
        invariant(!!context.client, "Could not find \"client\" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>");
        return props.children(context.client);
    };
    ApolloConsumer.contextTypes = {
        client: PropTypes.object.isRequired,
    };
    ApolloConsumer.propTypes = {
        children: PropTypes.func.isRequired,
    };

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
    var invariant$1 = require('invariant');
    var ApolloProvider = (function (_super) {
        __extends$1(ApolloProvider, _super);
        function ApolloProvider(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.operations = new Map();
            invariant$1(props.client, 'ApolloProvider was not passed a client instance. Make ' +
                'sure you pass in your client via the "client" prop.');
            if (!props.client.__operations_cache__) {
                props.client.__operations_cache__ = _this.operations;
            }
            return _this;
        }
        ApolloProvider.prototype.getChildContext = function () {
            return {
                client: this.props.client,
                operations: this.props.client.__operations_cache__,
            };
        };
        ApolloProvider.prototype.render = function () {
            return this.props.children;
        };
        ApolloProvider.propTypes = {
            client: PropTypes.object.isRequired,
            children: PropTypes.node.isRequired,
        };
        ApolloProvider.childContextTypes = {
            client: PropTypes.object.isRequired,
            operations: PropTypes.object,
        };
        return ApolloProvider;
    }(React.Component));

    var invariant$2 = require('invariant');
    var DocumentType;
    (function (DocumentType) {
        DocumentType[DocumentType["Query"] = 0] = "Query";
        DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
        DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
    })(DocumentType || (DocumentType = {}));
    var cache = new Map();
    function parser(document) {
        var cached = cache.get(document);
        if (cached)
            return cached;
        var variables, type, name;
        invariant$2(!!document && !!document.kind, "Argument of " + document + " passed to parser was not a valid GraphQL " +
            "DocumentNode. You may need to use 'graphql-tag' or another method " +
            "to convert your operation into a document");
        var fragments = document.definitions.filter(function (x) { return x.kind === 'FragmentDefinition'; });
        var queries = document.definitions.filter(function (x) { return x.kind === 'OperationDefinition' && x.operation === 'query'; });
        var mutations = document.definitions.filter(function (x) { return x.kind === 'OperationDefinition' && x.operation === 'mutation'; });
        var subscriptions = document.definitions.filter(function (x) { return x.kind === 'OperationDefinition' && x.operation === 'subscription'; });
        invariant$2(!fragments.length || (queries.length || mutations.length || subscriptions.length), "Passing only a fragment to 'graphql' is not yet supported. " +
            "You must include a query, subscription or mutation as well");
        invariant$2(queries.length + mutations.length + subscriptions.length <= 1, "react-apollo only supports a query, subscription, or a mutation per HOC. " +
            (document + " had " + queries.length + " queries, " + subscriptions.length + " ") +
            ("subscriptions and " + mutations.length + " mutations. ") +
            "You can use 'compose' to join multiple operation types to a component");
        type = queries.length ? DocumentType.Query : DocumentType.Mutation;
        if (!queries.length && !mutations.length)
            type = DocumentType.Subscription;
        var definitions = queries.length ? queries : mutations.length ? mutations : subscriptions;
        invariant$2(definitions.length === 1, "react-apollo only supports one defintion per HOC. " + document + " had " +
            (definitions.length + " definitions. ") +
            "You can use 'compose' to join multiple operation types to a component");
        var definition = definitions[0];
        variables = definition.variableDefinitions || [];
        if (definition.name && definition.name.kind === 'Name') {
            name = definition.name.value;
        }
        else {
            name = 'data';
        }
        var payload = { name: name, type: type, variables: variables };
        cache.set(document, payload);
        return payload;
    }

    var invariant$3 = require('invariant');
    function getClient(props, context) {
        var client = props.client || context.client;
        invariant$3(!!client, 'Could not find "client" in the context or passed in as a prop. ' +
            'Wrap the root component in an <ApolloProvider>, or pass an ' +
            'ApolloClient instance in via props.');
        return client;
    }

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
    var __rest = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    var shallowEqual = require('fbjs/lib/shallowEqual');
    var invariant$4 = require('invariant');
    function compact(obj) {
        return Object.keys(obj).reduce(function (acc, key) {
            if (obj[key] !== undefined) {
                acc[key] = obj[key];
            }
            return acc;
        }, {});
    }
    function observableQueryFields(observable) {
        var fields = {
            variables: observable.variables,
            refetch: observable.refetch.bind(observable),
            fetchMore: observable.fetchMore.bind(observable),
            updateQuery: observable.updateQuery.bind(observable),
            startPolling: observable.startPolling.bind(observable),
            stopPolling: observable.stopPolling.bind(observable),
            subscribeToMore: observable.subscribeToMore.bind(observable),
        };
        return fields;
    }
    var Query = (function (_super) {
        __extends$2(Query, _super);
        function Query(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.previousData = {};
            _this.hasMounted = false;
            _this.startQuerySubscription = function () {
                if (_this.querySubscription)
                    return;
                var initial = _this.getQueryResult();
                _this.querySubscription = _this.queryObservable.subscribe({
                    next: function (_a) {
                        var data = _a.data;
                        if (initial && initial.networkStatus === 7 && shallowEqual(initial.data, data)) {
                            initial = undefined;
                            return;
                        }
                        initial = undefined;
                        _this.updateCurrentData();
                    },
                    error: function (error) {
                        _this.resubscribeToQuery();
                        if (!error.hasOwnProperty('graphQLErrors'))
                            throw error;
                        _this.updateCurrentData();
                    },
                });
            };
            _this.removeQuerySubscription = function () {
                if (_this.querySubscription) {
                    _this.querySubscription.unsubscribe();
                    delete _this.querySubscription;
                }
            };
            _this.updateCurrentData = function () {
                if (_this.hasMounted)
                    _this.forceUpdate();
            };
            _this.getQueryResult = function () {
                var data = { data: Object.create(null) };
                Object.assign(data, observableQueryFields(_this.queryObservable));
                if (_this.props.skip) {
                    data = __assign$1({}, data, { data: undefined, error: undefined, loading: false });
                }
                else {
                    var currentResult = _this.queryObservable.currentResult();
                    var loading = currentResult.loading, partial = currentResult.partial, networkStatus = currentResult.networkStatus, errors = currentResult.errors;
                    var error = currentResult.error;
                    if (errors && errors.length > 0) {
                        error = new apolloClient.ApolloError({ graphQLErrors: errors });
                    }
                    Object.assign(data, { loading: loading, networkStatus: networkStatus, error: error });
                    if (loading) {
                        Object.assign(data.data, _this.previousData, currentResult.data);
                    }
                    else if (error) {
                        Object.assign(data, {
                            data: (_this.queryObservable.getLastResult() || {}).data,
                        });
                    }
                    else {
                        var fetchPolicy = _this.queryObservable.options.fetchPolicy;
                        var partialRefetch = _this.props.partialRefetch;
                        if (partialRefetch &&
                            Object.keys(currentResult.data).length === 0 &&
                            partial &&
                            fetchPolicy !== 'cache-only') {
                            Object.assign(data, { loading: true, networkStatus: apolloClient.NetworkStatus.loading });
                            data.refetch();
                            return data;
                        }
                        Object.assign(data.data, currentResult.data);
                        _this.previousData = currentResult.data;
                    }
                }
                if (!_this.querySubscription) {
                    var oldRefetch_1 = data.refetch;
                    data.refetch = function (args) {
                        if (_this.querySubscription) {
                            return oldRefetch_1(args);
                        }
                        else {
                            return new Promise(function (r, f) {
                                _this.refetcherQueue = { resolve: r, reject: f, args: args };
                            });
                        }
                    };
                }
                data.client = _this.client;
                return data;
            };
            _this.client = getClient(props, context);
            _this.initializeQueryObservable(props);
            return _this;
        }
        Query.prototype.fetchData = function () {
            if (this.props.skip)
                return false;
            var _a = this.props, children = _a.children, ssr = _a.ssr, displayName = _a.displayName, skip = _a.skip, client = _a.client, onCompleted = _a.onCompleted, onError = _a.onError, partialRefetch = _a.partialRefetch, opts = __rest(_a, ["children", "ssr", "displayName", "skip", "client", "onCompleted", "onError", "partialRefetch"]);
            var fetchPolicy = opts.fetchPolicy;
            if (ssr === false)
                return false;
            if (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network') {
                fetchPolicy = 'cache-first';
            }
            var observable = this.client.watchQuery(__assign$1({}, opts, { fetchPolicy: fetchPolicy }));
            var result = this.queryObservable.currentResult();
            return result.loading ? observable.result() : false;
        };
        Query.prototype.componentDidMount = function () {
            this.hasMounted = true;
            if (this.props.skip)
                return;
            this.startQuerySubscription();
            if (this.refetcherQueue) {
                var _a = this.refetcherQueue, args = _a.args, resolve = _a.resolve, reject = _a.reject;
                this.queryObservable.refetch(args)
                    .then(resolve)
                    .catch(reject);
            }
        };
        Query.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
            if (nextProps.skip && !this.props.skip) {
                this.removeQuerySubscription();
                return;
            }
            var nextClient = getClient(nextProps, nextContext);
            if (shallowEqual(this.props, nextProps) && this.client === nextClient) {
                return;
            }
            if (this.client !== nextClient) {
                this.client = nextClient;
                this.removeQuerySubscription();
                this.queryObservable = null;
                this.previousData = {};
                this.updateQuery(nextProps);
            }
            if (this.props.query !== nextProps.query) {
                this.removeQuerySubscription();
            }
            this.updateQuery(nextProps);
            if (nextProps.skip)
                return;
            this.startQuerySubscription();
        };
        Query.prototype.componentWillUnmount = function () {
            this.removeQuerySubscription();
            this.hasMounted = false;
        };
        Query.prototype.componentDidUpdate = function () {
            var _a = this.props, onCompleted = _a.onCompleted, onError = _a.onError;
            if (onCompleted || onError) {
                var currentResult = this.queryObservable.currentResult();
                var loading = currentResult.loading, error = currentResult.error, data = currentResult.data;
                if (onCompleted && !loading && !error) {
                    onCompleted(data);
                }
                else if (onError && !loading && error) {
                    onError(error);
                }
            }
        };
        Query.prototype.render = function () {
            var _this = this;
            var context = this.context;
            var finish = function () { return _this.props.children(_this.getQueryResult()); };
            if (context && context.renderPromises) {
                return context.renderPromises.addQueryPromise(this, finish);
            }
            return finish();
        };
        Query.prototype.extractOptsFromProps = function (props) {
            var variables = props.variables, pollInterval = props.pollInterval, fetchPolicy = props.fetchPolicy, errorPolicy = props.errorPolicy, notifyOnNetworkStatusChange = props.notifyOnNetworkStatusChange, query = props.query, _a = props.displayName, displayName = _a === void 0 ? 'Query' : _a, _b = props.context, context = _b === void 0 ? {} : _b;
            this.operation = parser(query);
            invariant$4(this.operation.type === DocumentType.Query, "The <Query /> component requires a graphql query, but got a " + (this.operation.type === DocumentType.Mutation ? 'mutation' : 'subscription') + ".");
            return compact({
                variables: variables,
                pollInterval: pollInterval,
                query: query,
                fetchPolicy: fetchPolicy,
                errorPolicy: errorPolicy,
                notifyOnNetworkStatusChange: notifyOnNetworkStatusChange,
                metadata: { reactComponent: { displayName: displayName } },
                context: context,
            });
        };
        Query.prototype.initializeQueryObservable = function (props) {
            var opts = this.extractOptsFromProps(props);
            this.setOperations(opts);
            this.queryObservable = this.client.watchQuery(opts);
        };
        Query.prototype.setOperations = function (props) {
            if (this.context.operations) {
                this.context.operations.set(this.operation.name, {
                    query: props.query,
                    variables: props.variables,
                });
            }
        };
        Query.prototype.updateQuery = function (props) {
            if (!this.queryObservable) {
                this.initializeQueryObservable(props);
            }
            else {
                this.setOperations(props);
            }
            this.queryObservable.setOptions(this.extractOptsFromProps(props))
                .catch(function () { return null; });
        };
        Query.prototype.resubscribeToQuery = function () {
            this.removeQuerySubscription();
            var lastError = this.queryObservable.getLastError();
            var lastResult = this.queryObservable.getLastResult();
            this.queryObservable.resetLastResults();
            this.startQuerySubscription();
            Object.assign(this.queryObservable, { lastError: lastError, lastResult: lastResult });
        };
        Query.contextTypes = {
            client: PropTypes.object,
            operations: PropTypes.object,
            renderPromises: PropTypes.object,
        };
        Query.propTypes = {
            client: PropTypes.object,
            children: PropTypes.func.isRequired,
            fetchPolicy: PropTypes.string,
            notifyOnNetworkStatusChange: PropTypes.bool,
            onCompleted: PropTypes.func,
            onError: PropTypes.func,
            pollInterval: PropTypes.number,
            query: PropTypes.object.isRequired,
            variables: PropTypes.object,
            ssr: PropTypes.bool,
            partialRefetch: PropTypes.bool,
        };
        return Query;
    }(React.Component));

    var __extends$3 = (undefined && undefined.__extends) || (function () {
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
    var invariant$5 = require('invariant');
    var shallowEqual$1 = require('fbjs/lib/shallowEqual');
    var initialState = {
        loading: false,
        called: false,
        error: undefined,
        data: undefined,
    };
    var Mutation = (function (_super) {
        __extends$3(Mutation, _super);
        function Mutation(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.hasMounted = false;
            _this.runMutation = function (options) {
                if (options === void 0) { options = {}; }
                _this.onMutationStart();
                var mutationId = _this.generateNewMutationId();
                return _this.mutate(options)
                    .then(function (response) {
                    _this.onMutationCompleted(response, mutationId);
                    return response;
                })
                    .catch(function (e) {
                    _this.onMutationError(e, mutationId);
                    if (!_this.props.onError)
                        throw e;
                });
            };
            _this.mutate = function (options) {
                var _a = _this.props, mutation = _a.mutation, variables = _a.variables, optimisticResponse = _a.optimisticResponse, update = _a.update, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.awaitRefetchQueries, awaitRefetchQueries = _c === void 0 ? false : _c;
                var mutateOptions = __assign$2({}, options);
                var refetchQueries = mutateOptions.refetchQueries || _this.props.refetchQueries;
                if (refetchQueries && refetchQueries.length && Array.isArray(refetchQueries)) {
                    refetchQueries = refetchQueries.map(function (x) {
                        if (typeof x === 'string' && _this.context.operations)
                            return _this.context.operations.get(x) || x;
                        return x;
                    });
                    delete mutateOptions.refetchQueries;
                }
                var mutateVariables = Object.assign({}, variables, mutateOptions.variables);
                delete mutateOptions.variables;
                return _this.client.mutate(__assign$2({ mutation: mutation,
                    optimisticResponse: optimisticResponse,
                    refetchQueries: refetchQueries,
                    awaitRefetchQueries: awaitRefetchQueries,
                    update: update,
                    context: context, variables: mutateVariables }, mutateOptions));
            };
            _this.onMutationStart = function () {
                if (!_this.state.loading && !_this.props.ignoreResults) {
                    _this.setState({
                        loading: true,
                        error: undefined,
                        data: undefined,
                        called: true,
                    });
                }
            };
            _this.onMutationCompleted = function (response, mutationId) {
                if (_this.hasMounted === false) {
                    return;
                }
                var _a = _this.props, onCompleted = _a.onCompleted, ignoreResults = _a.ignoreResults;
                var data = response.data, errors = response.errors;
                var error = errors && errors.length > 0 ? new apolloClient.ApolloError({ graphQLErrors: errors }) : undefined;
                var callOncomplete = function () { return (onCompleted ? onCompleted(data) : null); };
                if (_this.isMostRecentMutation(mutationId) && !ignoreResults) {
                    _this.setState({ loading: false, data: data, error: error }, callOncomplete);
                }
                else {
                    callOncomplete();
                }
            };
            _this.onMutationError = function (error, mutationId) {
                if (_this.hasMounted === false) {
                    return;
                }
                var onError = _this.props.onError;
                var callOnError = function () { return (onError ? onError(error) : null); };
                if (_this.isMostRecentMutation(mutationId)) {
                    _this.setState({ loading: false, error: error }, callOnError);
                }
                else {
                    callOnError();
                }
            };
            _this.generateNewMutationId = function () {
                _this.mostRecentMutationId = _this.mostRecentMutationId + 1;
                return _this.mostRecentMutationId;
            };
            _this.isMostRecentMutation = function (mutationId) {
                return _this.mostRecentMutationId === mutationId;
            };
            _this.verifyDocumentIsMutation = function (mutation) {
                var operation = parser(mutation);
                invariant$5(operation.type === DocumentType.Mutation, "The <Mutation /> component requires a graphql mutation, but got a " + (operation.type === DocumentType.Query ? 'query' : 'subscription') + ".");
            };
            _this.client = getClient(props, context);
            _this.verifyDocumentIsMutation(props.mutation);
            _this.mostRecentMutationId = 0;
            _this.state = initialState;
            return _this;
        }
        Mutation.prototype.componentDidMount = function () {
            this.hasMounted = true;
        };
        Mutation.prototype.componentWillUnmount = function () {
            this.hasMounted = false;
        };
        Mutation.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
            var nextClient = getClient(nextProps, nextContext);
            if (shallowEqual$1(this.props, nextProps) && this.client === nextClient) {
                return;
            }
            if (this.props.mutation !== nextProps.mutation) {
                this.verifyDocumentIsMutation(nextProps.mutation);
            }
            if (this.client !== nextClient) {
                this.client = nextClient;
                this.setState(initialState);
            }
        };
        Mutation.prototype.render = function () {
            var children = this.props.children;
            var _a = this.state, loading = _a.loading, data = _a.data, error = _a.error, called = _a.called;
            var result = {
                called: called,
                loading: loading,
                data: data,
                error: error,
                client: this.client,
            };
            return children(this.runMutation, result);
        };
        Mutation.contextTypes = {
            client: PropTypes.object.isRequired,
            operations: PropTypes.object,
        };
        Mutation.propTypes = {
            mutation: PropTypes.object.isRequired,
            variables: PropTypes.object,
            optimisticResponse: PropTypes.object,
            refetchQueries: PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
                PropTypes.func,
            ]),
            awaitRefetchQueries: PropTypes.bool,
            update: PropTypes.func,
            children: PropTypes.func.isRequired,
            onCompleted: PropTypes.func,
            onError: PropTypes.func,
        };
        return Mutation;
    }(React.Component));

    var __extends$4 = (undefined && undefined.__extends) || (function () {
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
    var shallowEqual$2 = require('fbjs/lib/shallowEqual');
    var invariant$6 = require('invariant');
    var Subscription = (function (_super) {
        __extends$4(Subscription, _super);
        function Subscription(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.initialize = function (props) {
                if (_this.queryObservable)
                    return;
                _this.queryObservable = _this.client.subscribe({
                    query: props.subscription,
                    variables: props.variables,
                    fetchPolicy: props.fetchPolicy,
                });
            };
            _this.startSubscription = function () {
                if (_this.querySubscription)
                    return;
                _this.querySubscription = _this.queryObservable.subscribe({
                    next: _this.updateCurrentData,
                    error: _this.updateError,
                });
            };
            _this.getInitialState = function () { return ({
                loading: true,
                error: undefined,
                data: undefined,
            }); };
            _this.updateCurrentData = function (result) {
                var _a = _this, client = _a.client, onSubscriptionData = _a.props.onSubscriptionData;
                if (onSubscriptionData)
                    onSubscriptionData({ client: client, subscriptionData: result });
                _this.setState({
                    data: result.data,
                    loading: false,
                    error: undefined,
                });
            };
            _this.updateError = function (error) {
                _this.setState({
                    error: error,
                    loading: false,
                });
            };
            _this.endSubscription = function () {
                if (_this.querySubscription) {
                    _this.querySubscription.unsubscribe();
                    delete _this.querySubscription;
                }
            };
            _this.client = getClient(props, context);
            _this.initialize(props);
            _this.state = _this.getInitialState();
            return _this;
        }
        Subscription.prototype.componentDidMount = function () {
            this.startSubscription();
        };
        Subscription.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
            var nextClient = getClient(nextProps, nextContext);
            if (shallowEqual$2(this.props.variables, nextProps.variables) &&
                this.client === nextClient &&
                this.props.subscription === nextProps.subscription) {
                return;
            }
            var shouldResubscribe = nextProps.shouldResubscribe;
            if (typeof shouldResubscribe === 'function') {
                shouldResubscribe = !!shouldResubscribe(this.props, nextProps);
            }
            var shouldNotResubscribe = shouldResubscribe === false;
            if (this.client !== nextClient) {
                this.client = nextClient;
            }
            if (!shouldNotResubscribe) {
                this.endSubscription();
                delete this.queryObservable;
                this.initialize(nextProps);
                this.startSubscription();
                this.setState(this.getInitialState());
                return;
            }
            this.initialize(nextProps);
            this.startSubscription();
        };
        Subscription.prototype.componentWillUnmount = function () {
            this.endSubscription();
        };
        Subscription.prototype.render = function () {
            var renderFn = this.props.children;
            if (!renderFn)
                return null;
            var result = Object.assign({}, this.state, {
                variables: this.props.variables,
            });
            return renderFn(result);
        };
        Subscription.contextTypes = {
            client: PropTypes.object.isRequired,
        };
        Subscription.propTypes = {
            subscription: PropTypes.object.isRequired,
            variables: PropTypes.object,
            children: PropTypes.func,
            onSubscriptionData: PropTypes.func,
            shouldResubscribe: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        };
        return Subscription;
    }(React.Component));

    var __extends$5 = (undefined && undefined.__extends) || (function () {
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
    var invariant$7 = require('invariant');
    var defaultMapPropsToOptions = function () { return ({}); };
    var defaultMapPropsToSkip = function () { return false; };
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
    function calculateVariablesFromProps(operation, props, graphQLDisplayName, wrapperName) {
        var variables = {};
        for (var _i = 0, _a = operation.variables; _i < _a.length; _i++) {
            var _b = _a[_i], variable = _b.variable, type = _b.type;
            if (!variable.name || !variable.name.value)
                continue;
            var variableName = variable.name.value;
            var variableProp = props[variableName];
            if (typeof variableProp !== 'undefined') {
                variables[variableName] = variableProp;
                continue;
            }
            if (type.kind !== 'NonNullType') {
                variables[variableName] = null;
                continue;
            }
            if (operation.type === DocumentType.Mutation)
                return;
            invariant$7(typeof variableProp !== 'undefined', "The operation '" + operation.name + "' wrapping '" + wrapperName + "' " +
                ("is expecting a variable: '" + variable.name.value + "' but it was not found in the props ") +
                ("passed to '" + graphQLDisplayName + "'"));
        }
        return variables;
    }
    var GraphQLBase = (function (_super) {
        __extends$5(GraphQLBase, _super);
        function GraphQLBase(props) {
            var _this = _super.call(this, props) || this;
            _this.withRef = false;
            _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
            return _this;
        }
        GraphQLBase.prototype.getWrappedInstance = function () {
            invariant$7(this.withRef, "To access the wrapped instance, you need to specify " + "{ withRef: true } in the options");
            return this.wrappedInstance;
        };
        GraphQLBase.prototype.setWrappedInstance = function (ref) {
            this.wrappedInstance = ref;
        };
        return GraphQLBase;
    }(React.Component));

    var __extends$6 = (undefined && undefined.__extends) || (function () {
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
    var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    var hoistNonReactStatics = require('hoist-non-react-statics');
    function query(document, operationOptions) {
        if (operationOptions === void 0) { operationOptions = {}; }
        var operation = parser(document);
        var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.skip, skip = _b === void 0 ? defaultMapPropsToSkip : _b, _c = operationOptions.alias, alias = _c === void 0 ? 'Apollo' : _c;
        var mapPropsToOptions = options;
        if (typeof mapPropsToOptions !== 'function') {
            mapPropsToOptions = function () { return options; };
        }
        var mapPropsToSkip = skip;
        if (typeof mapPropsToSkip !== 'function') {
            mapPropsToSkip = function () { return skip; };
        }
        var lastResultProps;
        return function (WrappedComponent) {
            var graphQLDisplayName = alias + "(" + getDisplayName(WrappedComponent) + ")";
            var GraphQL = (function (_super) {
                __extends$6(GraphQL, _super);
                function GraphQL() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GraphQL.prototype.render = function () {
                    var _this = this;
                    var props = this.props;
                    var shouldSkip = mapPropsToSkip(props);
                    var opts = shouldSkip ? Object.create(null) : __assign$3({}, mapPropsToOptions(props));
                    if (!shouldSkip && !opts.variables && operation.variables.length > 0) {
                        opts.variables = calculateVariablesFromProps(operation, props, graphQLDisplayName, getDisplayName(WrappedComponent));
                    }
                    return (React.createElement(Query, __assign$3({}, opts, { displayName: graphQLDisplayName, skip: shouldSkip, query: document, warnUnhandledError: true }), function (_a) {
                        var _ = _a.client, data = _a.data, r = __rest$1(_a, ["client", "data"]);
                        var _b, _c;
                        if (operationOptions.withRef) {
                            _this.withRef = true;
                            props = Object.assign({}, props, {
                                ref: _this.setWrappedInstance,
                            });
                        }
                        if (shouldSkip)
                            return React.createElement(WrappedComponent, __assign$3({}, props));
                        var result = Object.assign(r, data || {});
                        var name = operationOptions.name || 'data';
                        var childProps = (_b = {}, _b[name] = result, _b);
                        if (operationOptions.props) {
                            var newResult = (_c = {},
                                _c[name] = result,
                                _c.ownProps = props,
                                _c);
                            lastResultProps = operationOptions.props(newResult, lastResultProps);
                            childProps = lastResultProps;
                        }
                        return React.createElement(WrappedComponent, __assign$3({}, props, childProps));
                    }));
                };
                GraphQL.displayName = graphQLDisplayName;
                GraphQL.WrappedComponent = WrappedComponent;
                return GraphQL;
            }(GraphQLBase));
            return hoistNonReactStatics(GraphQL, WrappedComponent, {});
        };
    }

    var __extends$7 = (undefined && undefined.__extends) || (function () {
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
    var hoistNonReactStatics$1 = require('hoist-non-react-statics');
    function mutation(document, operationOptions) {
        if (operationOptions === void 0) { operationOptions = {}; }
        var operation = parser(document);
        var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.alias, alias = _b === void 0 ? 'Apollo' : _b;
        var mapPropsToOptions = options;
        if (typeof mapPropsToOptions !== 'function')
            mapPropsToOptions = function () { return options; };
        return function (WrappedComponent) {
            var graphQLDisplayName = alias + "(" + getDisplayName(WrappedComponent) + ")";
            var GraphQL = (function (_super) {
                __extends$7(GraphQL, _super);
                function GraphQL() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GraphQL.prototype.render = function () {
                    var props = this.props;
                    var opts = mapPropsToOptions(props);
                    if (operationOptions.withRef) {
                        this.withRef = true;
                        props = Object.assign({}, props, {
                            ref: this.setWrappedInstance,
                        });
                    }
                    if (!opts.variables && operation.variables.length > 0) {
                        opts.variables = calculateVariablesFromProps(operation, props, graphQLDisplayName, getDisplayName(WrappedComponent));
                    }
                    return (React.createElement(Mutation, __assign$4({}, opts, { mutation: document, ignoreResults: true }), function (mutate, _result) {
                        var _a, _b;
                        var name = operationOptions.name || 'mutate';
                        var childProps = (_a = {}, _a[name] = mutate, _a);
                        if (operationOptions.props) {
                            var newResult = (_b = {},
                                _b[name] = mutate,
                                _b.ownProps = props,
                                _b);
                            childProps = operationOptions.props(newResult);
                        }
                        return React.createElement(WrappedComponent, __assign$4({}, props, childProps));
                    }));
                };
                GraphQL.displayName = graphQLDisplayName;
                GraphQL.WrappedComponent = WrappedComponent;
                return GraphQL;
            }(GraphQLBase));
            return hoistNonReactStatics$1(GraphQL, WrappedComponent, {});
        };
    }

    var __extends$8 = (undefined && undefined.__extends) || (function () {
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
    var __assign$5 = (undefined && undefined.__assign) || function () {
        __assign$5 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$5.apply(this, arguments);
    };
    var __rest$2 = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    var hoistNonReactStatics$2 = require('hoist-non-react-statics');
    function subscribe(document, operationOptions) {
        if (operationOptions === void 0) { operationOptions = {}; }
        var operation = parser(document);
        var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.skip, skip = _b === void 0 ? defaultMapPropsToSkip : _b, _c = operationOptions.alias, alias = _c === void 0 ? 'Apollo' : _c, shouldResubscribe = operationOptions.shouldResubscribe;
        var mapPropsToOptions = options;
        if (typeof mapPropsToOptions !== 'function')
            mapPropsToOptions = function () { return options; };
        var mapPropsToSkip = skip;
        if (typeof mapPropsToSkip !== 'function')
            mapPropsToSkip = function () { return skip; };
        var lastResultProps;
        return function (WrappedComponent) {
            var graphQLDisplayName = alias + "(" + getDisplayName(WrappedComponent) + ")";
            var GraphQL = (function (_super) {
                __extends$8(GraphQL, _super);
                function GraphQL(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = { resubscribe: false };
                    return _this;
                }
                GraphQL.prototype.componentWillReceiveProps = function (nextProps) {
                    if (!shouldResubscribe)
                        return;
                    this.setState({
                        resubscribe: shouldResubscribe(this.props, nextProps),
                    });
                };
                GraphQL.prototype.render = function () {
                    var _this = this;
                    var props = this.props;
                    var shouldSkip = mapPropsToSkip(props);
                    var opts = shouldSkip ? Object.create(null) : mapPropsToOptions(props);
                    if (!shouldSkip && !opts.variables && operation.variables.length > 0) {
                        opts.variables = calculateVariablesFromProps(operation, props, graphQLDisplayName, getDisplayName(WrappedComponent));
                    }
                    return (React.createElement(Subscription, __assign$5({}, opts, { displayName: graphQLDisplayName, skip: shouldSkip, subscription: document, shouldResubscribe: this.state.resubscribe }), function (_a) {
                        var data = _a.data, r = __rest$2(_a, ["data"]);
                        var _b, _c;
                        if (operationOptions.withRef) {
                            _this.withRef = true;
                            props = Object.assign({}, props, {
                                ref: _this.setWrappedInstance,
                            });
                        }
                        if (shouldSkip)
                            return React.createElement(WrappedComponent, __assign$5({}, props));
                        var result = Object.assign(r, data || {});
                        var name = operationOptions.name || 'data';
                        var childProps = (_b = {}, _b[name] = result, _b);
                        if (operationOptions.props) {
                            var newResult = (_c = {},
                                _c[name] = result,
                                _c.ownProps = props,
                                _c);
                            lastResultProps = operationOptions.props(newResult, lastResultProps);
                            childProps = lastResultProps;
                        }
                        return React.createElement(WrappedComponent, __assign$5({}, props, childProps));
                    }));
                };
                GraphQL.displayName = graphQLDisplayName;
                GraphQL.WrappedComponent = WrappedComponent;
                return GraphQL;
            }(GraphQLBase));
            return hoistNonReactStatics$2(GraphQL, WrappedComponent, {});
        };
    }

    function graphql(document, operationOptions) {
        if (operationOptions === void 0) { operationOptions = {}; }
        switch (parser(document).type) {
            case DocumentType.Mutation:
                return mutation(document, operationOptions);
            case DocumentType.Subscription:
                return subscribe(document, operationOptions);
            case DocumentType.Query:
            default:
                return query(document, operationOptions);
        }
    }

    var __extends$9 = (undefined && undefined.__extends) || (function () {
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
    var __assign$6 = (undefined && undefined.__assign) || function () {
        __assign$6 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$6.apply(this, arguments);
    };
    var invariant$8 = require('invariant');
    var hoistNonReactStatics$3 = require('hoist-non-react-statics');
    function getDisplayName$1(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
    function withApollo(WrappedComponent, operationOptions) {
        if (operationOptions === void 0) { operationOptions = {}; }
        var withDisplayName = "withApollo(" + getDisplayName$1(WrappedComponent) + ")";
        var WithApollo = (function (_super) {
            __extends$9(WithApollo, _super);
            function WithApollo(props) {
                var _this = _super.call(this, props) || this;
                _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
                return _this;
            }
            WithApollo.prototype.getWrappedInstance = function () {
                invariant$8(operationOptions.withRef, "To access the wrapped instance, you need to specify " + "{ withRef: true } in the options");
                return this.wrappedInstance;
            };
            WithApollo.prototype.setWrappedInstance = function (ref) {
                this.wrappedInstance = ref;
            };
            WithApollo.prototype.render = function () {
                var _this = this;
                return (React.createElement(ApolloConsumer, null, function (client) {
                    var props = Object.assign({}, _this.props, {
                        client: client,
                        ref: operationOptions.withRef ? _this.setWrappedInstance : undefined,
                    });
                    return React.createElement(WrappedComponent, __assign$6({}, props));
                }));
            };
            WithApollo.displayName = withDisplayName;
            WithApollo.WrappedComponent = WrappedComponent;
            return WithApollo;
        }(React.Component));
        return hoistNonReactStatics$3(WithApollo, WrappedComponent, {});
    }

    function getProps(element) {
        return element.props || element.attributes;
    }
    function isReactElement(element) {
        return !!element.type;
    }
    function isComponentClass(Comp) {
        return Comp.prototype && (Comp.prototype.render || Comp.prototype.isReactComponent);
    }
    function providesChildContext(instance) {
        return !!instance.getChildContext;
    }
    function walkTree(element, context, visitor, newContext) {
        if (newContext === void 0) { newContext = new Map(); }
        if (!element) {
            return;
        }
        if (Array.isArray(element)) {
            element.forEach(function (item) { return walkTree(item, context, visitor, newContext); });
            return;
        }
        if (isReactElement(element)) {
            if (typeof element.type === 'function') {
                var Comp = element.type;
                var props = Object.assign({}, Comp.defaultProps, getProps(element));
                var childContext_1 = context;
                var child = void 0;
                if (isComponentClass(Comp)) {
                    var instance_1 = new Comp(props, context);
                    Object.defineProperty(instance_1, 'props', {
                        value: instance_1.props || props,
                    });
                    instance_1.context = instance_1.context || context;
                    instance_1.state = instance_1.state || null;
                    instance_1.setState = function (newState) {
                        if (typeof newState === 'function') {
                            newState = newState(instance_1.state, instance_1.props, instance_1.context);
                        }
                        instance_1.state = Object.assign({}, instance_1.state, newState);
                    };
                    if (Comp.getDerivedStateFromProps) {
                        var result = Comp.getDerivedStateFromProps(instance_1.props, instance_1.state);
                        if (result !== null) {
                            instance_1.state = Object.assign({}, instance_1.state, result);
                        }
                    }
                    else if (instance_1.UNSAFE_componentWillMount) {
                        instance_1.UNSAFE_componentWillMount();
                    }
                    else if (instance_1.componentWillMount) {
                        instance_1.componentWillMount();
                    }
                    if (providesChildContext(instance_1)) {
                        childContext_1 = Object.assign({}, context, instance_1.getChildContext());
                    }
                    if (visitor(element, instance_1, newContext, context, childContext_1) === false) {
                        return;
                    }
                    child = instance_1.render();
                }
                else {
                    if (visitor(element, null, newContext, context) === false) {
                        return;
                    }
                    child = Comp(props, context);
                }
                if (child) {
                    if (Array.isArray(child)) {
                        child.forEach(function (item) { return walkTree(item, childContext_1, visitor, newContext); });
                    }
                    else {
                        walkTree(child, childContext_1, visitor, newContext);
                    }
                }
            }
            else if (element.type._context || element.type.Consumer) {
                if (visitor(element, null, newContext, context) === false) {
                    return;
                }
                var child = void 0;
                if (!!element.type._context) {
                    newContext = new Map(newContext);
                    newContext.set(element.type, element.props.value);
                    child = element.props.children;
                }
                else {
                    var value = element.type._currentValue;
                    if (newContext.has(element.type.Provider)) {
                        value = newContext.get(element.type.Provider);
                    }
                    child = element.props.children(value);
                }
                if (child) {
                    if (Array.isArray(child)) {
                        child.forEach(function (item) { return walkTree(item, context, visitor, newContext); });
                    }
                    else {
                        walkTree(child, context, visitor, newContext);
                    }
                }
            }
            else {
                if (visitor(element, null, newContext, context) === false) {
                    return;
                }
                if (element.props && element.props.children) {
                    React.Children.forEach(element.props.children, function (child) {
                        if (child) {
                            walkTree(child, context, visitor, newContext);
                        }
                    });
                }
            }
        }
        else if (typeof element === 'string' || typeof element === 'number') {
            visitor(element, null, newContext, context);
        }
    }

    var compose = require('lodash.flowright');

    exports.compose = compose;
    exports.getDataFromTree = getDataFromTree;
    exports.ApolloConsumer = ApolloConsumer;
    exports.ApolloProvider = ApolloProvider;
    exports.Query = Query;
    exports.Mutation = Mutation;
    exports.Subscription = Subscription;
    exports.graphql = graphql;
    exports.withApollo = withApollo;
    exports.RenderPromises = RenderPromises;
    exports.getMarkupFromTree = getMarkupFromTree;
    exports.walkTree = walkTree;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react-apollo.browser.umd.js.map