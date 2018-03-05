'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Animated,
    Navigator,
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from 'rn-easy-navbar';

class ContactUs extends Component {

    

    static displayName = 'ContactUs';
    static description = '联系我们';

    static propTypes = {

    };

    static defaultProps = {

    };
    

	state = {
		doRenderScene: false,
		data: null,
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	componentWillReceiveProps () {
        
	}
    async fetchData () {
        //获取消息
        var FIND_URL = 'el//';
        this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });
        try {
            let responseData = await this.request(Global._host + FIND_URL, {
                body: JSON.stringify({
                    
                })
            });
            this.hideLoading();
            this.data = responseData.body;
            // console.log(responseData);
            if (responseData1.success == false) {
                Alert.alert(
                    '提示',
                    responseData.msg ,
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({bankCards: null,});
                            }
                        }
                    ]
                );
            } else {
                this.toast('成功！');
            }
        } catch(e) {
            this.hideLoading();
            
            this.handleRequestException(e);
        }
    }
    // refresh(){
    //     this.fetchData();
    // }
    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        

        return (
            <View style = {Global._styles.CONTAINER} >
                <ScrollView style={styles.scrollView}>
                <View style={Global._styles.PLACEHOLDER20} />
                {this._getNavBar()}
                    <View style={Global._styles.PLACEHOLDER20} />
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <View style={[styles.holder]}>
                        <Text>内蒙古科电数据服务有限公司</Text>
                    </View> 
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <View style={[styles.holder]}>
                        <Text>客 服 电 话： 88888888</Text>
                    </View>
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <View style={[styles.holder]}>
                        <Text>商户合作电话：88888888</Text>
                    </View>
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <View style={[styles.holder]}>
                        <Text>邮  箱：kedian@infohold.com.cn</Text>
                    </View>
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <View style={[styles.holder]}>
                        <Text>地  址：呼和浩特市大学西街学府康都4-5楼</Text>
                    </View>    
                    <View style={Global._styles.FULL_SEP_LINE} />
                </ScrollView> 
            </View>

                );
    }
 _renderPlaceholderView () {
        return (
            <View style = {Global._styles.CONTAINER}>
            {this._getNavBar()}
            </View>
        );
    }
    _getNavBar(){
        return(
                <NavBar 
                    navigator={this.props.navigator} 
                    route={this.props.route}
                    title={"联系我们"}
                    backText={"我"}/>
            );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginBottom: Global._os == 'ios' ? 48 : 0,
    },
    holder: {
        height: 40,
        paddingLeft:20,
        // alignItems: 'center', 
        justifyContent: 'center',//上下
        backgroundColor: 'white',
    },
});

export default ContactUs;