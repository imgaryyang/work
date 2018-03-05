package com.lenovohit.hcp.appointment.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.manager.RegisterStatisticsManager;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.appointment.model.RegInfoStatisticsDto;
import com.lenovohit.hcp.finance.model.InvoiceInfo;

@Service("registerStatisticsManager")
public class RegisterStatisticsManagerImpl implements RegisterStatisticsManager {
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;

	@Override
	public List<RegInfoStatisticsDto> listRegInfoStatistics(List<RegInfo> regInfos) {
		List<RegInfoStatisticsDto> result = new ArrayList<>();
		Map<String, RegInfoStatisticsDto> resultMap = new HashMap<>();
		for (RegInfo info : regInfos) {
			RegInfoStatisticsDto regInfoStatisticsDto = resultMap.get(info.getCreateOper());
			if (regInfoStatisticsDto == null) {
				resultMap.put(info.getCreateOper(), new RegInfoStatisticsDto());
			}
			RegInfoStatisticsDto dto = resultMap.get(info.getCreateOper());
			if (RegInfo.REG_CANCELED.equals(info.getRegState())) {
				// 根据regid取发票，invoicesource 1挂号 2诊疗
				dto.refundCount++;
				List<InvoiceInfo> invoiceInfos = invoiceInfoManager.findByProp("regId", info.getId());
				for (InvoiceInfo i : invoiceInfos) {
					if (InvoiceInfo.INVOICE_SOURCE_REGIST.equals(i.getInvoiceSource().toString())) {
						if (InvoiceInfo.PLUSMINUS_MINUS.equals(i.getPlusMinus().toString())) {
							dto.setRefundFee(getSumAmt(dto.getRefundFee(), i.getTotCost().abs()));
						}
					} else if (InvoiceInfo.INVOICE_SOURCE_PAY.equals(i.getInvoiceSource().toString())) {
						if (InvoiceInfo.PLUSMINUS_MINUS.equals(i.getPlusMinus().toString())) {
							dto.setRefundClinicFee(getSumAmt(dto.getRefundClinicFee(), i.getTotCost().abs()));
						}
					}
				}
			} else {
				// 根据regid取发票，invoicesource 1挂号 2诊疗
				dto.regCount++;
				List<InvoiceInfo> invoiceInfos = invoiceInfoManager.findByProp("regId", info.getId());
				for (InvoiceInfo i : invoiceInfos) {
					if (InvoiceInfo.INVOICE_SOURCE_REGIST.equals(i.getInvoiceSource())) {
						dto.setRegFee(getSumAmt(dto.getRegFee(), i.getTotCost()));
					} else if (InvoiceInfo.INVOICE_SOURCE_PAY.equals(i.getInvoiceSource())) {
						dto.setRegClinicFee(getSumAmt(dto.getRegClinicFee(), i.getTotCost()));
					}
				}
			}
		}
		for (Map.Entry<String, RegInfoStatisticsDto> entry : resultMap.entrySet()) {
			RegInfoStatisticsDto dto = entry.getValue();
			dto.setPerson(entry.getKey());
			result.add(dto);
		}
		completeResult(result);
		return result;
	}

	public BigDecimal getSumAmt(BigDecimal b1, BigDecimal b2) {
		return StringUtils.isBlank(b1) ? StringUtils.isBlank(b2) ? new BigDecimal("0") : b2
				: b1.add(StringUtils.isBlank(b2) ? new BigDecimal("0") : b2);
	}

	private void completeResult(List<RegInfoStatisticsDto> result) {
		RegInfoStatisticsDto sumDto = new RegInfoStatisticsDto();
		countOneSumAndBuildTotalDto(result, sumDto);
		result.add(sumDto);
	}

	private void countOneSumAndBuildTotalDto(List<RegInfoStatisticsDto> result, RegInfoStatisticsDto sumDto) {
		for (RegInfoStatisticsDto dto : result) {
			dto.setRegAddFee(new BigDecimal("0"));// 附加费？
			dto.setRegFeeSum(getSumAmt(getSumAmt(dto.getRegFee(), dto.getRegAddFee()), dto.getRegClinicFee()));
			dto.setRefundAddFee(new BigDecimal("0"));
			dto.setRefundFeeSum(
					getSumAmt(getSumAmt(dto.getRefundFee(), dto.getRefundAddFee()), dto.getRefundClinicFee()));
			dto.setTotalAddFee(getSumAmt(dto.getRegAddFee(), dto.getRefundAddFee()));
			dto.setTotalClinicFee(getSumAmt(dto.getRegClinicFee(), dto.getRefundClinicFee()));
			dto.totalCount = dto.regCount + dto.refundCount;
			dto.setTotalFee(getSumAmt(dto.getRegFee(), dto.getRefundFee()));
			dto.setTotalFee(getSumAmt(dto.getRegFee(), dto.getRefundFee()));
			dto.setTotalFeeSum(getSumAmt(dto.getRegFeeSum(), dto.getRefundFeeSum()));
			buildSumDto(sumDto, dto);

		}
	}

	private void buildSumDto(RegInfoStatisticsDto sumDto, RegInfoStatisticsDto dto) {
		sumDto.setPerson("总计");
		sumDto.regCount += dto.regCount;
		sumDto.setRegFee(getSumAmt(sumDto.getRegFee(), dto.getRegFee()));
		sumDto.setRegClinicFee(getSumAmt(sumDto.getRegClinicFee(), dto.getRegClinicFee()));
		sumDto.setRegAddFee(getSumAmt(sumDto.getRegAddFee(), dto.getRegAddFee()));
		sumDto.setRegFeeSum(getSumAmt(sumDto.getRegFeeSum(), dto.getRegFeeSum()));
		sumDto.refundCount += dto.refundCount;
		sumDto.setRefundFee(getSumAmt(sumDto.getRefundFee(), dto.getRefundFee()));
		sumDto.setRefundClinicFee(getSumAmt(sumDto.getRefundClinicFee(), dto.getRefundClinicFee()));
		sumDto.setRefundAddFee(getSumAmt(sumDto.getRefundAddFee(), dto.getRefundAddFee()));
		sumDto.setRefundFeeSum(getSumAmt(sumDto.getRefundFeeSum(), dto.getRefundFeeSum()));
		sumDto.totalCount += dto.totalCount;
		sumDto.setTotalFee(getSumAmt(sumDto.getTotalFee(), dto.getTotalFee()));
		sumDto.setTotalClinicFee(getSumAmt(sumDto.getTotalClinicFee(), dto.getTotalClinicFee()));
		sumDto.setTotalAddFee(getSumAmt(sumDto.getTotalAddFee(), dto.getTotalAddFee()));
		sumDto.setTotalFeeSum(getSumAmt(sumDto.getTotalFeeSum(), dto.getTotalFeeSum()));
	}
}
