package com.lenovohit.hcp.pharmacy.manager.print.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;

//	请领入库单打印
@Service("inStockCheckPrintDataManagerImpl")
public class InStockCheckPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<PhaInputInfo, String> phaOutputInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from PhaInputInfo where inBill=?";
		//注意：下面的取数据逻辑是不完整的，由于在PhaInputInfo对象中没有申请的信息，
		//导致两张表无法关联，后面增加连接字段后要修改这个逻辑 jiangy
		String sql = ""
				+" select "
				+" '请领入库' a0,"
				+" app.APP_BILL a1,"
				+" dept1.DEPT_NAME a2,"
				+" dept2.DEPT_NAME a3,"
				+" app.APP_OPER a4"
				+" from "
				+" b_deptinfo dept1,"
				+" b_deptinfo dept2, "
				+" pha_applyin app "
				+" where app.DEPT_ID=dept1.ID  and app.FROM_DEPT_ID=dept2.ID "
				+" and app.app_bill='" + bizId + "'";
		PrintData data = new PrintData();
		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);

			List<Object> objList = (List<Object>) phaOutputInfoManager.findBySql(sql);
			// 查询科室名称等，为了调试方便，不建议换行或者改名
			String _OUT_TYPE = "", _APP_BILL = "", _TO_DEPT_NAME = "",_FROM_DEPT_NAME = "", _APP_OPER = "";
			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				_OUT_TYPE = (String) obj[0];
				_APP_BILL = (String) obj[1];
				_TO_DEPT_NAME = (String) obj[2];
				_FROM_DEPT_NAME = (String) obj[3];
				_APP_OPER = (String) obj[4];
			}
			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>出库类型:</th>" + "  <td>" + _OUT_TYPE
					+ "</td><th>请领单</th><td>"  + _APP_BILL + "</td>"
					+ "  <th>出库科室:</th>" + "  <td>"
					+ _TO_DEPT_NAME + "->" + _FROM_DEPT_NAME + "</td>"
					+ "</td><th>领用人</th><td>" + _APP_OPER + "</td></tr>" + "</table>";
			data.setT1(_outHtml);
			List<PhaInputInfo> _list = phaOutputInfoManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>药品名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);
			BigDecimal _sum2 = new BigDecimal(0);
			BigDecimal _subtotal1 = new BigDecimal(0);
			BigDecimal _subtotal2 = new BigDecimal(0);
			;
			for (PhaInputInfo _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getInSum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getInSum());
					_sum1 = _sum1.add(_subtotal1);
					_subtotal2 = _detail.getSalePrice().multiply(_detail.getInSum());
					_sum2 = _sum2.add(_subtotal1);
				}
				_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDrugSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDoseUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getProducer()) + "</td>" + "  <td>"
						+ _detail.getProduceDate() + "</td><td>" + _detail.getValidDate() + "</td>" + "  <td>"
						+ _detail.getInSum() + "</td>" + "  <td>" + _detail.getBuyPrice() + "</td><td>" + _subtotal1
						+ "</td><td>" + _detail.getSalePrice() + "</td><td>" + _subtotal2 + "</td></tr>\n";

			}
			_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td>"
					+ "  <td></td>" + "  <td></td>" + "  <td></td><td></td>" + "  <td>" + _sum1 + "</td><td></td><td>"
					+ _sum2 + "</td></tr>\n";
			_outHtml += "</table>";
			data.setT2(_outHtml);
		}
		return data;
	}
}