/**
 * Created by liuyi on 2016/7/20.
 */
"use strict";

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
} from "react-native";

import * as Global      from '../Global';
import NavBar           from '../store/common/TopNavBar';
import EasyIcon         from 'rn-easy-icon';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    async fetchData () {
        try {
            let responseData = {"success":true,"result":[{"imageUrl":'../res/images/wallet/Wallet04.png',"bankName":'中国银行',"cardName":'储蓄卡',"cardNo":'1111111111113636'},
                {"imageUrl":'../res/images/wallet/Wallet05.png',"bankName":'中国农业银行',"cardName":'储蓄卡',"cardNo":'1111111111113636'},
                {"imageUrl":'../res/images/wallet/Wallet06.png',"bankName":'工商银行',"cardName":'储蓄卡',"cardNo":'1111111111113636'},
                {"imageUrl":'../res/images/wallet/Wallet07.png',"bankName":'建设银行',"cardName":'储蓄卡',"cardNo":'1111111111113636'},
                {"imageUrl":'../res/images/wallet/Wallet08.png',"bankName":'交通银行',"cardName":'储蓄卡',"cardNo":'1111111111113636'}]};
            this.data = responseData.result;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.data),
            }); 
            // this.hideLoading();
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }


    render() {
        return (
            <View  style = {Global._styles.CONTAINER}>
                {this._getNavBar()}
                <View style = {{backgroundColor:'#ffffff',}}>
                    <View style = {styles.personInfo}>
                        <Image style={styles.portrait}  source={require('../res/images/wallet/person1.png')} />
                        <Text style = {{color:Global.Color.DARK_GRAY, fontSize:Global.FontSize.BASE, marginLeft:10, marginTop:5}}>汪汪</Text>
                    </View>
                    <View style = {[{marginTop: 14,},styles.button]}>
                        {/*<Image style={styles.money}  source={require('../res/images/wallet/Wallet03.png')} />*/}
                        <Text style = {[ { fontSize:29,color:Global.Color.DARK_GRAY,}]}>¥500.00</Text>
                    </View>
                    <View style = {[styles.button,{marginTop:1}]}>
                        <Text style = {{color:Global.Color.DARK_GRAY, fontSize: Global.FontSize.SMALL}}>总资产 （元）</Text>
                    </View>
                    <View style = {{flexDirection: 'row', marginTop:18, marginBottom:25}}>
                        <View style = {[{flex:1},styles.button]}>
                            <Image style = {[styles.money, styles.button]} source={require('../res/images/wallet/Wallet02.png')} />
                            <Text style = {[styles.bill, styles.button, {marginLeft: 5}]}>账单</Text>
                        </View>
                        <View style = {[{flex:1},styles.button]}>
                            <Image style = {[styles.money, styles.button]}  source={require('../res/images/wallet/Wallet03.png')} />
                            <Text style = {[styles.bill, styles.button, {marginLeft: 5}]}>充值</Text>
                        </View>
                    </View>
                    <View style = {Global._styles.CONTAINER}>
                        {/*<View style = {{margin:8, marginBottom: 0,marginTop:10, flexDirection: 'row',height: 95,borderRadius: 10}}>
                            <View style = {{width:62, backgroundColor:Global.Color.RED}}>
                                <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet04.png')} />
                            </View>
                            <View style = {{flex:1, backgroundColor:'#ffffff', }}>
                                <Text style = {[styles.bankName,{color: Global.Color.DARK_GRAY, fontSize: Global.FontSize.BASE,}]}>中国银行</Text>
                                <Text style = {styles.cardName}>储蓄卡</Text>
                                <Text style = {styles.cardNo}>**** **** ****    6897</Text>

                            </View>
                        </View>
                        <View style = {{margin:8, marginBottom: 0,marginTop:10, flexDirection: 'row',height: 95,borderRadius: 10}}>
                                                    <View style = {{width:62, backgroundColor:'#009959'}}>
                                                        <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet05.png')} />
                                                    </View>
                                                    <View style = {{flex:1, backgroundColor:'#ffffff', }}>
                                                        <Text style = {styles.bankName}>中国银行</Text>
                                                        <Text style = {styles.cardName}>储蓄卡</Text>
                                                        <Text style = {styles.cardNo}>**** **** ****    6897</Text>
                        
                                                    </View>
                                                </View>
                                                <View style = {{margin:8, marginBottom: 0,marginTop:10, flexDirection: 'row',height: 95,borderRadius: 10}}>
                                                    <View style = {{width:62, backgroundColor:Global.Color.RED}}>
                                                        <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet06.png')} />
                                                    </View>
                                                    <View style = {{flex:1, backgroundColor:'#ffffff', }}>
                                                        <Text style = {styles.bankName}>中国银行</Text>
                                                        <Text style = {styles.cardName}>储蓄卡</Text>
                                                        <Text style = {styles.cardNo}>**** **** ****    6897</Text>
                        
                                                    </View>
                                                </View>*/}
                        <View style = {{margin:8, marginBottom: 0,marginTop:10, flexDirection: 'row',height: 95,borderRadius: 10}}>
                            <View style = {{width:62, backgroundColor:'#225aa5'}}>
                                <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet07.png')} />
                            </View>
                            <View style = {{flex:1, backgroundColor:'#ffffff', }}>
                                <Text style = {styles.bankName}>中国银行</Text>
                                <Text style = {styles.cardName}>储蓄卡</Text>
                                <Text style = {styles.cardNo}>**** **** ****    6897</Text>

                            </View>
                        </View>
                        <View style = {{margin:8, marginBottom: 0,marginTop:10, flexDirection: 'row',height: 95,borderRadius: 10}}>
                            <View style = {{width:62, backgroundColor:'#013976'}}>
                                <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet08.png')} />
                            </View>
                            <View style = {{flex:1, backgroundColor:'#ffffff', }}>
                                <Text style = {styles.bankName}>中国银行</Text>
                                <Text style = {styles.cardName}>储蓄卡</Text>
                                <Text style = {styles.cardNo}>**** **** ****    6897</Text>

                            </View>
                        </View>
                    </View>
                    

                    {/*<ListView
                                            key = {this.data}
                                            dataSource = {this    .state.dataSource}
                                             
                                              = {this.renderItem}
                                            renderSectionHeader = {this.renderSectionHeader}
                                            enableEmptySections = {true} />*/}
                </View>
                <View style = {Global._styles.CONTAINER}>
                    <View style = {{margin:8, marginTop:10,}}>
                        <View style = {{backgroundColor:'#ffffff', height: 48,borderRadius: 5, alignItems:'center',flexDirection: 'row', justifyContent: 'center' }}>
                            <Image style = {[styles.add, styles.button]}  source={require('../res/images/wallet/Wallet09.png')} />
                            <Text style = {[styles.addText, styles.button,{color: Global.Color.GRAY, marginLeft: 10}]}>绑定新卡</Text>
                        </View>
                    </View>
                </View>
            </View>
            )
    };

    renderItem (item, sectionID, rowID, highlightRow) {

        return (
            <View style = {Global._styles.CONTAINER}>
                <View style = {{margin:8, marginBottom: 0, backgroundColor:Global.Color.LIGHTER_GRAY,flexDirection: 'row'}}>
                    <View style = {{width:62, backgroundColor:Global.Color.RED}}>
                        <Image style = {[styles.bankLogo]} source={require('../res/images/wallet/Wallet04.png')} />
                    </View>
                    <View style = {{flex:1,}}>

                    </View>
                </View>
            </View>

        );
    };

    _getNavBar () {
        return (
            <NavBar title = '钱包' 
                navigator = {this.props.navigator} 
                route = {this.props.route}
                hideBackButton = {true} 
                hideBottomLine = {true}
                rightButtons = {(
                    <View style = {[styles.buttonContain, styles.rightButton]} >
                        <Button  stretch = {false} clear = {true} style = {styles.button} >
                            <EasyIcon name = "ios-add" color = 'white' size = {25} />
                            <View style = {{marginLeft: 5, marginTop: 10}}>
                                <Text style = {[Global.FontSize.BASE, {color: '#fff', backgroundColor: 'transparent', textAlign: 'center',}]}>绑定卡</Text>
                            </View>
                        </Button>
                    </View>
                    
                )}/>
        );
    };
}

