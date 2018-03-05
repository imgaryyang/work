package com.lenovohit.hcp.finance.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.finance.manager.CheckOutStatisticsManager;
import com.lenovohit.hcp.finance.model.AccountItemStatisticsDto;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OperBalance;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;
import com.lenovohit.hcp.finance.model.PayWayStatisticsDto;

@Service("checkOutStatisticsManager")
public class CheckOutStatisticsManagerImpl implements CheckOutStatisticsManager {

	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;

	@Override
	public List<AccountItemStatisticsDto> listAccountItemStatistics(List<OperBalance> balances) {
		List<AccountItemStatisticsDto> result = new ArrayList<>();
		Map<String, AccountItemStatisticsDto> resultMap = new HashMap<>();
		for (OperBalance o : balances) {
			AccountItemStatisticsDto dto = resultMap.get(o.getInvoiceOper());
			if (dto == null)
				resultMap.put(o.getInvoiceOper(), new AccountItemStatisticsDto());
			Map<String, BigDecimal> amtCount = new HashMap<>();
			AccountItemStatisticsDto accountItemStatisticsDto = resultMap.get(o.getInvoiceOper());
			List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", o.getId());
			List<OutpatientChargeDetail> details = listChargeDetails(infos);
			for (OutpatientChargeDetail d : details) {
				BigDecimal amt = amtCount.get(d.getFeeCode());
				if (StringUtils.isBlank(amt)) {
					amtCount.put(d.getFeeCode(), d.getTotCost());
				} else {
					amtCount.put(d.getFeeCode(), amt.add(d.getTotCost()));
				}
			}
			buildAccountItemDto(accountItemStatisticsDto, amtCount);
		}
		for (Map.Entry<String, AccountItemStatisticsDto> entry : resultMap.entrySet()) {
			AccountItemStatisticsDto dto = entry.getValue();
			dto.setPerson(entry.getKey());
			result.add(dto);
		}
		completeAccountItemResult(result);
		return result;
	}

	@Override
	public List<PayWayStatisticsDto> listPayWayStatistics(List<OperBalance> balances) {
		List<PayWayStatisticsDto> result = new ArrayList<>();
		Map<String, PayWayStatisticsDto> resultMap = new HashMap<>();
		for (OperBalance o : balances) {
			PayWayStatisticsDto dto = resultMap.get(o.getInvoiceOper());
			if (dto == null) {
				resultMap.put(o.getInvoiceOper(), new PayWayStatisticsDto());
			}
			Map<String, BigDecimal> amtCount = new HashMap<>();
			PayWayStatisticsDto payWayStatisticsDto = resultMap.get(o.getInvoiceOper());
			List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", o.getId());
			for (InvoiceInfo info : infos) {
				List<PayWay> payWays = payWayManager.findByProp("invoiceNo", info.getInvoiceNo());
				for (PayWay payWay : payWays) {
					BigDecimal amt = amtCount.get(payWay.getPayWay());
					if (StringUtils.isBlank(amt)) {
						amtCount.put(payWay.getPayWay(), payWay.getPayCost());
					} else {
						amtCount.put(payWay.getPayWay(), amt.add(payWay.getPayCost()));
					}
				}
			}
			buildPayWayDto(payWayStatisticsDto, amtCount);
		}
		for (Map.Entry<String, PayWayStatisticsDto> entry : resultMap.entrySet()) {
			PayWayStatisticsDto dto = entry.getValue();
			dto.setPerson(entry.getKey());
			result.add(dto);
		}
		completeResult(result);
		return result;
	}

	private void completeResult(List<PayWayStatisticsDto> result) {
		PayWayStatisticsDto sumDto = new PayWayStatisticsDto();
		countOneSumAndBuildTotalDto(result, sumDto);
		BigDecimal allSum = getAllSum(sumDto);
		sumDto.setAll(allSum);
		result.add(sumDto);
	}

	private void completeAccountItemResult(List<AccountItemStatisticsDto> result) {
		AccountItemStatisticsDto sumDto = new AccountItemStatisticsDto();
		accountItemCountOneSumAndBuildTotalDto(result, sumDto);
		BigDecimal allSum = getAccountItemAllSum(sumDto);
		sumDto.setAllSum(allSum);
		sumDto.setPerson("总计");
		result.add(sumDto);

	}

