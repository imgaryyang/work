package com.lenovohit.hcp.finance.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.manager.CheckOutManager;
import com.lenovohit.hcp.finance.model.CheckOutDto;
import com.lenovohit.hcp.finance.model.OperBalance;

@RestController
@RequestMapping("/hcp/finance/checkOut/")
public class CheckOutController extends HcpBaseRestController {
	@Autowired
	private CheckOutManager checkOutManager;

	@RequestMapping(value = "/get/{invoiceSource}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getCheckOutMsg(@PathVariable("invoiceSource") String invoiceSource) {
		if (StringUtils.isBlank(invoiceSource))
			return ResultUtils.renderFailureResult("发票类型不能为空");
		CheckOutDto dto = null;
		try {
			HcpUser user = this.getCurrentUser();
			dto = checkOutManager.getCheckOutMsg(user.getHosId(), invoiceSource, user.getName());
			if (dto != null)
				dto.setInvoiceOperName(user.getName());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取结账信息失败，失败原因：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(dto);
	}

	@RequestMapping(value = "/get/checked/{invoiceSource}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getCheckedOutMsg(@PathVariable("invoiceSource") String invoiceSource) {
		if (StringUtils.isBlank(invoiceSource))
			return ResultUtils.renderFailureResult("发票类型不能为空");
		CheckOutDto dto = null;
		try {
			HcpUser user = this.getCurrentUser();
			dto = checkOutManager.getCheckedMsg(user.getHosId(), invoiceSource, user.getName());
			if (dto != null)
				dto.setInvoiceOperName(user.getName());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取已结账信息失败，失败原因：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(dto);
	}

	@RequestMapping(value = "/create/checkOut", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result creatCheckOutMsg(@RequestBody String data) {
		CheckOutDto dto = JSONUtils.deserialize(data, CheckOutDto.class);
		OperBalance balance = null;
		try {
			checkParams(dto);
			HcpUser user = this.getCurrentUser();
			balance = checkOutManager.checkOut(user.getHosId(), dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("结账失败，失败原因：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(balance);
	}

	private void checkParams(CheckOutDto dto) {
		if (StringUtils.isBlank(dto.getInvoiceSource()))
			throw new RuntimeException("发票来源不能为空");
		if (StringUtils.isBlank(dto.getInvoiceOperName()))
			throw new RuntimeException("发票操作人不能为空");
		if (StringUtils.isBlank(dto.getBeginDate()))
			throw new RuntimeException("结账开始时间不能为空");
		if (StringUtils.isBlank(dto.getEndDate()))
			throw new RuntimeException("结账结束时间不能为空");
	}

	@RequestMapping(value = "/update/{balanceId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result cancelCheckedOut(@PathVariable("balanceId") String balanceId) {
		if (StringUtils.isBlank(balanceId))
			return ResultUtils.renderFailureResult("结账id不能为空");
		try {
			checkOutManager.cancelCheckOut(balanceId);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("取消结账失败，失败原因：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
}
