package com.lenovohit.hcp.material.manager.impl;

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
import com.lenovohit.hcp.material.manager.MatStoreManager;
import com.lenovohit.hcp.material.model.MatBuyBill;
import com.lenovohit.hcp.material.model.MatBuyDetail;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;
import com.lenovohit.hcp.material.model.MatStoreInfo;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;

@Service
@Transactional	// 好像这个标签是设置事务的
public class MatStoreManagerImpl implements MatStoreManager {

	@Autowired
	private GenericManager<MatInputInfo, String> matInputInfoManager;
	@Autowired
	private GenericManager<MatOutputInfo, String> matOutputInfoManager;
	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
	@Autowired
	private ICommonRedisSequenceManager commonRedisSequenceManager;
	@Autowired
	private GenericManager<MatBuyBill, String> matBuyBillManager;
	@Autowired
	private GenericManager<MatBuyDetail, String> matBuyDetailManager;
	
	

	@Override
	public List<MatInputInfo> matInput(List<MatInputInfo> inputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = inputBatchControl(inputList); // 获取是否按批次批号管理

		// 入库入参校验
		checkInputList(inputList, batchControl, hcpUser, now);
		// 循环处理InputList
		return handleInputList(inputList, batchControl, hcpUser, now);
	}

	@Override
	public void matOutput(List<MatOutputInfo> outputList, HcpUser hcpUser) {
		Date now = new Date();
		Boolean batchControl = outputBatchControl(outputList); // 获取是否按批次批号管理

		// 出库入参校验
		checkOutputList(outputList, batchControl, hcpUser, now);
		// 循环处理OutputList
		handleOutputList(outputList, hcpUser, now);
	}

	@Override
	public void dispenseOutput(List<MatOutputInfo> outputList, HcpUser hcpUser) {
		 Date now = new Date();
		 // 发药入参校验
		 checkDispenseList(outputList, hcpUser, now);
		 // 循环处理OutputList
		 handleDispenseList(outputList, hcpUser, now);
	}

