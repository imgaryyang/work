package com.lenovohit.hcp.material.manager.print.impl;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatBuyDetail;

//采购单打印-物资
@Service("matAuitdPrintDataManager")
public class MatAuitdPrintDataManager extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<MatBuyDetail, String> matBuyDetailManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) { 
		String hql = "select a from MatBuyDetail a left join a.matInfo b where a.buyBill=?";
//		String hql = "select a from MatBuyDetail a left join a.MatInfo where a.buyBill=?";
//		select regFree from RegFree regFree  regFree.itemInfo itemInfo  where 1=1
		String sql = ""
				+" select "
				+" com.COMPANY_NAME a0,"
				+" dept.DEPT_NAME a1,"
				+" CONVERT(varchar(12),buy.CREATE_TIME,111 ) a2,"
				+" CONVERT(varchar(12),buy.AUITD_TIME,111 ) a3,"
				+" buy.CREATE_OPER a4,"
				+" buy.AUITD_OPER a5,"
				+" sum(detail.AUITD_NUM*detail.BUY_PRICE) a6,"
				+" sum(detail.BUY_NUM*detail.BUY_PRICE) a7"
				+" from  MATERIAL_BUYBILL buy JOIN MATERIAL_BUYDETAIL detail on  buy.ID=detail.BILL_ID  left join b_deptinfo dept on buy.DEPT_ID=dept.ID left join B_COMPANY com on buy.COMPANY=com.ID "
				+" where buy.BUY_BILL='"+bizId+"'"
				+" group by"
				+" com.COMPANY_NAME,"
				+" dept.DEPT_NAME,"
				+" buy.CREATE_TIME,"
				+" buy.AUITD_TIME,"
				+" buy.CREATE_OPER,"
				+" buy.AUITD_OPER";

		List<Object> values = new ArrayList<Object>();
		values.add(bizId);

		PrintData data = new PrintData();
		double _AUITD_NUM = 0;
		if (!"undefined".equals(bizId) && bizId != null) {
			List<Object> objList = (List<Object>) matBuyDetailManager.findBySql(sql);
			String _COMPANY_NAME = "", _DEPT_NAME = "", _CREATE_TIME = "", _AUITD_TIME = "",
					CREATE_OPER = "", AUITD_OPER = "";
			BigDecimal _sum1 =new BigDecimal(0), _sum2 = new BigDecimal(0);
			if (objList != null && objList.size() > 0) {
				Object[] obj = (Object[]) objList.get(0);
				_COMPANY_NAME = PrintUtil.getNotNull((String)obj[0]);//公司名称
				_DEPT_NAME = PrintUtil.getNotNull((String)obj[1]);//部门名称
				if(obj[2]!=null){
					_CREATE_TIME = PrintUtil.getNotNull(obj[2].toString());
				}
				if(obj[3]!=null){
					_AUITD_TIME = PrintUtil.getNotNull(obj[3].toString());
				}
				if(obj[4]!=null){
					CREATE_OPER = PrintUtil.getNotNull(obj[4].toString());
				}
				if(obj[5]!=null){
					AUITD_OPER = PrintUtil.getNotNull(obj[5].toString());
				}
				if(obj[6]!=null){
					_sum1 =(BigDecimal)obj[6];//申请金额
				}
				if(obj[7]!=null){
					_sum2 =(BigDecimal)obj[7];//审批金额
				}
			}

			DecimalFormat myformat=new DecimalFormat("0.00");
			String _outHtml = "<style> table,td,th {border: 0px solid black;border-style: solid;border-collapse: collapse}</style>"
					+ "<table border=\"0\" width=\"100%\">" + "<tr>" + "  <th>审批单号:</th>" + "  <td>" + bizId
					+ "</td>" + "  <th>供应商:</th>" + "  <td>" + _COMPANY_NAME + "</td>" + "  <th>采购科室:</th>" + "  <td>"
					+ _DEPT_NAME + "</td>" + "  <th>审批金额:</th>" + "  <td>" + PrintUtil.getAmount(_sum2) + "</td>";

			_outHtml += "<tr>" + "  <th>申请人:</th>" + "  <td>" + CREATE_OPER + "</td>" + "  <th>申请时间:</th>" + "  <td>"
					+ _CREATE_TIME + "</td>" + "  <th>审批人:</th>" + "  <td>" + AUITD_OPER + "</td>" + "  <th>审批时间:</th>"
					+ "  <td>" + _AUITD_TIME + "</td></tr>" + "</table>";
			data.setT1(_outHtml);

			List<MatBuyDetail> _list = matBuyDetailManager.find(hql, values);
			if (_list != null) {
				_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
						+ "<table border=\"1\" width=\"100%\">" + "<tr>" + "  <th>药品名称</th>" + "  <th>规格</th>"
						+ "  <th>单位</th>" + "<th>生产厂家</th>" + "  <th>计划数量</th>" + " <th>审批数量</th><th>采购价</th>"
						+ "  <th>金额</th>" + "</tr>\n";
				BigDecimal _sum =new BigDecimal(0);
				for (MatBuyDetail _detail : _list) {
					BigDecimal _count=new BigDecimal(0);
					if (_detail.getBuyCost() != null) {
						_count = _detail.getBuyPrice().multiply(new BigDecimal(_detail.getBuyNum()));
						_sum =_sum.add(_count);
					}
					String companyName = "";
					if(_detail.getMatInfo().getCompanyInfo()!=null){
						companyName = PrintUtil.getNotNull(_detail.getMatInfo().getCompanyInfo().getCompanyName());
					}
					_outHtml += "<tr>" + "  <td>" + _detail.getTradeName() + "</td>" + "  <td>"
							+ PrintUtil.getNotNull(_detail.getMaterialSpec()) + "</td>" + "  <td>"
							+ PrintUtil.getNotNull(_detail.getMinUnit()) + "</td>" + "  <td>"
							+ companyName + "</td>" + "  <td>"
							+ _detail.getBuyNum() + "</td>" + "  <td>" + _detail.getAuitdNum() + "</td>" + "  <td>"
							+ PrintUtil.getAmount(_detail.getBuyPrice()) + "</td><td>" + myformat.format(_count) + "</td>" + "</tr>\n";

				}
				_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td>"
						+ "  <td></td>" + "  <td></td>" + "  <td>" +PrintUtil.getAmount(_sum) + "</td>" + "</tr>\n";
				_outHtml += "</table>";
				data.setT2(_outHtml);
			}
		}
		return data;
	}
}
