package com.lenovohit.hcp.hrp.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.ICommonRedisSequenceManager;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.hrp.manager.InstrmStoreMng;
import com.lenovohit.hcp.hrp.model.InstrmInfo;
import com.lenovohit.hcp.hrp.model.InstrmInputInfo;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;
import com.lenovohit.hcp.hrp.model.InstrmStoreInfo;

@Service
@Transactional	// 好像这个标签是设置事务的
public class InstrmStoreManagerImpl implements InstrmStoreMng {

	@Autowired
	private GenericManager<InstrmInputInfo, String> instrmInputInfoManager;
	@Autowired
	private GenericManager<InstrmOutputInfo, String> instrmOutputInfoManager;
	@Autowired
	private GenericManager<InstrmInfo, String> instrmInfoManager;
	@Autowired
	private GenericManager<InstrmStoreInfo, String> instrmStoreInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
	@Autowired
	private ICommonRedisSequenceManager commonRedisSequenceManager;

	@Override
	public List<InstrmInputInfo> instrmInput(List<InstrmInputInfo> inputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = inputBatchControl(inputList); // 获取是否按批次批号管理

		// 入库入参校验
		checkInputList(inputList, batchControl, hcpUser, now);
		// 循环处理InputList
		return handleInputList(inputList, batchControl, hcpUser, now);
	}

	@Override
	public void instrmOutput(List<InstrmOutputInfo> outputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = outputBatchControl(outputList); // 获取是否按批次批号管理

		// 出库入参校验
		checkOutputList(outputList, batchControl, hcpUser, now);
		// 循环处理OutputList
		handleOutputList(outputList, hcpUser, now);
	}

	@Override
	public void dispenseOutput(List<InstrmOutputInfo> outputList, HcpUser hcpUser) {
		 Date now = new Date();
		 // 发药入参校验
		 checkDispenseList(outputList, hcpUser, now);
		 // 循环处理OutputList
		 handleDispenseList(outputList, hcpUser, now);
	}

	// 获取是否按批次批号管理
	private Boolean inputBatchControl(List<InstrmInputInfo> inputList) {
//		StringBuilder jql = new StringBuilder();
//		List<Object> values = new ArrayList<Object>();
//		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'INSTRM_BATCH_CONTROL' ");
//		InstrmInputInfo firstInput = (InstrmInputInfo) inputList.get(0);
//		if (firstInput == null || StringUtils.isBlank(firstInput.getHosId())) {
//			throw new RuntimeException("医院Id不能为空");
//		} else {
//			values.add(firstInput.getHosId());
//		}
//		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
//		// 资产是否按批号管理1按批号2不按批号
//		return "1".equals(hcpCtrlParam.getControlParam()) ? Boolean.TRUE : Boolean.FALSE;
		return Boolean.FALSE;
	}

