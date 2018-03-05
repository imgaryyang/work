package com.lenovohit.hcp.pharmacy.manager.print.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

//	请领出库单打印
@Service("outStockCheckPrintDataManagerImpl")
public class OutStockCheckPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<PhaOutputInfo, String> phaOutputInfoManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from PhaOutputInfo where outBill=?";
		String sql = "select outs.OUT_TYPE a1,outs.APP_BILL a2,outs.OUT_TIME a3,dept1.DEPT_NAME a4,outs.OUT_OPER a5,outs.OUT_BILL a6,dept2.DEPT_NAME a7,app.APP_OPER a8"
				+ " from  PHA_OUTPUTINFO outs, b_deptinfo dept1,b_deptinfo dept2 ,pha_applyin app"
				+ " where app.DEPT_ID=dept1.ID " + " and app.FROM_DEPT_ID=dept2.ID"
				+ " and outs.app_bill=app.APP_BILL and outs.out_bill='"+bizId+"'";
		// + bizId + "'";
		PrintData data = new PrintData();
		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);

			List<Object> objList = (List<Object>) phaOutputInfoManager.findBySql(sql);
			// 查询科室名称等，为了调试方便，不建议换行或者改名
			String _OUT_TYPE = "", _APP_BILL = "", _OUT_TIME = "", _TO_DEPT_NAME = "", _OUT_OPER = "", _OUT_BILL = "",
					_FROM_DEPT_NAME = "", _APP_OPER = "";
			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				_OUT_TYPE = (String) obj[0];
				if(StringUtils.isNotBlank(_OUT_TYPE)){
					StringBuilder idSql = new StringBuilder();
					List<String> idValues = new ArrayList<String>();
					String hosId = user.getHosId();
					idValues.add(hosId);
					idValues.add(_OUT_TYPE);
					idSql.append("SELECT dict from Dictionary dict WHERE dict.hosId = ? and columnName = 'OUT_TYPE' and columnKey = ? ");
					Dictionary model = dictionaryManager.findOne(idSql.toString(), idValues.toArray());
					if(model!=null){
						_OUT_TYPE = model.getColumnVal();
					}
				}
				_APP_BILL = (String) obj[1];
				_OUT_TIME = formatDate.format(obj[2]);
				_TO_DEPT_NAME = (String) obj[3];
				_OUT_OPER = (String) obj[4];
				_OUT_BILL = (String) obj[5];
				_FROM_DEPT_NAME = (String) obj[6];
				_APP_OPER = (String) obj[7];
			}
			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>出库类型:</th>" + "  <td>" + _OUT_TYPE
					+ "</td><th>请领单</th><td>" + _OUT_BILL + "</td><th>出库单号:</th>" + "  <td>" + _APP_BILL + "</td>"
					+ "</tr><tr>" + "  <th>出库时间:</th>" + "  <td>" + _OUT_TIME + "</td>" +  "  <th>出库科室:</th>" + "  <td>"
					+ _FROM_DEPT_NAME + "->" + _TO_DEPT_NAME + "</td>" + "  <th>出库人:</th>" + "  <td>" + _OUT_OPER
					+ "</td><th>领用人</th><td>" + _APP_OPER + "</td></tr>" + "</table>";
			data.setT1(_outHtml);
			List<PhaOutputInfo> _list = phaOutputInfoManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>药品名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);
			BigDecimal _sum2 = new BigDecimal(0);
			BigDecimal _subtotal1 = new BigDecimal(0);
			BigDecimal _subtotal2 = new BigDecimal(0);
			for (PhaOutputInfo _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getOutSum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getOutSum().divide(new BigDecimal(_detail.getDrugInfo().getPackQty())));
					_sum1 = _sum1.add(_subtotal1);
					_subtotal2 = _detail.getSalePrice().multiply(_detail.getOutSum().divide(new BigDecimal(_detail.getDrugInfo().getPackQty())));
					_sum2 = _sum2.add(_subtotal1);
				}
				_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDrugSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDoseUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getCompanyInfo()!=null ? _detail.getDrugInfo().getCompanyInfo().getCompanyName() : "") + "</td>" + "  <td>"
						+ (_detail.getProduceDate()!=null ? formatDate.format(_detail.getProduceDate()) : "") + "</td><td>" + formatDate.format(_detail.getValidDate()) + "</td>" + "  <td>"
						+ (_detail.getOutSum()!=null&&_detail.getDrugInfo()!=null&&_detail.getDrugInfo().getPackQty()!=null ? _detail.getOutSum().divide(new BigDecimal(_detail.getDrugInfo().getPackQty())) : '0') + "</td>" + "  <td>" + PrintUtil.getAmount(_detail.getBuyPrice()) + "</td><td>" + PrintUtil.getAmount(_subtotal1)
						+ "</td><td>" + PrintUtil.getAmount(_detail.getSalePrice()) + "</td><td>" + PrintUtil.getAmount(_subtotal2) + "</td></tr>\n";

			}
			_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td>"
					+ "  <td></td>" + "  <td></td>" + "  <td></td><td></td>" + "  <td>" + PrintUtil.getAmount(_sum1) + "</td><td></td><td>"
					+ PrintUtil.getAmount(_sum2) + "</td></tr>\n";
			_outHtml += "</table>";
			data.setT2(_outHtml);
		}
		return data;
	}
}