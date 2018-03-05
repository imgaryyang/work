"use strict";

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
} from "react-native";

import UpdateUserInformation       from './UpdateUserInformation';
import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import UpdateUserPortrait       from './UpdateUserPortrait';
import UserStore        from '../flux/UserStore';

const IMAGES_URL    	= 'el/base/images/view/';
export default class UserInformation extends Component {

    constructor(props) {
        super(props);
        this.state={
            doRenderScene: false,
            userInfo: this.props.userInfo,
        };
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
    }
	componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                doRenderScene: true,
            });
        });	
	}
    onUserStoreChange (_user) {
        this.setState({
            userInfo: _user.user,
        });
    }
    _getNavBar () {
        return (
            <NavBar title = "个人资料"
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {false}
                    hideBottomLine = {false} />
        );
    }
    goPage(page){
        let title;
        if(page == 1){
            title = '修改昵称';
        } else if(page == 2){
            title = '修改性别';
        } else if(page == 3){
            title = '修改邮箱';
        }
        this.props.navigator.push({
            component: UpdateUserInformation,
            hideNavBar: true,
            passProps: {
                title: title,
                page:page,
                userInfo:this.state.userInfo,
            },
        });
    }
    goUserPortrait(){
        this.props.navigator.push({
            component: UpdateUserPortrait,
            hideNavBar: true,
            passProps: {
                userInfo:this.state.userInfo,
            },
        });
    }
    render() {
        let gender = this.state.userInfo.gender == null?'未填写':this.state.userInfo.gender;
        if(gender === '0'){
            gender ='女';
        } else if(gender === '1'){
            gender ='男';
        }
        let headImage = this.state.userInfo.portrait == null ? require('../res/images/user/user_info_hender.png') : {uri: Global._host + IMAGES_URL + this.state.userInfo.portrait}
        return (
             <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                <View style={styles.continer}>
                    <TouchableOpacity style={styles.menu} onPress={()=>this.goUserPortrait()}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText} >头像</Text>
                        </View>
                        <View style={styles.menuCenter}>
                            <Image style={styles.menuCenterImage} source={headImage} />
                        </View>
                        <View style={styles.menuRight}>
                            <Image style={styles.menuRightImage} source={require('../res/images/user/user_info_right.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.continer}>
                    <TouchableOpacity style={styles.menu} onPress={()=>this.goPage(1)}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText}>昵称</Text>
                        </View>
                        <View style={styles.menuCenter}>
                                <Text style={styles.menuCenterText}>{this.state.userInfo.nickname == null?'未填写':this.state.userInfo.nickname}</Text>
                        </View>
                        <View style={styles.menuRight}>
                            <Image style={styles.menuRightImage} source={require('../res/images/user/user_info_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuMid}  onPress={()=>this.goPage(2)}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText} >性别</Text>
                        </View>
                        <View style={styles.menuCenter}>
                            <Text style={styles.menuCenterText}>{gender}</Text>
                        </View>
                        <View style={styles.menuRight}>
                            <Image style={styles.menuRightImage} source={require('../res/images/user/user_info_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuMid}  onPress={()=>this.goPage(3)}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText}>邮箱</Text>
                        </View>
                        <View style={styles.menuCenter}>
                            <Text style={styles.menuCenterText}>{this.state.userInfo.email == null?'未填写':this.state.userInfo.email}</Text>
                        </View>
                        <View style={styles.menuRight}>
                            <Image style={styles.menuRightImage} source={require('../res/images/user/user_info_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuMid} >
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText}>电话</Text>
                        </View>
                        <View style={styles.menuCenter1}>
                            <Text style={styles.menuCenterText}>{this.state.userInfo.mobile == null?'未填写':this.state.userInfo.mobile}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
             </View>
        );
    };
}
UserInformation.propTypes = {
    userInfo: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
    continer: {
        marginTop:10,
        marginHorizontal: 8,
        borderColor:Global.Color.LIGHT_GRAY,
        borderWidth: 1 / Global._pixelRatio,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    menu:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    menuMid:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderTopWidth: 1 / Global._pixelRatio,
        borderColor:Global.Color.LIGHT_GRAY,
    },
    menuLeft:{
        flex:1,
        paddingLeft:16,
    },
    menuText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    menuCenter:{
        flex:5,
        justifyContent:'flex-start',
        paddingLeft:16,
    },
    menuCenter1:{
        flex:6,
        justifyContent:'flex-start',
        paddingLeft:16,
    },
    menuCenterImage:{
        height:32,
        width:32,
        borderRadius: 16,
    },
    menuCenterText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
    },
    menuRight:{
         alignItems: 'center',
         justifyContent: 'flex-end',
    },
    menuRightImage:{
        width: 10,
        height: 18,
        resizeMode: 'contain',
        marginRight:16, 
    }
});