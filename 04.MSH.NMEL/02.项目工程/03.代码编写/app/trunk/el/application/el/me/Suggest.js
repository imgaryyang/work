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

import * as Global  	from '../../Global';

import NavBar       	from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';
import AuthAction       from '../../flux/AuthAction';

class Suggest extends Component {

    static displayName = 'Suggest';
    static description = '反馈意见';
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
        feedback: null,
        connect: null,
	};

    constructor (props) {
        super(props);
        this.changeFeedBack = this.changeFeedBack.bind(this);
        this.doSave = this.doSave.bind(this);
        this.goPop = this.goPop.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	componentWillReceiveProps () {
        
	}
    async doSave () {
        //保存反馈意见
        var FIND_URL = 'el/appFeedBack/create';

        this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });
        try {
            let responseData = await this.request(Global._host + FIND_URL, {
                body: JSON.stringify({
                    feedback: this.state.feedback,
                    appId: '8a8c7db154ebe90c0154ebfdd1270004',
                    // hospId: '123',
                    // userId: this.props.userInfo.id,
                })
            });
            this.hideLoading();
            if (responseData.success == false) {
                Alert.alert(
                    '提示',
                    responseData.msg ,
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({value: {},});
                            }
                        }
                    ]
                );
            } else {
                this.toast('保存成功！');
                // UserAction.onUpdateUser(responseData.result);
                this.goPop();
                // this.props.navigator.popToTop();
            }
        } catch(e) {
            this.hideLoading();
            this.handleRequestException(e);
        }

    }
    refresh(){
        this.setState({
            data: null,
            feedback: null,
            connect: null,
        });
    }
    changeFeedBack(value){
        this.setState({
            feedback: value,
        });
    }
    goPop(){
        this.props.navigator.pop();

    }
    // ChangeConnect(value){

    // }

    onBlur(){

    }
    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ScrollView>
                <View style={Global._styles.PLACEHOLDER20} />
                <View style={styles.scrollView}>
                    <Text style={styles.text}>反馈意见:</Text>
                    <View style={Global._styles.PLACEHOLDER10} />
                    <View style={[styles.viewInputHolder]}>
                        <TextInput style={[styles.rowInput]}
                            multiline={true}
                            maxLength={500}
                            onChangeText={(value) => {this.changeFeedBack(value);}} 
                            placeholder='您好，请你描述你遇到的问题，或提出你宝贵的意见，我们将有专人及时与你联系！' />
                    </View>
                </View>
                <Separator height = {20} />
                <View style = {styles.buttonHolder} >
                    <Button text = "取消" onPress = {this.goPop} theme = {Button.THEME.BLUE}/>
                    <Separator width = {10} />
                    <Button text = "提交" onPress = {this.doSave} theme = {Button.THEME.BLUE}/>
                </View>
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
                    title={"反馈意见"}
                    backText={"我"} />
            );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        //backgroundColor: 'white',
        marginBottom: Global._os == 'ios' ? 48 : 0,
        padding: 10,
    },
    text:{
        fontSize: 14,
        width: 80,
        fontWeight: '500',
        color: 'rgba(93,93,93,1)',
    },
    rowInput: {
        flex: 1, 
        fontSize: 14,
        backgroundColor: 'white',
        padding: 6
    },
    viewInputHolder: {
        flex: 1, 
        flexDirection: 'row',
        height: 120,
        borderWidth: 1 / Global._pixelRatio, 
        borderColor: Global._colors.IOS_SEP_LINE, 
        borderRadius: 3,
    },
   
    buttonHolder:{
        flexDirection: 'row', 
        marginTop: 0,
        marginLeft: 10,
        marginRight: 10,
    },
});

export default Suggest;