	private BigDecimal getAccountItemAllSum(AccountItemStatisticsDto sumDto) {
		BigDecimal allSum = new BigDecimal("0");
		allSum = getSumAmt(allSum, sumDto.getOperateSpecialMateralFee());
		allSum = getSumAmt(allSum, sumDto.getCureRadiationFee());
		allSum = getSumAmt(allSum, sumDto.getOperateRadiationFee());
		allSum = getSumAmt(allSum, sumDto.getCheckSpecialMateralFee());
		allSum = getSumAmt(allSum, sumDto.getCureSpecialMateralFee());
		allSum = getSumAmt(allSum, sumDto.getChineseHerbsFee());
		allSum = getSumAmt(allSum, sumDto.getWestMedicineFee());
		allSum = getSumAmt(allSum, sumDto.getAnaesthesiaFee());
		allSum = getSumAmt(allSum, sumDto.getRadiationTherapy());
		allSum = getSumAmt(allSum, sumDto.getOxygenTransFee());
		allSum = getSumAmt(allSum, sumDto.getElectromyography());
		allSum = getSumAmt(allSum, sumDto.getOperateMaterialFee());
		allSum = getSumAmt(allSum, sumDto.getNeedlePhysiotherapyFee());
		allSum = getSumAmt(allSum, sumDto.getChineseMedicine());
		allSum = getSumAmt(allSum, sumDto.getSurgeryFee());
		allSum = getSumAmt(allSum, sumDto.getBloodTransFee());
		allSum = getSumAmt(allSum, sumDto.getRadiationFee());
		allSum = getSumAmt(allSum, sumDto.getPathology());
		allSum = getSumAmt(allSum, sumDto.getAssayFee());
		allSum = getSumAmt(allSum, sumDto.getAttendaceFee());
		allSum = getSumAmt(allSum, sumDto.getOtherFee());
		allSum = getSumAmt(allSum, sumDto.getFunctionFee());
		allSum = getSumAmt(allSum, sumDto.getRescueFee());
		allSum = getSumAmt(allSum, sumDto.getBloodCure());
		allSum = getSumAmt(allSum, sumDto.getMaterialFee());
		allSum = getSumAmt(allSum, sumDto.getDialysisFee());
		allSum = getSumAmt(allSum, sumDto.getCureFee());
		allSum = getSumAmt(allSum, sumDto.getResearchFee());
		allSum = getSumAmt(allSum, sumDto.getCaseRecordFee());
		allSum = getSumAmt(allSum, sumDto.getBedFee());
		allSum = getSumAmt(allSum, sumDto.getDeliverFee());
		allSum = getSumAmt(allSum, sumDto.getRegFee());
		allSum = getSumAmt(allSum, sumDto.getDiagnosisFee());
		allSum = getSumAmt(allSum, sumDto.getAllSum());
		allSum = getSumAmt(allSum, sumDto.getCheckFee());
		allSum = getSumAmt(allSum, sumDto.getLaserCureFee());
		allSum = getSumAmt(allSum, sumDto.getProxyCookFee());
		allSum = getSumAmt(allSum, sumDto.getLungFuction());
		allSum = getSumAmt(allSum, sumDto.getEndoscopy());
		allSum = getSumAmt(allSum, sumDto.getIsotopeCure());
		return allSum;
	}

	private BigDecimal getAllSum(PayWayStatisticsDto sumDto) {
		BigDecimal allSum = new BigDecimal("0");
		allSum = getSumAmt(allSum, sumDto.getCash());
		allSum = getSumAmt(allSum, sumDto.getCheque());
		allSum = getSumAmt(allSum, sumDto.getCreditCard());
		allSum = getSumAmt(allSum, sumDto.getDebitCard());
		allSum = getSumAmt(allSum, sumDto.getDraft());
		allSum = getSumAmt(allSum, sumDto.getInsureAccount());
		allSum = getSumAmt(allSum, sumDto.getHospitalAccount());
		allSum = getSumAmt(allSum, sumDto.getAliPay());
		allSum = getSumAmt(allSum, sumDto.getWxPay());
		return allSum;
	}

