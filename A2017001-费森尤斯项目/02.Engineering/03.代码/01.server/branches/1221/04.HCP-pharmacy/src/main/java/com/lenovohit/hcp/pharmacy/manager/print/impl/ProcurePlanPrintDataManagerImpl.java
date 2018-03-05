package com.lenovohit.hcp.pharmacy.manager.print.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;

//	采购单打印-药品
@Service("procurePlanPrintDataManagerImpl")
public class ProcurePlanPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<PhaBuyBill, String> phaBuyBillManager;
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from PhaBuyDetail where buyBill=?";
		String sql = ""
				+" select"
				+" buy.BUY_BILL a0,"
				+" dept.DEPT_NAME a1,"
				+" buy.CREATE_TIME a2,"
				+" buy.CREATE_OPER a3"
				+" from  pha_buybill buy,b_deptinfo dept"
				+" where "
				+" buy.BUY_BILL='"+bizId+"'"
				+" and buy.DEPT_ID=dept.ID";

		List<Object> values = new ArrayList<Object>();
		values.add(bizId);

		PrintData data = new PrintData();
		double _AUITD_NUM = 0;
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> objList = (List<Object>) phaBuyBillManager.findBySql(sql);
			String _BUY_BILL = "", _DEPT_NAME = "", _CREATE_TIME = "",CREATE_OPER = "";
			BigDecimal _sum1 = new BigDecimal(0);

			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				_BUY_BILL = (String)obj[0].toString();
				_DEPT_NAME = PrintUtil.getNotNull((String)obj[1]);
				_CREATE_TIME = PrintUtil.getDate((Date)obj[2]);
				CREATE_OPER = PrintUtil.getNotNull((String)obj[3]);
			}

			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>采购单号:</th>" + "  <td>"
					+ _BUY_BILL+ "</td>" + "  <th>供应商:</th>" + "<td></td>" + "  <th>采购科室:</th>" + "  <td>" + _DEPT_NAME + "</td>";

			_outHtml += "<tr>" + "  <th>申请人:</th>" + "  <td>" +CREATE_OPER + "</td>"
					+ "  <th>申请时间:</th>" + "  <td>" +_CREATE_TIME + "</td></tr></table>";
			data.setT1(_outHtml);

			List<PhaBuyDetail> _list = phaBuyDetailManager.find(hql, values);
			if (_list != null) {
				_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
						+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>药品名称</th>" + "  <th>规格</th>"
						+ "  <th>单位</th>" + "<th>生产厂家</th>" + "  <th>计划数量</th>" + "<th>采购价</th>" + "  <th>金额</th>"
						+ "</tr>\n";
				BigDecimal _sum = new BigDecimal(0);
				for (PhaBuyDetail _detail : _list) {
					BigDecimal _count = new BigDecimal(0);
					if (_detail.getBuyPrice() != null) {
						_count = _detail.getBuyPrice().multiply(new BigDecimal(_detail.getBuyNum()));
						_sum = _sum.add(_count);
					}
					_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
							+ PrintUtil.getNotNull(_detail.getDrugInfo().getDrugSpecs()) + "</td>" + "  <td>"
							+ PrintUtil.getNotNull(_detail.getDrugInfo().getDoseUnit()) + "</td>" + "  <td>"
							+ PrintUtil.getNotNull(_detail.getDrugInfo().getCompanyInfo().getCompanyName()) + "</td>" + "  <td>"
							+ _detail.getBuyNum() + "</td>" + "<td>"
							+ _detail.getBuyPrice() + "</td><td>" + _count + "</td>" + "</tr>\n";

				}
				_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" 
						+ "  <td></td>" + "  <td></td>" + "  <td>" + PrintUtil.getAmount(_sum) + "</td>" + "</tr>\n";
				_outHtml += "</table>";
				data.setT2(_outHtml);
			}
		}
		return data;
	}
}
