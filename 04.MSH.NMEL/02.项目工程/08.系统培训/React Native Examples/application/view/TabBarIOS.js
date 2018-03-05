/**
 * 主TabBar导航
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var MngIdx = require('./mng/MngIdx');
var Assets = require('./assets/Assets');
var Credit = require('./credit/Credit');
var Invest = require('./invest/Invest');
var Me = require('./me/Me');

var {
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
} = React;

var TabBar = React.createClass({

    statics: {
        title: '<TabBarIOS>',
        description: 'Tab-based navigation.',
    },

    getInitialState: function() {
        return {
            selectedTab: 'mngTab',
            notifCount: 0,
            presses: 0,
            USER_LOGIN_INFO: this.props.USER_LOGIN_INFO,
        };
    },

    componentWillReceiveProps: function(props) {
        this.setState({USER_LOGIN_INFO: props.USER_LOGIN_INFO});
    },

    render: function() {
        return (
            <TabBarIOS 
                style={[styles.tabBar]} 
                tintColor="#007aff" 
                barTintColor="white">

                <Icon.TabBarItem
                    iconName="ios-navigate-outline"
                    selectedIconName="ios-navigate"
                    iconSize={25} 
                    title="管家"
                    selected={this.state.selectedTab === 'mngTab'}
                    onLayout={(e) => {console.log(e.nativeEvent.layout)}}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'mngTab',
                            NavTitle: '管家',
                        });
                        this.NavTitle = '管家';
                    }}>
                    <MngIdx 
                        navigator={this.props.navigator} 
                        route={this.props.route} 
                        USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                        showLoading={this.props.showLoading} 
                        hideLoading={this.props.hideLoading} 
                        toast={this.props.toast} 
                        refreshUser={this.props.refreshUser} 
                        showRNKeyboard={this.props.showRNKeyboard} 
                        hideRNKeyboard={this.props.hideRNKeyboard} 
                        showModal={this.props.showModal}
                        hideModal={this.props.hideModal}
                    />
                </Icon.TabBarItem>

                <Icon.TabBarItem
                    iconName="ios-briefcase-outline"
                    selectedIconName="ios-briefcase"
                    iconSize={24} 
                    title="资产"
                    selected={this.state.selectedTab === 'assetsTab'}
                    onLayout={(e) => {console.log(e.nativeEvent.layout)}}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'assetsTab',
                            NavTitle: '资产',
                        });
                        this.NavTitle = '资产';
                    }}>
                    <Assets 
                        navigator={this.props.navigator} 
                        route={this.props.route} 
                        USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                        showLoading={this.props.showLoading} 
                        hideLoading={this.props.hideLoading} 
                        toast={this.props.toast} 
                        refreshUser={this.props.refreshUser} 
                        showRNKeyboard={this.props.showRNKeyboard} 
                        hideRNKeyboard={this.props.hideRNKeyboard} 
                        showModal={this.props.showModal}
                        hideModal={this.props.hideModal}
                    />
                </Icon.TabBarItem>

                <Icon.TabBarItem
                    iconName="ios-analytics-outline"
                    selectedIconName="ios-analytics"
                    iconSize={24} 
                    title="融资"
                    selected={this.state.selectedTab === 'creditTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'creditTab',
                            NavTitle: '融资',
                        });
                        this.NavTitle = '融资';
                    }}>
                    <Credit 
                        navigator={this.props.navigator} 
                        route={this.props.route} 
                        USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                        showLoading={this.props.showLoading} 
                        hideLoading={this.props.hideLoading} 
                        toast={this.props.toast} 
                        refreshUser={this.props.refreshUser} 
                        showRNKeyboard={this.props.showRNKeyboard} 
                        hideRNKeyboard={this.props.hideRNKeyboard} 
                        showModal={this.props.showModal}
                        hideModal={this.props.hideModal}
                    />
                </Icon.TabBarItem>

                <Icon.TabBarItem
                    iconName="ios-box-outline"
                    selectedIconName="ios-box"
                    iconSize={30} 
                    title="理财"
                    selected={this.state.selectedTab === 'investTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'investTab',
                            NavTitle: '理财',
                        });
                        this.NavTitle = '理财';
                    }}>
                    <Invest 
                        navigator={this.props.navigator} 
                        route={this.props.route} 
                        USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                        showLoading={this.props.showLoading} 
                        hideLoading={this.props.hideLoading} 
                        toast={this.props.toast} 
                        refreshUser={this.props.refreshUser} 
                        showRNKeyboard={this.props.showRNKeyboard} 
                        hideRNKeyboard={this.props.hideRNKeyboard} 
                        showModal={this.props.showModal}
                        hideModal={this.props.hideModal}
                    />
                </Icon.TabBarItem>

                <Icon.TabBarItem
                    iconName="ios-person-outline"
                    selectedIconName="ios-person"
                    iconSize={30} 
                    title="我"
                    selected={this.state.selectedTab === 'meTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'meTab',
                            NavTitle: '我',
                        });
                        this.NavTitle = '我';
                    }}>
                    <Me 
                        navigator={this.props.navigator} 
                        route={this.props.route} 
                        USER_LOGIN_INFO={this.state.USER_LOGIN_INFO} 
                        showLoading={this.props.showLoading} 
                        hideLoading={this.props.hideLoading} 
                        toast={this.props.toast} 
                        refreshUser={this.props.refreshUser} 
                        showRNKeyboard={this.props.showRNKeyboard} 
                        hideRNKeyboard={this.props.hideRNKeyboard} 
                        showModal={this.props.showModal}
                        hideModal={this.props.hideModal}
                    />
                </Icon.TabBarItem>

            </TabBarIOS>
        );
    }
});

var styles = StyleSheet.create({
    tabBar: {
        flex: 1,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

module.exports = TabBar;
