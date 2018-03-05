

'use strict';

import {Route, Router,RouterContext,useRouterHistory} from 'react-router';
import { Component} from 'react';
import Master from './pages/master.jsx';
import createHashHistory from 'history/lib/createHashHistory';
import { Modal, Button } from 'antd';
const history = useRouterHistory(createHashHistory)({ queryKey: false });
const cmpRequire = function (uri) {
	  if (uri) {
	    return require('./pages' + uri);
	  }else{return null}
};
class AppRoutes extends Component {

	  constructor (props) {
	    super(props);
	  }
	  
	  getRouteComponent(route,nextState, cb){
		  let ui = cmpRequire(route.menu.url);
		  if(ui)cb(null, ui);
	  }
	  render () {// indexRoute={{component: Home}}
		  var scope = this;
		  var result =   (
	    		<Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
		    		<Route path="/" modules={this.props.modules} component={Master}>
		    		{
		    			this.props.routes.map(function (route,mindex) {
		    				return (
		    						<Route key={mindex} path={route.path} menu={route.menu} getComponent={scope.getRouteComponent.bind(scope,route)}>
				    				{
				    					route.children.map(function (subRoute,nindex) {
				    						return (
				    							<Route key={nindex} path={subRoute.path} menu={subRoute.menu} getComponent={scope.getRouteComponent.bind(scope,subRoute)}></Route>
				    						)
				    		    		})
				    	    		}	
				    				</Route>
				    		)
			    		})
		    		}	
		    		</Route>
		    	</Router>
		  );
		  return result;
	  }
}

window._handler_402 = function(resp,msg,t){
	console.log(arguments);
	Modal.warning({
	    title: '警告',
	    content: '您尚未登录或已超时，系统将跳转至登录页面。',
	    onOk : function(){
	    	document.location.href= "login";
	    }
	});
	
	return false;
}

window._handler_502 = function(resp,msg,t){
	console.log(arguments);
	Modal.error({
	    title: '错误',
	    content: '"服务异常，请联系客服"',
	  });
	return false;
}
module.exports = AppRoutes;










