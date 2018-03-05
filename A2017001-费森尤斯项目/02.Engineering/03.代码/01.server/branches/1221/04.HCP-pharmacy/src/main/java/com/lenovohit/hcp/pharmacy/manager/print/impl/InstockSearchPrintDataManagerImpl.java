package com.lenovohit.hcp.pharmacy.manager.print.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaApplyIn;

//请领计划单-药品
@Service("instockSearchPrintDataManagerImpl")
public class InstockSearchPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<PhaApplyIn, String> phaApplyInManager;
	@Autowired
	private GenericManager<Company, String> companyManager;
	
	private static HashMap companyName=new HashMap();
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from PhaApplyIn where appBill=?";
		String sql = "select app.UPDATE_OPER a1,"
				+" dept1.DEPT_NAME a2,"
				+" app.APP_OPER a3,"
				+" app.APP_TIME a4,"
				+" app.UPDATE_TIME a5,"
				+" dept2.DEPT_NAME a6,"
				+" outI.OUT_OPER a7,"
				+" outI.APP_BILL a8 from  "
				+" pha_applyin app, b_deptinfo dept1,b_deptinfo dept2 ,pha_outputinfo outI "
				+" where app.APP_STATE='4' and app.DEPT_ID=dept1.ID and app.FROM_DEPT_ID=dept2.ID and app.APP_BILL=outI.APP_BILL and app.APP_BILL='" + bizId + "'";
		
		
		PrintData data = new PrintData();
		SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> values = new ArrayList<Object>();
			values.add(bizId);

			List<Company> _listCompany = companyManager.find("from Company");
			for( Company _detail : _listCompany){
				companyName.put(_detail.getId(), _detail.getCompanyName());
			}
			
			
			List<Object> objList = (List<Object>) phaApplyInManager.findBySql(sql);

			String _UPDATE_OPER = "", _DEPT_NAME = "", _APP_OPER, _APP_TIME, _UPDATE_TIME = "", _FROM_DEPT_NAME = "",
					_OUT_OPER = "", _APP_BILL = "";

			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);

				_UPDATE_OPER = (String) obj[0];//入库人
				_DEPT_NAME = (String) obj[1];//科室
				_APP_OPER = (String) obj[2];
				_APP_TIME = formatDate.format(obj[3]);
				_UPDATE_TIME = formatDate.format(obj[4]);//入库时间
				_FROM_DEPT_NAME = (String) obj[5];//科室
				_OUT_OPER = (String) obj[6];
				_APP_BILL = (String) obj[7];//出库单
			}

			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>入库单号:</th>"
					+ "  <td></td><th>请领单:</th><td>" + bizId + "</td><th>出库单:</th><td>" + _APP_BILL
					+ "</td><th>入库时间:</th>" + "  <td>" + _UPDATE_TIME + "</td>" + "  <th>科室:</th><td>" + _FROM_DEPT_NAME
					+ "->" + _DEPT_NAME + "</td>" + "  <th>入库人:</th>" + "  <td>" + _UPDATE_OPER + "</td>" + "</tr>"
					+ "</table>";
			data.setT1(_outHtml);
			List<PhaApplyIn> _list = phaApplyInManager.find(hql, values);
			_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>物资名称</th>" + "  <th>规格</th>"
					+ "  <th>单位</th>" + "  <th>批号</th>" + "  <th>生产厂家</th>" + "  <th>生产日期</th><th>有效期</th>"
					+ "  <th>数量</th>" + "  <th>进价</th>" + "  <th>进价金额</th><th>零售价</th><th>零售金额</th>" + "</tr>\n";
			BigDecimal _sum1 = new BigDecimal(0);
			BigDecimal _sum2 = new BigDecimal(0);
			BigDecimal _subtotal1 = new BigDecimal(0);
			BigDecimal _subtotal2 = new BigDecimal(0);
			;
			for (PhaApplyIn _detail : _list) {
				if (_detail.getBuyPrice() != null && _detail.getAppNum() != null) {
					_subtotal1 = _detail.getBuyPrice().multiply(_detail.getAppNum());
					_sum1=_sum1.add(_subtotal1);
					_subtotal2 = _detail.getSalePrice().multiply( _detail.getAppNum());
					_sum2=_sum2.add(_subtotal2);
				}
				//取得公司名称
				String _companyName=PrintUtil.getNotNull((String)companyName.get(_detail.getCompany()));
				_outHtml += "<tr>" + "  <td>" + _detail.getDrugInfo().getCommonName() + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDrugSpecs()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getDrugInfo().getDoseUnit()) + "</td>" + "  <td>"
						+ PrintUtil.getNotNull(_detail.getBatchNo()) + "</td>" + "  <td>" + 
						PrintUtil.getNotNull(_companyName)
						+ "</td>" + "  <td>" + formatDate.format(_detail.getProduceDate()) + "</td><td>"
						+ formatDate.format(_detail.getValidDate()) + "</td>" + "  <td>" + _detail.getAppNum().longValue()+ "</td>"
						+ "  <td>" + PrintUtil.getAmount(_detail.getBuyPrice()) + "</td><td>" + PrintUtil.getAmount(_subtotal1) + "</td><td>"
						+ PrintUtil.getAmount(_detail.getSalePrice()) + "</td><td>" + PrintUtil.getAmount(_subtotal2) + "</td></tr>\n";

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