	private void accountItemCountOneSumAndBuildTotalDto(List<AccountItemStatisticsDto> result,
			AccountItemStatisticsDto sumDto) {
		for (AccountItemStatisticsDto dto : result) {
			BigDecimal oneSum = new BigDecimal("0");
			sumDto.setRadiationTherapy(getSumAmt(sumDto.getRadiationTherapy(), dto.getRadiationTherapy()));
			oneSum = getSumAmt(oneSum, dto.getRadiationTherapy());
			sumDto.setChineseHerbsFee(getSumAmt(sumDto.getChineseHerbsFee(), dto.getChineseHerbsFee()));
			oneSum = getSumAmt(oneSum, dto.getChineseHerbsFee());
			sumDto.setOperateMaterialFee(getSumAmt(sumDto.getOperateMaterialFee(), dto.getOperateMaterialFee()));
			oneSum = getSumAmt(oneSum, dto.getOperateMaterialFee());
			sumDto.setElectromyography(getSumAmt(sumDto.getElectromyography(), dto.getElectromyography()));
			oneSum = getSumAmt(oneSum, dto.getElectromyography());
			sumDto.setOxygenTransFee(getSumAmt(sumDto.getOxygenTransFee(), dto.getOxygenTransFee()));
			oneSum = getSumAmt(oneSum, dto.getOxygenTransFee());
			sumDto.setCureRadiationFee(getSumAmt(sumDto.getCureRadiationFee(), dto.getCureRadiationFee()));
			oneSum = getSumAmt(oneSum, dto.getCureRadiationFee());
			sumDto.setOperateRadiationFee(getSumAmt(sumDto.getOperateRadiationFee(), dto.getOperateRadiationFee()));
			oneSum = getSumAmt(oneSum, dto.getOperateRadiationFee());
			sumDto.setWestMedicineFee(getSumAmt(sumDto.getWestMedicineFee(), dto.getWestMedicineFee()));
			oneSum = getSumAmt(oneSum, dto.getWestMedicineFee());
			sumDto.setCheckSpecialMateralFee(
					getSumAmt(sumDto.getCheckSpecialMateralFee(), dto.getCheckSpecialMateralFee()));
			oneSum = getSumAmt(oneSum, dto.getCheckSpecialMateralFee());
			sumDto.setCureSpecialMateralFee(
					getSumAmt(sumDto.getCureSpecialMateralFee(), dto.getCureSpecialMateralFee()));
			oneSum = getSumAmt(oneSum, dto.getCureSpecialMateralFee());
			sumDto.setChineseMedicine(getSumAmt(sumDto.getChineseMedicine(), dto.getChineseMedicine()));
			oneSum = getSumAmt(oneSum, dto.getChineseMedicine());
			sumDto.setAnaesthesiaFee(getSumAmt(sumDto.getAnaesthesiaFee(), dto.getAnaesthesiaFee()));
			oneSum = getSumAmt(oneSum, dto.getAnaesthesiaFee());
			sumDto.setNeedlePhysiotherapyFee(
					getSumAmt(sumDto.getNeedlePhysiotherapyFee(), dto.getNeedlePhysiotherapyFee()));
			oneSum = getSumAmt(oneSum, dto.getNeedlePhysiotherapyFee());
			sumDto.setRadiationFee(getSumAmt(sumDto.getRadiationFee(), dto.getRadiationFee()));
			oneSum = getSumAmt(oneSum, dto.getRadiationFee());
			sumDto.setSurgeryFee(getSumAmt(sumDto.getSurgeryFee(), dto.getSurgeryFee()));
			oneSum = getSumAmt(oneSum, dto.getSurgeryFee());
			sumDto.setAttendaceFee(getSumAmt(sumDto.getAttendaceFee(), dto.getAttendaceFee()));
			oneSum = getSumAmt(oneSum, dto.getAttendaceFee());
			sumDto.setOtherFee(getSumAmt(sumDto.getOtherFee(), dto.getOtherFee()));
			oneSum = getSumAmt(oneSum, dto.getOtherFee());
			sumDto.setBloodTransFee(getSumAmt(sumDto.getBloodTransFee(), dto.getBloodTransFee()));
			oneSum = getSumAmt(oneSum, dto.getBloodTransFee());
			sumDto.setPathology(getSumAmt(sumDto.getPathology(), dto.getPathology()));
			oneSum = getSumAmt(oneSum, dto.getPathology());
			sumDto.setFunctionFee(getSumAmt(sumDto.getFunctionFee(), dto.getFunctionFee()));
			oneSum = getSumAmt(oneSum, dto.getFunctionFee());
			sumDto.setAssayFee(getSumAmt(sumDto.getAssayFee(), dto.getAssayFee()));
			oneSum = getSumAmt(oneSum, dto.getAssayFee());
			sumDto.setDialysisFee(getSumAmt(sumDto.getDialysisFee(), dto.getDialysisFee()));
			oneSum = getSumAmt(oneSum, dto.getDialysisFee());
			sumDto.setLaserCureFee(getSumAmt(sumDto.getLaserCureFee(), dto.getLaserCureFee()));
			oneSum = getSumAmt(oneSum, dto.getLaserCureFee());
			sumDto.setDeliverFee(getSumAmt(sumDto.getDeliverFee(), dto.getDeliverFee()));
			oneSum = getSumAmt(oneSum, dto.getDeliverFee());
			sumDto.setIsotopeCure(getSumAmt(sumDto.getIsotopeCure(), dto.getIsotopeCure()));
			oneSum = getSumAmt(oneSum, dto.getIsotopeCure());
			sumDto.setCaseRecordFee(getSumAmt(sumDto.getCaseRecordFee(), dto.getCaseRecordFee()));
			oneSum = getSumAmt(oneSum, dto.getCaseRecordFee());
			sumDto.setBloodCure(getSumAmt(sumDto.getBloodCure(), dto.getBloodCure()));
			oneSum = getSumAmt(oneSum, dto.getBloodCure());
			sumDto.setEndoscopy(getSumAmt(sumDto.getEndoscopy(), dto.getEndoscopy()));
			oneSum = getSumAmt(oneSum, dto.getEndoscopy());
			sumDto.setBedFee(getSumAmt(sumDto.getBedFee(), dto.getBedFee()));
			oneSum = getSumAmt(oneSum, dto.getBedFee());
			sumDto.setCureFee(getSumAmt(sumDto.getCureFee(), dto.getCureFee()));
			oneSum = getSumAmt(oneSum, dto.getCureFee());
			sumDto.setProxyCookFee(getSumAmt(sumDto.getProxyCookFee(), dto.getProxyCookFee()));
			oneSum = getSumAmt(oneSum, dto.getProxyCookFee());
			sumDto.setMaterialFee(getSumAmt(sumDto.getMaterialFee(), dto.getMaterialFee()));
			oneSum = getSumAmt(oneSum, dto.getMaterialFee());
			sumDto.setRescueFee(getSumAmt(sumDto.getRescueFee(), dto.getRescueFee()));
			oneSum = getSumAmt(oneSum, dto.getRescueFee());
			sumDto.setRegFee(getSumAmt(sumDto.getRegFee(), dto.getRegFee()));
			oneSum = getSumAmt(oneSum, dto.getRegFee());
			sumDto.setDiagnosisFee(getSumAmt(sumDto.getDiagnosisFee(), dto.getDiagnosisFee()));
			oneSum = getSumAmt(oneSum, dto.getDiagnosisFee());
			sumDto.setCheckFee(getSumAmt(sumDto.getCheckFee(), dto.getCheckFee()));
			oneSum = getSumAmt(oneSum, dto.getCheckFee());
			sumDto.setResearchFee(getSumAmt(sumDto.getResearchFee(), dto.getResearchFee()));
			oneSum = getSumAmt(oneSum, dto.getResearchFee());
			sumDto.setLungFuction(getSumAmt(sumDto.getLungFuction(), dto.getLungFuction()));
			oneSum = getSumAmt(oneSum, dto.getLungFuction());
			sumDto.setOperateSpecialMateralFee(
					getSumAmt(sumDto.getOperateSpecialMateralFee(), dto.getOperateSpecialMateralFee()));
			oneSum = getSumAmt(oneSum, dto.getOperateSpecialMateralFee());
			dto.setAllSum(oneSum);
		}
	}

