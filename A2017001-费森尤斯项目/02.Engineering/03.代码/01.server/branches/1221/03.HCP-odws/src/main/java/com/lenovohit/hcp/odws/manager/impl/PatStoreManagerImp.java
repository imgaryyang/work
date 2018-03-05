package com.lenovohit.hcp.odws.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;
import com.lenovohit.hcp.material.model.MatPrice;
import com.lenovohit.hcp.material.model.MatStoreInfo;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;
import com.lenovohit.hcp.odws.manager.PatStoreMng;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PatStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;

@Service
@Transactional
public class PatStoreManagerImp implements PatStoreMng {

	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<PatStore, String> patStoreManager;
	@Autowired
	private GenericManager<PatStoreExec, String> patStoreExecManager;
	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;
	@Autowired
	private GenericManager<MatOutputInfo, String> matOutputInfoManager;
	@Autowired
	private GenericManager<MatInputInfo, String> matInputInfoManager;
	@Autowired
	private GenericManager<MatPrice, String> matPriceManager;
	
	private static Log log = LogFactory.getLog(PatStoreManagerImp.class);

	/**    
	 * 功能描述：保存执行确认明细相关信息
	 *@param recordList
	 *@return       
	 *@author GW
	 *@date 2017年6月26日             
	*/
	public void saveItemShort(PatientStoreRecord record, List<PatStoreExec> patStoreExecList, HcpUser user) {
		try{
			String execNo = redisSequenceManager.get("PHA_PATSTORE", "EXEC_NO"); // 生成执行单号
			String msg = null;
			Date now = new Date();
			PatStore store = new PatStore();
			store.setHosId(user.getHosId()); // 医院
			store.setPatientId(record.getPatient().getId());// 病人id
			store.setName(record.getPatient().getName()); // 姓名
			store.setRecipeId(record.getRecipeId()); // 处方Id
			store.setRecipeNo(record.getRecipeNo()); // 处方序号
			if (record.getItemInfo() != null) {
				ItemInfo info = record.getItemInfo();
				store.setItemCode(info.getId());// 项目id
				store.setSpecs(info.getSpecs()); // 规格
			}
			store.setItemName(record.getItemInfo().getItemName());
			store.setQty(record.getThisQty());
			store.setUnit(record.getUnit());
			store.setUnitPrice(record.getItemInfo().getUnitPrice());// 单价
			store.setCombNo(record.getCombNo());// 组号
			store.setExecOper(user.getName()); // 操作人信息
			store.setCreateOper(user.getName());
			store.setCreateOperId(user.getId());
			store.setCreateTime(now);
			store.setUpdateOper(user.getName());
			store.setUpdateOperId(user.getId());
			store.setUpdateTime(now);
			store.setState("1");
			store.setExecNo(execNo); // 保管单号
			store.setQty(new BigDecimal(1));// 执行数量为1
			if (patStoreExecList != null && patStoreExecList.size() > 0) {
				Integer execSubno = 1;
				for (PatStoreExec detail : patStoreExecList) {
					detail.setExecNo(execNo);
					detail.setExecSubno(execSubno);
					detail.setExecOper(user.getName());
					execSubno++;
				}
				msg = saveChargeDetail(patStoreExecList, user);
				if(msg == null){//库存操作失败不执行记录的添加
					patStoreManager.save(store); // 保存记录
					patStoreExecManager.batchSave(patStoreExecList);
				}else{
					throw new RuntimeException(msg);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}
	
	/**    
	 * 功能描述：作废护士站执行确认
	 *@param query  执行确认明细
	 *@return       
	 *@author GW
	 *@date 2017年6月26日             
	*/
	public void deleteItemShort(PatStore query, HcpUser user) {
		try{
			String msg = null;
			String execNo = query.getExecNo();
			msg = cancelItemShortDetail(execNo,user);
			if(msg != null){
				log.error(msg);
				System.err.println(msg);
				throw new RuntimeException(msg);
			}
			patStoreManager.save(query);
		}catch(Exception e){
			log.error("护士站执行确认取消失败！");
			System.err.println("护士站执行确认取消失败！");
			throw new RuntimeException("护士站执行确认取消失败！");
		}
	}

	/**    
	 * 功能描述：查询更新库存
	 *@param recordList
	 *@return       
	 *@author GW
	 *@date 2017年6月26日             
	*/
	private String saveChargeDetail(List<PatStoreExec> recordList, HcpUser user){
		StringBuilder sb = new StringBuilder();
		if(recordList!=null && recordList.size()>0){
			for(PatStoreExec record : recordList){
				BigDecimal sum = record.getQty();//明細中使用数量
				if(record.getItemCode()!=null){//确认项对应收费项目id是否存在
					StringBuilder jqlq = new StringBuilder(" from MatPrice where hosId = ? and  itemCode = ? ");
					List<Object> value=new ArrayList<Object>();
					value.add(user.getHosId());
					value.add(record.getItemCode());
					List<MatPrice> infos=matPriceManager.find(jqlq.toString(), value.toArray());
					MatPrice info=infos.get(0);
					if(info!=null){//项目对应物资基本信息是否存在
						StringBuilder jql = new StringBuilder(" from MatStoreInfo where 1=1 ");
						StringBuilder jqlSum = new StringBuilder(" from MatStoreSumInfo where 1=1 ");
						List<Object> values = new ArrayList<Object>();
						jql.append(" and materialInfo.id = ? and  hosId = ? ");
						jql.append(" and deptId = ? ");
						jqlSum.append(" and materialInfo.id = ? and hosId = ? ");
						jqlSum.append(" and deptId = ? ");
						values.add(info.getMatInfo().getId());//物资id
						values.add(user.getHosId());//物资id
						values.add(user.getLoginDepartment().getId());//登录科室ID
						if(record.getApprovalNo()!=null){//批号是否输入
							jql.append(" and approvalNo = ? ");
							values.add(record.getApprovalNo());
							List<MatStoreInfo> storeList = matStoreInfoManager.find(jql.toString(), values.toArray());
							BigDecimal totalSum = new BigDecimal(0);//相同批号
							if(storeList != null && storeList.size()> 0 ){
								for(MatStoreInfo mat: storeList){
									totalSum = totalSum.add(mat.getStoreSum());
								}
								//如果相同批号的库存大于执行数量
								if(!(totalSum.compareTo(sum)==-1)){//当前库存大于等于确认库存
									for(MatStoreInfo mat: storeList){
										BigDecimal storeSum = mat.getStoreSum();
										if(!(storeSum.compareTo(sum)==-1)){//本条库存数量大于剩余数量
											storeSum = storeSum.subtract(sum);
											mat.setStoreSum(storeSum);
											mat.setUpdateOper(user.getName());
											mat.setUpdateOperId(user.getId());
											mat.setUpdateTime(new Date());
											//执行确认出库
											String msg = confirmOutStock(mat,sum,user,record.getExecNo());
											if(msg==null){
												matStoreInfoManager.save(mat);
												values.remove(record.getApprovalNo());
												MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
												sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(sum) );
												sumInfo.setUpdateOper(user.getName());
												sumInfo.setUpdateOperId(user.getId());
												sumInfo.setUpdateTime(new Date());
												matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
											}else{
												sb.append("执行确认出库出错了！");
												System.err.println(record.getItemName()+"执行确认出库出错！");
												log.error(record.getItemName()+"("+record.getId()+")"+"执行确认出库出错！");
											}
											sum = new BigDecimal(0);
											break;
										}else if(storeSum.compareTo(new BigDecimal(0))!=0 && storeSum.compareTo(sum)==-1){//当前明细小于入库总数量
											mat.setStoreSum(new BigDecimal(0));
											mat.setUpdateOper(user.getName());
											mat.setUpdateOperId(user.getId());
											mat.setUpdateTime(new Date());
											//执行确认出库
											String msg = confirmOutStock(mat,storeSum,user,record.getExecNo());
											if(msg==null){
												matStoreInfoManager.save(mat);
												values.remove(record.getApprovalNo());
												MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
												sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(storeSum) );
												sumInfo.setUpdateOper(user.getName());
												sumInfo.setUpdateOperId(user.getId());
												sumInfo.setUpdateTime(new Date());
												matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
											}else{
												sb.append("执行确认出库出错了！");
												System.err.println(record.getItemName()+"执行确认出库出错！");
												log.error(record.getItemName()+"("+record.getId()+")"+"执行确认出库出错！");
											}
											sum = sum.subtract(storeSum);
										}
									}
								}else{
									sb.append(record.getItemName()+"库存不足");
									System.err.println(record.getItemName()+"(id:"+record.getItemCode()+")库存不足");
									log.error(record.getItemName()+"(id:"+record.getItemCode()+")库存不足");
								}
							}else {
								sb.append(record.getItemName()+"批号("+record.getApprovalNo()+")没有对应的库存信息");
								System.err.println(record.getItemName()+"(id:"+record.getItemCode()+")批号("+record.getApprovalNo()+")没有对应的库存信息");
								log.error(record.getItemName()+"(id:"+record.getItemCode()+")批号("+record.getApprovalNo()+")没有对应的库存信息");
								break;
							}
						
						}else{//如果没有批号查询本科室总库存量是否满足确认数量
							//查询本库存总数量
							MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
							if(sumInfo!=null && !(sumInfo.getStoreSum().compareTo(sum)==-1)){//库存量大于等于确认数量
								sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(sum) );
								matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
								//查询各个库存明细
								List<MatStoreInfo> storeList = matStoreInfoManager.find(jql.toString(), values.toArray());
								if(storeList!=null && storeList.size()>0){//库存信息存在
									for(MatStoreInfo storeInfo : storeList){//循环各个编号库存
										if(sum.compareTo(BigDecimal.ZERO)==0){//库存处理完毕之后
											break;
										}
										BigDecimal storeSum = storeInfo.getStoreSum();
										if(!(storeSum.compareTo(sum)==1)){//当前库存小于等于确认库存
											sum = sum.subtract(storeSum);  
											storeInfo.setStoreSum(new BigDecimal(0));//当前批号库存全部消耗
											storeInfo.setUpdateOper(user.getName());
											storeInfo.setUpdateOperId(user.getId());
											storeInfo.setUpdateTime(new Date());
											matStoreInfoManager.save(storeInfo);
										}else{
											storeSum = storeSum.subtract(sum);
											storeInfo.setStoreSum(storeSum);
											storeInfo.setUpdateOper(user.getName());
											storeInfo.setUpdateOperId(user.getId());
											storeInfo.setUpdateTime(new Date());
											matStoreInfoManager.save(storeInfo);
											sum = new BigDecimal(0);
										}
									}
								}
								
							}else{
								sb.append(record.getItemName()+"库存不足");
								System.err.println(record.getItemName()+"(id:"+record.getItemCode()+")库存不足");
								log.error(record.getItemName()+"(id:"+record.getItemCode()+")库存不足");
								break;
							}
						}
					} else {
						sb.append(record.getItemName()+"没有对应物资！");
						System.err.println(record.getItemName()+"(id:"+record.getItemCode()+")项目没有对应物资！");
						log.error(record.getItemName()+"(id:"+record.getItemCode()+")项目没有对应物资！");
						break;
					}
				}
			}
		}else{
			sb.append("确认记录信息传递错误");
			log.error("确认记录信息传递错误");
		}
		if(sb.length()>0){
			return sb.toString();
		}else{
			return null;
		}
	}
	
