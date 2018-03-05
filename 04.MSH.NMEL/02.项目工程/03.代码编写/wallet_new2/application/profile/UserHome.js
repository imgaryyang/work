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
    Dimensions,
} from 'react-native';

import NavBar       from '../store/common/TopNavBar';
import UserInformation       from './UserInformation';
import * as Global  from '../Global';
import ContactUs  from './ContactUs';
import Help  from './Help';
import SecuritySetting  from './SecuritySetting';
import OrderList  from '../store/user/OrderList';
import AddressList  from '../store/user/AddressList';
import UserStore from '../flux/UserStore';
import Index from './Index';
import Login        from './Login';
const IMAGES_URL    	= 'el/base/images/view/';

class UserHome extends Component {

    static displayName = 'UserHome';
    static description = '个人中心';

    static propTypes = {};

    static defaultProps = {};

    state = {
        doRenderScene: false,
        userInfo:{}
    };

    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange.bind(this));
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                doRenderScene: true,
            },()=>{
                this.getUser();
            });
        });	
	}

    onUserStoreChange (_user) {
        this.setState({
            userInfo: _user.user,
        });
    }
    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    toPage(component) {
        this.props.navigator.push({
            component: component,
            hideNavBar: true
        });
    }

    toLogin () {
        this.props.navigator.push({ 
            title: "登录",
            component: Login,
            hideNavBar: true,
        });
    }

    async logout() {
        await UserStore.logout();
        this.props.navigator.resetTo({
            component: Index,
            hideNavBar: true,
        });
    }

    personalInformation(){
        this.props.navigator.push({
            component: UserInformation,
            hideNavBar: true,
            passProps: {
                userInfo:this.state.userInfo,
            },
        });
    }

    render() {
        if (!this.state.doRenderScene)
            return this._renderPlaceholderView();
        let headImage = this.state.userInfo.portrait == null ? require('../res/images/user/user_default_photo.png') : {uri: Global._host + IMAGES_URL + this.state.userInfo.portrait};
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets = {false}>
                    <Image style={styles.head}
                        source={require('../res/images/user/user_head_bg.jpg')}
                        resizeMode='cover'
                    >
                        <Image style={styles.headCenterImg}
                            source={headImage}
                        />
                        <Text style={styles.headTitle}>{this.state.userInfo.nickname == null?'昵称':this.state.userInfo.nickname}</Text>
                    </Image>
                    <View style={styles.body}>
                        <View style={styles.main}>
                            <TouchableOpacity style={styles.menu}
                                onPress={() => this.personalInformation()}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#ff9f22'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_1.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>个人资料</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.main}>
                            <TouchableOpacity style={[styles.menu, styles.menuBorder]}
                                onPress={() => this.toPage(OrderList)}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#ff6867'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_2.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>我的订单</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menu}
                                onPress={() => this.toPage(AddressList)}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#8a8ff9'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_3.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>收货地址</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.main}>
                            <TouchableOpacity style={styles.menu}
                                onPress={() => this.toPage(SecuritySetting)}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#ff9f22'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_4.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>安全设置</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.main}>
                            <TouchableOpacity style={[styles.menu, styles.menuBorder]}
                                onPress={() => this.toPage(ContactUs)}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#ff7fc4'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_6.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>联系我们</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menu}
                                onPress={() => this.logout()}
                            >
                                <View style={styles.menuMain}>
                                    <View style={[styles.menuMainLeft, {backgroundColor: '#04d2bf'}]}>
                                        <Image style={styles.menuMainLeftImg}
                                            source={require('../res/images/user/user_menu_7.png')}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>安全退出</Text>
                                </View>
                                <Image style={styles.menuRightImg}
                                    source={require('../store/images/shop_center_right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar() {
        return (
            <NavBar title='我'
                navigator={this.props.navigator}
                route={this.props.route}
                hideBackButton={true}
                hideBottomLine={false}
            />
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    head: {
        width: Dimensions.get('window').width,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headCenterImg: {
        width: 44,
        height: 44,
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 22,
    },
    headTitle: {
        color: '#fff',
        fontSize: Global.FontSize.BASE,
        marginTop: 10,
        backgroundColor:'transparent'
    },
    body: {
        paddingVertical: 8,
    },
    main: {
        margin: 8,
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#dcdce1',
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    menu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
    },
    menuBorder: {
        borderBottomColor: Global.Color.LIGHT_GRAY,
        borderBottomWidth: 1 / Global._pixelRatio,
    },
    menuMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuMainLeft: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#69c1f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuMainLeftImg: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    menuName: {
        marginLeft: 10,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    menuRightImg: {
        width: 10,
        height: 18,
        resizeMode: 'contain',
    },
});

export default UserHome;



