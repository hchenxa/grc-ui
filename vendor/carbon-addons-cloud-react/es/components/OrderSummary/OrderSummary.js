var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'carbon-components-react';

export var OrderSummary = function (_Component) {
  _inherits(OrderSummary, _Component);

  function OrderSummary() {
    _classCallCheck(this, OrderSummary);

    return _possibleConstructorReturn(this, (OrderSummary.__proto__ || Object.getPrototypeOf(OrderSummary)).apply(this, arguments));
  }

  _createClass(OrderSummary, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          other = _objectWithoutProperties(_props, ['children', 'className']);

      var classes = classNames('bx--order-summary', className);

      return React.createElement(
        'div',
        _extends({ className: classes }, other),
        children
      );
    }
  }]);

  return OrderSummary;
}(Component);

OrderSummary.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
export var OrderSummaryHeader = function (_Component2) {
  _inherits(OrderSummaryHeader, _Component2);

  function OrderSummaryHeader() {
    _classCallCheck(this, OrderSummaryHeader);

    return _possibleConstructorReturn(this, (OrderSummaryHeader.__proto__ || Object.getPrototypeOf(OrderSummaryHeader)).apply(this, arguments));
  }

  _createClass(OrderSummaryHeader, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          title = _props2.title,
          other = _objectWithoutProperties(_props2, ['children', 'className', 'title']);

      var classes = classNames('bx--order-header', className);

      return React.createElement(
        'section',
        _extends({ className: classes }, other),
        React.createElement(
          'p',
          { className: 'bx--order-header-title' },
          title
        ),
        children
      );
    }
  }]);

  return OrderSummaryHeader;
}(Component);

OrderSummaryHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string
};
OrderSummaryHeader.defaultProps = {
  title: 'Order Summary'
};
export var OrderSummaryList = function (_Component3) {
  _inherits(OrderSummaryList, _Component3);

  function OrderSummaryList() {
    _classCallCheck(this, OrderSummaryList);

    return _possibleConstructorReturn(this, (OrderSummaryList.__proto__ || Object.getPrototypeOf(OrderSummaryList)).apply(this, arguments));
  }

  _createClass(OrderSummaryList, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          children = _props3.children,
          className = _props3.className,
          other = _objectWithoutProperties(_props3, ['children', 'className']);

      var classes = classNames('bx--order-list', className);

      return React.createElement(
        'ul',
        _extends({ className: classes }, other),
        children
      );
    }
  }]);

  return OrderSummaryList;
}(Component);

OrderSummaryList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
export var OrderSummaryCategory = function (_Component4) {
  _inherits(OrderSummaryCategory, _Component4);

  function OrderSummaryCategory() {
    _classCallCheck(this, OrderSummaryCategory);

    return _possibleConstructorReturn(this, (OrderSummaryCategory.__proto__ || Object.getPrototypeOf(OrderSummaryCategory)).apply(this, arguments));
  }

  _createClass(OrderSummaryCategory, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          children = _props4.children,
          className = _props4.className,
          categoryText = _props4.categoryText,
          other = _objectWithoutProperties(_props4, ['children', 'className', 'categoryText']);

      var classes = classNames('bx--order-category', className);

      return React.createElement(
        'li',
        _extends({ className: classes }, other),
        React.createElement(
          'p',
          { className: 'bx--order-category-title' },
          categoryText
        ),
        React.createElement(
          'ul',
          null,
          children
        )
      );
    }
  }]);

  return OrderSummaryCategory;
}(Component);

