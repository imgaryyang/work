"use strict";

import React from 'react';
import Page1 from './pages/site/LoginPage.jsx';
import '../styles/site/style';
import { Row, Col, Icon } from 'antd';

export default class HomePage extends React.Component {
	constructor(props) {
	    super(props);
	}	

  // To store style which is only for Home and has conflicts with others.
  getStyle() {
    return `
      #react-content,
      #react-content > div {
    	  width : 100%;
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
    return (
   		<div className="page-wrapper">
          <div className="main-wrapper">
            <Page1 />
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