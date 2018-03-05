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
    TextInput,
    InteractionManager,
} from "react-native";

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import RadioGroup   from './common/RadioGroup';
import Button   from 'rn-easy-button';
import UserStore        from '../flux/UserStore';
import UserAction       from '../flux/UserAction';
const FIND_URL 		= 'el/user/changeUserInfo';
export default class UserInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            page: -1,
            canClearName: false,
            canClearMail:false,
            nickeName:'',
            gender:'',
            email:'',
            doRenderScene: false,
            userInfo: this.props.userInfo,
        };
        this.state.title = this.props.title;
        this.state.page =this.props.page;
    }
    _getNavBar () {
        return (
            <NavBar title = {this.state.title}
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {false}
                    hideBottomLine = {false} />
        );
    }
    _getText(){
        let title;
        if(this.state.page == 1){
            title = '昵称';
        } else if(this.state.page == 2){
            title = '性别';
        } else if(this.state.page == 3){
            title = '邮箱';
        }
        return title;
    }
    _onSelect(value){
       this.setState({gender:value});
    }
    componentDidMount () {
       InteractionManager.runAfterInteractions(() => {
			this.setState({
                doRenderScene: true,
            });
		});
	}
    fChkMail(szMail){ 
        var szReg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/; 
        var bChk=szReg.test(szMail); 
        return bChk; 
    } 
    async _save(){
         this.showLoading();
         if(this.state.email != '' && !this.fChkMail(this.state.email)){
             this.hideLoading();
             this.toast("您输入邮箱格式错误");
             return;
         }
         let rstr;
         let vbody;
         if(this.state.page == 1){
            rstr =  this.state.nickeName;
            vbody={nickname:rstr};
         } else if(this.state.page == 2){
            rstr =  this.state.gender;
            vbody={gender:rstr};
         } else if(this.state.page == 3){
            rstr = this.state.email; 
            vbody={email:rstr};   
         }
         try {
            let responseData = await this.request(Global._host + FIND_URL, {
                body: JSON.stringify(vbody)
            });
            this.hideLoading();
            
            this.toast('修改成功！');
            UserAction.onUpdateUser(responseData.result);
            this.props.navigator.pop();
            
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }
    }
    _getMidView(){
        let vg;
        if(this.state.userInfo.gender != null){
            vg = this.state.userInfo.gender;
        }
        if(this.state.gender != ''){
            vg = this.state.gender;
        }
        if(this.state.userInfo.gender === null && this.state.gender === ''){
            vg='1';
        }
        if(this.state.page === 1){
            return (
                <View style={styles.menuRight}>
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.userInfo.nickname == null?'请输入用户昵称':this.state.userInfo.nickname}
                        placeholderTextColor={Global.Color.GRAY}
                        underlineColorAndroid='transparent'
                        value={this.state.nickeName}
                        onChangeText={(nickeName) =>
                            this.setState({nickeName, canClearName: nickeName != '' ? true : false})
                        }
                    />
                </View>
            );
        } else if(this.state.page === 2){
            return (
            <View style={styles.menuRight}>
                <RadioGroup 
                    items={[{value:'1',label:'男'},{value:'0',label:'女'}]}
                    selected={vg} 
                    onSelect={this._onSelect.bind(this)}/>
            </View>
            );
        } else if(this.state.page === 3){
            return (
                <View style={styles.menuRight}>
                    <TextInput
                            style={styles.input}
                            placeholder={this.state.userInfo.email == null?'请输入常用邮箱':this.state.userInfo.email}
                            placeholderTextColor={Global.Color.GRAY}
                            underlineColorAndroid='transparent'
                            value={this.state.email}
                            onChangeText={(email) =>
                                this.setState({email, canClearMail: email != '' ? true : false})
                            }
                        />
                </View>
            );
        }
    }
    _getclearView(){
        if(this.state.canClearName){
            return (
                <View style={styles.clear}>
                    <TouchableOpacity
                        onPress={() => this.setState({nickeName: '', canClearName: false})}>
                        <Image  style={styles.clearImage} source={require('../res/images/user/user_info_clear.png')} />
                    </TouchableOpacity>
                </View>
            );
        }
        if(this.state.canClearMail){
            return (
                <View style={styles.clear}>
                    <TouchableOpacity
                        onPress={() => this.setState({email: '', canClearMail: false})}>
                        <Image  style={styles.clearImage} source={require('../res/images/user/user_info_clear.png')} />
                    </TouchableOpacity>
                </View>
            );
        }
    }
    _getView(){
         return (
            <View style={styles.continer}>
                <View style={styles.menu}>
                     <View style={styles.menu}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuText} >{this._getText()}</Text>
                        </View>
                        {this._getMidView()}
                        {this._getclearView()}
                    </View>
                </View>
            </View>
         );
    }
    render() {
        return (
             <View style={Global._styles.CONTAINER}>
                {this._getNavBar()}
                {this._getView()}
                <View>
                     <Button onPress={()=>{this._save()}} style={{ marginTop:30,marginHorizontal: 8,height:48,backgroundColor:Global.Color.RED}} text='保存'/>
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
    menuLeft:{
        flex:1,
        paddingLeft:16,
    },
    menuText:{
        fontSize: Global.FontSize.BASE,
        color: Global.Color.DARK_GRAY,
    },
    menuRight:{
        flex:5,
        justifyContent:'flex-start',
    },
    input:{
        margin:0,
        padding: 0,
        height: 48,
        fontSize: Global.FontSize.BASE,
        color: Global.Color.GRAY,
    },
    clear: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearImage: {
        marginRight:16,
        height:20,
        width:20,
        borderRadius: 10,
    },
});