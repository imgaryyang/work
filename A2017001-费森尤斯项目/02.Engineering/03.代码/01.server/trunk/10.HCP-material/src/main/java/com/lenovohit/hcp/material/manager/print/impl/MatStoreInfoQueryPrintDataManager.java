package com.lenovohit.hcp.material.manager.print.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatStoreInfo;

//库存查询打印-物资
@Service("matStoreInfoQueryPrintDataManager")
public class MatStoreInfoQueryPrintDataManager extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		StringBuilder jql = new StringBuilder("select a from MatStoreInfo a left join a.materialInfo b where a.deptId=?");
		List<Object> values = new ArrayList<Object>();
		PrintData data = new PrintData();
		String _deptId = "";
		if (!"undefined".equals(bizId) && bizId != null) {
			values.add(bizId);
			_deptId = bizId;
		} else {
			values.add(user.getDeptId());
			_deptId = user.getDeptId();
		}

		String _outHtml = "";
		data.setT1(_outHtml);

		List<MatStoreInfo> models = matStoreInfoManager.find(jql.toString(), values.toArray());

		if (models != null) {
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "<th>序号</th>  <th>药品名称</th>" + "  <th>规格</th>"
					+ " <th>厂家</th><th>批号</th>" + "  <th>数量</th>"
					+ " <th>单位</th><th>进价</th><th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);
			BigDecimal _sum2 = new BigDecimal(0);
			int _count = 1;
			java.text.DecimalFormat _format = new java.text.DecimalFormat("0.0000");
			for (MatStoreInfo _detail : models) {
				if (_detail.getBuyPrice() != null) {
					_sum1 = _sum1.add(_detail.getBuyPrice().multiply(_detail.getStoreSum()));
					_sum2 = _sum2.add(_detail.getSalePrice().multiply(_detail.getStoreSum()));
				}
				
				_outHtml += "<tr>"
						+ "<td>" + _count + "</td>"
						+ "<td>" + _detail.getTradeName() + "</td>"
						+"<td>"+ _detail.getMaterialSpecs()+ "</td>"
						+"<td>"
						//+ _detail.getMaterialInfo().getProducer() 厂家取不到
						+ "</td>" 
						+ "<td>"+_detail.getBatchNo() + "</td>"
						+ "<td>" + _detail.getStoreSum() + "</td>"
						+ "<td>" + _detail.getMinUnit() + "</td>"
						+ "<td>"+ PrintUtil.getAmount(_detail.getBuyPrice()) + "</td>" 
						+ "<td>" +PrintUtil.getAmount(_detail.getBuyPrice().multiply(_detail.getStoreSum()))+"</td>"
						+ "<td>"+ _detail.getSalePrice() + "</td>"
						+ "<td>" +PrintUtil.getAmount(_detail.getSalePrice().multiply(_detail.getStoreSum()))+"</td>"
						+ "</tr>\n";
				_count++;
			}
			_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td><td></td>"
					+ "  <td></td>" + "  <td></td>" + "  <td>" + PrintUtil.getAmount(_sum1) + "</td><td></td><td>" + PrintUtil.getAmount(_sum2) + "</td></tr>\n";
			_outHtml += "</table>";
			data.setT2(_outHtml);
			_count++;
		}
		return data;

	}
}
