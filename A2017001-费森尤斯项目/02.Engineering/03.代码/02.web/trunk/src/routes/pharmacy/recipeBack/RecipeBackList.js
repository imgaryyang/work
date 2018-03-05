import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal } from 'antd';
import CommonTable from '../../../components/CommonTable';
import ShadowDiv from '../../../components/ShadowDiv';


class RecipeBackList extends Component { 
  
  componentWillMount() {
    // 载入医嘱信息
    this.props.dispatch({
      type: 'phaRecipe/load',
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'phaRecipe/load',
      payload: { page },
    });
  }
  handleSubmit(record) {
    this.props.dispatch({
      type: 'phaRecipe/recipe',
      id: record.id,
    });
  }

  handleBack(record) {
    this.props.dispatch({
      type: 'phaRecipe/back',
      id: record.id,
    });
  }
  render() {
    const { data, page, dicts, dispatch } = this.props;
    const ButtonGroup = Button.Group;
    // 不需要特殊渲染的列使用此方法公用判断是否跨列
    const columns = [
      { title: '处方号',
        dataIndex: 'id',
        key: 'id',
        width: '25%',
        className: 'text-no-wrap text-align-center',
      },
      { title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        className: 'text-no-wrap  text-align-center',
        render: (text, record) => {
          return record.name;
        },
      },
      { title: '诊疗卡号',
        dataIndex: 'medicalCardNo',
        className: 'text-no-wrap text-align-center',
        key: 'medicalCardNo',
        width:'25%',
      },
      { title: '操作',
        key: 'action',
        width: '15%',
        className: 'text-align-center',
        render: (text, record) => {
          return <ButtonGroup><Button size = 'small' onClick={this.handleBack.bind(this, record)}>驳回</Button><Button size = 'small' type="primary" onClick={this.handleSubmit.bind(this, record)}>确认</Button></ButtonGroup>
          
        },
      },
    ];

    const expandTable = (record) => {
      const expandColumns = [
        { title: '项目',
          dataIndex: 'tradeName',
          key: 'tradeName',
        },
        { title: '单价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: 80,
          className: 'text-no-wrap text-align-right',
          render: (text, record) => {
            return {
              children: text ? parseFloat(text).formatMoney(4) : '',
              props: {
                colSpan: record.tradeName ? 1 : 0,
              },
            };
          },
        },
        { title: '数量',
          dataIndex: 'applyNum',
          key: 'applyNum',
          width: 45,
          className: 'text-no-wrap text-align-right',
          render: (text, record) => {
            return {
              children: parseFloat(text),
              props: {
                colSpan: record.tradeName ? 1 : 0,
              },
            };
          },
        },
      ];
      return (
        <CommonTable
          data={record.detailList}
          size="small"
          bordered
          columns={expandColumns}
          pagination={false}
          rowSelection={false}
        />
      );
    };


    return (
      <div>
        <ShadowDiv showTopShadow={false} showBottomShadow={false}  >
          <CommonTable
            data={data}
            columns={columns}
            page={page}
            onPageChange={this.onPageChange.bind(this)}
            bordered
            expandedRowRender={record => expandTable(record)}
            className="compact-table"
            
            rowSelection={false}
          />
        </ShadowDiv>
      </div>
    );
  }
}

export default RecipeBackList;

