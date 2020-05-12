var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import window from 'window-or-global';
import { Icon } from 'carbon-components-react';
import InteriorLeftNavList from '../InteriorLeftNavList';
import InteriorLeftNavItem from '../InteriorLeftNavItem';

var _ref2 = React.createElement(Icon, {
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
      activeHref: _this.props.activeHref || window.location && window.location.pathname,
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
        if (child.type === InteriorLeftNavList) {
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
      return React.createElement(InteriorLeftNavList, _extends({}, child.props, {
        key: key,
        ref: key,
        onListClick: _this.handleListClick,
        onItemClick: _this.handleItemClick,
        activeHref: _this.state.activeHref
      }));
    }, _this.buildNewItemChild = function (child, index) {
      var key = 'item-' + index;
      return React.createElement(InteriorLeftNavItem, _extends({}, child.props, {
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

      var newChildren = React.Children.map(children, function (child, index) {
        var newChild = void 0;
        if (child.type === InteriorLeftNavList) {
          newChild = _this2.buildNewListChild(child, index);
        } else if (child.type === InteriorLeftNavItem) {
          newChild = _this2.buildNewItemChild(child, index);
        } else {
          newChild = child;
        }

        return newChild;
      });

      var classNames = classnames('bx--interior-left-nav', 'bx--interior-left-nav--collapseable', {
        'bx--interior-left-nav--collapsed': !this.state.open
      }, className);

      var buttonStyles = {
        border: 'none'
      };

      return React.createElement(
        'nav',
        _extends({
          tabIndex: -1,
          'aria-label': 'Interior Left Navigation',
          className: classNames,
          onClick: !this.state.open ? this.toggle : function () {}
        }, other),
        React.createElement(
          'ul',
          { key: 'main_list', className: 'left-nav-list' },
          newChildren
        ),
        React.createElement(
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
}(Component);

InteriorLeftNav.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  activeHref: PropTypes.string,
  onToggle: PropTypes.func
};
InteriorLeftNav.defaultProps = {
  onToggle: function onToggle() {}
};
export default InteriorLeftNav;