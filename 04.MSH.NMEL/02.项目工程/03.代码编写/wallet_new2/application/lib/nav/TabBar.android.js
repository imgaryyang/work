/* Android 使用的TabBar */
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Dimensions,
} from 'react-native';

import ScrollableTabView    from 'react-native-scrollable-tab-view';
import TabBar               from './TabViewTabBar';

import Home     from '../../Home';
import Wallet   from '../../wallet/CardList';
import Store    from '../../store/Index';
import Me       from '../../profile/UserHome';

export default class TabView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            USER_LOGIN_INFO: null,
        }
    }

    onTabItemPress(name) {
        this.setState({
            selected: name
        });
    }

    componentWillReceiveProps(props) {

    }

    render() {
        var state = this.state;
        return (
            <ScrollableTabView
                tabBarPosition='bottom'
                locked={true}
                edgeHitWidth={Dimensions.get('window').width / 2}
                renderTabBar={() => <TabBar />}
            >
                <Home runInTab={true} tabLabel="首页|tab_home|tab_home_pre"    {...this.props} />
                <Wallet runInTab={true} tabLabel="钱包|tab_wallet|tab_wallet_pre" {...this.props} />
                <Store runInTab={true} tabLabel="商城|tab_shop|tab_shop_pre"    {...this.props} />
                <Me runInTab={true} tabLabel="我|tab_man|tab_man_pre"        {...this.props} />
            </ScrollableTabView>
        );
    }
}

