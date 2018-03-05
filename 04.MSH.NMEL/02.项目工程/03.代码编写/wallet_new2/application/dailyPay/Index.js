/**
 * Created by liuyi on 2016/7/20.
 */
//日程缴费
'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    WebView,
} from 'react-native';

import * as Global  from '../Global';
import NavBar from '../store/common/TopNavBar';

const URL_DIAM = 'https://billcloud.unionpay.com/ccfront/loc/UP1900C/search?category=D1';
const URL_PHONE = 'https://billcloud.unionpay.com/ccfront/entry/query?category=I1&insId=9800_0000';
const URL_TV = 'https://billcloud.unionpay.com/ccfront/loc/UP1900C/search?category=I2';

class Index extends Component {

    static displayName = 'DailyPay';
    static description = '日常缴费';

    state = {
        doRenderScene: false,
        url: '',
        status: 'No Page Loaded',
        backButtonEnabled: false,
        forwardButtonEnabled: false,
        loading: true,
        scalesPageToFit: true,
    };

    constructor (props) {
        super(props);
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }

    onShouldStartLoadWithRequest() {
        return false;
    }

    _getWebView() {
        let uri = '';
        switch(this.props.type) {
            case 'dian' :
                uri = URL_DIAM;
                break;
            case 'phone' :
                uri = URL_PHONE;
                break;
            case 'tv' :
                uri = URL_TV;
                break;
        }

        if(uri){
            return <WebView
                ref="webview"
                source={{uri:uri}}
                style={{flex:1}}
                automaticallyAdjustContentInsets={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        }
        return null;
    }

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
        });
    }

    goBack() {
        this.refs['webview'].goBack();
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                {this._getWebView()}
            </View>
        );
    }

    _renderPlaceholderView () {
        return (
            <View style = {Global._styles.CONTAINER}>
                <ScrollView style={{flex:1}}>
                    {this._getNavBar()}
                </ScrollView>
            </View>
        );
    }

    _getNavBar () {
        return (
            <NavBar title = {this.props.title}
                    backFn = {()=>{
                        if(this.state.backButtonEnabled)
                            this.goBack();
                        else
                            this.props.navigator.pop();
                    }}
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {false}
                    hideBottomLine = {false} />
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
});

export default Index;