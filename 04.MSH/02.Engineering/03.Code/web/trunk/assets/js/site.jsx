"use strict";

import React from 'react';
import Link from './pages/site/Link.jsx';
import Banner from './pages/site/Banner.jsx';
import Page1 from './pages/site/Page1.jsx';
import Page2 from './pages/site/Page2.jsx';
import Page3 from './pages/site/Page3.jsx';
import Page4 from './pages/site/Page4.jsx';
import Promise from 'bluebird';
import '../styles/site/style';
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd';

import debounce from 'lodash.debounce';
import enquire from 'enquire.js';


export default class HomePage extends React.Component {
	constructor(props) {
	    super(props);

	    this.onScroll = debounce(() => {
	      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	      const clientHeight = document.documentElement.clientHeight;
	      if (scrollTop >= clientHeight) {
	        this.setState({ isFirstFrame: false });
	      } else {
	        this.setState({ isFirstFrame: true });
	      }
	    }, 100);

	    this.onDocumentClick = () => {
	      this.setState({
	        menuVisible: false,
	      });
	    };

	    this.state = {
	      menuVisible: false,
	      menuMode: 'horizontal',
	      isFirstFrame: true,
	    };
  }	
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);

    document.addEventListener('click', this.onDocumentClick);

    enquire.register('only screen and (min-width: 320px) and (max-width: 767px)', {
      match: () => {
        this.setState({ menuMode: 'inline' });
      },
      unmatch: () => {
        this.setState({ menuMode: 'horizontal' });
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('click', this.onDocumentClick);
  }

  // To store style which is only for Home and has conflicts with others.
  getStyle() {
    return `
      #react-content,
      #react-content > div {
        height: 100%;
      }
      .main-wrapper {
        background: transparent;
        width: auto;
        margin: 0;
        border-radius: 0;
        padding: 0;
        overflow: unset;
        display: inline;
        min-height: 600px;
      }
      #header {
        position: fixed;
        z-index: 999;
        background: rgba(0, 0, 0, 0.25);
        border-bottom: 1px solid transparent;
        transition: border .5s cubic-bezier(0.455, 0.03, 0.515, 0.955), background .5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
      }
      #header .ant-select-selection,
      #header .ant-menu {
        background: transparent;
      }
      #header.home-nav-white {
        background: rgba(255, 255, 255, 0.9);
        border-bottom-color: #EBEDEE;
      }
      .home-nav-white #search-box {
        border-left-color: #EBEDEE;
      }
      .home-nav-white #nav a {
        color: #666;
      }
      .nav-phone-icon:before {
        background: #eee;
        box-shadow: 0 7px 0 0 #eee, 0 14px 0 0 #eee;
      }
      .home-nav-white .nav-phone-icon:before {
        background: #777;
        box-shadow: 0 7px 0 0 #777, 0 14px 0 0 #777;
      }
      #lang,
      #nav a {
        color: #eee;
        transition: color 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
      }
      #search-box {
        border-left-color: rgba(235, 237, 238, .5);
        transition: border 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
      }
      section {
        height: 100%;
        width: 100%;
        background: #fff;
      }
      #footer {
        background: #000;
      }
      #footer,
      #footer h2 {
        color: #999;
      }
      #footer a {
        color: #eee;
      }
      .down {
        animation: upDownMove 1.2s ease-in-out infinite;
      }
    `;
  }

  render() {
  	
  	const menuStyle = {
      display: this.state.menuVisible ? 'block' : '',
    };

    const headerClassName = classNames({
      clearfix: true,
      'home-nav-white': !this.state.isFirstFrame,
    });

    return (
   		<div className="page-wrapper">
          <header id="header" className={headerClassName}>
	        <Row>
	          <Col lg={4} md={6} sm={7} xs={24}>
	            <Icon
	              className="nav-phone-icon"
	              type="menu"
	            />
	          </Col>
	          <Col className={`nav ${this.state.menuVisible ? 'nav-show' : 'nav-hide'}`}
	            lg={20} md={18} sm={17} xs={0} style={menuStyle}
	          >
	          </Col>
	        </Row>
	      </header>
          <div className="main-wrapper">
            <Link />
            <Banner />
            <Page1 />
            <Page2 />
            <Page3 />
            <Page4 />
            <style dangerouslySetInnerHTML={{ __html: this.getStyle() }} />
          </div>
          <footer id="footer">
	        <ul>
	          <li>
	            <div>©2016 内蒙科电数据出品</div>
	          </li>
	        </ul>
	      </footer>
        </div>
          
       
    );
  }
}

ReactDOM.render(<HomePage />,document.getElementById('react-content'));