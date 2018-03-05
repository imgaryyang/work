package com.lenovohit.hcp.finance.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.manager.InvoiceReprintManager;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;

/**
 * 退费与重打
 */
@RestController
@RequestMapping("/hcp/finance/invoiceReprint")
public class InvoiceReprintController extends HcpBaseRestController {

	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private InvoiceReprintManager invoiceReprintManager;

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		InvoiceInfo query = JSONUtils.deserialize(data, InvoiceInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		//用来判断是退费还是重打（reFund/rePrint）
		String chanel = json.getString("chanel");

		StringBuilder jql = new StringBuilder("select a from InvoiceInfo a left join a.patientInfo b where a.invoiceSource = '2' ");

		List<Object> values = new ArrayList<Object>();
		jql.append("and a.hosId = ? ");
		values.add(this.getCurrentUser().getHosId());
		// TODO 查询条件
		// 卡号、姓名、日期、收款人

		if (query.getPatientInfo() != null) {
			if (StringUtils.isNotBlank(query.getPatientInfo().getMedicalCardNo())) {
				jql.append("and b.medicalCardNo = ? ");
				values.add(query.getPatientInfo().getMedicalCardNo());
			}
			if (StringUtils.isNotBlank(query.getPatientInfo().getMiCardNo())) {
				jql.append("and b.miCardNo = ? ");
				values.add(query.getPatientInfo().getMedicalCardNo());
			}
			if (StringUtils.isNotBlank(query.getPatientInfo().getName())) {
				jql.append("and b.name like ? ");
				values.add(query.getPatientInfo().getName());
			}
		}

		if (StringUtils.isNotBlank(query.getStartDate())) {
			jql.append("and a.invoiceTime >= ? ");
			values.add(query.getStartDate());
		}

		if (StringUtils.isNotBlank(query.getEndDate())) {
			jql.append("and a.invoiceTime <= ? ");
			values.add(query.getEndDate());
		}

		if (StringUtils.isNotBlank(query.getInvoiceNo())) {
			jql.append("and a.invoiceNo = ? ");
			values.add(query.getInvoiceNo());
		}

		if (StringUtils.isNotBlank(query.getHosId())) {
			jql.append("and a.hosId = ? ");
			values.add(query.getHosId());
		}
		
		if(chanel !=null && "reFund".equalsIgnoreCase(chanel)){//若为退费
			jql.append("and a.invoiceNo in ( select detail.invoiceNo  from OutpatientChargeDetail detail where applyState = '7' ) ");
			//values.add("7");
			
		}
		
		jql.append("order by a.updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		invoiceInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/chargeDetail/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		InvoiceInfo query = JSONUtils.deserialize(data, InvoiceInfo.class);

		StringBuilder jql = new StringBuilder("from OutpatientChargeDetail where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();

		if (StringUtils.isNotBlank(query.getInvoiceNo())) {
			jql.append("and invoiceNo = ? ");
			values.add(query.getInvoiceNo());
		}

		if (StringUtils.isNotBlank(query.getHosId())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosId());
		}

		jql.append("order by updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		outpatientChargeDetailManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/payWay/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPayWayPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		PayWay query = JSONUtils.deserialize(data, PayWay.class);

		StringBuilder jql = new StringBuilder("from PayWay where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();

		if (StringUtils.isNotBlank(query.getPayId())) {
			jql.append("and payId = ? ");
			values.add(query.getPayId());
		}

		if (StringUtils.isNotBlank(query.getHosId())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosId());
		}

		jql.append("order by updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		payWayManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/refund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRefund(@RequestBody String data) {
		try {
			InvoiceInfo input = JSONUtils.deserialize(data, InvoiceInfo.class);
			UserNow userNow = new UserNow();
			//invoiceReprintManager.forRefundOtherInfo(input.getHosId(), input.getInvoiceNo(), userNow,input.getRegId());
			invoiceReprintManager.forRefund(input.getHosId(), input.getInvoiceNo(), userNow);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("退费成功");
	}
	
	public class UserNow extends HcpBaseRestController {
		public Date now = new Date();
		public HcpUser hcpUser = this.getCurrentUser();
	}
	
	// 注意事务问题，后期改为建涛的Manager形式，或等待解决RestController的事务问题
	@RequestMapping(value = "/reprint", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReprint(@RequestBody String data) {
		try {
			InvoiceInfo input = JSONUtils.deserialize(data, InvoiceInfo.class);
			UserNow userNow = new UserNow();
			invoiceReprintManager.forReprint(input.getHosId(), input.getInvoiceNo(), userNow);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("重打成功");
	}
}
