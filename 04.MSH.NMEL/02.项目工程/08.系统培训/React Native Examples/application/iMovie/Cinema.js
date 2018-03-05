/**
 * 电影院
 */
'use strict';



var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../Global');
var NavBar = require('../view/NavBar');

var UtilsMixin = require('../view/lib/UtilsMixin');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Image,
    InteractionManager,
} = React;

var FIND_URL = 'yppt/getCinemaDetailById.do'

var Cinema = React.createClass({

    mixins:[UtilsMixin],
    data :null,
    cinemaPic:[],


    statics: {
        title: 'Cinema',
        description: '影院详情',
    },

    /**
     * 参数说明
     */
    propTypes: {

        /**
        * 导航容器
        * 必填
        */
        navigator: PropTypes.object.isRequired,

        /**
        * 路由
        * 必填
        */
        route: PropTypes.object.isRequired,
        /**
        *影院详细信息
        *必填
        */
        CinemaInfo:PropTypes.object.isRequired,

    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {
        return {
        	doRenderScene: false,
        	navTitle: '影院详情',
            value:{
                //影院描述展开全部的状态控制，默认为折叠状态
                showAllFlag:false,
                loaded:true,
            }
        };
    },

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
            this.fetchData();
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function(props) {
    },

    changShowText:function(){
        this.setState({
            showAllFlag:!this.state.showAllFlag,
        });
    },

    fetchData:async function(){
        this.setState({loaded:false,});
        this.showLoading();
        let URL = Global.movieHost+FIND_URL+'?cinemaId='+this.props.CinemaInfo.id;
        try{
            let responseData = await this.request(URL,{
                method:'GET',
            });
            // console.log(responseData);
            if(responseData.return_code==='0'){
                this.data = responseData.cinemaInfo;
                // console.log(this.data);
                for(var ii=0;ii<this.data.images.length;ii++){
                    this.cinemaPic.push({
                        id: ii, 
                        picUri: this.data.images[ii],
                    });
                }
            }else{
                this.data = null;
                this.cinemaPic = [];
            }
            this.setState({loaded:false,});
            this.hideLoading();
        }catch(e){
            this.requestCatch(e);
        }
    },

     getPictures: function() {

        return this.cinemaPic.map(
            ({id, picUri}, idx) => {
                return (
                    <View key={'key_'+idx} style={[styles.cinermaHolder]} >
                       <Image source={{uri:picUri}}  resizeMode='cover' style={styles.picUri} />
                    </View>
                );
            }
        );
    },    

    render: function() {


        var showIcon = this.state.showAllFlag?
                (<Icon name='ios-arrow-up' size={18} style={[Global.styles.ICON, {width: 40}]} />)
                :(<Icon name='ios-arrow-down' size={18} style={[Global.styles.ICON, {width: 40}]} />);

        var CinemaDesc = this.state.showAllFlag?
                        (<Text style={styles.descr} >{this.props.CinemaInfo.memo}</Text>)
                        :(<Text style={styles.descr} numberOfLines={8}>{this.props.CinemaInfo.memo}</Text>);

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
        return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
				<ScrollView style={[styles.sv]}>
                    <View style={{flexDirection:'row',flex:1,backgroundColor:Global.colors.VIEW_BG,padding:15,}}>
                        <View style={{flex:0.7,width:130,height:80,}}>
                            <Image source={{uri:Global.movieHost+Global.movieImgPath+this.props.CinemaInfo.logoUrl}} style={styles.cinermaPic}/>
                        </View>
                        <View style={{flex:1,flexDirection:'column',paddingTop:10,width:Global.getScreen().width-140,}}>
                            <Text style={styles.cinermaTitle}>{this.props.CinemaInfo.name}</Text>
                        </View>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE}/>
                    <View style={{flex:1,height:80,flexDirection:'row',alignItems: 'center',paddingTop:10, }}>
                        <Icon name='ios-location' size={25} color={Global.colors.IOS_LIGHT_GRAY} style={styles.icons} />
                        <Text style={styles.descrip}>{this.props.CinemaInfo.address}{'\n'}公交：{this.props.CinemaInfo.buslines}</Text>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE}/>
                    <View style={{flex:1,height:50,flexDirection:'row',alignItems:'center'}}>
                        <Icon name='ios-telephone' size={20} color={Global.colors.IOS_LIGHT_GRAY} style={styles.icons}/>                        
                        <Text style={styles.descrip}>{this.props.CinemaInfo.tel}</Text>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE}/>
                    <View style={{height: 15,backgroundColor:Global.colors.VIEW_BG}}/>
                    <View style={{flex:1,flexDirection:'column',paddingLeft:15,paddingRight:15,paddingTop:15,}}>
                        <Text style={{flex:1,fontSize:16,fontWeight:'bold',color:Global.colors.FONT,paddingLeft:15,paddingBottom:15,}}>影院详情</Text>
                        {CinemaDesc}
                        <TouchableOpacity onPress={()=>{this.changShowText();}} style={Global.styles.CENTER}>
                            {showIcon}
                        </TouchableOpacity> 
                    </View>
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        showsVerticalScrollIndicator={false} 
                        automaticallyAdjustContentInsets={false} 
                        style={styles.cinermasHolder} >
                        {this.getPictures()}
                    </ScrollView>
                    <View style={Global.styles.PLACEHOLDER20}/>
			    </ScrollView>
		    </View>
        );

    },

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false}
                backText={'返回'}/>
		);
	},
});

var styles = StyleSheet.create({
    sv: {
        flex:1,
    },
    cinermaBg:{
        width:Global.getScreen().width,
        height:120,
    },
    cinermaPic:{
        // position:'absolute',
        // left:10,
        // top:20,
        // flex:1,
        // paddingLeft:20,
        // paddingTop:20,
        width:120,
        height:80,
    },
    cinermaTitle:{
        // position:'absolute',
        // top:25,
        // left:135,
        flex:1,
        // paddingTop:10,
        paddingRight:20,
        fontSize:16,
        fontWeight:'bold',
        color:Global.colors.FONT,
    },
    score:{
        // position:'absolute',
        flex:1,
        marginTop:20,
        marginRight:30,
        fontSize:14,
        textAlign:'right',
        color:Global.colors.ORANGE,
    },
    icons:{
        width: 40,
        textAlign:'center',
    },
    descrip:{
        flex:1,
        paddingLeft:10,
        paddingRight:10,
        fontSize:14,
        lineHeight:25,
        color:Global.colors.FONT,
    },
    descr:{
        flex:1,
        paddingLeft:10,
        fontSize:16,
        lineHeight:25,
        color:Global.colors.FONT_GRAY,
    }, 
    cinermasHolder: {
        height: 160,
        padding: 20,
        backgroundColor: 'white',
    },
    cinermaHolder: {
        width: 100,
        height: 165,
    },
    picUri: {
        width: 90,
        height: 120,
    },
});

module.exports = Cinema;

