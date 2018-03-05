'use strict';

var React = require('react-native');
var Global = require('../../Global');

var {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Easing,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
} = React;

var Loading = React.createClass({

    _spinnerObj : null,

    getInitialState() {
        return {
            top: Global.getScreen().height,
            animating: false,
        };
    },

    /*show: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },*/

    /*hide: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: Global.getScreen().height,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },*/

    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps: function(props) {
        if(props.show) {
            //this.show();
            this.setState({top: 0, animating: true});
        } else {
            //this.hide();
            this.setState({top: Global.getScreen().height, animating: false});
        }
    },

    render() {
        if(Global.os == 'ios') 
            this._spinnerObj = (<ActivityIndicatorIOS animating={this.state.animating} color='white' size='small' style={{height: 80}} />)
        else 
            this._spinnerObj = (<ProgressBarAndroid color='white' styleAttr='Normal' />)
        return (
            <View style={[styles.container, Global.styles.CENTER, {top: this.state.top}]}>
                {/*<Image
                  style={{width: 50, height: 50}}
                  source={require('../../res/images/loading2.png')} />*/}
                {/*<LoadingView />*/}
                <View style={[styles.spinnerHolder, Global.styles.CENTER]} >
                    {this._spinnerObj}
                </View>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        width: Global.getScreen().width,
        height: Global.getScreen().height,
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .25)',
        overflow: 'hidden',
    },

    spinnerHolder: {
        top: -50,
        backgroundColor: 'rgba(0, 0, 0, .35)',
        borderRadius: 6,
        width: 50,
        height: 50,
    },
});

module.exports = Loading;
