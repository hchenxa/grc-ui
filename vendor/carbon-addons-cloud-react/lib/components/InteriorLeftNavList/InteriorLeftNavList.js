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

var _InteriorLeftNavItem = require('../InteriorLeftNavItem');

var _InteriorLeftNavItem2 = _interopRequireDefault(_InteriorLeftNavItem);

var _carbonComponentsReact = require('carbon-components-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteriorLeftNavList = function (_Component) {
  _inherits(InteriorLeftNavList, _Component);

  function InteriorLeftNavList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InteriorLeftNavList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InteriorLeftNavList.__proto__ || Object.getPrototypeOf(InteriorLeftNavList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      open: _this.props.open
    }, _this.toggle = function (evt) {
      if (evt.which === 13 || evt.which === 32 || evt.type === 'click') {
        if (!_this.state.open) {
          _this.props.onListClick(_this.props.id);
        }
        _this.setState({ open: !_this.state.open });
      }
    }, _this.close = function () {
      return _this.state.open && _this.setState({ open: false });
    }, _this.buildNewItemChild = function (child, index) {
      var _this$props = _this.props,
          onItemClick = _this$props.onItemClick,
          activeHref = _this$props.activeHref;


      var key = 'listitem-' + index;
      return _react2.default.createElement(_InteriorLeftNavItem2.default, _extends({}, child.props, {
        key: key,
        onClick: onItemClick,
        activeHref: activeHref,
        tabIndex: _this.state.open ? 0 : -1,
        onFocus: function onFocus() {
          return _this.setState({ open: true });
        }
      }));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InteriorLeftNavList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          tabIndex = _props.tabIndex,
          title = _props.title,
          children = _props.children,
          className = _props.className,
          iconDescription = _props.iconDescription,
          id = _props.id,
          onListClick = _props.onListClick,
          onItemClick = _props.onItemClick,
          activeHref = _props.activeHref;


      var classNames = (0, _classnames2.default)('left-nav-list__item', 'left-nav-list__item--has-children', {
        'left-nav-list__item--expanded': this.state.open
      }, className);

      var newChildren = _react2.default.Children.map(children, function (child, index) {
        return _this2.buildNewItemChild(child, index);
      });

      return _react2.default.createElement(
        'li',
        {
          className: classNames,
          tabIndex: tabIndex,
          onClick: this.toggle,
          onKeyPress: this.toggle },
        _react2.default.createElement(
          'div',
          { className: 'left-nav-list__item-link', id: id },
          title,
          _react2.default.createElement(
            'div',
            { className: 'left-nav-list__item-icon' },
            _react2.default.createElement(_carbonComponentsReact.Icon, {
              name: 'chevron--down',
              description: iconDescription,
              className: 'left-nav-list__item-icon bx--interior-left-nav__icon'
            })
          )
        ),
        _react2.default.createElement(
          'ul',
          { className: 'left-nav-list left-nav-list--nested', 'aria-label': title },
          newChildren
        )
      );
    }
  }]);

  return InteriorLeftNavList;
}(_react.Component);

InteriorLeftNavList.propTypes = {
  className: _propTypes2.default.string,
  children: _propTypes2.default.node,
  tabIndex: _propTypes2.default.number,
  title: _propTypes2.default.string,
  open: _propTypes2.default.bool,
  onListClick: _propTypes2.default.func,
  onItemClick: _propTypes2.default.func,
  activeHref: _propTypes2.default.string,
  iconDescription: _propTypes2.default.string,
  id: _propTypes2.default.string,
  isExpanded: _propTypes2.default.bool
};
InteriorLeftNavList.defaultProps = {
  title: 'Provide title',
  open: false,
  tabIndex: 0,
  activeHref: '#',
  iconDescription: 'display sub navigation items',
  onListClick: /* istanbul ignore next */function onListClick() {},
  onItemClick: /* istanbul ignore next */function onItemClick() {},
  isExpanded: false
};
exports.default = InteriorLeftNavList;