	// 入库入参校验
	private void checkInputList(List<InstrmInputInfo> inputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		String inBill = null;
		StringBuilder errorMsg = new StringBuilder();

		for (InstrmInputInfo inputInfo : inputList) {
			if (inputInfo == null) {
				throw new RuntimeException("不存在入库接口对象");
			}
			BigDecimal buyPrice = inputInfo.getBuyPrice();
			BigDecimal salePrice = inputInfo.getSalePrice();
			BigDecimal inSum = inputInfo.getInSum();

			if (inputInfo.getInstrmInfo() == null) {
				throw new RuntimeException("资产信息不能为空");
			}
			InstrmInfo newInstrmInfo = getInstrmInfoById(inputInfo.getInstrmInfo().getId());
			inputInfo.setInstrmInfo(newInstrmInfo);

			if (StringUtils.isBlank(inputInfo.getInType())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "入库类型不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getInputState())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "入库状态不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getDeptId())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getHosId())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "医院Id不能为空\n");

			}
			if (batchControl) {
				if (StringUtils.isBlank(inputInfo.getApprovalNo())) {
					errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				//inputInfo.setBatchNo("-");
//				inputInfo.setApprovalNo("-");
			}
			if (StringUtils.isBlank(inputInfo.getProduceDate())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "生产日期不能为空\n");
			}
			/*
			 * 固定资产不校验供应商
			 * if (inputInfo.getCompanyInfo() == null || StringUtils.isBlank(inputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "供货商不能为空\n");
			}*/
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "采购价不能为null或0或负数\n");
			}
			if (inSum == null || inSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "入库数量不能为null或0\n");
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
				InstrmInputInfo origInputInfo = this.instrmInputInfoManager.get(inputInfo.getId());
				if (origInputInfo == null) {
					errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "获取原入库信息失败\n");
				}
				if (StringUtils.isBlank(inputInfo.getInBill())) {
					errorMsg.append("【" + inputInfo.getInstrmInfo().getTradeName() + "】" + "入库Id不为空，则入库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	// 循环处理InputList
	private List<InstrmInputInfo> handleInputList(List<InstrmInputInfo> inputList, Boolean batchControl, HcpUser hcpUser,
			Date now) {
		Map<String, InstrmStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, InstrmStoreInfo> instrmStoreSumInfos = new HashMap<>();

		for (InstrmInputInfo inputInfo : inputList) {
			// 处理inputInfo
			handleInputInfo(inputInfo, hcpUser, now);
			
			// 处理storeInfo
			if (batchControl) {
				if (inputInfo.getPlusMinus() == 1) { // PlusMinus为正，入库
					inputInfo.setPurchaseDate(new Date());
					// 新建storeInfo
					checkDuplicateStoreInfo(inputInfo);
					InstrmStoreInfo storeInfo = createStoreInfo(inputInfo, hcpUser, now);
					storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
				} else if (inputInfo.getPlusMinus() == -1) { // PlusMinus为负，退库
					// 查找storeInfo
					InstrmStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
					if (mapStoreInfo == null) {
						InstrmStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
						// 对storeInfo退库
						inputRetreatStoreInfo(inputInfo, hcpUser, now, storeInfo);
						storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
						+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
					} else {
						inputRetreatStoreInfo(inputInfo, hcpUser, now, mapStoreInfo);
					}
				} else {
					throw new RuntimeException("正负类型错误");
				}
			} else {
				InstrmStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
				+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
				if (mapStoreInfo == null) {
					InstrmStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
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
					+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
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
				+inputInfo.getInstrmInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo()).getStoreId();
			inputInfo.setStoreId(storeId); 
			
			
			// 处理库存汇总(固定资产中无库存汇总)
			/*InstrmStoreInfo info = instrmStoreSumInfos
					.get(inputInfo.getInstrmInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId());
			if (info == null) {
				// 获取sum
				InstrmStoreInfo instrmStoreSumInfo = findStoreSum(inputInfo);
				if (instrmStoreSumInfo == null) {
					instrmStoreSumInfos.put(inputInfo.getInstrmInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(),
							createStoreSum(inputInfo, hcpUser, now));
				} else {
					addStoreSum(inputInfo, hcpUser, now, instrmStoreSumInfo);
					instrmStoreSumInfos.put(inputInfo.getInstrmInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(), instrmStoreSumInfo);
				}
			} else {
				addStoreSum(inputInfo, hcpUser, now, info);
			}*/
		}
		List<InstrmStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, InstrmStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}		
		List<InstrmStoreInfo> storeSumList = new ArrayList<>();
		for (Map.Entry<String, InstrmStoreInfo> entry : instrmStoreSumInfos.entrySet()){
			storeSumList.add(entry.getValue());
		}
		instrmInputInfoManager.batchSave(inputList);
		instrmStoreInfoManager.batchSave(storeInfoList);
		//instrmStoreInfoManager.batchSave(storeSumList);

		return inputList;
	}

	private void checkDuplicateStoreInfo(InstrmInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getInstrmInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		Long count = instrmStoreInfoManager.getCount(jql.toString(), values.toArray());
		if (count > 0) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "已有相同批次批号的库存明细记录");
		}
	}

	// 新建storeInfo
	private InstrmStoreInfo createStoreInfo(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now) {
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();
		InstrmStoreInfo storeInfo = new InstrmStoreInfo();
		storeInfo.setStoreId(redisSequenceManager.get("INSTRM_STOREINFO", "STORE_ID"));
		storeInfo.setDeptId(inputInfo.getDeptId());
		storeInfo.setInstrmType(instrmInfo.getInstrmType());
		//保存录入的固定资产编码
		storeInfo.setInstrmCode(inputInfo.getInstrmCode());
		storeInfo.setInstrmInfo(instrmInfo);
		storeInfo.setTradeName(instrmInfo.getCommonName());
		storeInfo.setInstrmSpecs(instrmInfo.getInstrmSpecs());
		storeInfo.setBatchNo(inputInfo.getBatchNo());
		storeInfo.setApprovalNo(inputInfo.getApprovalNo());
		storeInfo.setProduceDate(inputInfo.getProduceDate());
		Company storeCompany = new Company();
		storeCompany.setId(inputInfo.getProducer());
		storeInfo.setCompanyInfo(storeCompany);
		storeInfo.setCompanySupply(inputInfo.getCompanyInfo());
		storeInfo.setValidDate(inputInfo.getValidDate());
		storeInfo.setBuyPrice(inputInfo.getBuyPrice());
		storeInfo.setSalePrice(inputInfo.getSalePrice());
		storeInfo.setStoreSum(inputInfo.getInSum());
		storeInfo.setInstrmUnit(instrmInfo.getInstrmUnit());
		storeInfo.setBuyCost(inputInfo.getBuyCost());
		storeInfo.setSaleCost(inputInfo.getSaleCost());
		// 祝哥说location不用管
		storeInfo.setStop(Boolean.TRUE);
		storeInfo.setComm(inputInfo.getComm());
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
		storeInfo.setCreateTime(now);
		storeInfo.setPurchaseDate(now);
		storeInfo.setCreateOper(hcpUser.getName());
		storeInfo.setCreateOperId(hcpUser.getId());
		return storeInfo;
	}

	// 查找StoreInfo
	private InstrmStoreInfo inputFindStoreInfo(InstrmInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		// 是否按批次批号管理对查询条件无影响，因为不按批次批号管理时，批次批号都设为了"-"
		jql.append(
				"from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getInstrmInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		return (InstrmStoreInfo) instrmStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 退库storeInfo
	private void inputRetreatStoreInfo(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
		if (storeInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "退库数量超出原库存量");
		}
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0), 4,
				BigDecimal.ROUND_HALF_UP));
		if(salePrice!=null){
			storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0),
					4, BigDecimal.ROUND_HALF_UP));
		}
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 累加storeInfo
	private void addStoreInfo(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0), 4,
				BigDecimal.ROUND_HALF_UP));
		if(salePrice!=null){
			storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0),
					4, BigDecimal.ROUND_HALF_UP));
		}
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 查找storeSum
	private InstrmStoreInfo findStoreSum(InstrmInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getInstrmInfo().getId());
		return instrmStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 处理inputInfo
	private void handleInputInfo(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();
		// String newBatchNo = DateUtils.getCurrentDateStr("yyyyMMddHHmmsssss");
		String newBatchNo = commonRedisSequenceManager.get(inputInfo.getHosId()+inputInfo.getDeptId()+inputInfo.getInstrmInfo().getId()+inputInfo.getApprovalNo());

		inputInfo.setBatchNo(newBatchNo);
		inputInfo.setTradeName(instrmInfo.getCommonName());
		inputInfo.setInstrmSpecs(instrmInfo.getInstrmSpecs());
		inputInfo.setInstrmType(instrmInfo.getInstrmType());
		inputInfo.setProducer(instrmInfo.getCompanyInfo().getId());
		inputInfo.setInstrmUnit(instrmInfo.getInstrmUnit());
//		inputInfo.setInstrmCode(instrmInfo.getInstrmCode());
		inputInfo.setBuyCost(buyPrice.multiply(inSum));
//		inputInfo.setSaleCost(salePrice.multiply(inSum));
		// 接口传入的inSum按包装数量计，而数据库保存的inSum按最小单位计
		inputInfo.setInSum(inSum);
		inputInfo.setInOper(hcpUser.getName());
		inputInfo.setInTime(now);
		inputInfo.setUpdateOper(hcpUser.getName());
		inputInfo.setUpdateTime(now);
		inputInfo.setPurchaseDate(now);
		inputInfo.setUpdateOperId(hcpUser.getId());
	}

	// 新建storeSum
	private InstrmStoreInfo createStoreSum(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now) {
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();

		InstrmStoreInfo storeSumInfo = new InstrmStoreInfo();
		storeSumInfo.setStoreId(redisSequenceManager.get("INSTRM_STOREINFO", "STORE_SUM_ID"));
		storeSumInfo.setDeptId(inputInfo.getDeptId());
		storeSumInfo.setInstrmType(instrmInfo.getInstrmType());
		storeSumInfo.setInstrmCode(instrmInfo.getInstrmCode());
		InstrmInfo storeSumInstrmInfo = new InstrmInfo();
		storeSumInstrmInfo.setId(inputInfo.getInstrmInfo().getId());
		storeSumInfo.setInstrmInfo(storeSumInstrmInfo);
		storeSumInfo.setTradeName(instrmInfo.getTradeName());
		storeSumInfo.setInstrmSpecs(instrmInfo.getInstrmSpecs());
		Company storeSumCompany = new Company();
		storeSumCompany.setId(inputInfo.getProducer());
		storeSumInfo.setCompanyInfo(storeSumCompany);
		storeSumInfo.setBuyPrice(inputInfo.getBuyPrice());
		storeSumInfo.setSalePrice(inputInfo.getSalePrice());
		storeSumInfo.setStoreSum(inputInfo.getInSum());
		storeSumInfo.setInstrmUnit(instrmInfo.getInstrmUnit());
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
	private void addStoreSum(InstrmInputInfo inputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeSumInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		InstrmInfo instrmInfo = inputInfo.getInstrmInfo();

		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + inputInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().add(inSum));
		storeSumInfo.setBuyCost(buyPrice.multiply(storeSumInfo.getStoreSum()));
		storeSumInfo.setSaleCost(salePrice);
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}

	private void checkStoreInfo(InstrmStoreInfo storeInfo, BigDecimal buyPrice, BigDecimal salePrice) {
		if (storeInfo == null) {
			throw new RuntimeException("未获取到原库存明细信息");
		}
		if (!storeInfo.isStop()) {
			throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "原库存明细信息已停用");
		}
		if (buyPrice.compareTo(storeInfo.getBuyPrice()) != 0) {
			//throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "采购价格与原库存采购价格不相等，请先调价");
		}
		/*if (salePrice.compareTo(storeInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + storeInfo.getTradeName() + "】" + "零售价格与原库存零售价格不相等，请先调价");
		}*/
	}

	private void checkDispenseStoreInfoList(List<InstrmStoreInfo> storeInfoList, InstrmOutputInfo outputInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		String tradeName = outputInfo.getInstrmInfo().getCommonName();
		
		if (storeInfoList == null) {
			throw new RuntimeException("未获取到原库存明细信息");
		}
		/*  
		 * 发药出库入参没有采购价，不用比较
		 */
		/*if (salePrice.compareTo(storeInfoList.get(0).getSalePrice()) != 0) {
			throw new RuntimeException("【"+tradeName+"】"+"零售价格与原库存零售价格不相等，请先调价");
		}*/
	}
	
	private Boolean outputBatchControl(List<InstrmOutputInfo> outputList) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'INSTRM_BATCH_CONTROL' ");
		InstrmOutputInfo firstOutput = (InstrmOutputInfo) outputList.get(0);
		if (firstOutput == null || StringUtils.isBlank(firstOutput.getHosId())) {
			throw new RuntimeException("医院Id不能为空");
		} else {
			values.add(firstOutput.getHosId());
		}
		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
		// 资产是否按批号管理1按批号2不按批号
