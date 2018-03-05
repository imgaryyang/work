'use strict';
/**
 * IOS、Android均可使用的Loading
 */

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    ActivityIndicator,
    //ProgressBarAndroid,
} from 'react-native';

import * as Global  from '../Global';

import LoadingStore   from '../flux/LoadingStore';
import LoadingAction  from '../flux/LoadingAction';

export default class Loading extends Component {

    _spinnerObj = null;

    static displayName = 'Loading';
    static description = '载入遮罩';

    static propTypes = {
    };

    static defaultProps = {
    };

    state = {
        top: Global.getScreen().height,
        animating: false,
    };

    constructor (props) {
        super(props);
        this.onLoadingStoreChange = this.onLoadingStoreChange.bind(this);
    }

    componentDidMount () {
        //监听LoadingStore
        LoadingStore.listen(this.onLoadingStoreChange);
    }

    /**
     * 监听Loading信息变化
     */
    onLoadingStoreChange (visibility) {
        if(visibility) {
            this.setState({top: 0, animating: true});
        } else {
            this.setState({top: Global.getScreen().height, animating: false});
        }
    }

    render () {
        /*if(Global._os == 'ios') 
            this._spinnerObj = (<ActivityIndicatorIOS animating = {this.state.animating} color = 'white' size = 'small' style = {{height: 80}} />)
        else 
            this._spinnerObj = (<ProgressBarAndroid color = 'white' styleAttr = 'Normal' />)*/

        this._spinnerObj = <ActivityIndicator />
        
        return (
            <View style = {[styles.container, Global._styles.CENTER, {top: this.state.top}]}>
                <View style = {[styles.spinnerHolder, Global._styles.CENTER]} >
                    {this._spinnerObj}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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

