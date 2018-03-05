'use strict';

var React = require('react-native');
var TabView = require('./TabViewAndroid');
var {
    Navigator,
    View,
    StyleSheet,
} = React;

var Nav = React.createClass({
    statics: {
        title: 'Nav',
        description: '导航框架',
    },

    renderScene: function(route, navigator) {
        //console.log(route.component);
        if (route.component) {
            return (
                <View style={[styles.scene]}>
                {React.createElement(route.component, { navigator })}
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
                    component: TabView,
                }}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FadeAndroid;
                }}
                renderScene={this.renderScene} />
        );
    },
});

var styles = StyleSheet.create({
    scene: {
        flex: 1,
        //paddingTop: 50,
    },
});

module.exports = Nav;

