'use strict';

import * as Global  from '../../Global';
import TimerMixin   from 'react-timer-mixin';

import React, {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Easing,
    PropTypes,
} from 'react-native';

let styles = {
    toastContainer: {
        position: 'absolute',
        width: Global.getScreen().width - 200,
        left: 100,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    msgContainer: {
        backgroundColor: 'rgba(0,0,0,.7)',
        borderRadius: 5,
        padding: 10,
        width: Global.getScreen().width - 200,
        marginBottom: 10,
    },
    msgText: {
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
};

var Toast = React.createClass({

    mixins: [TimerMixin],

    propTypes: {
        //msgs: React.PropTypes.string,
    },

    getInitialState: function() {
        return {
            msgs: [],
            tcTop: Global.getScreen().height,
        };
    },

    componentWillReceiveProps: function(props) {
        if(props.msgs) {
            this.setState({
                msgs: props.msgs,
            });
            if(props.msgs.length > 0)
                this.setState({tcTop: 120});
            else
                this.setState({tcTop: Global.getScreen().height});
        }
    },

    render: function() {
        let msgs = this.state.msgs.map((msg, idx) => {
            return (
                <View key={idx} style={[styles.msgContainer, Global.styles.CENTER]} >
                    <Text style={styles.msgText} >{msg}</Text>
                </View>
            );
        });
        return (
            <View style={[styles.toastContainer, {top: this.state.tcTop}]} >
                {msgs}
            </View>
        );
    },

});

module.exports = Toast;