	private void countOneSumAndBuildTotalDto(List<PayWayStatisticsDto> result, PayWayStatisticsDto sumDto) {
		for (PayWayStatisticsDto dto : result) {
			BigDecimal oneSum = new BigDecimal("0");
			sumDto.setCash(getSumAmt(sumDto.getCash(), dto.getCash()));
			oneSum = getSumAmt(oneSum, dto.getCash());
			sumDto.setCheque(getSumAmt(sumDto.getCheque(), dto.getCheque()));
			oneSum = getSumAmt(oneSum, dto.getCheque());
			sumDto.setCreditCard(getSumAmt(sumDto.getCreditCard(), dto.getCreditCard()));
			oneSum = getSumAmt(oneSum, dto.getCreditCard());
			sumDto.setDebitCard(getSumAmt(sumDto.getDebitCard(), dto.getDebitCard()));
			oneSum = getSumAmt(oneSum, dto.getDebitCard());
			sumDto.setDraft(getSumAmt(sumDto.getDraft(), dto.getDraft()));
			oneSum = getSumAmt(oneSum, dto.getDraft());
			sumDto.setInsureAccount(getSumAmt(sumDto.getInsureAccount(), dto.getInsureAccount()));
			oneSum = getSumAmt(oneSum, dto.getInsureAccount());
			sumDto.setHospitalAccount(getSumAmt(sumDto.getHospitalAccount(), dto.getHospitalAccount()));
			oneSum = getSumAmt(oneSum, dto.getHospitalAccount());
			sumDto.setAliPay(getSumAmt(sumDto.getAliPay(), dto.getAliPay()));
			oneSum = getSumAmt(oneSum, dto.getAliPay());
			sumDto.setWxPay(getSumAmt(sumDto.getWxPay(), dto.getWxPay()));
			oneSum = getSumAmt(oneSum, dto.getWxPay());
			dto.setAll(oneSum);
			sumDto.setPerson("总计");
		}
	}

