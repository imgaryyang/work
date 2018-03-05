package com.lenovohit.hcp.pharmacy.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.ICommonRedisSequenceManager;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@Service
@Transactional	// 好像这个标签是设置事务的
public class PhaStoreManagerImpl implements PhaStoreManager {

	@Autowired
	private GenericManager<PhaInputInfo, String> phaInputInfoManager;
	@Autowired
	private GenericManager<PhaOutputInfo, String> phaOutputInfoManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<PhaStoreInfo, String> phaStoreInfoManager;
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
	@Autowired
	private ICommonRedisSequenceManager commonRedisSequenceManager;

	@Override
	public List<PhaInputInfo> phaInput(List<PhaInputInfo> inputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = inputBatchControl(inputList); // 获取是否按批次批号管理

		// 入库入参校验
		checkInputList(inputList, batchControl, hcpUser, now);
		// 循环处理InputList
		return handleInputList(inputList, batchControl, hcpUser, now);
	}

	@Override
	public void phaOutput(List<PhaOutputInfo> outputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = outputBatchControl(outputList); // 获取是否按批次批号管理

		// 出库入参校验
		checkOutputList(outputList, batchControl, hcpUser, now);
		// 循环处理OutputList
		handleOutputList(outputList, hcpUser, now);
	}

	@Override
	public void dispenseOutput(List<PhaOutputInfo> outputList, HcpUser hcpUser) {
		 Date now = new Date();
		 // 发药入参校验
		 checkDispenseList(outputList, hcpUser, now);
		 // 循环处理OutputList
		 handleDispenseList(outputList, hcpUser, now);
	}

