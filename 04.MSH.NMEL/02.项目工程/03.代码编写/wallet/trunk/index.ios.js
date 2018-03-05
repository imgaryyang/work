/**
 * el
 * powered by React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    StatusBarIOS,
} from 'react-native';

import RootNavigator    from './application/lib/nav/RootNavigator';
import CustomPrototypes from './application/utils/CustomPrototypes';

import Config           from './Config';
import * as Global      from './application/Global';

class el extends Component {

    state = {
        layouted: false,
        inited: false,
    }

    /**
    * 构造函数，声明初始化 state
    */
    constructor(props) {
        super(props);
        Global.setConfig(Config);
        //console.log('el.constructor()');
        this.onLayout = this.onLayout.bind(this);
    }

    /**
     * 系统初始化
     */
    async componentWillMount() {
        //console.log('el.componentWillMount() - befroe init()');
        await Global.init();
        this.setState({inited: true});
        //console.log('el.componentWillMount() - after init()');
    }

    /**
     * 初始化完成并且取到了第一次的layout参数后再渲染RootNavigator
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.inited && nextState.layouted)
            return true;
        else
            return false;
    }

    /**
    * 获取不同系统中可用屏幕宽度及高度
    */
    onLayout(e) {
        if(!this.state.layouted) {
            //console.log('el.onLayout() - befroe onLayout');
            Global.setLayoutScreen({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
            });
            this.setState({layouted: true});
            //console.log('el.onLayout() - after onLayout');
        }
    }

    render() {
        var child = this.state.layouted && this.state.inited ? (<RootNavigator />) : null;
        //console.log(child ? 'el.render() - render RootNavigator' : 'el.render() - render null child');
        return (
            <View style={{flex: 1}} onLayout={this.onLayout} >
                {child}
            </View>
        );
    }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('el', () => el);
