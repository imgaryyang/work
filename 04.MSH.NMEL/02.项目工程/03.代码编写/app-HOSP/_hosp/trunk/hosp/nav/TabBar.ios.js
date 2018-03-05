/**
 * 主TabBar导航
 */
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TabBarIOS,
    NavigatorIOS,
    Navigator,
    TouchableOpacity,
    PixelRatio,
} from 'react-native';

import * as Global      from 'elapp/Global';

import Home             from '../Home';
import OutpatientGuidanceList from 'elapp/elh/outpatient/OutpatientGuidanceList';
import Bill             from 'elapp/el/bill/BillList';
import Me               from '../me/Me';

export default class TabBar extends Component {

    static displayName = 'TabBarIOS';
    static description = 'Tab-based navigation';

    state = {
        selectedTab: 'homeTab',
        notifCount: 0,
        presses: 0,
    };

    render () {
        return (
            <TabBarIOS 
                style = {[styles.tabBar]} 
                tintColor = "#007aff" 
                barTintColor = "white">

                <TabBarIOS.Item
                    icon = {require('../res/images/base/ios-nav-icon/home.png')}
                    selectedIcon = {require('../res/images/base/ios-nav-icon/home-active.png')}
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
                    icon = {require('../res/images/base/ios-nav-icon/guidance.png')}
                    selectedIcon = {require('../res/images/base/ios-nav-icon/guidance-active.png')}
                    title = "导诊"
                    selected = {this.state.selectedTab === 'guidanceTab'}
                    onPress = {() => {
                        this.setState({
                            selectedTab: 'guidanceTab',
                            NavTitle: '导诊',
                        });
                        this.NavTitle = '导诊';
                    }}>
                    <OutpatientGuidanceList runInTab = {true} hideBackButton = {true} {...this.props} />
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    icon = {require('../res/images/base/ios-nav-icon/bill.png')}
                    selectedIcon = {require('../res/images/base/ios-nav-icon/bill-active.png')}
                    title = "账单"
                    selected = {this.state.selectedTab === 'billTab'}
                    onPress = {() => {
                        this.setState({
                            selectedTab: 'billTab',
                            NavTitle: '账单',
                        });
                        this.NavTitle = '账单';
                    }}>
                    <Bill runInTab = {true} {...this.props} />
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    icon = {require('../res/images/base/ios-nav-icon/me.png')}
                    selectedIcon = {require('../res/images/base/ios-nav-icon/me-active.png')}
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
    },
});


