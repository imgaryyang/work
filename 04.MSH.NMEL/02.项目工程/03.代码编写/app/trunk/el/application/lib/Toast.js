'use strict';

/**
 * IOS、Android均可使用的Toast
 */

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Animated,
} from 'react-native';

import * as Global  from '../Global';

import ToastStore   from '../flux/ToastStore';
import ToastAction  from '../flux/ToastAction';

export default class Toast extends Component {

    _timer = null;

    static displayName = 'Toast';
    static description = '用户登录';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        msg: '',
        fadeAnim: new Animated.Value(0),
    };

    constructor (props) {
        super(props);
        this.onToastStoreChange = this.onToastStoreChange.bind(this);
    }

    componentDidMount () {
        //监听ToastStore
        ToastStore.listen(this.onToastStoreChange);
    }

    /**
     * 监听toast信息变化
     */
    onToastStoreChange (msg) {
        this.setState({msg: msg}, () => {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 1,
                    duration: 300,
                }
            ).start(() => {
                this._timer = setTimeout(
                    () => {
                        Animated.timing(
                            this.state.fadeAnim,
                            {
                                toValue: 0,
                                duration: 300,
                            }
                        ).start(() => this.setState({msg: ''}));
                    },
                    2000
                );
            });
        });
    }

    render () {
        return (
            <Animated.View style = {[styles.toastContainer, {top: this.state.msg ? 120 : Global.getScreen().height, opacity: this.state.fadeAnim}]} >
                <View style = {[styles.msgContainer, Global._styles.CENTER]} >
                    <Text style = {styles.msgText} >{this.state.msg}</Text>
                </View>
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        width: Global.getScreen().width - 200,
        left: 100,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    msgContainer: {
        backgroundColor: 'rgba(0,0,0,.5)',
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
});