OrderSummaryCategory.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  categoryText: PropTypes.string
};
OrderSummaryCategory.defaultProps = {
  categoryText: 'Category Label'
};
export var OrderSummaryListItem = function (_Component5) {
  _inherits(OrderSummaryListItem, _Component5);

  function OrderSummaryListItem() {
    _classCallCheck(this, OrderSummaryListItem);

    return _possibleConstructorReturn(this, (OrderSummaryListItem.__proto__ || Object.getPrototypeOf(OrderSummaryListItem)).apply(this, arguments));
  }

  _createClass(OrderSummaryListItem, [{
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          className = _props5.className,
          text = _props5.text,
          price = _props5.price,
          other = _objectWithoutProperties(_props5, ['className', 'text', 'price']);

      var classes = classNames('bx--order-item', className);

      return React.createElement(
        'li',
        _extends({ className: classes }, other),
        React.createElement(
          'div',
          { className: 'bx--order-detail' },
          text
        ),
        React.createElement(
          'p',
          { className: 'bx--order-price' },
          price
        )
      );
    }
  }]);

  return OrderSummaryListItem;
}(Component);

OrderSummaryListItem.propTypes = {
  className: PropTypes.string,
  text: PropTypes.node,
  price: PropTypes.string
};
OrderSummaryListItem.defaultProps = {
  text: 'Detail 1',
  price: '--'
};
export var OrderSummaryTotal = function (_Component6) {
  _inherits(OrderSummaryTotal, _Component6);

  function OrderSummaryTotal() {
    _classCallCheck(this, OrderSummaryTotal);

    return _possibleConstructorReturn(this, (OrderSummaryTotal.__proto__ || Object.getPrototypeOf(OrderSummaryTotal)).apply(this, arguments));
  }

  _createClass(OrderSummaryTotal, [{
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          children = _props6.children,
          className = _props6.className,
          summaryText = _props6.summaryText,
          summaryPrice = _props6.summaryPrice,
          summaryDetails = _props6.summaryDetails,
          other = _objectWithoutProperties(_props6, ['children', 'className', 'summaryText', 'summaryPrice', 'summaryDetails']);

      var classes = classNames('bx--order-total-container', className);

      return React.createElement(
        'section',
        _extends({ className: classes }, other),
        React.createElement(
          'div',
          { className: 'bx--order-total' },
          React.createElement(
            'p',
            { className: 'bx--order-total-text' },
            summaryText
          ),
          React.createElement(
            'p',
            { className: 'bx--order-total-price' },
            summaryPrice,
            React.createElement(
              'span',
              null,
              summaryDetails
            )
          )
        ),
        children
      );
    }
  }]);

  return OrderSummaryTotal;
}(Component);

OrderSummaryTotal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  summaryText: PropTypes.string,
  summaryPrice: PropTypes.string,
  summaryDetails: PropTypes.string
};
OrderSummaryTotal.defaultProps = {
  summaryText: 'Total due now:',
  summaryPrice: '$0.00',
  summaryDetails: 'estimated'
};
export var OrderSummaryFooter = function (_Component7) {
  _inherits(OrderSummaryFooter, _Component7);

  function OrderSummaryFooter() {
    _classCallCheck(this, OrderSummaryFooter);

    return _possibleConstructorReturn(this, (OrderSummaryFooter.__proto__ || Object.getPrototypeOf(OrderSummaryFooter)).apply(this, arguments));
  }

  _createClass(OrderSummaryFooter, [{
    key: 'render',
    value: function render() {
      var _props7 = this.props,
          className = _props7.className,
          footerText = _props7.footerText,
          linkText = _props7.linkText,
          href = _props7.href,
          target = _props7.target,
          rel = _props7.rel,
          other = _objectWithoutProperties(_props7, ['className', 'footerText', 'linkText', 'href', 'target', 'rel']);

      var classes = classNames('bx--order-footer', className);

      return React.createElement(
        'section',
        _extends({ className: classes }, other),
        React.createElement(
          'p',
          { className: 'bx--order-footer-text' },
          footerText
        ),
        '\xA0',
        React.createElement(
          Link,
          { href: href, target: target, rel: rel },
          linkText
        )
      );
    }
  }]);

  return OrderSummaryFooter;
}(Component);
OrderSummaryFooter.propTypes = {
  className: PropTypes.string,
  linkText: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string
};
OrderSummaryFooter.defaultProps = {
  footerText: 'Need Help?',
  linkText: 'Contact Bluemix Sales',
  href: '',
  target: '_blank',
  rel: 'noreferrer noopener'
};