//		return hcpCtrlParam.getControlParam().equals("1") ? Boolean.TRUE : Boolean.FALSE;
		return Boolean.FALSE;
	}

	private void checkOutputList(List<InstrmOutputInfo> outputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (InstrmOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}

			BigDecimal buyPrice = outputInfo.getBuyPrice();
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getInstrmInfo() == null) {
				throw new RuntimeException("资产信息不能为空");
			}
			InstrmInfo newInstrmInfo = getInstrmInfoById(outputInfo.getInstrmInfo().getId());
			outputInfo.setInstrmInfo(newInstrmInfo);

			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库状态不能为空\n");
			}
			if (batchControl) {
				if (StringUtils.isBlank(outputInfo.getBatchNo())) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "批次不能为空\n");
				}
				if (StringUtils.isBlank(outputInfo.getApprovalNo())) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				//outputInfo.setBatchNo("-");
//				outputInfo.setApprovalNo("-");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "医院Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {//资产无有效期校验
				//errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				if(outputInfo.getInstrmInfo().getCompanyInfo()!=null){
					outputInfo.setCompanyInfo(outputInfo.getInstrmInfo().getCompanyInfo());
				}/*else{
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "供货商不能为空\n");
				}*/
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "采购价不能为null或0或负数\n");
			}
			/*if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "零售价不能为null或0或负数\n");
			}*/
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库数量不能为null或0\n");
			} else if (outSum.compareTo(BigDecimal.ZERO) == 1) {
				outputInfo.setPlusMinus(1);
			} else if (outSum.compareTo(BigDecimal.ZERO) == -1) {
				outputInfo.setPlusMinus(1);
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
				InstrmOutputInfo origOutputInfo = this.instrmOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	private void checkDispenseList(List<InstrmOutputInfo> outputList, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (InstrmOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getInstrmInfo() == null) {
				throw new RuntimeException("资产信息不能为空");
			}
			InstrmInfo newInstrmInfo = getInstrmInfoById(outputInfo.getInstrmInfo().getId());
			outputInfo.setInstrmInfo(newInstrmInfo);

			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库状态不能为空\n");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "医院Id不能为空\n");
			}
			// 循环扣库存时去取
			/*if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "采购价不能为null或0或负数\n");
			}*/
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				//errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "零售价不能为null或0或负数\n");
			}
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库数量不能为null或0\n");
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
				InstrmOutputInfo origOutputInfo = this.instrmOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getInstrmInfo().getCommonName() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}
	
	private void handleOutputList(List<InstrmOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, InstrmStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, InstrmStoreInfo> storeSumInfoMaps = new HashMap<>();

		for (InstrmOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleOutputInfo(outputInfo, hcpUser, now);
			
			InstrmStoreInfo mapStoreInfo = storeInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo());
			if (mapStoreInfo == null) {
				InstrmStoreInfo storeInfo = outputFindStoreInfo(outputInfo);
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
				storeInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo(), storeInfo);
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
			
			String storeId = storeInfoMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo()).getStoreId();
			outputInfo.setStoreId(storeId); // storeId回写outputInfo
			
			InstrmStoreInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId());
			/*固定资产不存在库存汇总功能
			 * if (mapStoreSumInfo == null) {
				InstrmStoreInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId(), storeSumInfo);
			} else {
				handleStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}*/
		}

		List<InstrmStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, InstrmStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}

		List<InstrmStoreInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, InstrmStoreInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		instrmOutputInfoManager.batchSave(outputList);
		instrmStoreInfoManager.batchSave(storeInfoList);
		instrmStoreInfoManager.batchSave(storeSumInfoList);
	}

	private void handleDispenseList(List<InstrmOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, List<InstrmStoreInfo>> storeInfoListMaps = new HashMap<>();
		Map<String, InstrmStoreInfo> storeSumInfoMaps = new HashMap<>();

		for (InstrmOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleDispenseOutputInfo(outputInfo, hcpUser, now);

			// 处理InstrmStoreInfo
			InstrmStoreInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId());
			if (mapStoreSumInfo == null) {
				InstrmStoreInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId(), storeSumInfo);
			} else {
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}

			List<InstrmStoreInfo> mapStoreInfoList = storeInfoListMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId());
			if (mapStoreInfoList == null) {
				List<InstrmStoreInfo> storeInfoList = outputFindStoreInfoList(outputInfo);
				checkDispenseStoreInfoList(storeInfoList, outputInfo);
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfo库存
					subtractStoreInfoList(outputInfo, hcpUser, now, storeInfoList);
				} else if (outputInfo.getPlusMinus() == -1) {
					throw new RuntimeException("此交易不允许退库");
				} else {
					throw new RuntimeException("正负类型错误");
				}
				storeInfoListMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId(), storeInfoList);
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
			
			InstrmStoreInfo firstStoreInfo = storeInfoListMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getInstrmInfo().getId()).get(0);
			/* storeId、生产日期、有效期、供货商、生产商、采购价、采购金额回写OutputInfo) */
			rehandleDispenseOutputInfo(outputInfo, firstStoreInfo);
		}

		List<InstrmStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, List<InstrmStoreInfo>> entry : storeInfoListMaps.entrySet()){
			for (InstrmStoreInfo storeInfo : entry.getValue()) {
				storeInfoList.add(storeInfo);
			}
		}
		List<InstrmStoreInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, InstrmStoreInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		instrmOutputInfoManager.batchSave(outputList);
		instrmStoreInfoManager.batchSave(storeInfoList);
		instrmStoreInfoManager.batchSave(storeSumInfoList);
	}
	
	private InstrmStoreInfo outputFindStoreSum(InstrmOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ?");
		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getInstrmInfo().getId());

		return instrmStoreInfoManager.findOne(jql.toString(), values.toArray());
	}
	
	private void handleStoreSumInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeSumInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "找不到该资产的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		/*if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}*/
