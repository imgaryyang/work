'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
  Dimensions,
  TabBarIOS,
  StyleSheet,
} from 'react-native';


import Home     from '../../Home';
import Wallet   from '../../wallet/CardList';
import Store    from '../../store/Index';
import Me       from '../../profile/UserHome';

export default class TabBar extends Component {
 constructor(props) {
        super(props);
        this.state = {
          selectedTab: 'homeTab',
        };
    }
	render() {
		return (
			<TabBarIOS 
					style = {[styles.tabBar]} 
					tintColor = "#f54646" 
					barTintColor = "white">

					<TabBarIOS.Item
						icon = {require('../../res/images/base/nav-icon/tab_home.png')}
						selectedIcon = {require('../../res/images/base/nav-icon/tab_home_pre.png')}
						title = "首页"
						selected = {this.state.selectedTab === 'homeTab'}
						onPress = {() => {
							this.setState({
								selectedTab: 'homeTab',
								NavTitle: '首页',
							});
							this.NavTitle = '首页';
						}}>
						<Home runInTab = {true} {...this.props} />
					</TabBarIOS.Item>

					<TabBarIOS.Item
						icon = {require('../../res/images/base/nav-icon/tab_wallet.png')}
						selectedIcon = {require('../../res/images/base/nav-icon/tab_wallet_pre.png')}
						title = "钱包"
						selected = {this.state.selectedTab === 'cardTab'}
						onPress = {() => {
							this.setState({
								selectedTab: 'cardTab',
								NavTitle: '钱包',
							});
							this.NavTitle = '钱包';
						}}>
						<Wallet runInTab = {true} {...this.props} />
					</TabBarIOS.Item>

					<TabBarIOS.Item
						icon = {require('../../res/images/base/nav-icon/tab_shop.png')}
						selectedIcon = {require('../../res/images/base/nav-icon/tab_shop_pre.png')}
						title = "商城"
						selected = {this.state.selectedTab === 'billTab'}
						onPress = {() => {
							this.setState({
								selectedTab: 'billTab',
								NavTitle: '商城',
							});
							this.NavTitle = '商城';
						}}>
						<Store runInTab = {true} {...this.props} />
					</TabBarIOS.Item>

					<TabBarIOS.Item
						icon = {require('../../res/images/base/nav-icon/tab_man.png')}
						selectedIcon = {require('../../res/images/base/nav-icon/tab_man_pre.png')}
						title = "我"
						selected = {this.state.selectedTab === 'meTab'}
						onPress = {() => {
							this.setState({
								selectedTab: 'meTab',
								NavTitle: '我',
							});
							this.NavTitle = '我';
						}}>
						<Me runInTab = {true} {...this.props} />
					</TabBarIOS.Item>

				</TabBarIOS>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    }
});
