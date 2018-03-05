/**
 * 民生钱包
 *
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import RootNavigator from './application/lib/nav/RootNavigator';
import CustomPrototypes from './application/utils/CustomPrototypes';

class wallet extends Component {

    state = {
        layouted: false,
        inited: false,
    }

    constructor(props) {
        super(props);
        this.onLayout = this.onLayout.bind(this);
    }

    async componentWillMount() {
        // await Global.init();
        this.setState({inited: true});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.inited && nextState.layouted)
            return true;
        else
            return false;
    }

    onLayout(e) {
        if(!this.state.layouted) {
/*            Global.setLayoutScreen({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
            });*/
            this.setState({layouted: true});
        }
    }

    render() {
        var child = this.state.layouted && this.state.inited ? (<RootNavigator />) : null;
        return (
            <View style={{flex: 1}} onLayout={this.onLayout} >
                {child}
            </View>
        );
    }
}

AppRegistry.registerComponent('wallet', () => wallet);
