import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './NavBar.css';
function NavBar({
	nav,
	dispatch
}) {
	let {onBack,onForward,onHome,display,backDisabled,homeDisabled,title,} = nav;
	
	function backHandle(e) {
		if(onBack)onBack(e,dispatch);
		else defaultBack();
	}
	function forwardHandle(e) {
		if(onForward)onForward(e,dispatch);
		else defaultForward();
	}
	function homeHandle(e) {
		if(onForward)onForward(e,dispatch);
		else defaultHome();
	}
	function defaultBack(){
		 dispatch(routerRedux.goBack());
	}
	function defaultForward(){
		 dispatch(routerRedux.goBack());
	}
	function defaultHome(){
		dispatch(routerRedux.push({
			pathname: '/',
		}));
		/* if(window.history){
			 var length = 2-window.history.length;
			 dispatch(routerRedux.go(length));
			 //console.info('window.history : ',window.history.length);
		 }*/
	}
  
  return (
		<div className={styles.bar} style = {{height: _navBarHeight + 'rem'}} >
			<Button className={styles.backbtn} disabled={backDisabled} onClick={backHandle}>
      	<Icon type="left" />返回
      </Button>
      <Button className={styles.homebtn} disabled={homeDisabled} onClick={homeHandle}>
      	<Icon type="home" />回首页
      </Button>
      <div className={styles.titlewrap}>
      	<div className={styles.title}>{title}</div>
      </div>
		</div>
	);
};
export default connect(({nav})=>({nav}))(NavBar);
