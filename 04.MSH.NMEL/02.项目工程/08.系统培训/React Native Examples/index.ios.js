/**
 * iSEB
 * powered by React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Platform,
    View,
    StatusBarIOS,
} from 'react-native';

import RootNavigator from './application/view/RootNavigator';
import * as Global from './application/Global';

class iSEB extends React.Component {

    state = {
        layouted: false,
        inited: false,
    };

    /**
    * 构造函数，声明初始化 state
    */
    constructor(props) {
        super(props);
        console.log('iSEB.constructor()');
    }

    /**
     * 系统初始化
     */
    async componentWillMount() {
        console.log('iSEB.componentWillMount() - befroe init()');
        await Global.init();
        this.setState({inited: true});
        console.log('iSEB.componentWillMount() - after init()');
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
            console.log('iSEB.onLayout() - befroe onLayout');
            Global.setLayoutScreen({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
            });
            this.setState({layouted: true});
            console.log('iSEB.onLayout() - after onLayout');
        }
    }

    render() {
        var child = this.state.layouted && this.state.inited ? (<RootNavigator />) : null;
        console.log(child ? 'iSEB.render() - render RootNavigator' : 'iSEB.render() - render null child');
        return (
            <View style={{flex: 1}} onLayout={this.onLayout.bind(this)} >
                {child}
            </View>
        );
    }
}

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('iSEB', () => iSEB);
