'use strict';
/**
 * 公用选择组件
 */
import React, {
    Component,

} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Modal,
    Dimensions,
    PixelRatio,
    StyleSheet,
} from 'react-native';

class EasyPicker extends Component {

    listView        = null;
    item            = null;
    selectedPosY    = null;

    static displayName = 'EasyPicker';
    static description = 'EasyPicker Component';

    static propTypes = {

        /**
         * 被选择的数据源
         */
    	dataSource: PropTypes.array,

        /**
         * 被选中的值
         */
        selected: PropTypes.string,

        /**
         * 被选中回调
         */
        onChange: PropTypes.func,

    };

    static defaultProps = {
    };

    state = {
        visible: false,
        selected: this.props.selected,
    };

    constructor (props) {
        super(props);
        this.toggle             = this.toggle.bind(this);
        this.onPicked           = this.onPicked.bind(this);
        this.onCancel           = this.onCancel.bind(this);
        this.onOk               = this.onOk.bind(this);
        this.renderRow          = this.renderRow.bind(this);
        this.renderSeparator    = this.renderSeparator.bind(this);
        this.onSelectedRowLayout = this.onSelectedRowLayout.bind(this);
    }

    componentDidMount () {
        console.log('this.selectedPosY:' + this.selectedPosY);
        if(this.selectedPosY)
            this.listView.scrollTo(this.selectedPosY - 120);
    }

    toggle () {
        this.setState({visible: !this.state.visible});
    }

    onPicked (item) {
        this.setState({selected: item.value});
    }

    onCancel () {
        this.setState({visible: false});
    }

    onOk () {
        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.item);
        this.setState({visible: false});
    }

    onSelectedRowLayout (e) {
        //console.log(e);
        if(e) {
            //console.log(e.nativeEvent.layout);
            this.selectedPosY = e.nativeEvent.layout.y;
            if(this.selectedPosY)
                this.listView.scrollTo({x: 0, y: this.selectedPosY - 100, animated: true});
        }
    }

    renderRow (item, sectionId, rowId, highlightRow) {
        let selectedTextStyle = null, selectedRowStyle = null, onLayout = null;
        if (this.state.selected == item.value) {
            this.item = item;
            selectedTextStyle = {
                color: '#000000',
                fontWeight: '500',
            };
            selectedRowStyle = {
                backgroundColor: 'rgba(248,248,248,1)',
            };

            onLayout = this.onSelectedRowLayout;
        }
        return (
            <TouchableOpacity style = {[styles.row, selectedRowStyle]} onPress = {() => this.onPicked(item)} onLayout = {onLayout} >
                <Text style = {[styles.rowText, selectedTextStyle]} >{item.label}</Text>
            </TouchableOpacity>
        );
    }

    renderSeparator (sectionId, rowId) {
        return <View key={'sep_' + rowId} style={styles.sepLine} />;
    }

	render () {
        let ds = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }).cloneWithRows(this.props.dataSource ? this.props.dataSource : []);
		return (
			<Modal
                animationType = "slide"
                transparent = {true}
                visible = {this.state.visible} >
                <View style = {styles.bg} >
                    <View style = {styles.container} >
                        <View style = {styles.buttonContainer} >
                            <TouchableOpacity style = {[styles.button]} onPress = {this.onCancel} ><Text style = {{color: 'rgba(0,122,255,1)'}} >取消</Text></TouchableOpacity>
                            <View style = {{flex: 1}} />
                            <TouchableOpacity style = {[styles.button]} onPress = {this.onOk} ><Text style = {{color: 'rgba(0,122,255,1)'}} >确定</Text></TouchableOpacity>
                        </View>
                        <ListView 
                            ref = {(c) => this.listView = c} 
                            dataSource = {ds}
                            renderRow = {this.renderRow}
                            renderSeparator = {this.renderSeparator}
                            style = {styles.listView}
                        />
                    </View>
                </View>
			</Modal>
		);
	}

}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    container: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: Dimensions.get('window').width,
        height: 280,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    buttonContainer: {
        height: 40,
        borderBottomColor: 'rgba(200,199,204,1)',
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
    },
    button: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listView: {
        flex: 1,
    },
    row: {
        padding: 12,
        paddingLeft: 18,
        paddingRight: 18,
    },
    rowText: {
        fontSize: 14,
        color: 'rgba(130,130,130,1)',//'rgba(93,93,93,1)',
    },
    sepLine: {
        width: Dimensions.get('window').width, 
        backgroundColor: 'rgba(200,199,204,1)',
        height: 1 / PixelRatio.get(),
    },
});

export default EasyPicker;