	/**
	 * 非复合项目（物资项目）确认
	 * @param recordList
	 * @param user
	 * @return
	 */
	public void saveChargeDetailOfMaterial(PatientStoreRecord record, HcpUser user,String approvalNo){
		try{
			StringBuilder sb = new StringBuilder();
			Date now = new Date();
			PatStore storeExec = new PatStore();
			storeExec.setHosId(user.getHosId());				//医院
			storeExec.setPatientId(record.getPatient().getId());//病人id
			storeExec.setName(record.getPatient().getName());	//姓名
			storeExec.setRecipeId(record.getRecipeId());		//处方Id
			storeExec.setRecipeNo(record.getRecipeNo());		//处方序号
			if(record.getItemInfo()!=null){
				ItemInfo info = record.getItemInfo();
				storeExec.setItemCode(info.getId());//项目id
				storeExec.setSpecs(info.getSpecs());			//规格
			}
			storeExec.setCombNo(record.getCombNo());
			storeExec.setItemName(record.getItemInfo().getItemName());
			storeExec.setQty(record.getThisQty());
			storeExec.setUnit(record.getUnit());
			storeExec.setUnitPrice(record.getItemInfo().getUnitPrice());//单价
			storeExec.setCombNo(record.getCombNo());//组号
			storeExec.setExecOper(user.getName());	//操作人信息
			storeExec.setCreateOper(user.getName());
			storeExec.setCreateOperId(user.getId());
			storeExec.setCreateTime(now);
			storeExec.setUpdateOper(user.getName());
			storeExec.setUpdateOperId(user.getId());
			storeExec.setUpdateTime(now);
			storeExec.setState("1");
			storeExec.setQty(new BigDecimal(1));
			patStoreManager.save(storeExec);
			
			BigDecimal sum = record.getQty();//明細中使用数量
			if(record.getItemInfo()!=null){//确认项对应收费项目id是否存在
				//MatInfo info = matInfoManager.findOneByProp("itemCode", record.getItemInfo().getId());
				MatPrice info=matPriceManager.findOneByProp("itemCode", record.getItemInfo().getId());
				if(info!=null){//项目对应物资基本信息是否存在
					StringBuilder jql = new StringBuilder(" from MatStoreInfo where 1=1 ");
					StringBuilder jqlSum = new StringBuilder(" from MatStoreSumInfo where 1=1 ");
					List<Object> values = new ArrayList<Object>();
					jql.append(" and materialInfo.id = ? and hosId = ? ");
					jql.append(" and deptId = ? ");
					jqlSum.append(" and materialInfo.id = ? and hosId = ? ");
					jqlSum.append(" and deptId = ? ");
					values.add(info.getMatInfo().getId());//物资id
					values.add(user.getHosId());
					values.add(user.getLoginDepartment().getId());//登录科室ID
					if(StringUtils.isNotBlank(approvalNo)){//批号是否输入
						jql.append(" and approvalNo = ? ");
						values.add(approvalNo);
						List<MatStoreInfo> storeList = matStoreInfoManager.find(jql.toString(), values.toArray());
						BigDecimal totalSum = new BigDecimal(0);//相同批号
						if(storeList != null && storeList.size()> 0 ){
							for(MatStoreInfo mat: storeList){
								totalSum = totalSum.add(mat.getStoreSum());
							}
							//如果相同批号的库存大于执行数量
							if(!(totalSum.compareTo(sum)==-1)){//当前库存大于等于确认库存
								for(MatStoreInfo mat: storeList){
									BigDecimal storeSum = mat.getStoreSum();
									if(!(storeSum.compareTo(sum)==-1)){//本条库存数量大于剩余数量
										storeSum = storeSum.subtract(sum);
										mat.setStoreSum(storeSum);
										mat.setUpdateOper(user.getName());
										mat.setUpdateOperId(user.getId());
										mat.setUpdateTime(new Date());
										//执行确认出库
										String msg = confirmOutStock(mat,sum,user,storeExec.getExecNo());
										if(msg==null){
											matStoreInfoManager.save(mat);
											values.remove(approvalNo);
											MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
											sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(sum) );
											sumInfo.setUpdateOper(user.getName());
											sumInfo.setUpdateOperId(user.getId());
											sumInfo.setUpdateTime(new Date());
											matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
										}else{
											sb.append("执行确认出库出错了！");
											System.err.println(record.getItemInfo().getItemName()+"执行确认出库出错！");
										}
										sum = new BigDecimal(0);
										break;
									}else if(sum.compareTo(new BigDecimal(0))!=0 && storeSum.compareTo(new BigDecimal(0))!=0 && storeSum.compareTo(sum)==-1){//当前明细小于入库总数量
										mat.setStoreSum(new BigDecimal(0));
										mat.setUpdateOper(user.getName());
										mat.setUpdateOperId(user.getId());
										mat.setUpdateTime(new Date());
										//执行确认出库
										String msg = confirmOutStock(mat,storeSum,user,storeExec.getExecNo());
										if(msg==null){
											matStoreInfoManager.save(mat);
											values.remove(approvalNo);
											MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
											sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(storeSum) );
											sumInfo.setUpdateOper(user.getName());
											sumInfo.setUpdateOperId(user.getId());
											sumInfo.setUpdateTime(new Date());
											matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
										}else{
											sb.append("执行确认出库出错了！");
											System.err.println(record.getItemInfo().getItemName()+"执行确认出库出错！");
										}
										sum = sum.subtract(storeSum);
									}
								}
							}else{
								sb.append(record.getItemInfo().getItemName()+"库存不足");
								System.err.println(record.getItemInfo().getItemName()+"(id:"+record.getItemInfo().getItemCode()+")库存不足");
							}
						}else {
							sb.append(record.getItemInfo().getItemName()+"批号("+approvalNo+")没有对应的库存信息");
							System.err.println(record.getItemInfo().getItemName()+"(id:"+record.getItemInfo().getItemCode()+")批号("+approvalNo+")没有对应的库存信息");
						}
					}else{//如果没有批号查询本科室总库存量是否满足确认数量
						//查询本库存总数量
						MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), values.toArray());
						if(sumInfo!=null && !(sumInfo.getStoreSum().compareTo(sum)==-1)){//库存量大于等于确认数量
							sumInfo.setStoreSum(sumInfo.getStoreSum().subtract(sum) );
							matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
							//查询各个库存明细
							List<MatStoreInfo> storeList = matStoreInfoManager.find(jql.toString(), values.toArray());
							if(storeList!=null && storeList.size()>0){//库存信息存在
								for(MatStoreInfo storeInfo : storeList){//循环各个编号库存
									if(sum.compareTo(BigDecimal.ZERO)==0){//库存处理完毕之后
										break;
									}
									BigDecimal storeSum = storeInfo.getStoreSum();
									if(!(storeSum.compareTo(sum)==1)){//当前库存小于等于确认库存
										sum = sum.subtract(storeSum);  
										storeInfo.setStoreSum(new BigDecimal(0));//当前批号库存全部消耗
										storeInfo.setUpdateOper(user.getName());
										storeInfo.setUpdateOperId(user.getId());
										storeInfo.setUpdateTime(new Date());
										matStoreInfoManager.save(storeInfo);
									}else{
										storeSum = storeSum.subtract(sum);
										storeInfo.setStoreSum(storeSum);
										storeInfo.setUpdateOper(user.getName());
										storeInfo.setUpdateOperId(user.getId());
										storeInfo.setUpdateTime(new Date());
										matStoreInfoManager.save(storeInfo);
										sum = new BigDecimal(0);
									}
								}
							}
							
						}else{
							sb.append(record.getItemInfo().getItemName()+"库存不足");
							System.err.println(record.getItemInfo().getItemName()+"(id:"+record.getItemInfo().getItemCode()+")库存不足");
						}
					}
				} else {
					sb.append(record.getItemInfo().getItemName()+"没有对应物资！");
					System.err.println(record.getItemInfo().getItemName()+"(id:"+record.getItemInfo().getItemCode()+")项目没有对应物资！");
				}
			}
			
			if(sb.length()>0){
				log.error(sb.toString());
				throw new RuntimeException(sb.toString());
			}
		}catch(Exception e ){
			log.error("执行过程中保存出错！");
			System.err.println("执行过程中保存出错！");
			throw new RuntimeException("执行过程中保存出错！");
		}
	
		
	}
	
	/**    
	 * 功能描述：护士站执行确认物资出库
	 *@param store 库存信息
	 *@param sum 出库数量
	 *@param user 操作用户
	 *@param execNo 执行单号
	 *@return       
	 *@author GW
	 *@date 2017年8月3日             
	*/
	private String confirmOutStock(MatStoreInfo store,BigDecimal sum,HcpUser user,String execNo){
		String msg =null;
		MatOutputInfo output = new MatOutputInfo();
		output.setApprovalNo(store.getApprovalNo());//批号
		output.setHosId(store.getHosId());
		Department dept = new Department();
		dept.setId(store.getDeptId());
		output.setDeptInfo(dept);
		output.setOutType("O7");
		output.setPlusMinus(1);
		output.setStoreId(store.getStoreId());
		output.setMaterialCode(store.getMaterialCode());
		output.setMaterialSpecs(store.getMaterialSpecs());
		MatInfo matInfo = new MatInfo();
		matInfo = store.getMaterialInfo();
		output.setMatInfo(matInfo);
		output.setTradeName(store.getTradeName());
		output.setMaterialType(store.getMaterialType());
		output.setBatchNo(store.getBatchNo());
		output.setProduceDate(store.getProduceDate());
		output.setProducerInfo(store.getCompanyInfo());
		output.setValidDate(store.getValidDate());
		output.setBuyPrice(store.getBuyPrice());
		output.setBuyCost(store.getBuyCost());
		output.setSalePrice(store.getSalePrice());
		output.setSaleCost(store.getSaleCost());
		output.setOutSum(sum);
		output.setMinUnit(store.getMinUnit());
		output.setOutOper(user.getName());
		output.setOutTime(new Date());
		output.setOutputState("2");
		output.setOutId(execNo);
		matOutputInfoManager.save(output);
		return msg;
	}
	
	/**    
	 * 功能描述：护士站取消执行确认-物资入库
	 *@param store 库存信息
	 *@param sum 出库数量
	 *@param user 操作用户
	 *@param execNo 执行单号
	 *@return       
	 *@author GW
	 *@date 2017年8月3日             
	 */
	private String cancelItemShortDetail(String execNo,HcpUser user){
		String msg =null;
		StringBuilder jql = new StringBuilder( "from MatOutputInfo where 1=1 ");
		if(StringUtils.isNotBlank(execNo)){
			jql.append(" and outId = ? ");
			List<Object> values = new ArrayList<Object>();
			values.add(execNo);
			List<MatOutputInfo> outList = matOutputInfoManager.find(jql.toString(), values.toArray());
			if(outList!=null && outList.size()>0){
				msg = confirmInStock(outList,user);
			}else{
				msg="没有确认出库明细！";
				System.err.println("该执行单没有出库明细！");
			}
		}else{
			msg="数据错误";
			System.err.println("该执行单没有出库执行单号！");
		}
		return msg;
	}
	/**    
	 * 功能描述：护士站取消执行确认-物资入库
	 *@param store 库存信息
	 *@param sum 出库数量
	 *@param user 操作用户
	 *@param execNo 执行单号
	 *@return       
	 *@author GW
	 *@date 2017年8月3日             
	 */
	private String confirmInStock(List<MatOutputInfo> outList,HcpUser user){
		String msg =null;
		List<MatInputInfo> inputList = new ArrayList<MatInputInfo>();
		for(MatOutputInfo out:outList){
			MatInputInfo in = new MatInputInfo();
			in.setApprovalNo(out.getApprovalNo());//批号
			in.setHosId(out.getHosId());
			in.setDeptId(out.getDeptInfo().getId());
			in.setInType("I9");
			in.setPlusMinus(1);
			in.setBuyBill(out.getOutId());
			in.setMaterialCode(out.getMaterialCode());
			in.setMaterialSpecs(out.getMaterialSpecs());
			in.setMatInfo(out.getMatInfo());
			in.setTradeName(out.getTradeName());
			in.setMaterialType(out.getMaterialType());
			in.setBatchNo(out.getBatchNo());
			in.setProduceDate(out.getProduceDate());
			in.setCompanyInfo(out.getCompanyInfo());
			in.setValidDate(out.getValidDate());
			in.setBuyPrice(out.getBuyPrice());
			in.setBuyCost(out.getBuyCost());
			in.setSalePrice(out.getSalePrice());
			in.setSaleCost(out.getSaleCost());
			in.setInSum(out.getOutSum());
			in.setMinUnit(out.getMinUnit());
			in.setInOper(user.getName());
			in.setInTime(new Date());
			in.setInputState("4");
			inputList.add(in);
		}
		//更新库存
		msg = addStockToStore(outList, user);
		if(msg ==null){
			//插入入库表
			matInputInfoManager.batchSave(inputList);
		}else{
			return msg;
		}
		return msg;
	}
	
	/**    
	 * 功能描述：根据出库单信息还原库存信息
	 *@param info
	 *@param user
	 *@return       
	 *@author GW
	 *@date 2017年8月3日             
	*/
	private String addStockToStore(List<MatOutputInfo> outList,HcpUser user){
		String msg=null;
		for(MatOutputInfo info:outList){
			StringBuilder jql = new StringBuilder(" from MatStoreInfo where 1=1 ");
			StringBuilder jqlSum = new StringBuilder(" from MatStoreSumInfo where 1=1 ");
			List<Object> values = new ArrayList<Object>();
			List<Object> valueSum = new ArrayList<Object>();
			jql.append(" and materialInfo.id = ? ");
			jql.append(" and deptId = ? ");
			jqlSum.append(" and materialInfo.id = ? ");
			jqlSum.append(" and deptId = ? ");
			values.add(info.getMatInfo().getId());//物资id
			values.add(info.getDeptInfo().getId());//登录科室ID
			valueSum.add(info.getMatInfo().getId());//物资id
			valueSum.add(info.getDeptInfo().getId());//登录科室ID
			jql.append(" and approvalNo = ? ");
			jql.append(" and batchNo = ? ");
			values.add(info.getApprovalNo());
			values.add(info.getBatchNo());
			MatStoreInfo store = matStoreInfoManager.findOne(jql.toString(), values.toArray());
			if(store!=null){
				BigDecimal storeSum = store.getStoreSum();
				storeSum = storeSum.add(info.getOutSum());
				store.setStoreSum(storeSum);
				store.setUpdateOper(user.getName());
				store.setUpdateOperId(user.getId());
				store.setUpdateTime(new Date());
				if(msg==null){
					matStoreInfoManager.save(store);
					values.remove(info.getApprovalNo());
					MatStoreSumInfo sumInfo = matStoreSumInfoManager.findOne(jqlSum.toString(), valueSum.toArray());
					sumInfo.setStoreSum(sumInfo.getStoreSum().add(info.getOutSum()) );
					sumInfo.setUpdateOper(user.getName());
					sumInfo.setUpdateOperId(user.getId());
					sumInfo.setUpdateTime(new Date());
					matStoreSumInfoManager.save(sumInfo);//更新库存汇总信息
				}
			}
		}
	return msg;
	}
}