//		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));

		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库数量超出原库存量");
		}
//		storeSumInfo.setBuyCost(buyPrice.multiply(storeSumInfo.getStoreSum())
//				.divide(new BigDecimal(0), 4, BigDecimal.ROUND_HALF_UP));
//		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
//				.divide(new BigDecimal(0), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseStoreSumInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeSumInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "找不到该资产的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "原库存汇总信息已停用");
		}
		/* 发药出库没有采购价
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		*/
		/*if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}*/
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));
		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "出库数量超出原库存量");
		}
		storeSumInfo.setBuyCost(storeSumInfo.getBuyPrice().multiply(storeSumInfo.getStoreSum())
				.divide(new BigDecimal(0), 4, BigDecimal.ROUND_HALF_UP));
		if(salePrice!=null){
			storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
					.divide(new BigDecimal(0), 4, BigDecimal.ROUND_HALF_UP));
		}
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private InstrmStoreInfo outputFindStoreInfo(InstrmOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ? and approvalNo = ? and batchNo = ? ");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getInstrmInfo().getId());
		values.add(outputInfo.getApprovalNo());
		values.add(outputInfo.getBatchNo());

		return (InstrmStoreInfo) instrmStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	private List<InstrmStoreInfo> outputFindStoreInfoList(InstrmOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from InstrmStoreInfo where hosId = ? and deptId = ? and instrmInfo.id = ? and stop = true and storeSum > 0 order by createTime");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getInstrmInfo().getId());

		return instrmStoreInfoManager.find(jql.toString(), values.toArray());
	}
	
	private void subtractStoreInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();

		if (storeInfo.getStoreSum().doubleValue()<outSum.doubleValue()) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "库存明细中库存量不足");
		}
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		//将对应资产出库到对应科室
		instockToDept(outputInfo, storeInfo);
