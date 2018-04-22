import React, { PropTypes }     from 'react';
import { connect }              from 'dva';
import { Row, Col }             from 'antd';
import config                   from '../config';
import styles                   from './career.css';
import moment                   from 'moment';
import Button               from './Button';
class Month extends React.Component {

  static defaultProps = {
    width: 800,
  };

  careers = [
	  {type:'0005',code:'01',name:'工人',pinyin:'GR',wb:'AW', },
	  {type:'0005',code:'02',name:'农民',pinyin:'NM',wb:'PN',},
	  {type:'0005',code:'03',name:'经商',pinyin:'JS',wb:'XU',},
	  {type:'0005',code:'04',name:'学生',pinyin:'XS',wb:'IT',},
	  {type:'0005',code:'05',name:'军人',pinyin:'JR',wb:'PW',},
	  {type:'0005',code:'06',name:'儿童',pinyin:'ET',wb:'QU',},
	  {type:'0005',code:'07',name:'待业',pinyin:'DY',wb:'TO',},
	  {type:'0005',code:'08',name:'家务',pinyin:'JW',wb:'PT',},
	  {type:'0005',code:'09',name:'干部职员',pinyin:'GBZY',wb:'FUBK',},
	  {type:'0005',code:'10',name:'教育',pinyin:'JY',wb:'FY',},
	  {type:'0005',code:'11',name:'宗教',pinyin:'ZJ',wb:'PF',},
	  {type:'0005',code:'12',name:'文艺',pinyin:'WY',wb:'YA',},
	  {type:'0005',code:'13',name:'体育',pinyin:'TY',wb:'WY',},
	  {type:'0005',code:'14',name:'离退休',pinyin:'LTX',wb:'YVW',},
	  {type:'0005',code:'15',name:'牧民',pinyin:'MM',wb:'TN',},
	  {type:'0005',code:'16',name:'渔民',pinyin:'YM',wb:'IN',},
	  {type:'0005',code:'17',name:'民工',pinyin:'MG',wb:'NA',},
	  {type:'0005',code:'18',name:'海员',pinyin:'HY',wb:'IK',},
	  {type:'0005',code:'19',name:'幼托儿童',pinyin:'YTET',wb:'XRQU',},
	  {type:'0005',code:'20',name:'散居儿童',pinyin:'SJET',wb:'ANQU',},
	  {type:'0005',code:'21',name:'保育员及保姆',pinyin:'BYYJBM',wb:'WYKEWV',},
	  {type:'0005',code:'22',name:'餐饮食品',pinyin:'CYSP',wb:'HQWK',},	
	  {type:'0005',code:'23',name:'医务人员',pinyin:'YWRY',wb:'ATWK',},	
	  {type:'0005',code:'24',name:'不详'	,pinyin:'BX',wb:'GY',},
	  {type:'0005',code:'25',name:'技术员',pinyin:'JSY',wb:'RSK',},
	  {type:'0005',code:'26',name:'自由职业',pinyin:'ZYZY',},
  ];
  state={
  }
  
  
  constructor (props) {
    super(props);
    this.onSelectCareer = this.onSelectCareer.bind(this);
  }

  onSelectCareer (career) {
	  if(this.props.onSelectCareer)this.props.onSelectCareer(career);
  }

  componentWillMount () {
  }
  init(value){
  }
  render () {
    // let { } = this.props;
 	return(
	  <div className = {styles.container} >
	    <div className = {styles.innerContainer} >
	      <Row>
	      {
	    	  this.careers.map((career, idx) => {
                return (
	              <Col key = {idx} span = {4} className={styles.career} style = {{padding: '2px'}} >
	                <div onClick = {() => this.onSelectCareer(career)  } >
	                  <span>{career.name}</span>
	                </div>
	              </Col>
		    	)
		      })
	      }
	      </Row>
	    </div>
	  </div>
    );
  }
}

export default connect()(Month);