	public BigDecimal getSumAmt(BigDecimal b1, BigDecimal b2) {
		return StringUtils.isBlank(b1) ? StringUtils.isBlank(b2) ? new BigDecimal("0") : b2
				: b1.add(StringUtils.isBlank(b2) ? new BigDecimal("0") : b2);
	}

	private void buildPayWayDto(PayWayStatisticsDto dto, Map<String, BigDecimal> amtMap) {
		dto.setCash(getSumAmt(dto.getCash(), amtMap.get("1")));
		dto.setCheque(getSumAmt(dto.getCheque(), amtMap.get("2")));
		dto.setCreditCard(getSumAmt(dto.getCreditCard(), amtMap.get("3")));
		dto.setDebitCard(getSumAmt(dto.getDebitCard(), amtMap.get("4")));
		dto.setDraft(getSumAmt(dto.getDraft(), amtMap.get("5")));
		dto.setInsureAccount(getSumAmt(dto.getInsureAccount(), amtMap.get("6")));
		dto.setHospitalAccount(getSumAmt(dto.getHospitalAccount(), amtMap.get("7")));
		dto.setAliPay(getSumAmt(dto.getAliPay(), amtMap.get("8")));
		dto.setWxPay(getSumAmt(dto.getWxPay(), amtMap.get("9")));
	}

