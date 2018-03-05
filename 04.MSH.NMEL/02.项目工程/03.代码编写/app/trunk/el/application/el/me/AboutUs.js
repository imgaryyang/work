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

class AboutUs extends Component {

    static displayName = 'AboutUs';
    static description = '关于我们';

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
        //暂时将文档写死
        this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });

        try {
            // let responseData = await this.request(Global._host + FIND_URL, {
            //     body: JSON.stringify({
                    
            //     })
            // });
            this.hideLoading();
            let responseData = 
                    {
                        'success': true,
                        'result': {
                                        "version": "v 1.0.1",
                                        "content": "“易民生”是一个基于内蒙社会保障卡实名认证，建立居民相关薪资发放、挂号就医、缴费等民生活动为一体的应用平台，未来还将逐步丰富公共服务、个人消费及理财信贷等领域",
                                    } 
                    };
            // this.data = responseData.result;

            if (responseData1.success == false) {
                Alert.alert(
                    '提示',
                    responseData.msg ,
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({});
                            }
                        }
                    ]
                );
            } else {
                this.toast('成功！');
            }
        } catch(e) {
            this.hideLoading();
            this.setState({
                isRefreshing: false,
            });
            if(e.status == 401 || e.status == 403)
                this.setState({fetchForbidden: true});
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
                <ScrollView>
                    {this._getNavBar()}
                    <View style={Global._styles.PLACEHOLDER20} />
                    <View style={[Global._styles.CENTER,styles.holder]}>
                    <View style={[styles.imageHolder,Global._styles.CENTER]}>
                        <Image resizeMode='contain' 
                            style={[styles.logo]} 
                            source={require('../../res/images/logo/logo-s.png')} />
                    </View>
                    </View>
                    <View style={Global._styles.PLACEHOLDER20} />
                    <View style={[styles.holder1]}>
                        <Text style={styles.font}>易民生  v 1.0.1</Text>
                    </View>
                    <View style={Global._styles.PLACEHOLDER20} />
                    <View style={[styles.holder2]}>
                        <Text>“易民生”是一个基于内蒙社会保障卡实名认证，建立居民相关薪资发放、挂号就医、缴费等民生活动为一体的应用平台，未来还将逐步丰富公共服务、个人消费及理财信贷等领域。</Text>
                    </View>
                    <View style={Global._styles.PLACEHOLDER20} />

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
                    title={"关于我们"}
                    backText={"我"} />
            );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: Global._os == 'ios' ? 48 : 0,
    },
    holder:{
        height: 180,
    },
    font:{
        fontSize:20,
        color: Global._colors.FONT,
    },
    imageHolder:{
        width: 100,
        height: 100,
        borderRadius: 37,
        backgroundColor: 'black',
    },
    logo: {
        width: 70,
        height: 70,
        // backgroundColor: 'black',
        // left: 120,
    },
    holder1: {
        height: 35,
        alignItems: 'center', 
        justifyContent: 'center',//上下
    },
    holder2: {
        height: 100,
        paddingLeft:20,
        paddingRight:10,
        // alignItems: 'center', 
        justifyContent: 'center',//上下
    },
});

export default AboutUs;