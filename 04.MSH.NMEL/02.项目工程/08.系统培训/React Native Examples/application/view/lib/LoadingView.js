/**
* LoadingView
*/
'use strict';

var React = require('react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');

var {
    TouchableWithoutFeedback,
    Animated,
    StyleSheet,
    Image,
    View,
    Easing
} = React;

var TIMES = 400;

var LoadingView = React.createClass({

    getInitialState() {
        return {
            angle: new Animated.Value(0),
            startAnimate: false,
        };
    },

    componentDidMount() {
    },

    componentWillReceiveProps: function(props) {
        if(props.startAnimate) {
            this.setState({startAnimate: true});
            this._animate();
        } else {
            this.setState({startAnimate: false});
            /*if(this._anim)
                this._anim.stop();*/
        }
    },

    _animate() {
        this.state.angle.setValue(0);
        this._anim = Animated.timing(this.state.angle, {
            toValue: 360*TIMES,
            duration: 1100*TIMES,
            easing: Easing.linear
        }).start(() => {
            if(this.state.startAnimate)
                this._animate();
            else {
                if(this._anim)
                    this._anim.stop();
                this.state.angle.setValue(0);
            }
        });
    },

    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[styles.rotateCard, {
                        transform: [
                            { rotate: this.state.angle.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}) }
                        ]
                    }]} >
                    <FAIcon 
                        name={'spinner'}
                        size={50}
                        color={'white'}
                        style={{
                            width: 50,
                            height: 50,
                        }} />
                </Animated.View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    rotateCard: {
        width:50,
        height:50,
        justifyContent:'center',
        backgroundColor:'transparent',
    }
});


module.exports = LoadingView;


