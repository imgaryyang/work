'use strict';

var React = require('react-native');
var TabBar = require('./TabBarIOS');
var NavBar = require('./NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var cssVar = require('cssVar');
var {
    Navigator,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    PixelRatio,
    StyleSheet,
} = React;

var Nav = React.createClass({
    statics: {
        title: 'Nav',
        description: '导航框架',
    },

    renderScene: function(route, navigator) {
        var Component = route.component;
        if (route.component) {
            return (
                <View style={[styles.scene]}>
                    <Component navigator={navigator} route={route} />
                    {route.hideNavBar === true ? null : React.createElement(NavBar, { navigator, route }) }
                </View>
            );
        }
    },

    render: function() {
        return (
            <Navigator
                debugOverlay={false}
                style={[{flex: 1}]}
                initialRoute={{
                    id: 'mainTab',
                    title: '管家',
                    component: TabBar,
                    hideNavBar: true,
                }}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.HorizontalSwipeJump;
                }}
                renderScene={this.renderScene} />
        );
    },
});

var styles = StyleSheet.create({
    scene: {
        flex: 1,
        backgroundColor: '#EAEAEA',
    },
});

module.exports = Nav;