	private void buildAccountItemDto(AccountItemStatisticsDto dto, Map<String, BigDecimal> amtMap) {
		dto.setElectromyography(getSumAmt(dto.getElectromyography(), amtMap.get("021")));
		dto.setCureSpecialMateralFee(getSumAmt(dto.getCureSpecialMateralFee(), amtMap.get("041")));
		dto.setOxygenTransFee(getSumAmt(dto.getOxygenTransFee(), amtMap.get("014")));
		dto.setNeedlePhysiotherapyFee(getSumAmt(dto.getNeedlePhysiotherapyFee(), amtMap.get("030")));
		dto.setOperateMaterialFee(getSumAmt(dto.getOperateMaterialFee(), amtMap.get("034")));
		dto.setRadiationTherapy(getSumAmt(dto.getRadiationTherapy(), amtMap.get("032")));
		dto.setChineseMedicine(getSumAmt(dto.getChineseMedicine(), amtMap.get("002")));
		dto.setAnaesthesiaFee(getSumAmt(dto.getAnaesthesiaFee(), amtMap.get("020")));
		dto.setWestMedicineFee(getSumAmt(dto.getWestMedicineFee(), amtMap.get("001")));
		dto.setChineseHerbsFee(getSumAmt(dto.getChineseHerbsFee(), amtMap.get("003")));
		dto.setCureRadiationFee(getSumAmt(dto.getCureRadiationFee(), amtMap.get("032")));
		dto.setOperateRadiationFee(getSumAmt(dto.getOperateRadiationFee(), amtMap.get("039")));
		dto.setCheckSpecialMateralFee(getSumAmt(dto.getCheckSpecialMateralFee(), amtMap.get("040")));
		dto.setEndoscopy(getSumAmt(dto.getEndoscopy(), amtMap.get("023")));
		dto.setAttendaceFee(getSumAmt(dto.getAttendaceFee(), amtMap.get("015")));
		dto.setFunctionFee(getSumAmt(dto.getFunctionFee(), amtMap.get("018")));
		dto.setAssayFee(getSumAmt(dto.getAssayFee(), amtMap.get("012")));
		dto.setOtherFee(getSumAmt(dto.getOtherFee(), amtMap.get("016")));
		dto.setBloodTransFee(getSumAmt(dto.getBloodTransFee(), amtMap.get("013")));
		dto.setPathology(getSumAmt(dto.getPathology(), amtMap.get("017")));
		dto.setLungFuction(getSumAmt(dto.getLungFuction(), amtMap.get("022")));
		dto.setSurgeryFee(getSumAmt(dto.getSurgeryFee(), amtMap.get("011")));
		dto.setRadiationFee(getSumAmt(dto.getRadiationFee(), amtMap.get("010")));
		dto.setLaserCureFee(getSumAmt(dto.getLaserCureFee(), amtMap.get("029")));
		dto.setResearchFee(getSumAmt(dto.getResearchFee(), amtMap.get("035")));
		dto.setDeliverFee(getSumAmt(dto.getDeliverFee(), amtMap.get("024")));
		dto.setDialysisFee(getSumAmt(dto.getDialysisFee(), amtMap.get("027")));
		dto.setCureFee(getSumAmt(dto.getCureFee(), amtMap.get("009")));
		dto.setRegFee(getSumAmt(dto.getRegFee(), amtMap.get("004")));
		dto.setDiagnosisFee(getSumAmt(dto.getDiagnosisFee(), amtMap.get("007")));
		dto.setRescueFee(getSumAmt(dto.getRescueFee(), amtMap.get("026")));
		dto.setCheckFee(getSumAmt(dto.getCheckFee(), amtMap.get("008")));
		dto.setBloodCure(getSumAmt(dto.getBloodCure(), amtMap.get("031")));
		dto.setIsotopeCure(getSumAmt(dto.getIsotopeCure(), amtMap.get("025")));
		dto.setProxyCookFee(getSumAmt(dto.getProxyCookFee(), amtMap.get("036")));
		dto.setCaseRecordFee(getSumAmt(dto.getCaseRecordFee(), amtMap.get("005")));
		dto.setBedFee(getSumAmt(dto.getBedFee(), amtMap.get("006")));
		dto.setMaterialFee(getSumAmt(dto.getMaterialFee(), amtMap.get("033")));
		dto.setOperateSpecialMateralFee(getSumAmt(dto.getOperateSpecialMateralFee(), amtMap.get("042")));
	}

	private List<OutpatientChargeDetail> listChargeDetails(List<InvoiceInfo> infos) {
		List<OutpatientChargeDetail> totalDetails = new ArrayList<>();
		for (InvoiceInfo i : infos) {
			if (!InvoiceInfo.PLUSMINUS_MINUS.equals(i.getPlusMinus())) {
				List<OutpatientChargeDetail> details = outpatientChargeDetailManager.findByProp("invoiceNo",
						i.getInvoiceNo());
				totalDetails.addAll(details);
			}
		}
		return totalDetails;
	}
}
