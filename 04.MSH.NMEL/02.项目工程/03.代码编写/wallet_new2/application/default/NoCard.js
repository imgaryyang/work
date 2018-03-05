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

export default  class NoCard extends Component {
    static displayName = 'NoDeliveryAddress';
    static description = '没有绑定卡';
    render() {

        return (
            <View style={[Global._styles.CONTAINER, {backgroundColor: '#fff'}]}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.head}>
                        <Image style={styles.headImg}
                            source={require('./images/noCard.jpg')}
                        />
                    </View>
                    <View style={styles.main}>
                        <Text style={styles.text}>尚未绑定银行卡</Text>
                        <Text style={styles.text1}>绑定银行卡将方便您的便民生活</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}>
                        <Image  style={styles.add} source={require('../res/images/wallet/Wallet01.png')} />
                        <Text style={styles.btnTxt}>绑定新卡</Text>
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
    text1: {
        marginTop: 20,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
    },
    btn: {
        marginTop: 40,
        marginHorizontal: 8,
        height: 48,
        backgroundColor: Global.Color.RED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flexDirection:'row'
    },
    btnTxt: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
    },
    add: {
        height: 16,
        width: 16,
        marginRight:10,
    },
});