package com.lenovohit.hcp.material.manager.print.impl;

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
import com.lenovohit.hcp.material.model.MatInputInfo;

//入库单打印-物资
@Service("matInputPrintDataManager")
public class MatInputPrintDataManager extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<MatInputInfo, String> matInputInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from MatInputInfo where inBill=?";
		// 查询科室名称等，为了调试方便，不建议换行或者改名
		String _sql = ""
				+ "select top 1 ins.IN_TYPE a0, ins.IN_BILL, "
				+" ins.IN_TIME a1,"
				+" dept.DEPT_NAME a2,"
				+" ins.IN_OPER a3,"
				+" COLUMN_VAL a4,"
				+" ins.BUY_BILL a5 from  MATERIAL_INPUTINFO ins,b_deptinfo dept,B_DICVALUE dic "
				+" where ins.IN_TYPE=dic.COLUMN_KEY and ins.DEPT_ID=dept.ID and  ins.in_BILL='" + bizId + "'";
		PrintData data = new PrintData();
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);

			List<Object> objList = (List<Object>) matInputInfoManager.findBySql(_sql);

			String IN_TYPE = "", IN_BILL = "", IN_TIME = "", DEPT_NAME = "", IN_OPER = "", COLUMN_VAL = "",
					BUY_BILL = "";

			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				IN_TYPE = (String) obj[0];// 入库类型
				IN_BILL = (String) obj[1];// 入库单号
				IN_TIME = PrintUtil.getDate((Date)obj[2]);// 入库时间
				DEPT_NAME = (String) obj[3];// 入库科室
				IN_OPER = PrintUtil.getNotNull((String) obj[4]);// 入库人
				COLUMN_VAL = (String) obj[5];// 入库类型名称
				BUY_BILL = (String) obj[6];// 入库类型
			}

			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>入库类型:</th>" + "  <td>" + COLUMN_VAL
					+ "</td>";
			if ("I1".equals(COLUMN_VAL)) {
				_outHtml += "<th>采购单</th><td>" + BUY_BILL + "</td>";
			}
			if ("I8".equals(COLUMN_VAL)) {
				_outHtml += "<th>请领单</th><td>" + BUY_BILL + "</td>";
			}

			_outHtml += "  <th>入库单号:</th>" + "  <td>" + IN_BILL + "</td>" + "  <th>入库时间:</th>" + "  <td>" + IN_TIME
					+ "</td>" + "  <th>入库科室:</th>" + "  <td>" + DEPT_NAME + "</td>" + "  <th>入库人:</th>" + "  <td>"
					+ IN_OPER + "</td>" + "</tr></table>";

			data.setT1(_outHtml);
			List<MatInputInfo> _list = matInputInfoManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>物资名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);// 小计
			BigDecimal _sum2 = new BigDecimal(0);// 小计
			BigDecimal _subtotal1 = new BigDecimal(0);// 合计
			BigDecimal _subtotal2 = new BigDecimal(0);// 合计
			for (MatInputInfo _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getInSum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getInSum());
					_sum1 = _sum1.add(_subtotal1);
					if(_detail.getSalePrice()!=null && _detail.getInSum()!=null){
						_subtotal2 = _detail.getSalePrice().multiply(_detail.getInSum());
					}
					_sum2 = _sum2.add(_subtotal2);
				}
				_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getMaterialSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getMinUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getCompanyInfo().getCompanyName()) + "</td>" + "  <td>"
						+ PrintUtil.getDate(_detail.getProduceDate()) + "</td><td>"
						+ PrintUtil.getDate(_detail.getValidDate()) + "</td>" + "  <td>" + _detail.getInSum().longValue() + "</td>"
						+ "  <td>" + _detail.getBuyPrice() + "</td><td>" + PrintUtil.getAmount(_subtotal1) + "</td><td>"
						+ (_detail.getSalePrice()!=null ? _detail.getSalePrice() : "0.00") + "</td><td>" + PrintUtil.getAmount(_subtotal2) + "</td></tr>\n";

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
