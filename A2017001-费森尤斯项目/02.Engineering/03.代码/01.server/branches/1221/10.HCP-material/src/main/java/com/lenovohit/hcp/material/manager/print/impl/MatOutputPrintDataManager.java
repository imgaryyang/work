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
import com.lenovohit.hcp.material.model.MatOutputInfo;

//出库单打印-物资
@Service("matOutputPrintDataManager")
public class MatOutputPrintDataManager extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<MatOutputInfo, String> phaOutputInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from MatOutputInfo where outBill=?";
		// 查询科室名称等，为了调试方便，不建议换行或者改名
		String _sql = "select top 1 outs.OUT_TYPE a0," + " outs.APP_BILL a1," + " outs.OUT_TIME a2,"
				+ " dept.DEPT_NAME a3," + " outs.OUT_OPER a4," + " COLUMN_VAL a5"
				+ " from  MATERIAL_OUTPUTINFO outs,b_deptinfo dept,B_DICVALUE dic"
				+ " where outs.OUT_TYPE=dic.COLUMN_KEY and outs.DEPT_ID=dept.ID and outs.out_bill='" + bizId + "'";
		// System.out.ptint("sql:"+_sql);
		PrintData data = new PrintData();
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);
			List<Object> objList = (List<Object>) phaOutputInfoManager.findBySql(_sql);
			String _OUT_TYPE = "", _APP_BILL = "", _OUT_TIME = "", _DEPT_NAME = "", _OUT_OPER = "", _COLUMN_VAL = "";
			if (objList != null && objList.size() == 1) {
				Object[] obj = (Object[]) objList.get(0);
				_OUT_TYPE = (String) obj[0];// 出库类型
				_APP_BILL = (String) obj[1];// 采购单号
				_OUT_TIME = PrintUtil.getDate((Date) obj[2]);// 出库时间
				_DEPT_NAME = (String) obj[3];// 科室名称
				_OUT_OPER = (String) obj[4];// 出库人
				_COLUMN_VAL = (String) obj[5];// 出库类型名称
			}
			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>出库类型:</th>" + "  <td>" + _COLUMN_VAL
					+ "</td>" + "  <th>出库单号:</th>" + "  <td>" + bizId + "</td>" + "  <th>出库时间:</th>" + "  <td>"
					+ _OUT_TIME + "</td>" + "  <th>出库科室:</th>" + "  <td>" + _DEPT_NAME + "</td>" + "  <th>出库人:</th>"
					+ "  <td>" + _OUT_OPER + "</td>" + "</tr>" + "</table>";
			data.setT1(_outHtml);
			List<MatOutputInfo> _list = phaOutputInfoManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>药品名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);
			BigDecimal _sum2 = new BigDecimal(0);
			BigDecimal _subtotal1 = new BigDecimal(0);
			BigDecimal _subtotal2 = new BigDecimal(0);
			for (MatOutputInfo _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getOutSum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getOutSum());
					_sum1 = _sum1.add(_subtotal1);
					_subtotal2 = _detail.getSalePrice().multiply(_detail.getOutSum());
					_sum2 = _sum2.add(_subtotal2);
				}
				_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getMaterialSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getMinUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>"
						//_detail.getMatInfo()
						+ PrintUtil.getNotNull("") + "</td>" + "  <td>"
						+ PrintUtil.getDate(_detail.getProduceDate()) + "</td><td>"
						+ PrintUtil.getDate(_detail.getValidDate()) + "</td>" + "  <td>"
						+ _detail.getOutSum().longValue() + "</td>" + "  <td>"
						+ PrintUtil.getAmount(_detail.getBuyPrice()) + "</td><td>" + PrintUtil.getAmount(_subtotal1)
						+ "</td><td>" + PrintUtil.getAmount(_detail.getSalePrice()) + "</td><td>"
						+ PrintUtil.getAmount(_subtotal2) + "</td></tr>\n";

			}
			_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td>"
					+ "  <td></td>" + "  <td></td>" + "  <td></td><td></td>" + "  <td>" + PrintUtil.getAmount(_sum1)
					+ "</td><td></td><td>" + PrintUtil.getAmount(_sum2) + "</td></tr>\n";
			_outHtml += "</table>";
			data.setT2(_outHtml);
		}
		return data;
	}

}