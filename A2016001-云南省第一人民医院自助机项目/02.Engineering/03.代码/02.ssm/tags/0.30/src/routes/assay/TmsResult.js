import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './TmsResult.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';

import upImg                from '../../assets/base/up.png';
import downImg              from '../../assets/base/down.png';

class CheckResult extends React.Component {

  static displayName = 'CheckResult';
  static description = '检查检验记录查询';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    printWinVisible: false
  };

  componentWillMount () {
  }

  constructor(props) {
    super(props);
    this.print          = this.print.bind(this);
    this.renderItems    = this.renderItems.bind(this);
  }

  print (row) {
    this.props.dispatch({
      type: 'outpatient/loadCheckInfoForPrint',
      payload: {
        printInfo : row 
      },
    });

    /*this.setState({printWinVisible: true});

    setTimeout(() => {
      this.setState({printWinVisible: false});

      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: '打印完成！',
        }
      });
    }, 3000);*/
  }

  render () {
	const { tmsRecord } = this.props.assay;
	const {orderno, patientNo,jymodelname,patientName, patientDeptname,orderdate,jsdoctor, patientSex,startDate, endDate,} = tmsRecord;
	const height = config.getWS().height - 11 * config.remSize+ 'px';
	return (
      <div style = {{paddingTop: '2rem',height:height}} >
	    <Row>
	      <Col span = {5} > </Col>
	      <Col span = {14} style={{fontSize: '7rem'}}>云南省第一人民医院</Col>
	      <Col span = {5}  > </Col>
	    </Row>
	    <Row style = {{paddingBottom: '2rem'}}>
	      <Col span = {8}  ></Col>
	      <Col span = {8} style={{fontSize: '4rem'}}>血型鉴定实验报告单</Col>
	      <Col span = {8}  ></Col>
	    </Row>
        <Card radius = {false} >
          <Row>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >检查单号</Col>
            <Col span = {20} className = {listStyles.item} >{orderno}</Col>
          </Row>
          <Row>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >病案号</Col>
            <Col span = {3} className = {listStyles.item} >{orderno}</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >姓名</Col>
            <Col span = {3} className = {listStyles.item} >{patientName}</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >性别</Col>
            <Col span = {3} className = {listStyles.item} >{patientSex}</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >年龄</Col>
            <Col span = {3} className = {listStyles.item} >{patientSex}</Col>
          </Row>
          <Row>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >科别</Col>
            <Col span = {3} className = {listStyles.item} >{patientDeptname}</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >病区</Col>
            <Col span = {3} className = {listStyles.item} ></Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} ></Col>
            <Col span = {3} className = {listStyles.item} ></Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >床号</Col>
            <Col span = {3} className = {listStyles.item} ></Col>
          </Row>
          <Row>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >诊断</Col>
          </Row>
          <Row>
         	<Col span = {20} className = {listStyles.item} ></Col>
          </Row>
        </Card>

        <Card radius = {false} style = {{marginTop: '2rem'}} >
          <Row>
            <Col span = {9} className = {listStyles.title} style = {{paddingLeft: '2rem'}} >项目</Col>
            <Col span = {10} className = {listStyles.title + ' ' + listStyles.center} >反应格局</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >测试结果</Col>
          </Row>
          {this.renderItems()}
        </Card>

        <PrintWin visible = {this.state.printWinVisible} />
      </div>
    );
  }

  renderItems () {
    const { tmsRecord } = this.props.assay;
    const { details } = tmsRecord;
    if( !details || details.length <=0)return null;
    return details.map ((row, idx) => {
      const { orderno,jyname,result,jydate,jydoctor,bgdate,bgdoctor,shdate,shdoctor,} = row;
      return (
    		  <Row key = {'_cr_item_' + idx} >
              <Col span = {9} className = {listStyles.item} style = {{paddingLeft: '2rem'}} >{jyname}</Col>
              <Col span = {10} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.resultCol} >
                {result}
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >{result}</Col>
            </Row>
          );
        }
    );
  }

}

export default connect(({assay}) => ({assay}))(CheckResult);





