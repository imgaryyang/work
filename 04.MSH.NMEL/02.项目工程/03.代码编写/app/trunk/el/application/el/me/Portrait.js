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
    Alert,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Animated,
    Navigator,
    AsyncStorage,
} from 'react-native';

import * as Global  	from '../../Global';
import UserAction       from '../../flux/UserAction';
import Icon           	from 'react-native-vector-icons/FontAwesome';

import NavBar       	from 'rn-easy-navbar';
import Separator        from 'rn-easy-separator';
import Button           from 'rn-easy-button';
import EasyPortrait     from 'rn-easy-portrait';


import EditProfile  	from './EditProfile'
import CameraRollView   from '../common/CameraRollView';

const SAVE_URL 			= '/el/base/images/upload';
const IMAGES_URL    	= 'el/base/images/view/';
const SAVE_PORTRAIT_URL = '/el/user/setPortrait';

class Portrait extends Component{

	static displayName = 'Portrait';
    static description = '头像';

    static propTypes = {
    	/*
        ** 用户信息
        */
        userInfo: PropTypes.object.isRequired,
    };

    static defaultProps = {

    };

	state = {
		doRenderScene: false,
		data: null,
        userInfo: this.props.userInfo,
        buttonState: true,
        photo: null,
	};

    constructor (props) {

        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectedPhoto = this.selectedPhoto.bind(this);
        this.savePhoto = this.savePhoto.bind(this);
        this.updatePortrait = this.updatePortrait.bind(this);
    }
	componentDidMount () {

		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}
	componentWillReceiveProps () {
		this.setState({
			userInfo: this.props.userInfo,
		});
	}
	/**
	 * 显示菜单
	 */
	showMenu () {
		//this.setState({showModal: true});
	}
	takePhoto () {

		this.toast('暂无法访问相机！');
	}
	/**
	 * 从相册选择
	 */
	selectPhoto () {
		this.props.navigator.push({
			component: CameraRollView ,
			hideNavBar: true,
			passProps: {
				selected: this.selectedPhoto,
				userInfo: this.props.userInfo,
				/*type: 'multi',
				maxCount: 4,*/
			},
		});
	}

	/**
	 * 选择完图片后回调
	 */
	selectedPhoto ( photo) {
		this.setState({
			photo: photo,
			buttonState: false,
			//showModal: false,
		});
		// this.savePhoto();
	}
	goPop(){
        this.props.navigator.pop();

    }
	/**
	 * 保存头像
	 */
	async savePhoto() {
		var startPos, ext;

		if(Global.os == 'ios') {
			// startPos 	= this.state.photo.uri.indexOf('&ext=');
			// ext 		= this.state.photo.uri.substring(startPos + 5, this.state.photo.uri.length);
		} else {
			//TODO: 需要想办法获取文件的真实扩展名
			ext = 'png';
		}
		var fileType 	= "image/" + ext.toLowerCase(),
			fileConfig 	= {
				uri: this.state.photo.uri, 
				type: fileType, 
				name: this.state.userInfo.id + '.' + ext.toLowerCase()
			};
		var form = new FormData();
		form.append("FormData", true);
		form.append("fkId", '1');
		form.append("fkType", '2');
		form.append("memo", '1234');
		form.append("resolution", '');
		form.append("sortNum", '0');
		form.append('file', fileConfig);

		try {
			this.showLoading();

			var responseData = await this.request(Global._host + SAVE_URL, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: form,
			});
			this.hideLoading();
			if (responseData.success == false) {
				Alert.alert(
					'提示',
					responseData.msg + ',请重新输入!',
					[
					 	{
					 		text: '确定', 
					 	}
					]
				);
			} else {
				this.state.userInfo.portrait = responseData.result.id;
				this.toast('保存头像成功！');
				//将头像id 存入 user表中
				this.updatePortrait();
				UserAction.onUpdateUser(this.state.userInfo);
				this.pop();
			}
		} catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
		}
	}

	async updatePortrait (){

		try {
			this.showLoading();
			let responseData = await this.request(Global._host + SAVE_PORTRAIT_URL, {
				body: JSON.stringify({portrait: this.state.userInfo.portrait}),
			});

			this.hideLoading();
			if (responseData.success == false) {
				Alert.alert(
					'提示',
					responseData.msg + ',请重新输入!',
					[
					 	{
					 		text: '确定', 
					 	}
					]
				);
			} else {
				this.setState({userInfo:responseData.result,});
			}
			//将头像id 存入 user表中
			this.toast('修改用户信息成功！');
		} catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
		}

	}
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var saveButton = this.state.photo?(<Button text = "头像上传" onPress = {()=>{this.savePhoto()}} theme = {Button.THEME.BLUE} style={{ marginLeft: 10,marginRight: 10,}} />)
							: null ;

		var portraitImage = (this.state.photo == null && this.state.userInfo.portrait == null) ? 
							require('../../res/images/me-portrait-dft.png') : 
							(this.state.photo != null ?this.state.photo : {uri: Global._host + IMAGES_URL + this.state.userInfo.portrait} );
		return (
			<View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                
                <ScrollView style={[styles.scrollView]} alwaysBounceVertical={true}>
					
					<View style={[Global._styles.CENTER, styles.portraitHolder]} >
						<View style={styles.portraitbackground}>
							<EasyPortrait imageSource={portraitImage} width={100} height = {100} radius={50} />
						</View>
					</View>
			
					<View style={Global._styles.FULL_SEP_LINE} />
					<TouchableOpacity style={[ styles.buttonHolder, Global._styles.CENTER]} onPress={this.takePhoto} >
						<Icon iconLib='fa' name={'camera'} size={22} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON]} />
						<Text style={{flex: 1, marginLeft: 10}} >拍一张照片</Text>
						<Icon iconLib='fa' name='angle-right' size={18} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
					</TouchableOpacity>
					<View style={Global._styles.FULL_SEP_LINE} />
					<TouchableOpacity style={[ styles.buttonHolder, Global._styles.CENTER]} onPress={this.selectPhoto} >
						<Icon iconLib='fa' name={'photo'} size={22}  color={Global._colors.IOS_ARROW} style={[styles.icon, Global._styles.ICON]} />
						<Text style={{flex: 1, marginLeft: 10}}>从相册中选择一张</Text>
						<Icon iconLib='fa' name='angle-right' size={18} color={Global._colors.IOS_ARROW} style={[Global._styles.ICON, {width: 40}]} />
					</TouchableOpacity>
					<View style={Global._styles.FULL_SEP_LINE} />
                    <Separator height = {20} />
                    {saveButton}

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
                    hideBackButton = {false}
                    title={"选择头像"}
                    backText={"个人资料"} />
            );
    }
}

const styles = StyleSheet.create({
			scrollView: {
        		flex: 1,
        		// backgroundColor: 'gray',
    		},
			portraitHolder: {
				marginTop: 80,
				marginBottom: 80,
				height: 100,
        		borderRadius: 50,
        		alignItems: 'center',
        		justifyContent: 'center',
			},
			portraitbackground: {
				height: 100,
        		borderRadius: 50,
        		width: 100,
        		backgroundColor: 'gray',

			},
		    buttonHolder: {
		    	width: Global.getScreen().width,
        		flexDirection: 'row',
       		 	padding: 7,
        		paddingLeft: 15,
        		paddingRight: 0,
        		backgroundColor: 'white',
        		height: 50,
		    },
		    button: {
		    	flex: 1,
		    	backgroundColor: 'transparent',
		    	height: 40,
		    },
		    buttonText: {
		    	fontSize: 15,
		    	
		    	backgroundColor: 'transparent',
		    },

});

export default Portrait;


