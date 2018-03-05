'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Confirm = require('../lib/Confirm');
var bossVacaMng = require('./bossVacaMng');
var empVacaList = require('./empVacaList');

var {
	Animated,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	InteractionManager,
	ListView
}=React;

var VacationMng = React.createClass({
	 list: [
        {text: '请假记录(老板端)', icon: 'clipboard', component: bossVacaMng, hideNavBar:false},
        {text: '请假记录(员工端)', icon: 'android-list', component: empVacaList, hideNavBar:true},
    ],

	 push: function(title, component,hideNavBar) {
    	var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
        nav.push({
            title: title,
            component: component,
            hideNavBar: hideNavBar?true:false,
        });
    },

	_renderList: function() {
        
        var list = this.list.map(({text, icon, component,hideNavBar,separator}, idx)=>{
            
            var topLine = idx === 0 ? (<View style={styles.fullSeparator} ></View>) : null;
            var bottomLine = idx === this.list.length - 1 ? (<View style={styles.fullSeparator} ></View>) : null;

            var itemLine = idx < this.list.length - 1 ? (<View style={styles.separator} ></View>) : null;
            if(separator === true)
            	itemLine = (
            		<View key={idx + '_' + text} >
	            		<View style={styles.fullSeparator} />
	            		<View style={styles.placeholder} />
	            		<View style={styles.fullSeparator} />
                	</View>
            	);

            return (
                <View key={idx + '_' + text} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global.styles.CENTER]} onPress={()=>{
                        if(component) {
                            this.push(text, component, hideNavBar);
                        }
                    }} >
                        <View style={[Global.styles.CENTER, styles.listItemIcon, ]} >
                            <Icon name={icon} size={22} color={Global.colors.ORANGE} style={[styles.icon, Global.styles.ICON]} />
                        </View>
                        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    },
	render : function(){
		return (
			<View style={styles.container}>
				<ScrollView >
					<View style={styles.placeholder} />
					   {/*<TouchableOpacity style={[Global.styles.BORDER,styles.item,]} onPress={()=>{this.push('休假管理',bossVacaMng,false)}}>
							<Icon name='social-snapchat' style={[Global.styles.ICON]} size={25} color={Global.colors.PURPLE}></Icon>
							<Text style={[styles.text]} >请假记录(老板端)</Text>
							<Icon name='ios-arrow-right' size={18} color={'#000000'} style={[Global.styles.ICON, {width: 20,marginRight: 40}]}></Icon>
						</TouchableOpacity>
						<TouchableOpacity style={[Global.styles.BORDER,styles.item]} onPress={()=>{this.onPressList('休假管理',expenseList,false)}}>
							<Icon name='social-freebsd-devil' style={[Global.styles.ICON]} size={25} color={Global.colors.ORANGE}></Icon>
							<Text style={styles.text}>请假记录(员工端)</Text>
							<Icon name='ios-arrow-right' size={18} color={'#000000'} style={[Global.styles.ICON, {width: 20,marginRight: 40}]}></Icon>
						</TouchableOpacity>*/}
						
					{this._renderList()}
					<View style={styles.placeholder} />
				</ScrollView>
			</View>	
	);
	}

});
var styles = StyleSheet.create({
	container: {
			flex: 1,
			backgroundColor: Global.colors.IOS_GRAY_BG,
		},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	
	separator: {
        width: Global.getScreen().width - 15, 
        left: 15,
        backgroundColor: Global.colors.IOS_SEP_LINE, 
        height: 1/Global.pixelRatio,
    },
    fullSeparator: {
        width: Global.getScreen().width, 
        backgroundColor: Global.colors.IOS_SEP_LINE, 
        height: 1/Global.pixelRatio,
    },
    listItem: {
        width: Global.getScreen().width,
        height: 50,
        flexDirection: 'row',
        paddingLeft: 15,
        backgroundColor: 'white',
    },
    listItemIcon: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
});
module.exports = VacationMng;