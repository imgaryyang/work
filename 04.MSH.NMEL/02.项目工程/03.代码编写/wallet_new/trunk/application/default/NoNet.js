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
	PixelRatio,
} from 'react-native';

import * as Global  from '../Global';
import NavBar       from '../store/common/TopNavBar';

export default  class NoNet extends Component {
    static displayName = 'NoNet';
    static description = '没有网络';
    render() {

        return (
            <View style={[Global._styles.CONTAINER, {backgroundColor: '#fff'}]}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.head}>
                        <Image style={styles.headImg}
                            source={require('./images/noNet.jpg')}
                        />
                    </View>
                    <View style={styles.main}>
                        <Text style={styles.text}>好像没有网络</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}>
                        <Text style={styles.btnTxt}>立即刷新</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    head: {
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headImg: {
        width: 298,
        height: 140,
        resizeMode: 'contain',
    },
    main: {
        marginTop: 30,
        alignItems: 'center',
    },
    text: {
        fontSize: Global.FontSize.LARGE,
        color: Global.Color.DARK_GRAY,
    },
    btn: {
        marginTop: 40,
        marginHorizontal: 8,
        height: 48,
        backgroundColor: Global.Color.RED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
});