	// 获取是否按批次批号管理
	private Boolean inputBatchControl(List<PhaInputInfo> inputList) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'DRUG_BATCH_CONTROL' ");
		PhaInputInfo firstInput = (PhaInputInfo) inputList.get(0);
		if (firstInput == null || StringUtils.isBlank(firstInput.getHosId())) {
			throw new RuntimeException("医院Id不能为空");
		} else {
			values.add(firstInput.getHosId());
		}
		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
		// 药品是否按批号管理1按批号2不按批号
		if(hcpCtrlParam!=null){
			return "1".equals(hcpCtrlParam.getControlParam()) ? Boolean.TRUE : Boolean.FALSE;
		} else {
			return false;
		}
	}

	// 入库入参校验
	private void checkInputList(List<PhaInputInfo> inputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		String inBill = null;
		StringBuilder errorMsg = new StringBuilder();

		for (PhaInputInfo inputInfo : inputList) {
			if (inputInfo == null) {
				throw new RuntimeException("不存在入库接口对象");
			}
			BigDecimal buyPrice = inputInfo.getBuyPrice();
			BigDecimal salePrice = inputInfo.getSalePrice();
			BigDecimal inSum = inputInfo.getInSum();

			if (inputInfo.getDrugInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}
			PhaDrugInfo newDrugInfo = getDrugInfoById(inputInfo.getDrugInfo().getId());
			inputInfo.setDrugInfo(newDrugInfo);

			if (StringUtils.isBlank(inputInfo.getInType())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "入库类型不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getInputState())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "入库状态不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getDeptId())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getHosId())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "医院Id不能为空\n");

			}
			if (batchControl) {
				if (StringUtils.isBlank(inputInfo.getApprovalNo())) {
					errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				inputInfo.setBatchNo("-");
				inputInfo.setApprovalNo("-");
			}
			if (StringUtils.isBlank(inputInfo.getProduceDate())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getValidDate())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "有效期不能为空\n");
			}
			if (inputInfo.getCompanyInfo() == null || StringUtils.isBlank(inputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "采购价不能为null或0或负数\n");
			}
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "零售价不能为null或0或负数\n");
			}
			if (inSum == null || inSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "入库数量不能为null或0\n");
			} else if (inSum.compareTo(BigDecimal.ZERO) == 1) {
				inputInfo.setPlusMinus(1);
			} else if (inSum.compareTo(BigDecimal.ZERO) == -1) {
				inputInfo.setPlusMinus(-1);
			}

			// inputInfo有Id则更新，无Id则插入。
			if (StringUtils.isBlank(inputInfo.getId())) {
				inputInfo.setCreateOper(hcpUser.getName());
				inputInfo.setCreateTime(now);
				inputInfo.setCreateOperId(hcpUser.getId());
				if (StringUtils.isBlank(inputInfo.getInBill())) { // 同一次入库只有一个inBill
					if (inBill == null) {
						inBill = redisSequenceManager.get("PHA_INPUTINFO", "IN_BILL");
					}
					inputInfo.setInBill(inBill);
				}
			} else {
				PhaInputInfo origInputInfo = this.phaInputInfoManager.get(inputInfo.getId());
				if (origInputInfo == null) {
					errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "获取原入库信息失败\n");
				}
				if (StringUtils.isBlank(inputInfo.getInBill())) {
					errorMsg.append("【" + inputInfo.getDrugInfo().getTradeName() + "】" + "入库Id不为空，则入库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	// 循环处理InputList
	private List<PhaInputInfo> handleInputList(List<PhaInputInfo> inputList, Boolean batchControl, HcpUser hcpUser,
			Date now) {
		Map<String, PhaStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, PhaStoreSumInfo> phaStoreSumInfos = new HashMap<>();

		for (PhaInputInfo inputInfo : inputList) {
			// 处理inputInfo
			handleInputInfo(inputInfo, hcpUser, now);
			
			// 处理storeInfo
			if (batchControl) {
				if (inputInfo.getPlusMinus() == 1) { // PlusMinus为正，入库
					// 新建storeInfo
					checkDuplicateStoreInfo(inputInfo);
					PhaStoreInfo storeInfo = createStoreInfo(inputInfo, hcpUser, now);
					storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
				} else if (inputInfo.getPlusMinus() == -1) { // PlusMinus为负，退库
					// 查找storeInfo
					PhaStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
					if (mapStoreInfo == null) {
						PhaStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
						// 对storeInfo退库
						inputRetreatStoreInfo(inputInfo, hcpUser, now, storeInfo);
						storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
						+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
					} else {
						inputRetreatStoreInfo(inputInfo, hcpUser, now, mapStoreInfo);
					}
				} else {
					throw new RuntimeException("正负类型错误");
				}
			} else {
				PhaStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
				+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
				if (mapStoreInfo == null) {
					PhaStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
					if (inputInfo.getPlusMinus() == 1) { // PlusMinus为正，入库
						if (storeInfo == null) {
							// 未找到则插入storeInfo
							storeInfo = createStoreInfo(inputInfo, hcpUser, now);
						} else {
							// 找到则累加storeInfo
							addStoreInfo(inputInfo, hcpUser, now, storeInfo);
						}
					} else if (inputInfo.getPlusMinus() == -1) { // PlusMinus为负，退库
						inputRetreatStoreInfo(inputInfo, hcpUser, now, storeInfo);
					} else {
						throw new RuntimeException("正负类型错误");
					}
					storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
				} else {
					if (inputInfo.getPlusMinus() == 1) { // PlusMinus为正，入库
						// 累加storeInfo
						addStoreInfo(inputInfo, hcpUser, now, mapStoreInfo);
					} else if (inputInfo.getPlusMinus() == -1) { // PlusMinus为负，退库
						inputRetreatStoreInfo(inputInfo, hcpUser, now, mapStoreInfo);
					} else {
						throw new RuntimeException("正负类型错误");
					}
				}
			}
			// storeId回写inputInfo
			String storeId = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
				+inputInfo.getDrugInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo()).getStoreId();
			inputInfo.setStoreId(storeId); 
			
			
			// 处理库存汇总
			PhaStoreSumInfo info = phaStoreSumInfos
					.get(inputInfo.getDrugInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId());
			if (info == null) {
				// 获取sum
				PhaStoreSumInfo phaStoreSumInfo = findStoreSum(inputInfo);
				if (phaStoreSumInfo == null) {
					phaStoreSumInfos.put(inputInfo.getDrugInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(),
							createStoreSum(inputInfo, hcpUser, now));
				} else {
					addStoreSum(inputInfo, hcpUser, now, phaStoreSumInfo);
					phaStoreSumInfos.put(inputInfo.getDrugInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(), phaStoreSumInfo);
				}
			} else {
				addStoreSum(inputInfo, hcpUser, now, info);
			}
		}
		List<PhaStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, PhaStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}		
		List<PhaStoreSumInfo> storeSumList = new ArrayList<>();
		for (Map.Entry<String, PhaStoreSumInfo> entry : phaStoreSumInfos.entrySet()){
			storeSumList.add(entry.getValue());
		}
		phaInputInfoManager.batchSave(inputList);
		phaStoreInfoManager.batchSave(storeInfoList);
		phaStoreSumInfoManager.batchSave(storeSumList);

		return inputList;
	}

	private void checkDuplicateStoreInfo(PhaInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from PhaStoreInfo where hosId = ? and deptId = ? and drugInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getDrugInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		Long count = phaStoreInfoManager.getCount(jql.toString(), values.toArray());
		if (count > 0) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "已有相同批次批号的库存明细记录");
		}
	}

	// 新建storeInfo
	private PhaStoreInfo createStoreInfo(PhaInputInfo inputInfo, HcpUser hcpUser, Date now) {
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();
		PhaStoreInfo storeInfo = new PhaStoreInfo();
		storeInfo.setStoreId(redisSequenceManager.get("PHA_STOREINFO", "STORE_ID"));
		storeInfo.setDeptId(inputInfo.getDeptId());
		storeInfo.setDrugType(drugInfo.getDrugType());
		storeInfo.setDrugCode(drugInfo.getDrugCode());
		storeInfo.setDrugInfo(drugInfo);
		storeInfo.setTradeName(drugInfo.getTradeName());
		storeInfo.setSpecs(drugInfo.getDrugSpecs());
		storeInfo.setBatchNo(inputInfo.getBatchNo());
		storeInfo.setApprovalNo(inputInfo.getApprovalNo());
		storeInfo.setProduceDate(inputInfo.getProduceDate());
		Company storeCompanyInfo = new Company();
		storeCompanyInfo.setId(inputInfo.getProducer());
		storeInfo.setCompanyInfo(storeCompanyInfo);
		storeInfo.setCompanySupply(inputInfo.getCompanyInfo());
		storeInfo.setValidDate(inputInfo.getValidDate());
		storeInfo.setBuyPrice(inputInfo.getBuyPrice());
		storeInfo.setSalePrice(inputInfo.getSalePrice());
		storeInfo.setStoreSum(inputInfo.getInSum());
		storeInfo.setMinUnit(drugInfo.getMiniUnit());
		storeInfo.setBuyCost(inputInfo.getBuyCost());
		storeInfo.setSaleCost(inputInfo.getSaleCost());
		// 祝哥说location不用管
		storeInfo.setStop(Boolean.TRUE);
		storeInfo.setComm(inputInfo.getComm());
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
		storeInfo.setCreateTime(now);
		storeInfo.setCreateOper(hcpUser.getName());
		storeInfo.setCreateOperId(hcpUser.getId());
		return storeInfo;
	}

	// 查找StoreInfo
	private PhaStoreInfo inputFindStoreInfo(PhaInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		// 是否按批次批号管理对查询条件无影响，因为不按批次批号管理时，批次批号都设为了"-"
		jql.append(
				"from PhaStoreInfo where hosId = ? and deptId = ? and drugInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getDrugInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		return (PhaStoreInfo) phaStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 退库storeInfo
	private void inputRetreatStoreInfo(PhaInputInfo inputInfo, HcpUser hcpUser, Date now, PhaStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
		if (storeInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "退库数量超出原库存量");
		}
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 累加storeInfo
	private void addStoreInfo(PhaInputInfo inputInfo, HcpUser hcpUser, Date now, PhaStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 查找storeSum
	private PhaStoreSumInfo findStoreSum(PhaInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from PhaStoreSumInfo where hosId = ? and deptId = ? and drugInfo.id = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getDrugInfo().getId());
		return phaStoreSumInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 处理inputInfo
	private void handleInputInfo(PhaInputInfo inputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();
		// String newBatchNo = DateUtils.getCurrentDateStr("yyyyMMddHHmmsssss");
		String newBatchNo = commonRedisSequenceManager.get(inputInfo.getHosId()+inputInfo.getDeptId()+inputInfo.getDrugInfo().getId()+inputInfo.getApprovalNo());

		inputInfo.setBatchNo(newBatchNo);
		inputInfo.setTradeName(drugInfo.getTradeName());
		inputInfo.setSpecs(drugInfo.getDrugSpecs());
		inputInfo.setDrugType(drugInfo.getDrugType());
		inputInfo.setProducer(drugInfo.getCompanyInfo().getId());
		inputInfo.setMinUnit(drugInfo.getMiniUnit());
		inputInfo.setDrugCode(drugInfo.getDrugCode());
		inputInfo.setBuyCost(buyPrice.multiply(inSum));
		inputInfo.setSaleCost(salePrice.multiply(inSum));
		// 接口传入的inSum按包装数量计，而数据库保存的inSum按最小单位计
		inputInfo.setInSum(inSum.multiply(new BigDecimal(drugInfo.getPackQty())));
		inputInfo.setInOper(hcpUser.getName());
		inputInfo.setInTime(now);
		inputInfo.setUpdateOper(hcpUser.getName());
		inputInfo.setUpdateTime(now);
		inputInfo.setUpdateOperId(hcpUser.getId());
	}

	// 新建storeSum
	private PhaStoreSumInfo createStoreSum(PhaInputInfo inputInfo, HcpUser hcpUser, Date now) {
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();

		PhaStoreSumInfo storeSumInfo = new PhaStoreSumInfo();
		storeSumInfo.setStoreSumId(redisSequenceManager.get("PHA_STORESUMINFO", "STORE_SUM_ID"));
		storeSumInfo.setDeptId(inputInfo.getDeptId());
		storeSumInfo.setDrugType(drugInfo.getDrugType());
		storeSumInfo.setDrugCode(drugInfo.getDrugCode());
		PhaDrugInfo storeSumDrugInfo = new PhaDrugInfo();
		storeSumDrugInfo.setId(inputInfo.getDrugInfo().getId());
		storeSumInfo.setDrugInfo(storeSumDrugInfo);
		storeSumInfo.setTradeName(drugInfo.getTradeName());
		storeSumInfo.setSpecs(drugInfo.getDrugSpecs());
		Company storeSumCompanyInfo = new Company();
		storeSumCompanyInfo.setId(inputInfo.getProducer());
		storeSumInfo.setCompanyInfo(storeSumCompanyInfo);
		storeSumInfo.setBuyPrice(inputInfo.getBuyPrice());
		storeSumInfo.setSalePrice(inputInfo.getSalePrice());
		storeSumInfo.setStoreSum(inputInfo.getInSum());
		storeSumInfo.setMinUnit(drugInfo.getMiniUnit());
		storeSumInfo.setBuyCost(inputInfo.getBuyCost());
		storeSumInfo.setSaleCost(inputInfo.getSaleCost());
		storeSumInfo.setBuyCost(inputInfo.getBuyCost());
		// alertNum、location不用管
		storeSumInfo.setStop(Boolean.TRUE);
		storeSumInfo.setComm(inputInfo.getComm());
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setCreateOper(hcpUser.getName());
		storeSumInfo.setCreateTime(now);
		storeSumInfo.setCreateOperId(hcpUser.getId());
		storeSumInfo.setUpdateOperId(hcpUser.getId());
		return storeSumInfo;
	}

	// 累加StoreSum
	private void addStoreSum(PhaInputInfo inputInfo, HcpUser hcpUser, Date now, PhaStoreSumInfo storeSumInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		PhaDrugInfo drugInfo = inputInfo.getDrugInfo();

		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "入库采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "入库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().add(inSum));
		storeSumInfo.setBuyCost(buyPrice.multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}

	private void checkStoreInfo(PhaStoreInfo storeInfo, BigDecimal buyPrice, BigDecimal salePrice) {
		if (storeInfo == null) {
			throw new RuntimeException("未获取到原库存明细信息");
		}
		if (!storeInfo.isStop()) {
			throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "原库存明细信息已停用");
		}
		if (buyPrice.compareTo(storeInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "零售价格与原库存零售价格不相等，请先调价");
		}
	}

	private void checkDispenseStoreInfoList(List<PhaStoreInfo> storeInfoList, PhaOutputInfo outputInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		String tradeName = outputInfo.getDrugInfo().getTradeName();
		
		if (storeInfoList == null) {
			throw new RuntimeException("未获取到原库存明细信息");
		}
		/*  
		 * 发药出库入参没有采购价，不用比较
		 */
		if (salePrice.compareTo(storeInfoList.get(0).getSalePrice()) != 0) {
			throw new RuntimeException("【"+tradeName+"】"+"零售价格与原库存零售价格不相等，请先调价");
		}
	}
	
	private Boolean outputBatchControl(List<PhaOutputInfo> outputList) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'DRUG_BATCH_CONTROL' ");
		PhaOutputInfo firstOutput = (PhaOutputInfo) outputList.get(0);
		if (firstOutput == null || StringUtils.isBlank(firstOutput.getHosId())) {
			throw new RuntimeException("医院Id不能为空");
		} else {
			values.add(firstOutput.getHosId());
		}
		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
		// 药品是否按批号管理1按批号2不按批号
		return hcpCtrlParam.getControlParam().equals("1") ? Boolean.TRUE : Boolean.FALSE;
	}

	private void checkOutputList(List<PhaOutputInfo> outputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (PhaOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}

			BigDecimal buyPrice = outputInfo.getBuyPrice();
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getDrugInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}
			PhaDrugInfo newDrugInfo = getDrugInfoById(outputInfo.getDrugInfo().getId());
			outputInfo.setDrugInfo(newDrugInfo);

			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库状态不能为空\n");
			}
			if (batchControl) {
				if (StringUtils.isBlank(outputInfo.getBatchNo())) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "批次不能为空\n");
				}
				if (StringUtils.isBlank(outputInfo.getApprovalNo())) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				outputInfo.setBatchNo("-");
				outputInfo.setApprovalNo("-");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "医院Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "采购价不能为null或0或负数\n");
			}
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "零售价不能为null或0或负数\n");
			}
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库数量不能为null或0\n");
			} else if (outSum.compareTo(BigDecimal.ZERO) == 1) {
				outputInfo.setPlusMinus(1);
			} else if (outSum.compareTo(BigDecimal.ZERO) == -1) {
				outputInfo.setPlusMinus(-1);
			}

			if (StringUtils.isBlank(outputInfo.getId())) {
				outputInfo.setCreateOper(hcpUser.getName());
				outputInfo.setCreateTime(now);
				outputInfo.setCreateOperId(hcpUser.getId());
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					if (outBill == null) {
						outBill = redisSequenceManager.get("PHA_OUTPUTINFO", "OUT_BILL");
					}
					outputInfo.setOutBill(outBill);
					outputInfo.setOutTime(now);
				}
			} else {
				PhaOutputInfo origOutputInfo = this.phaOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	private void checkDispenseList(List<PhaOutputInfo> outputList, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (PhaOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getDrugInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}
			PhaDrugInfo newDrugInfo = getDrugInfoById(outputInfo.getDrugInfo().getId());
			outputInfo.setDrugInfo(newDrugInfo);

			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库状态不能为空\n");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "医院Id不能为空\n");
			}
			// 循环扣库存时去取
			/*if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "采购价不能为null或0或负数\n");
			}*/
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "零售价不能为null或0或负数\n");
			}
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库数量不能为null或0\n");
			} else if (outSum.compareTo(BigDecimal.ZERO) == 1) {
				outputInfo.setPlusMinus(1);
			} else if (outSum.compareTo(BigDecimal.ZERO) == -1) {
				outputInfo.setPlusMinus(-1);
			}

			if (StringUtils.isBlank(outputInfo.getId())) {
				outputInfo.setCreateOper(hcpUser.getName());
				outputInfo.setCreateTime(now);
				outputInfo.setCreateOperId(hcpUser.getId());
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					if (outBill == null) {
						outBill = redisSequenceManager.get("PHA_OUTPUTINFO", "OUT_BILL");
					}
					outputInfo.setOutBill(outBill);
					outputInfo.setOutTime(now);
				}
			} else {
				PhaOutputInfo origOutputInfo = this.phaOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getDrugInfo().getTradeName() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}
	
	private void handleOutputList(List<PhaOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, PhaStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, PhaStoreSumInfo> storeSumInfoMaps = new HashMap<>();

		for (PhaOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleOutputInfo(outputInfo, hcpUser, now);
			
			PhaStoreInfo mapStoreInfo = storeInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo());
			if (mapStoreInfo == null) {
				PhaStoreInfo storeInfo = outputFindStoreInfo(outputInfo);
				checkStoreInfo(storeInfo, outputInfo.getBuyPrice(), outputInfo.getSalePrice());
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfo库存
					subtractStoreInfo(outputInfo, hcpUser, now, storeInfo);
				} else if (outputInfo.getPlusMinus() == -1) {
					// 退库
					outputRetreatStoreInfo(outputInfo, hcpUser, now, storeInfo);
				} else {
					throw new RuntimeException("正负类型错误");
				}
				storeInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo(), storeInfo);
			} else {
				checkStoreInfo(mapStoreInfo, outputInfo.getBuyPrice(), outputInfo.getSalePrice());
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfo库存
					subtractStoreInfo(outputInfo, hcpUser, now, mapStoreInfo);
				} else if (outputInfo.getPlusMinus() == -1) {
					// 退库
					outputRetreatStoreInfo(outputInfo, hcpUser, now, mapStoreInfo);
				} else {
					throw new RuntimeException("正负类型错误");
				}
			}
			
			String storeId = storeInfoMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo()).getStoreId();
			outputInfo.setStoreId(storeId); // storeId回写outputInfo
			
			PhaStoreSumInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId());
			if (mapStoreSumInfo == null) {
				PhaStoreSumInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId(), storeSumInfo);
			} else {
				handleStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}
		}

		List<PhaStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, PhaStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}

		List<PhaStoreSumInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, PhaStoreSumInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		phaOutputInfoManager.batchSave(outputList);
		phaStoreInfoManager.batchSave(storeInfoList);
		phaStoreSumInfoManager.batchSave(storeSumInfoList);
	}

	private void handleDispenseList(List<PhaOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, List<PhaStoreInfo>> storeInfoListMaps = new HashMap<>();
		Map<String, PhaStoreSumInfo> storeSumInfoMaps = new HashMap<>();

		for (PhaOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleDispenseOutputInfo(outputInfo, hcpUser, now);

			// 处理PhaStoreSumInfo
			PhaStoreSumInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId());
			if (mapStoreSumInfo == null) {
				PhaStoreSumInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId(), storeSumInfo);
			} else {
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}

			List<PhaStoreInfo> mapStoreInfoList = storeInfoListMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId());
			if (mapStoreInfoList == null) {
				List<PhaStoreInfo> storeInfoList = outputFindStoreInfoList(outputInfo);
				checkDispenseStoreInfoList(storeInfoList, outputInfo);
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfo库存
					subtractStoreInfoList(outputInfo, hcpUser, now, storeInfoList);
				} else if (outputInfo.getPlusMinus() == -1) {
					throw new RuntimeException("此交易不允许退库");
				} else {
					throw new RuntimeException("正负类型错误");
				}
				storeInfoListMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId(), storeInfoList);
			} else {
				checkDispenseStoreInfoList(mapStoreInfoList, outputInfo);
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfoList库存
					subtractStoreInfoList(outputInfo, hcpUser, now, mapStoreInfoList);
				} else if (outputInfo.getPlusMinus() == -1) {
					// 退库
					throw new RuntimeException("此交易不允许退库");
				} else {
					throw new RuntimeException("正负类型错误");
				}
			}
			
			PhaStoreInfo firstStoreInfo = storeInfoListMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getDrugInfo().getId()).get(0);
			/* storeId、生产日期、有效期、供货商、生产商、采购价、采购金额回写OutputInfo) */
			rehandleDispenseOutputInfo(outputInfo, firstStoreInfo);
		}

		List<PhaStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, List<PhaStoreInfo>> entry : storeInfoListMaps.entrySet()){
			for (PhaStoreInfo storeInfo : entry.getValue()) {
				storeInfoList.add(storeInfo);
			}
		}
		List<PhaStoreSumInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, PhaStoreSumInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		phaOutputInfoManager.batchSave(outputList);
		phaStoreInfoManager.batchSave(storeInfoList);
		phaStoreSumInfoManager.batchSave(storeSumInfoList);
	}
	
	private PhaStoreSumInfo outputFindStoreSum(PhaOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from PhaStoreSumInfo where hosId = ? and deptId = ? and drugInfo.id = ?");
		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getDrugInfo().getId());

		return phaStoreSumInfoManager.findOne(jql.toString(), values.toArray());
	}
	
	private void handleStoreSumInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now, PhaStoreSumInfo storeSumInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "找不到该药品的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));
		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库数量超出原库存量");
		}
		storeSumInfo.setBuyCost(buyPrice.multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseStoreSumInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now, PhaStoreSumInfo storeSumInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "找不到该药品的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		/* 发药出库没有采购价
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		*/
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));
		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "出库数量超出原库存量");
		}
		storeSumInfo.setBuyCost(storeSumInfo.getBuyPrice().multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(drugInfo.getPackQty()), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private PhaStoreInfo outputFindStoreInfo(PhaOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from PhaStoreInfo where hosId = ? and deptId = ? and drugInfo.id = ? and approvalNo = ? and batchNo = ? ");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getDrugInfo().getId());
		values.add(outputInfo.getApprovalNo());
		values.add(outputInfo.getBatchNo());

		return (PhaStoreInfo) phaStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	private List<PhaStoreInfo> outputFindStoreInfoList(PhaOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from PhaStoreInfo where hosId = ? and deptId = ? and drugInfo.id = ? and stop = true and storeSum > 0 order by createTime");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getDrugInfo().getId());

		return phaStoreInfoManager.find(jql.toString(), values.toArray());
	}
	
	private void subtractStoreInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now, PhaStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();

		if (storeInfo.getStoreSum().compareTo(outSum) == -1) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "库存明细中库存量不足");
		}
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	private void subtractStoreInfoList(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now, List<PhaStoreInfo> storeInfoList) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();

		for (PhaStoreInfo storeInfo : storeInfoList) {
			if (storeInfo.getStoreSum().compareTo(outSum) == -1) {
				// 库存不够扣
				outSum = outSum.subtract(storeInfo.getStoreSum());
				storeInfo.setStoreSum(BigDecimal.ZERO);				
			} else {
				// 库存够扣
				storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
				outSum = BigDecimal.ZERO;
			}
			storeInfo.setBuyCost(storeInfo.getBuyPrice().multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()), 4,
					BigDecimal.ROUND_HALF_UP));
			storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()),
					4, BigDecimal.ROUND_HALF_UP));
			storeInfo.setUpdateTime(now);
			storeInfo.setUpdateOper(hcpUser.getName());
			storeInfo.setUpdateOperId(hcpUser.getId());
			// 出库数量完了就退出
			if (outSum.compareTo(BigDecimal.ZERO) != 1) break;
		}
		// 循环完出库数量仍然大于0，说明所有库存明细都不够扣
		if (outSum.compareTo(BigDecimal.ZERO) == 1) {
			throw new RuntimeException("【" + drugInfo.getTradeName() + "】" + "库存明细中库存量不足");
		}
	}
	
	private void outputRetreatStoreInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now, PhaStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(drugInfo.getPackQty()),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private PhaDrugInfo getDrugInfoById(String drugId) {
		if (StringUtils.isBlank(drugId)) {
			throw new RuntimeException("药品Id不能为空");
		}
		PhaDrugInfo drugInfo = this.phaDrugInfoManager.get(drugId);
		if (drugInfo == null) {
			throw new RuntimeException("药品Id有误，获取药品信息失败");
		}
		return drugInfo;
	}

	private void handleOutputInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();

		outputInfo.setProducerInfo(drugInfo.getCompanyInfo());
		outputInfo.setTradeName(drugInfo.getTradeName());
		outputInfo.setSpecs(drugInfo.getDrugSpecs());
		outputInfo.setDrugType(drugInfo.getDrugType());
		outputInfo.setMinUnit(drugInfo.getMiniUnit());
		outputInfo.setDrugCode(drugInfo.getDrugCode());
		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		outputInfo.setSaleCost(salePrice.multiply(outSum));
		outputInfo.setOutSum(outSum.multiply(new BigDecimal(drugInfo.getPackQty())));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseOutputInfo(PhaOutputInfo outputInfo, HcpUser hcpUser, Date now) {
//		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		PhaDrugInfo drugInfo = outputInfo.getDrugInfo();

		outputInfo.setProducerInfo(drugInfo.getCompanyInfo());
		outputInfo.setTradeName(drugInfo.getTradeName());
		outputInfo.setSpecs(drugInfo.getDrugSpecs());
		outputInfo.setDrugType(drugInfo.getDrugType());
		outputInfo.setMinUnit(drugInfo.getMiniUnit());
		outputInfo.setDrugCode(drugInfo.getDrugCode());
//		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		outputInfo.setSaleCost(salePrice.multiply(outSum));
		outputInfo.setOutSum(outSum.multiply(new BigDecimal(drugInfo.getPackQty())));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void rehandleDispenseOutputInfo(PhaOutputInfo outputInfo, PhaStoreInfo storeInfo) {
		BigDecimal packQty= new BigDecimal(outputInfo.getDrugInfo().getPackQty());
		BigDecimal buyPrice = storeInfo.getBuyPrice();
		BigDecimal outSum = outputInfo.getOutSum();
		
		outputInfo.setStoreId(storeInfo.getStoreId());
		outputInfo.setValidDate(storeInfo.getValidDate());
		outputInfo.setProduceDate(storeInfo.getProduceDate());
		outputInfo.setProducerInfo(storeInfo.getCompanyInfo());
		outputInfo.setCompanyInfo(storeInfo.getCompanySupply());
		outputInfo.setBuyPrice(buyPrice);
		outputInfo.setBuyCost(buyPrice.multiply(outSum.divide(packQty, 4, BigDecimal.ROUND_HALF_UP)));
	}
}