//		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0), 4,
//				BigDecimal.ROUND_HALF_UP));
//		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0),
//				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	/**
	 * 描述：if（目标科室是否存在相同资产）{
	 * 			在原有基础上做数量累加
	 * 			（hosId、deptId、instrmId、instrmCode相同）
	 * 		}else{
	 *			创建一条新的资产库存信息设置库存
	 * 			}
	 * //之所以这样处理是避免资产在两个科室之间来回轮转时，无限制在库存中插入库存为0的数据
	 * @param outputInfo
	 * @param storeInfo
	 */
	private void instockToDept(InstrmOutputInfo outputInfo, InstrmStoreInfo storeInfo) {
		Department toDept = outputInfo.getToDept();
		// 如果存在出库科室将固定资产直接入到对应出库科室
		if(toDept!=null){
			InstrmStoreInfo inputStore = new InstrmStoreInfo();
			try {
				List<String> values = new ArrayList<String>();
				values.add(outputInfo.getHosId());
				values.add(toDept.getId());
				values.add(outputInfo.getInstrmId());
				values.add(storeInfo.getInstrmCode());
				// 根据医院、科室、资产id、资产编码 查询库存中是否已存在物资
				InstrmStoreInfo tmpStore = instrmStoreInfoManager.findOne("from InstrmStoreInfo where hosId = ? "
						+ "and deptId = ? and instrmInfo.id = ? and instrmCode=? and  stop = true ", values.toArray());
				//判断库存中是否存在记录
				if(tmpStore!=null){
					if(tmpStore.getStoreSum()!=null){
						tmpStore.setStoreSum(tmpStore.getStoreSum().add(outputInfo.getOutSum()));
					} else {
						tmpStore.setStoreSum(outputInfo.getOutSum());
					}
					inputStore = tmpStore;
				} else {//不存在对应库存
					BeanUtils.copyProperties(inputStore, storeInfo);
					inputStore.setId(null);
					inputStore.setDeptId(toDept.getId());
					inputStore.setStoreSum(outputInfo.getOutSum());
				}
				instrmStoreInfoManager.save(inputStore);
			} catch (Exception e) {
				throw new RuntimeException("向目标科室入库时出错，请稍后再试或联系管理员！");
			}
		}
	}

	private void subtractStoreInfoList(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now, List<InstrmStoreInfo> storeInfoList) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();

		for (InstrmStoreInfo storeInfo : storeInfoList) {
			if (storeInfo.getStoreSum().compareTo(outSum) == -1) {
				// 库存不够扣
				outSum = outSum.subtract(storeInfo.getStoreSum());
				storeInfo.setStoreSum(BigDecimal.ZERO);				
			} else {
				// 库存够扣
				storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
				outSum = BigDecimal.ZERO;
			}
			storeInfo.setBuyCost(storeInfo.getBuyPrice().multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0), 4,
					BigDecimal.ROUND_HALF_UP));
			
			/*storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0),
					4, BigDecimal.ROUND_HALF_UP));*/
			storeInfo.setUpdateTime(now);
			storeInfo.setUpdateOper(hcpUser.getName());
			storeInfo.setUpdateOperId(hcpUser.getId());
			// 出库数量完了就退出
			if (outSum.compareTo(BigDecimal.ZERO) != 1) break;
		}
		// 循环完出库数量仍然大于0，说明所有库存明细都不够扣
		if (outSum.compareTo(BigDecimal.ZERO) == 1) {
			throw new RuntimeException("【" + instrmInfo.getTradeName() + "】" + "库存明细中库存量不足");
		}
	}
	
	private void outputRetreatStoreInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now, InstrmStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0), 4,
				BigDecimal.ROUND_HALF_UP));
		/*storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(0),
				4, BigDecimal.ROUND_HALF_UP));*/
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private InstrmInfo getInstrmInfoById(String instrmId) {
		if (StringUtils.isBlank(instrmId)) {
			throw new RuntimeException("资产Id不能为空");
		}
		InstrmInfo instrmInfo = this.instrmInfoManager.get(instrmId);
		if (instrmInfo == null) {
			throw new RuntimeException("资产Id有误，获取资产信息失败");
		}
		return instrmInfo;
	}

	private void handleOutputInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();

		outputInfo.setProducerInfo(instrmInfo.getCompanyInfo());
		outputInfo.setTradeName(instrmInfo.getTradeName());
		outputInfo.setInstrmSpecs(instrmInfo.getInstrmSpecs());
		outputInfo.setInstrmType(instrmInfo.getInstrmType());
		outputInfo.setMinUnit(instrmInfo.getInstrmUnit());
