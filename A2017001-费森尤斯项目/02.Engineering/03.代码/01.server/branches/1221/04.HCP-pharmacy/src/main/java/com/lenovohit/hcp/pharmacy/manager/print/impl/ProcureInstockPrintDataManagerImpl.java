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

//	采购入库单
@Service("procureInstockPrintDataManagerImpl")
public class ProcureInstockPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<PhaInputInfo, String> phaInputInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from PhaInputInfo where inBill=?";
		String sql = "select ins.IN_TYPE,ins.IN_BILL,ins.IN_TIME,dept.DEPT_NAME,ins.IN_OPER,BUY_BILL from  PHA_INPUTINFO ins, b_deptinfo dept where ins.DEPT_ID=dept.ID and ins.in_BILL='"
				+ bizId + "'";
		PrintData data = new PrintData();
		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);

			List<Object> objList = (List<Object>) phaInputInfoManager.findBySql(sql);

			String _IN_TYPE = "", _IN_BILL = "", _IN_TIME = "", _DEPT_NAME = "", _IN_OPER = "", _BUY_BILL = "";

			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				_IN_TYPE = (String) obj[0];
				_IN_BILL = (String) obj[1];
				_IN_TIME = formatDate.format(obj[2]);
				_DEPT_NAME = (String) obj[3];
				_IN_OPER = PrintUtil.getNotNull((String) obj[4]);
				_BUY_BILL = PrintUtil.getNotNull((String) obj[5]);
			}

			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>入库类型:</th>" + "  <td>" + _IN_TYPE
					+ "</td>" + "  <th>入库单号:</th>" + "  <td>" + _IN_BILL + "</td><th>采购单号:</th><td>" + _BUY_BILL
					+ "</td><th>入库时间:</th>" + "  <td>" + _IN_TIME + "</td>" + "  <th>入库科室:</th>" + "  <td>" + _DEPT_NAME
					+ "</td>" + "  <th>入库人:</th>" + "  <td>" + _IN_OPER + "</td>" + "</tr>" + "</table>";
			data.setT1(_outHtml);
			List<PhaInputInfo> _list = phaInputInfoManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>物资名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0), _sum2 = new BigDecimal(0), _subtotal1 = new BigDecimal(0),
					_subtotal2 = new BigDecimal(0);
			;
			for (PhaInputInfo _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getInSum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getInSum());
					_sum1 = _sum1.add(_subtotal1);
					_subtotal2 = _detail.getSalePrice().multiply(_detail.getInSum());
					_sum2 = _sum2.add(_subtotal2);
				}
				_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDrugSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDoseUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>" + PrintUtil.getNotNull(_detail.getCompany())
						+ "</td>" + "  <td>" + formatDate.format(_detail.getProduceDate()) + "</td><td>"
						+ formatDate.format(_detail.getValidDate()) + "</td>" + "  <td>" + _detail.getInSum() + "</td>"
						+ "  <td>" + _detail.getBuyPrice() + "</td><td>" + _subtotal1 + "</td><td>"
						+ _detail.getSalePrice() + "</td><td>" + _subtotal2 + "</td></tr>\n";

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
