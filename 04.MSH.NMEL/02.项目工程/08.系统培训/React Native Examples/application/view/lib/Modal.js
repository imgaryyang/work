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
    InteractionManager,
} = React;

var Modal = React.createClass({

    getStyles() {
        return StyleSheet.create({
            container: {
                width: Global.getScreen().width,
                height: Global.getScreen().height,
                position: 'absolute',
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, .25)',
                overflow: 'hidden',
            },
        });
    },

    getInitialState() {
        return {
            top: new Animated.Value(Global.getScreen().height),
            animating: false,
            comp: null,
            animated: false,
        };
    },

    componentDidMount: function() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({animated: true});
        });
    },

    show: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    hide: function() {
        Animated.timing(
            this.state.top,
            {
                toValue: Global.getScreen().height,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                delay: 0,
            },
        ).start();
    },

    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps: function(props) {
        if(props.show) {
            this.show();
        } else {
            this.hide();
        }
        this.setState({comp: props.comp});
    },

    render() {
        var comp = null;
        if(this.state.animated)
            comp = this.state.comp ? this.state.comp : this.props.children;
        return (
            <Animated.View style={[this.getStyles().container, Global.styles.CENTER, {top: this.state.top}]}>
                {comp}
            </Animated.View>
        );
    },
});

module.exports = Modal;
