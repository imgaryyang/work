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
	Animated,
    Navigator,
    AsyncStorage,
} from 'react-native';

import * as Global  	from '../../Global';
import UserStore        from '../../flux/UserStore';

import NavBar       	from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import EasyIcon         from 'rn-easy-icon';

import Portrait     from './Portrait' ;
import EditProfile  from './EditProfile'

const IMAGES_URL    = 'el/base/images/view/';

class Profile extends Component {

    static displayName = 'Profile';
    static description = '个人资料';

    static propTypes = {
    };

    static defaultProps = {

    };
    

	state = {
		doRenderScene: false,
		data: null,
        userInfo: {},
	};

    constructor (props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.push = this.push.bind(this);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
        this.getList = this.getList.bind(this);
       
    }

	componentDidMount () {

        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
        InteractionManager.runAfterInteractions(() => {
            this.getUser();
            this.setState({
                doRenderScene: true,
            });
        });

        // console.log(this.state.userInfo);
		
	}
    componentWillUnmount () {
        this.unUserStoreChange();
        
    }
	componentWillReceiveProps () {
     
	}
    
    onUserStoreChange (_user) {
        // console.log('========================profile UserStore   Changed!!! =======================');
        this.setState({
            userInfo: _user.user,
        });
        // console.log(this.state.userInfo.portrait);
        // console.log('========================hUserStore.getUser()aha UserStore   Changed!!! =======================');
    }

    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }

    //No icon list
    getList () {
        return [
            //text, component, func, separator, passProps  var textright = textRight ? textRight : '未填写';
            {textLeft: '昵称',        textRight: this.state.userInfo.nickname==null?'未填写':this.state.userInfo.nickname,    },
            {textLeft: '性别',        textRight: this.state.userInfo.gender==null?'未填写':(this.state.userInfo.gender==1?'男':'女'),     },
            {textLeft: '邮箱',        textRight: this.state.userInfo.email==null?'未填写':this.state.userInfo.email,     },

        ];
    }
    
    push(title, component, passProps) {
        if(component != null)
            this.props.navigator.push({
                title: title,
                component: component,
                hideNavBar: true,
                passProps: {userInfo:this.state.userInfo,},
            });
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        var picBgHeight =100;

        var portrait = this.state.userInfo && this.state.userInfo.portrait ? (
            <Image resizeMode='cover' 
                key={Global._host + this.state.userInfo.portrait}
                style={[styles.portrait]} 
                source={{uri: Global._host + IMAGES_URL + this.state.userInfo.portrait}} />

        ) : (
            <Image resizeMode='cover' 
                style={[styles.portrait]} 
                source={require('../../res/images/me-portrait-dft.png')} />
        );

        // var portrait = (
                // <Image resizeMode='cover' 
                // style={[styles.portrait]} 
                // source={require('../../res/images/me-portrait-dft.png')} />
            // );

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ScrollView >
                    <View style={Global._styles.PLACEHOLDER20} />
                    <View style={Global._styles.FULL_SEP_LINE} />
                    <TouchableOpacity style={Global._styles.CENTER} onPress={()=>{this.push('我的头像', Portrait, true)}}>
                        <View style={[styles.listItem2 ,Global._styles.CENTER]} >
                            <Text style={styles.testLeft}>头像</Text>
                            <View style={{flex:1,}}>
                                <View style={styles.portraitHolder} >
                                {portrait}
                                </View>
                             </View>
                             <EasyIcon iconLib='fa' name='angle-right' size={18} color={Global._colors.IOS_ARROW} style={[{width: 40}]} />
                        </View>
                    </TouchableOpacity>
                    <View style={Global._styles.FULL_SEP_LINE} />
                    
                    <View style={Global._styles.PLACEHOLDER20} />
                    {this._renderList()}
                    <View style={Global._styles.PLACEHOLDER20} />
                        <Button text = "编辑" onPress = {()=>{this.push('个人资料修改', EditProfile,true)}} style = {{marginLeft: 10,marginRight: 10}} theme = {Button.THEME.BLUE}/>
                    <View style={Global._styles.PLACEHOLDER20} />
                    
                </ScrollView>
        
            </View>

                );
    }
    _renderList () {

        var list = this.getList().map(({textLeft, textRight, separator,}, idx) => {

            // console.log("BBBBBBBBBBBBBBBB");
            // console.log(idx + '_' + textLeft);
            var topLine = idx === 0 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;
            var bottomLine = idx === this.getList().length - 1 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;

            var itemLine = idx < this.getList().length - 1 ? <View style={Global._styles.SEP_LINE} /> : null;
            if(separator === true)
                itemLine = (
                    <View key={idx + '_' + textLeft} >
                        <View style={Global._styles.FULL_SEP_LINE} />
                        <View style={Global._styles.PLACEHOLDER20} />
                        <View style={Global._styles.FULL_SEP_LINE} />
                    </View>
                );
           
            return (
                <View key={idx + '_' + textLeft} >
                    {topLine}
                    <View style={[styles.listItem, Global._styles.CENTER]} >
                        <Text style={styles.testLeft}>{textLeft}</Text>
                        <Text style={styles.testRight}>{textRight}</Text>
                    </View>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
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
                    title={"个人资料"}
                    backText={"我"}
                     />
            );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: Global._os == 'ios' ? 48 : 0,
    },
    listItem: {
        alignItems: 'center', 
        justifyContent: 'center',//上下
        height: 40,
        width: Global.getScreen().width,
        backgroundColor:'white',
        flexDirection: 'row',
    },
    listItem2: {
        height: 100,
        width: Global.getScreen().width,
        backgroundColor:'white',
        flexDirection: 'row',
    },
    testLeft:{
        width: Global.getScreen().width/3,
        left: 15,
    },
    testRight:{
        // width: Global.getScreen().width/4,
        flex:1,
        right: 15,
        textAlign:'right',

    },
    portrait:{
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    itemPortraitContent: {
        flex: 1,
        alignItems: 'flex-end',
    },
    portraitHolder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        left: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        backgroundColor: 'gray',
    },
});

export default Profile;