//		outputInfo.setInstrmCode(instrmInfo.getInstrmCode());
		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		if(salePrice !=null){
			outputInfo.setSaleCost(salePrice.multiply(outSum));
		}
//		outputInfo.setOutSum(outSum.multiply(new BigDecimal(0)));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseOutputInfo(InstrmOutputInfo outputInfo, HcpUser hcpUser, Date now) {
//		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		InstrmInfo instrmInfo = outputInfo.getInstrmInfo();

		outputInfo.setProducerInfo(instrmInfo.getCompanyInfo());
		outputInfo.setTradeName(instrmInfo.getTradeName());
		outputInfo.setInstrmSpecs(instrmInfo.getInstrmSpecs());
		outputInfo.setInstrmType(instrmInfo.getInstrmType());
		outputInfo.setMinUnit(instrmInfo.getInstrmUnit());
//		outputInfo.setInstrmCode(instrmInfo.getInstrmCode());
//		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		if(salePrice!=null){
			outputInfo.setSaleCost(salePrice.multiply(outSum));
		}
		outputInfo.setOutSum(outSum.multiply(new BigDecimal(0)));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void rehandleDispenseOutputInfo(InstrmOutputInfo outputInfo, InstrmStoreInfo storeInfo) {
		BigDecimal packQty= new BigDecimal(0);
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
