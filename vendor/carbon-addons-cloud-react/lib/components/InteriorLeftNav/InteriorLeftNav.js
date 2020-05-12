'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _windowOrGlobal = require('window-or-global');

var _windowOrGlobal2 = _interopRequireDefault(_windowOrGlobal);

var _carbonComponentsReact = require('carbon-components-react');

var _InteriorLeftNavList = require('../InteriorLeftNavList');

var _InteriorLeftNavList2 = _interopRequireDefault(_InteriorLeftNavList);

var _InteriorLeftNavItem = require('../InteriorLeftNavItem');

var _InteriorLeftNavItem2 = _interopRequireDefault(_InteriorLeftNavItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ref2 = _react2.default.createElement(_carbonComponentsReact.Icon, {
  name: 'chevron--left',
  description: 'close/open iln',
  className: 'bx--interior-left-nav-collapse__arrow'
});

var InteriorLeftNav = function (_Component) {
  _inherits(InteriorLeftNav, _Component);

  function InteriorLeftNav() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InteriorLeftNav);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InteriorLeftNav.__proto__ || Object.getPrototypeOf(InteriorLeftNav)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      activeHref: _this.props.activeHref || _windowOrGlobal2.default.location && _windowOrGlobal2.default.location.pathname,
      open: true
    }, _this.componentWillReceiveProps = function (nextProps) {
      if (nextProps.activeHref) {
        _this.setState({ activeHref: nextProps.activeHref });
      }
    }, _this.handleItemClick = function (evt, href) {
      evt.stopPropagation();

      // 13 = Enter, 32 = Spacebar
      var acceptableEvent = evt.which === 13 || evt.which === 32 || evt.type === 'click';
      var diffHref = href !== _this.state.activeHref;
      if (acceptableEvent && diffHref) {
        _this.setState({ activeHref: href });
      }
    }, _this.handleListClick = function (id) {
      _this.props.children.forEach(function (child, index) {
        if (child.type === _InteriorLeftNavList2.default) {
          var childId = 'list-' + index;
          if (childId !== id && !child.props.isExpanded) {
            _this.refs[childId].close();
          }
        }
      });
    }, _this.toggle = function (evt) {
      evt.stopPropagation();
      _this.props.onToggle(!_this.state.open);
      _this.setState({ open: !_this.state.open });
    }, _this.buildNewListChild = function (child, index) {
      var key = 'list-' + index;
      return _react2.default.createElement(_InteriorLeftNavList2.default, _extends({}, child.props, {
        key: key,
        ref: key,
        onListClick: _this.handleListClick,
        onItemClick: _this.handleItemClick,
        activeHref: _this.state.activeHref
      }));
    }, _this.buildNewItemChild = function (child, index) {
      var key = 'item-' + index;
      return _react2.default.createElement(_InteriorLeftNavItem2.default, _extends({}, child.props, {
        key: key,
        onClick: _this.handleItemClick,
        activeHref: _this.state.activeHref
      }));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InteriorLeftNav, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          className = _props.className,
          children = _props.children,
          activeHref = _props.activeHref,
          onToggle = _props.onToggle,
          other = _objectWithoutProperties(_props, ['className', 'children', 'activeHref', 'onToggle']);

      var newChildren = _react2.default.Children.map(children, function (child, index) {
        var newChild = void 0;
        if (child.type === _InteriorLeftNavList2.default) {
          newChild = _this2.buildNewListChild(child, index);
        } else if (child.type === _InteriorLeftNavItem2.default) {
          newChild = _this2.buildNewItemChild(child, index);
        } else {
          newChild = child;
        }

        return newChild;
      });

      var classNames = (0, _classnames2.default)('bx--interior-left-nav', 'bx--interior-left-nav--collapseable', {
        'bx--interior-left-nav--collapsed': !this.state.open
      }, className);

      var buttonStyles = {
        border: 'none'
      };

      return _react2.default.createElement(
        'nav',
        _extends({
          tabIndex: -1,
          'aria-label': 'Interior Left Navigation',
          className: classNames,
          onClick: !this.state.open ? this.toggle : function () {}
        }, other),
        _react2.default.createElement(
          'ul',
          { key: 'main_list', className: 'left-nav-list' },
          newChildren
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'bx--interior-left-nav-collapse',
            onClick: this.toggle,
            style: buttonStyles },
          _ref2
        )
      );
    }
  }]);

  return InteriorLeftNav;
}(_react.Component);

InteriorLeftNav.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  activeHref: _propTypes2.default.string,
  onToggle: _propTypes2.default.func
};
InteriorLeftNav.defaultProps = {
  onToggle: function onToggle() {}
};
exports.default = InteriorLeftNav;