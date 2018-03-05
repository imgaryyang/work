'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UtilsMixin = require('../lib/UtilsMixin');

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
	PropTypes,
} = React;

var SelectPhotoFromAlbum = React.createClass({

	mixins: [UtilsMixin],

    statics: {
        title: 'SelectPhotoFromAlbum',
        description: '相册图片选择器',
    },

    propTypes: {

        /**
        * 选择后回调函数
        * 必填
        */
        selected: PropTypes.func.isRequired,

        /**
         * 选择方式
         * single - 单选，multi - 多选
         * 默认单选
         */
        type: PropTypes.string,

        /**
         * 最多选择数量
         * 当多选时有效
         */
        maxCount: PropTypes.number,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
            type: 'single',
            maxCount: -1,
        };
    },

    /**
     * 默认状态
     */
	getInitialState: function() {
		return {
			doRenderScene: false,
			photos: [],
			selectedPhotos: [],
		};
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.listPhotos();
		});
	},

	/**
	 * 从相册选择
	 */
	listPhotos: function() {
		/* fetchParams of iOS CameraRoll
		{
		    first: ..., // (required) The number of photos wanted in reverse order of the photo application
		    after: ..., // A cursor returned from a previous call to 'getPhotos'
		    groupTypes: ..., // Specifies which group types to filter the results to
		                     // One of ['Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream', 'SavedPhotos'(default)]
		    groupName: ..., // Specifies filter on group names, like 'Recent Photos' or custom album titles
		    assetType: ... // Specifies filter on assetType
		                   // One of ['All', 'Videos', 'Photos'(default)]
		}*/
		var fetchParams = {
			first: 50,
		};
		CameraRoll.getPhotos(fetchParams, this.loadPhoto, this.loadPhotoErr);
		this.setState({showModal: false});
	},

	loadPhoto: async function(data) {
		let assets = data.edges;
	    let photos = assets.map((asset) => asset.node.image);
	    this.setState({
	        photos: photos,
	    });
	},

	loadPhotoErr: function(err) {
		console.warn('error when load local photo:');
		console.warn(err);
	},

	onSelect: function(photo) {
		if(this.props.type == 'single') {
			if(this.state.selectedPhotos.contains(photo)) {
				this.setState({selectedPhotos: []});
			} else {
				this.setState({selectedPhotos: new Array(photo)});
			}
		} else {
			if(this.state.selectedPhotos.contains(photo)) {
				var arr = this.state.selectedPhotos;
				arr.splice(arr.indexOf(photo), 1);
				this.setState({selectedPhotos: arr});
			} else {
				if(this.props.maxCount != -1 && this.state.selectedPhotos.length == this.props.maxCount) {
					this.toast('选择数量不能超过' + this.props.maxCount + '张');
					return;
				}
				var arr = this.state.selectedPhotos;
				arr.push(photo);
				this.setState({selectedPhotos: arr});
			}
		}
	},

	confirm: function() {
		if(this.state.selectedPhotos.length == 0)
			this.toast('您尚未选择照片')
		else {
			if(typeof this.props.selected == 'function') {
				if(this.props.type == 'single')
					this.props.selected(this.state.selectedPhotos[0]);
				else
					this.props.selected(this.state.selectedPhotos);
				this.props.navigator.pop();
			}
		}
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var photos = this.state.photos.map(
			(photo, idx) => {

				var selected = this.state.selectedPhotos.contains(photo) ? (
					<Icon name='checkmark-circled' size={20} color={Global.colors.ORANGE} style={this.getStyles().selectIcon} />
				) : null;
				return (
					<TouchableOpacity key={'ap_' + idx} style={[Global.styles.CENTER, this.getStyles().imgHolder]} onPress={() => this.onSelect(photo)} >
						<Image style={this.getStyles().img} resizeMode='cover' source={{ uri: photo.uri }} />
						{selected}
					</TouchableOpacity>
				);
			}
		);

		return (
			<View style={[Global.styles.CONTAINER, {backgroundColor: 'white'}]} >
				{this._getNavBar()}

				<ScrollView style={this.getStyles().sv} >
					<View style={this.getStyles().imgsHolder} >
						{photos}
					</View>
					<View style={{height: 50}} />
				</ScrollView>

				<View style={[this.getStyles().buttonHolder]} >
					<TouchableOpacity style={[this.getStyles().button, Global.styles.CENTER]} onPress={() => this.props.navigator.pop()} >
						<Text style={[this.getStyles().buttonText]} >取消</Text>
					</TouchableOpacity>
					<View style={{flex: 1}} />
					<TouchableOpacity style={[this.getStyles().button, Global.styles.CENTER]} onPress={this.confirm} >
						<Text style={[this.getStyles().buttonText]} >确定</Text>
					</TouchableOpacity>
				</View>

			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER, {backgroundColor: 'white'}]} >
				{this._getNavBar()}
		    </View>
		);
	},

	_getNavBar: function() {
		var blackTheme = {
            bar: {
                backgroundColor: 'black',
            },
            barBottomLine: {
                backgroundColor: 'black',
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
				title='从手机相册选择' 
				navigator={this.props.navigator} 
				route={this.props.route} 
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]} >
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.listPhotos} >
							<Icon name='refresh' size={20} color='white' style={[Global.styles.ICON]} />
						</TouchableOpacity>
					</View>
				)} 
				hideBackButton={false} 
				hideBottomLine={true} 
				theme={blackTheme} 
				statusBarStyle='light-content' 
				flow={false} 
			/>
		);
	},

	getStyles() {
		return StyleSheet.create({
			sv: {
				flex: 1,
			},
			imgsHolder: {
				flex: 1,
				flexDirection: 'row',
		        flexWrap: 'wrap',
		        overflow: 'hidden', 
		        padding: 1,
			},
			imgHolder: {
				width: (Global.getScreen().width - 2) / 4,
				height: (Global.getScreen().width - 2) / 4,
			},
			img: {
				width: (Global.getScreen().width - 2) / 4 - 2,
				height: (Global.getScreen().width - 2) / 4 - 2,
			},
            selectIcon: {
				backgroundColor: 'transparent',
				position: 'absolute',
				top: 3,
				left: 3,
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
            	width: 100,
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

module.exports = SelectPhotoFromAlbum;