	// 获取是否按批次批号管理
	private Boolean inputBatchControl(List<MatInputInfo> inputList) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'DRUG_BATCH_CONTROL' ");
		MatInputInfo firstInput = (MatInputInfo) inputList.get(0);
		if (firstInput == null || StringUtils.isBlank(firstInput.getHosId())) {
			throw new RuntimeException("医院Id不能为空");
		} else {
			values.add(firstInput.getHosId());
		}
		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
		// 药品是否按批号管理1按批号2不按批号
		return "1".equals(hcpCtrlParam.getControlParam()) ? Boolean.TRUE : Boolean.FALSE;
	}

	// 入库入参校验
	private void checkInputList(List<MatInputInfo> inputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		String inBill = null;
		StringBuilder errorMsg = new StringBuilder();

		for (MatInputInfo inputInfo : inputList) {
			if (inputInfo == null) {
				throw new RuntimeException("不存在入库接口对象");
			}
			BigDecimal buyPrice = inputInfo.getBuyPrice();
			BigDecimal salePrice = inputInfo.getSalePrice();
			BigDecimal inSum = inputInfo.getInSum();
			//统一设置物資相關信息
			if(inputInfo.getTradeName()==null||"".equals(inputInfo.getTradeName())){
				inputInfo.setTradeName(inputInfo.getMatInfo().getCommonName());
			}
			if(inputInfo.getMaterialSpecs()==null||"".equals(inputInfo.getMaterialSpecs())){
				inputInfo.setMaterialSpecs(inputInfo.getMatInfo().getMaterialSpecs());
			}
			

			if (inputInfo.getMatInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}
			MatInfo newMatInfo = getMatInfoById(inputInfo.getMatInfo().getId());
			inputInfo.setMatInfo(newMatInfo);

			if (StringUtils.isBlank(inputInfo.getInType())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "入库类型不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getInputState())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "入库状态不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getDeptId())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getHosId())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "医院Id不能为空\n");

			}
			if (batchControl) {
				if (StringUtils.isBlank(inputInfo.getApprovalNo())) {
					errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				inputInfo.setBatchNo("-");
				inputInfo.setApprovalNo("-");
			}
			if (StringUtils.isBlank(inputInfo.getProduceDate())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(inputInfo.getValidDate())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "有效期不能为空\n");
			}
			if (inputInfo.getCompanyInfo() == null || StringUtils.isBlank(inputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "采购价不能为null或0或负数\n");
			}
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "零售价不能为null或0或负数\n");
			}
			if (inSum == null || inSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "入库数量不能为null或0\n");
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
				MatInputInfo origInputInfo = this.matInputInfoManager.get(inputInfo.getId());
				if (origInputInfo == null) {
					errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "获取原入库信息失败\n");
				}
				if (StringUtils.isBlank(inputInfo.getInBill())) {
					errorMsg.append("【" + inputInfo.getMatInfo().getMaterialCode() + "】" + "入库Id不为空，则入库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	// 循环处理InputList
	private List<MatInputInfo> handleInputList(List<MatInputInfo> inputList, Boolean batchControl, HcpUser hcpUser,
			Date now) {
		Map<String, MatStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, MatStoreSumInfo> matStoreSumInfos = new HashMap<>();

		for (MatInputInfo inputInfo : inputList) {
			// 处理inputInfo
			handleInputInfo(inputInfo, hcpUser, now);
			
			// 处理storeInfo
			if (batchControl) {
				if (inputInfo.getPlusMinus() == 1) { // PlusMinus为正，入库
					// 新建storeInfo
					checkDuplicateStoreInfo(inputInfo);
					MatStoreInfo storeInfo = createStoreInfo(inputInfo, hcpUser, now);
					storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
				} else if (inputInfo.getPlusMinus() == -1) { // PlusMinus为负，退库
					// 查找storeInfo
					MatStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
					+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
					if (mapStoreInfo == null) {
						MatStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
						// 对storeInfo退库
						inputRetreatStoreInfo(inputInfo, hcpUser, now, storeInfo);
						storeInfoMaps.put(inputInfo.getHosId()+inputInfo.getDeptId()
						+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
					} else {
						inputRetreatStoreInfo(inputInfo, hcpUser, now, mapStoreInfo);
					}
				} else {
					throw new RuntimeException("正负类型错误");
				}
			} else {
				MatStoreInfo mapStoreInfo = storeInfoMaps.get(inputInfo.getHosId()+inputInfo.getDeptId()
				+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo());
				if (mapStoreInfo == null) {
					MatStoreInfo storeInfo = inputFindStoreInfo(inputInfo);
					storeInfo.setMaterialInfo(inputInfo.getMatInfo());
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
					+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo(),storeInfo);
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
				+inputInfo.getMatInfo().getId()+inputInfo.getBatchNo()+inputInfo.getApprovalNo()).getStoreId();
			inputInfo.setStoreId(storeId); 
			
			
			// 处理库存汇总
			MatStoreSumInfo info = matStoreSumInfos
					.get(inputInfo.getMatInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId());
			if (info == null) {
				// 获取sum
				MatStoreSumInfo matStoreSumInfo = findStoreSum(inputInfo);
				if (matStoreSumInfo == null) {
					matStoreSumInfos.put(inputInfo.getMatInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(),
							createStoreSum(inputInfo, hcpUser, now));
				} else {
					addStoreSum(inputInfo, hcpUser, now, matStoreSumInfo);
					matStoreSumInfos.put(inputInfo.getMatInfo().getId()+inputInfo.getHosId()+inputInfo.getDeptId(), matStoreSumInfo);
				}
			} else {
				addStoreSum(inputInfo, hcpUser, now, info);
			}
		}
		List<MatStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, MatStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}		
		List<MatStoreSumInfo> storeSumList = new ArrayList<>();
		for (Map.Entry<String, MatStoreSumInfo> entry : matStoreSumInfos.entrySet()){
			storeSumList.add(entry.getValue());
		}
		matInputInfoManager.batchSave(inputList);
		matStoreInfoManager.batchSave(storeInfoList);
		matStoreSumInfoManager.batchSave(storeSumList);

		return inputList;
	}

	private void checkDuplicateStoreInfo(MatInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from MatStoreInfo where hosId = ? and deptId = ? and materialInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getMatInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		Long count = matStoreInfoManager.getCount(jql.toString(), values.toArray());
		if (count > 0) {
			throw new RuntimeException("【" + inputInfo.getMaterialCode() + "】" + "已有相同批次批号的库存明细记录");
		}
	}

	// 新建storeInfo
	private MatStoreInfo createStoreInfo(MatInputInfo inputInfo, HcpUser hcpUser, Date now) {
		MatInfo matInfo = inputInfo.getMatInfo();
		MatStoreInfo storeInfo = new MatStoreInfo();
		storeInfo.setStoreId(redisSequenceManager.get("PHA_STOREINFO", "STORE_ID"));
		storeInfo.setDeptId(inputInfo.getDeptId());
		storeInfo.setMaterialType(matInfo.getMaterialType());
		storeInfo.setMaterialCode(matInfo.getMaterialCode());
		storeInfo.setTradeName(matInfo.getCommonName());
		storeInfo.setMaterialSpecs(matInfo.getMaterialSpecs());
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
		storeInfo.setMinUnit(matInfo.getMaterialUnit());
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
		storeInfo.setMaterialInfo(matInfo);
		return storeInfo;
	}

	// 查找StoreInfo
	private MatStoreInfo inputFindStoreInfo(MatInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		// 是否按批次批号管理对查询条件无影响，因为不按批次批号管理时，批次批号都设为了"-"
		jql.append(
				"from MatStoreInfo where hosId = ? and deptId = ? and materialInfo.id = ? and batchNo = ? and approvalNo = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getMatInfo().getId());
		values.add(inputInfo.getBatchNo());
		values.add(inputInfo.getApprovalNo());
		return (MatStoreInfo) matStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 退库storeInfo
	private void inputRetreatStoreInfo(MatInputInfo inputInfo, HcpUser hcpUser, Date now, MatStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		MatInfo matInfo = inputInfo.getMatInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
		if (storeInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + inputInfo.getMaterialCode() + "】" + "退库数量超出原库存量");
			
		}
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getSalePrice(), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getSalePrice(),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 累加storeInfo
	private void addStoreInfo(MatInputInfo inputInfo, HcpUser hcpUser, Date now, MatStoreInfo storeInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		MatInfo matInfo = inputInfo.getMatInfo();
		checkStoreInfo(storeInfo, buyPrice, salePrice);

		storeInfo.setStoreSum(storeInfo.getStoreSum().add(inSum));
//		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(matInfo.getPackQty()), 4,
//				BigDecimal.ROUND_HALF_UP));
//		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(new BigDecimal(matInfo.getPackQty()),
//				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	// 查找storeSum
	private MatStoreSumInfo findStoreSum(MatInputInfo inputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from MatStoreSumInfo where hosId = ? and deptId = ? and materialInfo.id = ?");
		values.add(inputInfo.getHosId());
		values.add(inputInfo.getDeptId());
		values.add(inputInfo.getMatInfo().getId());
		return matStoreSumInfoManager.findOne(jql.toString(), values.toArray());
	}

	// 处理inputInfo
	private void handleInputInfo(MatInputInfo inputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		MatInfo matInfo = inputInfo.getMatInfo();
		// String newBatchNo = DateUtils.getCurrentDateStr("yyyyMMddHHmmsssss");
		String newBatchNo = commonRedisSequenceManager.get(inputInfo.getHosId()+inputInfo.getDeptId()+inputInfo.getMatInfo().getId()+inputInfo.getApprovalNo());

		inputInfo.setBatchNo(newBatchNo);
//		inputInfo.setCommonName(matInfo.getMaterialCode());
		inputInfo.setMaterialSpecs(matInfo.getMaterialSpecs());
		inputInfo.setMaterialType(matInfo.getMaterialType());
		inputInfo.setProducer(matInfo.getCompanyInfo().getId());
		inputInfo.setMinUnit(matInfo.getMaterialUnit());
		inputInfo.setMaterialCode(matInfo.getMaterialCode());
		inputInfo.setBuyCost(buyPrice.multiply(inSum));
		inputInfo.setSaleCost(salePrice.multiply(inSum));
		// 接口传入的inSum按包装数量计，而数据库保存的inSum按最小单位计
//		inputInfo.setInSum(inSum.multiply(new BigDecimal(matInfo.getPackQty())));
		inputInfo.setInOper(hcpUser.getName());
		inputInfo.setInTime(now);
		inputInfo.setUpdateOper(hcpUser.getName());
		inputInfo.setUpdateTime(now);
		inputInfo.setUpdateOperId(hcpUser.getId());
	}

	// 新建storeSum
	private MatStoreSumInfo createStoreSum(MatInputInfo inputInfo, HcpUser hcpUser, Date now) {
		MatInfo matInfo = inputInfo.getMatInfo();

		MatStoreSumInfo storeSumInfo = new MatStoreSumInfo();
		storeSumInfo.setStoreSumId(redisSequenceManager.get("PHA_STORESUMINFO", "STORE_SUM_ID"));
		storeSumInfo.setDeptId(inputInfo.getDeptId());
		storeSumInfo.setMaterialType(matInfo.getMaterialType());
		storeSumInfo.setMaterialCode(matInfo.getMaterialCode());
		MatInfo storeSumMatInfo = new MatInfo();
		storeSumMatInfo.setId(inputInfo.getMatInfo().getId());
		storeSumInfo.setMaterialInfo(storeSumMatInfo);
		storeSumInfo.setTradeName(matInfo.getCommonName());
		storeSumInfo.setMaterialSpecs(matInfo.getMaterialSpecs());
		Company storeSumCompanyInfo = new Company();
		storeSumCompanyInfo.setId(inputInfo.getProducer());
		storeSumInfo.setCompanyInfo(storeSumCompanyInfo);
		storeSumInfo.setBuyPrice(inputInfo.getBuyPrice());
		storeSumInfo.setSalePrice(inputInfo.getSalePrice());
		storeSumInfo.setStoreSum(inputInfo.getInSum());
		storeSumInfo.setMinUnit(matInfo.getMaterialUnit());
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
	private void addStoreSum(MatInputInfo inputInfo, HcpUser hcpUser, Date now, MatStoreSumInfo storeSumInfo) {
		BigDecimal buyPrice = inputInfo.getBuyPrice();
		BigDecimal salePrice = inputInfo.getSalePrice();
		BigDecimal inSum = inputInfo.getInSum();
		MatInfo matInfo = inputInfo.getMatInfo();

		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + inputInfo.getMaterialCode() + "】" + "原库存汇总信息已停用");
		}
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + inputInfo.getMaterialCode() + "】" + "入库采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + inputInfo.getMaterialCode() + "】" + "入库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().add(inSum));
		storeSumInfo.setBuyCost(
				buyPrice.multiply(
						storeSumInfo.getStoreSum()).divide(
								matInfo.getBuyPrice()
								, 4, BigDecimal.ROUND_HALF_UP
								)
				);
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum()).divide(matInfo.getBuyPrice(), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
		storeSumInfo.setMaterialInfo(matInfo);
	}

	private void checkStoreInfo(MatStoreInfo storeInfo, BigDecimal buyPrice, BigDecimal salePrice) {
		if (storeInfo == null) {
			throw new RuntimeException("未获取到原库存明细信息");
		}
		if (!storeInfo.isStop()) {
			throw new RuntimeException("【" + storeInfo.getMaterialCode() + "】" + "原库存明细信息已停用");
		}
		if (buyPrice.compareTo(storeInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + storeInfo.getMaterialCode() + "】" + "采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + storeInfo.getMaterialCode() + "】" + "零售价格与原库存零售价格不相等，请先调价");
		}
	}

	private void checkDispenseStoreInfoList(List<MatStoreInfo> storeInfoList, MatOutputInfo outputInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		String tradeName = outputInfo.getMatInfo().getMaterialCode();
		
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
	
	private Boolean outputBatchControl(List<MatOutputInfo> outputList) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpCtrlParam where hosId = ? and controlId = 'MAT_BATCH_CONTROL' ");
		MatOutputInfo firstOutput = (MatOutputInfo) outputList.get(0);
		if (firstOutput == null || StringUtils.isBlank(firstOutput.getHosId())) {
			throw new RuntimeException("医院Id不能为空");
		} else {
			values.add(firstOutput.getHosId());
		}
		HcpCtrlParam hcpCtrlParam = (HcpCtrlParam) phaCtrlParamUtil.findOne(jql.toString(), values.toArray());
		// 药品是否按批号管理1按批号2不按批号
		return hcpCtrlParam.getControlParam().equals("1") ? Boolean.TRUE : Boolean.FALSE;
	}

	private void checkOutputList(List<MatOutputInfo> outputList, Boolean batchControl, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (MatOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}
//			outputInfo.setDeptId(hcpUser.getLoginDepartment().getId());//設置登陸科室
			BigDecimal buyPrice = outputInfo.getBuyPrice();
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getMatInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}

			MatInfo newMatInfo = getMatInfoById(outputInfo.getMatInfo().getId());
			
			outputInfo.setMatInfo(newMatInfo);

			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库状态不能为空\n");
			}
			if (batchControl) {
				if (StringUtils.isBlank(outputInfo.getBatchNo())) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "批次不能为空\n");
				}
				if (StringUtils.isBlank(outputInfo.getApprovalNo())) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "批号不能为空\n");
				}
			} else { // 不按批次批号管理则设为"-"
				outputInfo.setBatchNo("-");
				outputInfo.setApprovalNo("-");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "医院Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "采购价不能为null或0或负数\n");
			}
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "零售价不能为null或0或负数\n");
			}
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库数量不能为null或0\n");
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
				MatOutputInfo origOutputInfo = this.matOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}

	private void checkDispenseList(List<MatOutputInfo> outputList, HcpUser hcpUser, Date now) {
		StringBuilder errorMsg = new StringBuilder();
		String outBill = null;
		for (MatOutputInfo outputInfo : outputList) {
			if (outputInfo == null) {
				throw new RuntimeException("不存在出库接口对象");
			}
			BigDecimal salePrice = outputInfo.getSalePrice();
			BigDecimal outSum = outputInfo.getOutSum();

			if (outputInfo.getMatInfo() == null) {
				throw new RuntimeException("药品信息不能为空");
			}
			MatInfo newMatInfo = getMatInfoById(outputInfo.getMatInfo().getId());
			outputInfo.setMatInfo(newMatInfo);

			//统一设置getTradeName
			if(outputInfo.getTradeName()==null||"".equals(outputInfo.getTradeName())){
				outputInfo.setTradeName(outputInfo.getMatInfo().getCommonName());
			}
			if(outputInfo.getMaterialSpecs()==null||"".equals(outputInfo.getMaterialSpecs())){
				outputInfo.setMaterialSpecs(outputInfo.getMatInfo().getMaterialSpecs());
			}
			
			if (StringUtils.isBlank(outputInfo.getOutType())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库类型不能为空\n");
			}
			if (outputInfo.getBillNo() == null || outputInfo.getBillNo() <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "单内序号不能为null或0或负数\n");
			}
			if (StringUtils.isBlank(outputInfo.getOutputState())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库状态不能为空\n");
			}
			if (outputInfo.getDeptInfo() == null || StringUtils.isBlank(outputInfo.getDeptInfo().getId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "库房Id不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getHosId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "医院Id不能为空\n");
			}
			// 循环扣库存时去取
			/*if (StringUtils.isBlank(outputInfo.getProduceDate())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "生产日期不能为空\n");
			}
			if (StringUtils.isBlank(outputInfo.getValidDate())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "有效期不能为空\n");
			}
			if (outputInfo.getCompanyInfo() == null || StringUtils.isBlank(outputInfo.getCompanyInfo().getId())) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "供货商不能为空\n");
			}
			if (buyPrice == null || buyPrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "采购价不能为null或0或负数\n");
			}*/
			if (salePrice == null || salePrice.compareTo(BigDecimal.ZERO) <= 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "零售价不能为null或0或负数\n");
			}
			if (outSum == null || outSum.compareTo(BigDecimal.ZERO) == 0) {
				errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库数量不能为null或0\n");
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
				MatOutputInfo origOutputInfo = this.matOutputInfoManager.get(outputInfo.getId());
				if (origOutputInfo == null) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "获取原出库信息失败\n");
				}
				if (StringUtils.isBlank(outputInfo.getOutBill())) {
					errorMsg.append("【" + outputInfo.getMatInfo().getMaterialCode() + "】" + "出库Id不为空，则出库单号不能为空\n");
				}
			}
		}
		if (errorMsg.length() > 0) {
			throw new RuntimeException(errorMsg.toString());
		}
	}
	
	private void handleOutputList(List<MatOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, MatStoreInfo> storeInfoMaps = new HashMap<>();
		Map<String, MatStoreSumInfo> storeSumInfoMaps = new HashMap<>();

		for (MatOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleOutputInfo(outputInfo, hcpUser, now);
			
			MatStoreInfo mapStoreInfo = storeInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo());
			if (mapStoreInfo == null) {
				MatStoreInfo storeInfo = outputFindStoreInfo(outputInfo);
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
				storeInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo(), storeInfo);
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
			
			String storeId = storeInfoMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId()+outputInfo.getApprovalNo()+outputInfo.getBatchNo()).getStoreId();
			outputInfo.setStoreId(storeId); // storeId回写outputInfo
			
			MatStoreSumInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId());
			if (mapStoreSumInfo == null) {
				MatStoreSumInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId(), storeSumInfo);
			} else {
				handleStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}
		}

		List<MatStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, MatStoreInfo> entry : storeInfoMaps.entrySet()){
			storeInfoList.add(entry.getValue());
		}

		List<MatStoreSumInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, MatStoreSumInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		matOutputInfoManager.batchSave(outputList);
		matStoreInfoManager.batchSave(storeInfoList);
		matStoreSumInfoManager.batchSave(storeSumInfoList);
	}

	private void handleDispenseList(List<MatOutputInfo> outputList, HcpUser hcpUser, Date now) {
		Map<String, List<MatStoreInfo>> storeInfoListMaps = new HashMap<>();
		Map<String, MatStoreSumInfo> storeSumInfoMaps = new HashMap<>();

		for (MatOutputInfo outputInfo : outputList) {
			// 处理outputInfo
			handleDispenseOutputInfo(outputInfo, hcpUser, now);

			// 处理MatStoreSumInfo
			MatStoreSumInfo mapStoreSumInfo = storeSumInfoMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId());
			if (mapStoreSumInfo == null) {
				MatStoreSumInfo storeSumInfo = outputFindStoreSum(outputInfo);
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, storeSumInfo);
				storeSumInfoMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId(), storeSumInfo);
			} else {
				handleDispenseStoreSumInfo(outputInfo, hcpUser, now, mapStoreSumInfo);
			}

			List<MatStoreInfo> mapStoreInfoList = storeInfoListMaps
					.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId());
			if (mapStoreInfoList == null) {
				List<MatStoreInfo> storeInfoList = outputFindStoreInfoList(outputInfo);
				checkDispenseStoreInfoList(storeInfoList, outputInfo);
				if (outputInfo.getPlusMinus() == 1) {
					// 扣storeInfo库存
					subtractStoreInfoList(outputInfo, hcpUser, now, storeInfoList);
				} else if (outputInfo.getPlusMinus() == -1) {
					throw new RuntimeException("此交易不允许退库");
				} else {
					throw new RuntimeException("正负类型错误");
				}
				storeInfoListMaps.put(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId(), storeInfoList);
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
			
			MatStoreInfo firstStoreInfo = storeInfoListMaps.get(outputInfo.getHosId()+outputInfo.getDeptInfo().getId()+outputInfo.getMatInfo().getId()).get(0);
			/* storeId、生产日期、有效期、供货商、生产商、采购价、采购金额回写OutputInfo) */
			rehandleDispenseOutputInfo(outputInfo, firstStoreInfo);
		}

		List<MatStoreInfo> storeInfoList = new ArrayList<>();
		for (Map.Entry<String, List<MatStoreInfo>> entry : storeInfoListMaps.entrySet()){
			for (MatStoreInfo storeInfo : entry.getValue()) {
				storeInfoList.add(storeInfo);
			}
		}
		List<MatStoreSumInfo> storeSumInfoList = new ArrayList<>();
		for (Map.Entry<String, MatStoreSumInfo> entry : storeSumInfoMaps.entrySet()){
			storeSumInfoList.add(entry.getValue());
		}
		matOutputInfoManager.batchSave(outputList);
		matStoreInfoManager.batchSave(storeInfoList);
		matStoreSumInfoManager.batchSave(storeSumInfoList);
	}
	
	private MatStoreSumInfo outputFindStoreSum(MatOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from MatStoreSumInfo where hosId = ? and deptId = ? and materialInfo.id = ?");
		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getMatInfo().getId());

		return matStoreSumInfoManager.findOne(jql.toString(), values.toArray());
	}
	
	private void handleStoreSumInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now, MatStoreSumInfo storeSumInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "找不到该药品的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "原库存汇总信息已停用");
		}
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));
		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库数量超出原库存量");
		}
		storeSumInfo.setBuyCost(buyPrice.multiply(storeSumInfo.getStoreSum())
				.divide(matInfo.getBuyPrice(), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
				.divide(matInfo.getBuyPrice(), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseStoreSumInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now, MatStoreSumInfo storeSumInfo) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();
		
		if (storeSumInfo == null) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "找不到该药品的库存信息");
		}
		if (!storeSumInfo.isStop()) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "原库存汇总信息已停用");
		}
		/* 发药出库没有采购价
		if (buyPrice.compareTo(storeSumInfo.getBuyPrice()) != 0) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库采购价格与原库存采购价格不相等，请先调价");
		}
		*/
		if (salePrice.compareTo(storeSumInfo.getSalePrice()) != 0) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库零售价格与原库存零售价格不相等，请先调价");
		}
		storeSumInfo.setStoreSum(storeSumInfo.getStoreSum().subtract(outSum));
		if (storeSumInfo.getStoreSum().compareTo(BigDecimal.ZERO) == -1) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "出库数量超出原库存量");
		}
		storeSumInfo.setBuyCost(storeSumInfo.getBuyPrice().multiply(storeSumInfo.getStoreSum())
				.divide(matInfo.getBuyPrice(), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setSaleCost(salePrice.multiply(storeSumInfo.getStoreSum())
				.divide(matInfo.getBuyPrice(), 4, BigDecimal.ROUND_HALF_UP));
		storeSumInfo.setUpdateOper(hcpUser.getName());
		storeSumInfo.setUpdateTime(now);
		storeSumInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private MatStoreInfo outputFindStoreInfo(MatOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append(
				"from MatStoreInfo where hosId = ? and deptId = ? and materialInfo.id = ? and approvalNo = ? and batchNo = ? ");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getMatInfo().getId());
		values.add(outputInfo.getApprovalNo());
		values.add(outputInfo.getBatchNo());

		return (MatStoreInfo) matStoreInfoManager.findOne(jql.toString(), values.toArray());
	}

	private List<MatStoreInfo> outputFindStoreInfoList(MatOutputInfo outputInfo) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from MatStoreInfo where hosId = ? and deptId = ? and materialInfo.id = ? and stop = true and storeSum > 0 order by createTime");

		values.add(outputInfo.getHosId());
		values.add(outputInfo.getDeptInfo().getId());
		values.add(outputInfo.getMatInfo().getId());

		return matStoreInfoManager.find(jql.toString(), values.toArray());
	}
	
	private void subtractStoreInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now, MatStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();

		if (storeInfo.getStoreSum().compareTo(outSum) == -1) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "库存明细中库存量不足");
		}
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}

	private void subtractStoreInfoList(MatOutputInfo outputInfo, HcpUser hcpUser, Date now, List<MatStoreInfo> storeInfoList) {
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();

		for (MatStoreInfo storeInfo : storeInfoList) {
			if (storeInfo.getStoreSum().compareTo(outSum) == -1) {
				// 库存不够扣
				outSum = outSum.subtract(storeInfo.getStoreSum());
				storeInfo.setStoreSum(BigDecimal.ZERO);				
			} else {
				// 库存够扣
				storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
				outSum = BigDecimal.ZERO;
			}
			storeInfo.setBuyCost(storeInfo.getBuyPrice().multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(), 4,
					BigDecimal.ROUND_HALF_UP));
			storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(),
					4, BigDecimal.ROUND_HALF_UP));
			storeInfo.setUpdateTime(now);
			storeInfo.setUpdateOper(hcpUser.getName());
			storeInfo.setUpdateOperId(hcpUser.getId());
			// 出库数量完了就退出
			if (outSum.compareTo(BigDecimal.ZERO) != 1) break;
		}
		// 循环完出库数量仍然大于0，说明所有库存明细都不够扣
		if (outSum.compareTo(BigDecimal.ZERO) == 1) {
			throw new RuntimeException("【" + matInfo.getMaterialCode() + "】" + "库存明细中库存量不足");
		}
	}
	
	private void outputRetreatStoreInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now, MatStoreInfo storeInfo) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();

		// 退库如果价格不相符，应自动调价，等调价接口完成，调调价接口即可。
		storeInfo.setStoreSum(storeInfo.getStoreSum().subtract(outSum));
		storeInfo.setBuyCost(buyPrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(), 4,
				BigDecimal.ROUND_HALF_UP));
		storeInfo.setSaleCost(salePrice.multiply(storeInfo.getStoreSum()).divide(matInfo.getBuyPrice(),
				4, BigDecimal.ROUND_HALF_UP));
		storeInfo.setUpdateTime(now);
		storeInfo.setUpdateOper(hcpUser.getName());
		storeInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private MatInfo getMatInfoById(String drugId) {
		if (StringUtils.isBlank(drugId)) {
			throw new RuntimeException("药品Id不能为空");
		}
		MatInfo matInfo = this.matInfoManager.get(drugId);
		if (matInfo == null) {
			throw new RuntimeException("药品Id有误，获取药品信息失败");
		}
		return matInfo;
	}

	private void handleOutputInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now) {
		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();

		outputInfo.setProducerInfo(matInfo.getCompanyInfo());
		outputInfo.setTradeName(matInfo.getCommonName());
		
		outputInfo.setMaterialSpecs(matInfo.getMaterialSpecs());
		outputInfo.setMaterialType(matInfo.getMaterialType());
		outputInfo.setMinUnit(matInfo.getMaterialUnit());
		outputInfo.setMaterialCode(matInfo.getMaterialCode());
		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		outputInfo.setSaleCost(salePrice.multiply(outSum));
//		outputInfo.setOutSum(outSum.multiply(new BigDecimal(matInfo.getPackQty())));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void handleDispenseOutputInfo(MatOutputInfo outputInfo, HcpUser hcpUser, Date now) {
//		BigDecimal buyPrice = outputInfo.getBuyPrice();
		BigDecimal salePrice = outputInfo.getSalePrice();
		BigDecimal outSum = outputInfo.getOutSum();
		MatInfo matInfo = outputInfo.getMatInfo();

		outputInfo.setProducerInfo(matInfo.getCompanyInfo());
		outputInfo.setTradeName(matInfo.getCommonName());
		outputInfo.setMaterialSpecs(matInfo.getMaterialSpecs());
		outputInfo.setMaterialType(matInfo.getMaterialType());
		outputInfo.setMinUnit(matInfo.getMaterialUnit());
		outputInfo.setMaterialCode(matInfo.getMaterialCode());
//		outputInfo.setBuyCost(buyPrice.multiply(outSum));
		outputInfo.setSaleCost(salePrice.multiply(outSum));
//		outputInfo.setOutSum(outSum.multiply(new BigDecimal(matInfo.getPackQty())));
		outputInfo.setOutOper(hcpUser.getName());
		outputInfo.setOutTime(now);
		outputInfo.setUpdateOper(hcpUser.getName());
		outputInfo.setUpdateTime(now);
		outputInfo.setUpdateOperId(hcpUser.getId());
	}
	
	private void rehandleDispenseOutputInfo(MatOutputInfo outputInfo, MatStoreInfo storeInfo) {
//		BigDecimal packQty= new BigDecimal(outputInfo.getMatInfo().getPackQty());
		BigDecimal buyPrice = storeInfo.getBuyPrice();
		BigDecimal outSum = outputInfo.getOutSum();
		
		outputInfo.setStoreId(storeInfo.getStoreId());
		outputInfo.setValidDate(storeInfo.getValidDate());
		outputInfo.setProduceDate(storeInfo.getProduceDate());
		outputInfo.setProducerInfo(storeInfo.getCompanyInfo());
		outputInfo.setCompanyInfo(storeInfo.getCompanySupply());
		outputInfo.setBuyPrice(buyPrice);
//		outputInfo.setBuyCost(buyPrice.multiply(outSum.divide(packQty, 4, BigDecimal.ROUND_HALF_UP)));
	}
	@Override
	public void matInputByBill(MatBuyBill matBuyBill,List<MatInputInfo> inputList, HcpUser hcpUser) {
		Date now = new Date();
		List<MatBuyDetail> _buyDetailList = matBuyBill.getBuyDetail();
		MatStoreManagerImpl _matStoreManagerImpl = new MatStoreManagerImpl();

		List<MatInputInfo> _matInputInfoList = new ArrayList<>();
		

		java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
		for (MatBuyDetail _detail : _buyDetailList) {
			MatInputInfo _matInputInfo = new MatInputInfo();
			// 设置库房信息
			_matInputInfo.setDeptId(hcpUser.getLoginDepartment().getId());
			// 设置物资代码
			_matInputInfo.setMaterialCode(_detail.getMaterialCode());
			//
			String setBuyPrice = df.format(_detail.getBuyPrice());
			_matInputInfo.setBuyPrice(new BigDecimal(setBuyPrice));
			String setSalePrice = df.format(_detail.getSalePrice());
			_matInputInfo.setSalePrice(new BigDecimal(setSalePrice));
			_matInputInfo.setInSum(_detail.getInNum());
			_matInputInfo.setBuyBill(_detail.getBuyBill());
			_matInputInfo.setTradeName(_detail.getTradeName());
			_matInputInfo.setMaterialSpecs(_detail.getMaterialSpec());
			_matInputInfo.setInputState("");
			_matInputInfo.setStopFlag("1");//停用标志
			_matInputInfo.setValidDate(_detail.getValidDate());
			_matInputInfo.setProduceDate(_detail.getProcuceDate());
			// 物資信息
			MatInfo _matInfo = new MatInfo();
			_matInfo.setId(_detail.getMaterialCode());
			_matInputInfo.setMatInfo(_matInfo);
			_matInputInfo.setInType("I2");// 入库类型
			_matInputInfo.setInputState("4");// 入库状态
			_matInputInfo.setHosId(hcpUser.getHosId());// 医院Id不能为空
			Company _matCompanyInfo = new Company();
			_matCompanyInfo.setId(matBuyBill.getCompany());
			_matInputInfo.setCompanyInfo(_matCompanyInfo);
			 _matInputInfo.setApprovalNo(_detail.getApprovalNo());//批次号

			_matInputInfoList.add(_matInputInfo);
			
			MatBuyDetail _newDetail= this.matBuyDetailManager.get(_detail.getId());
			_newDetail.setInOper(hcpUser.getName());
			_newDetail.setInTime(now);
			_newDetail.setValidDate(_detail.getValidDate());
			_newDetail.setProcuceDate(_detail.getProcuceDate());
			this.matBuyDetailManager.save(_newDetail);
		}
		this.matInput(_matInputInfoList, hcpUser);
		this.matBuyBillManager.save(matBuyBill);
	}
		
}