const styles = StyleSheet.create({
    buttonContain: {
        flexDirection: 'row',
        height: 44,
    },
    rightButton: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    personInfo: {
        flexDirection: 'row',
        marginLeft: 16,
        marginTop:10,
    },
    portrait: {
        width: 32,
        height: 32,
        borderRadius: 20,
        
    },
    money: {
        height: 14,
        width:14,
    },
    line10: {
        backgroundColor: Global.Color.Lighter_Gray, 
        height: 10,
    },
    bankLogo: {
        marginTop: 32,
        marginLeft: 16,
        height: 29,
        width: 29,
    },
    bankName: {
        marginLeft: 16,
        marginTop: 16,
        
    },
    cardName: {
        marginTop: 6,
        marginLeft: 16,
        color: Global.Color.DARK_GRAY, 
        fontSize: Global.FontSize.SMALL,
    },
    cardNo: {
        marginTop: 10,
        marginLeft: 16,
        color: Global.Color.DARK_GRAY, 
        fontSize: Global.FontSize.BASE,
    },
    bill: {
        color: Global.Color.DARK_GRAY, 
        fontSize: Global.FontSize.BASE,
    },
    add: {
        height: 16,
        width: 16,
    },
    addText: {
        fontSize: Global.FontSize.BASE,
        
    },
    
});

