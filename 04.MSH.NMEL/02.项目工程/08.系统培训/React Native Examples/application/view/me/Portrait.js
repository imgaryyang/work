'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Modal = require('../lib/Modal');
var SelectPhotoFromAlbum = require('../common/SelectPhotoFromAlbum');
var UtilsMixin = require('../lib/UtilsMixin');
var UserAction = require('../actions/UserAction');
var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	InteractionManager,
	CameraRoll,
} = React;

var SAVE_URL = 'person/uploadPortrait';

var Portrait = React.createClass({

	mixins: [UtilsMixin],

	getInitialState: function() {
		return {
			doRenderScene: false,
			/*showModal: false,*/
			photo: null,
			statusBarStyle: 'light-content',
		};
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	/**
	 * 显示菜单
	 */
	showMenu: function() {
		//this.setState({showModal: true});
	},

	takePhoto: function() {
		this.toast('暂无法访问相机！');
	},

	/**
	 * 从相册选择
	 */
	selectPhoto: function() {
		this.props.navigator.push({
			component: SelectPhotoFromAlbum,
			hideNavBar: true,
			passProps: {
				selected: this.selectedPhoto,
				/*type: 'multi',
				maxCount: 4,*/
			},
		});
	},

	/**
	 * 选择完图片后回调
	 */
	selectedPhoto: function(photo) {
		console.log(photo);

		this.setState({
			photo: photo,
			//showModal: false,
		}, () => {});
	},

	/**
	 * 保存头像
	 */
	save: async function() {
		this.showLoading();

		var startPos, ext;

		if(Global.os == 'ios') {
			startPos 	= this.state.photo.uri.indexOf('&ext=');
			ext 		= this.state.photo.uri.substring(startPos + 5, this.state.photo.uri.length);
		} else {
			//TODO: 需要想办法获取文件的真实扩展名
			ext = 'png';
		}

		var fileType 	= "image/" + ext.toLowerCase(),
			fileConfig 	= {
				uri: this.state.photo.uri, 
				type: fileType, 
				name: Global.USER_LOGIN_INFO.id + '.' + ext.toLowerCase()
			};

		//console.log(fileConfig);

		var form = new FormData();
		form.append("FormData", true);
		form.append("Content-Type", fileType);
		form.append('portrait', fileConfig);

		try {
			var res = await this.request(Global.host + SAVE_URL, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: form,
			});
			this.hideLoading();
			//console.log(res);
			this.toast('保存头像成功！');
			//this.setState({showModal: false});
			// await this.updateUserInfo({image: res.data[0].image});
			UserAction.updateUser({image: res.data[0].image});
		} catch(err) {
			this.requestCatch(err);
		}
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

        var portrait = this.props.image ? (
            <Image resizeMode='cover' 
                style={[Global.styles.BORDER, this.getStyles().portrait]} 
                source={{uri: Global.host + Global.userPortraitPath + this.props.image}} />
        ) : (
            <Image resizeMode='cover' 
    			style={[Global.styles.BORDER, this.getStyles().portrait]} 
    			source={require('../../res/images/me-portrait-dft.png')} />
		);

		if(this.state.photo)
			portrait = (
	            <Image resizeMode='cover' 
	                style={[Global.styles.BORDER, this.getStyles().portrait]} 
	                source={{uri: this.state.photo.uri}} />
	        )

		return (
			<View style={[Global.styles.CONTAINER, {backgroundColor: 'black'}]} >
				{this._getNavBar()}
				<View style={[Global.styles.CENTER, this.getStyles().sv]} >
					<View style={[Global.styles.CENTER, this.getStyles().portraitHolder]} >
						{portrait}
					</View>
				</View>

				{/*<Modal show={this.state.showModal} >
					<View style={this.getStyles().modal}>
						<View style={[this.getStyles().modalMenuHolder]}>
							<View style={Global.styles.FULL_SEP_LINE}/>
							<TouchableOpacity style={[this.getStyles().menuItem, Global.styles.CENTER]} onPress={this.takePhoto}>
								<Text style={[this.getStyles().menuItemText]}>拍照</Text>
							</TouchableOpacity>
							<View style={Global.styles.FULL_SEP_LINE}/>
							<TouchableOpacity style={[this.getStyles().menuItem, Global.styles.CENTER]} onPress={this.selectPhoto}>
								<Text style={[this.getStyles().menuItemText]}>从相册选择</Text>
							</TouchableOpacity>
							<View style={Global.styles.FULL_SEP_LINE}/>
							<TouchableOpacity style={[this.getStyles().menuItem, Global.styles.CENTER]} onPress={this.save}>
								<Text style={[this.getStyles().menuItemText]}>保存头像</Text>
							</TouchableOpacity>
							<View style={Global.styles.FULL_SEP_LINE}/>
							<View style={Global.styles.PLACEHOLDER10}/>
							<View style={Global.styles.FULL_SEP_LINE}/>
							<TouchableOpacity style={[this.getStyles().menuItem, Global.styles.CENTER]} onPress={() => {this.setState({showModal: false})}}>
								<Text style={[this.getStyles().menuItemText]}>取消</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>*/}

				<View style={[this.getStyles().buttonHolder]} >
					<TouchableOpacity style={[this.getStyles().button, Global.styles.CENTER]} onPress={this.takePhoto} >
						<Text style={[this.getStyles().buttonText]} >拍照</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[this.getStyles().button, Global.styles.CENTER]} onPress={this.selectPhoto} >
						<Text style={[this.getStyles().buttonText]} >从相册选择</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[this.getStyles().button, Global.styles.CENTER]} onPress={() => {
						if(this.state.photo) this.save();
					}} >
						<Text style={[this.getStyles().buttonText, this.state.photo ? null : {color: 'gray'}]} >保存头像</Text>
					</TouchableOpacity>
				</View>

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER, {backgroundColor: 'black'}]} >
				{this._getNavBar()}
		    </View>
		);
	},

	_getNavBar: function() {
		var blackTheme = {
            bar: {
                backgroundColor: 'transparent',
            },
            barBottomLine: {
                backgroundColor: 'transparent',
            },
            titleText: {
                fontSize: 16,
                color: '#FFFFFF',
            },
            backBtn: {
                flex: 1, 
                flexDirection: 'row', 
                height: 44,
                alignItems: 'center', 
                justifyContent: 'center',
            },
            backIcon: {
                width: 23, 
                marginLeft: 7, 
                color: '#FFFFFF',
                textAlign: 'center',
            },
            backText: {
                flex: 1, 
                fontSize: 13, 
                color: '#FFFFFF',
            },
        };

		return (
			<NavBar 
				title='我的头像' 
				navigator={this.props.navigator} 
				route={this.props.route} 
				/*rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]} >
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.showMenu} >
							<Icon name='more' size={20} color='white' style={[Global.styles.ICON]} />
						</TouchableOpacity>
					</View>
				)} */
				hideBackButton={false} 
				hideBottomLine={true} 
				theme={blackTheme} 
				statusBarStyle={this.state.statusBarStyle} 
				flow={false} 
			/>
		);
	},

	getStyles: function() {
		return StyleSheet.create({
			sv: {
				flex: 1,
				backgroundColor: 'transparent',
			},
			portraitHolder: {
				marginTop: -55,
				width: Global.getScreen().width,
				height: Global.getScreen().width,
				backgroundColor: 'gray',
			},
			portrait: {
				width: Global.getScreen().width,
				height: Global.getScreen().width,
				backgroundColor: 'transparent',
			},

			modal: {
			    flex: 1,
			    justifyContent: 'flex-end',
			},
			modalMenuHolder: {
				backgroundColor: 'transparent',
			},
			menuItem: {
				width: Global.getScreen().width,
				height: 45,
				backgroundColor: 'white',
			},
			menuItemText: {
				fontSize: 16,
			},

		    buttonHolder: {
		    	height: 50,
		    	width: Global.getScreen().width,
		    	position: 'absolute',
		    	left: 0,
		    	top: Global.getScreen().height - 50,
		    	backgroundColor: 'rgba(0, 0, 0, .7)',
		    	flexDirection: 'row',
		    },
		    button: {
		    	flex: 1,
		    	flexDirection: 'row',
		    	backgroundColor: 'transparent',
		    	height: 50,
		    },
		    buttonText: {
		    	fontSize: 15,
		    	color: 'white',
		    	backgroundColor: 'transparent',
		    },
		});
	},

});

module.exports = Portrait;


