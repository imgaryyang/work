package com.lenovohit.hcp.pharmacy.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaCheckInfoManager;
import com.lenovohit.hcp.pharmacy.model.CheckInfoBill;
import com.lenovohit.hcp.pharmacy.model.PhaCheckInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaCheckInfo")
public class PhaCheckInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaCheckInfo, String> phaCheckInfoManager;
	@Autowired
	private GenericManager<CheckInfoBill, String> checkInfoBillManager;
	@Autowired
	private GenericManager<PhaStoreInfo, String> phaStoreInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private PhaCheckInfoManager phaCheckInfoManagerImpl;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{type}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("type") String type,@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		PhaCheckInfo query =  JSONUtils.deserialize(data, PhaCheckInfo.class);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();

		StringBuilder jql = new StringBuilder( " from PhaCheckInfo check where 1=1 ");
		if(!"detail".equalsIgnoreCase(type)){
			jql.append(" and check.deptId = ? and check.hosId = ? ");
			values.add(deptId);
			values.add(hosId);
		}
		if("check".equalsIgnoreCase(type)){//查询盘点中的状态
			jql.append("and ( check.checkState = ? or check.checkState = ?)");
			values.add("1");//开始状态
			values.add("2");//录入保存
		} else if("record".equalsIgnoreCase(type)){//查询盘点记录
			jql.append("and ( check.checkState != ? AND check.checkState != ?)");
			values.add("1");//开始状态
			values.add("2");//录入保存
		}
		
		if(!StringUtils.isEmpty(query.getDrugType())){
			jql.append(" and check.drugType like ? ");
			values.add("%"+query.getDrugType()+"%");
		}
		if(!StringUtils.isEmpty(query.getCheckBill())){//盘点单号
			jql.append(" and check.checkBill like ? ");
			values.add("%"+query.getCheckBill()+"%");
		}
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append(" and check.tradeName like ? ");
			values.add("%"+query.getTradeName()+"%");
		}
		jql.append(" order by check.createTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaCheckInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**    
	 * 功能描述：盘点单分页查询
	 *@param type
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月13日             
	*/
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCheckInfoBillPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		CheckInfoBill query =  JSONUtils.deserialize(data, CheckInfoBill.class);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String hosId = user.getHosId();
		String deptId = user.getLoginDepartment().getId();
		
		StringBuilder jql = new StringBuilder( " from CheckInfoBill check where check.hosId = ? and check.deptId = ? ");
		values.add(hosId);
		values.add(deptId);
		if(query!=null && !StringUtils.isEmpty(query.getCheckState())){
			jql.append(" and check.checkState = ? ");
			values.add(query.getCheckState());
		}
		if(query!=null && !StringUtils.isEmpty(query.getId())){
			jql.append(" and check.id like ? ");
			values.add("%"+query.getId()+"%");
		}
		jql.append(" order by check.createTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		checkInfoBillManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */ 
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PhaCheckInfo model= phaCheckInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**    
	 * 功能描述：生成盘点单（封账的查询）
	 *@return       
	 *@author GW
	 *@date 2017年5月12日             
	*/
	@RequestMapping(value = "/getBill", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getBill(){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<PhaCheckInfo> checkList = undoneCheckInfoList(hosId, deptId);
		
		String checkBill = "";
		if(checkList!=null && checkList.size()>0){
			checkBill = checkList.get(0).getCheckBill();
		}else{
			checkBill = redisSequenceManager.get("PHA_CHECKINFO", "CHECK_BILL");	//生成盘点号(单次封存盘点号相同)
		}
		return ResultUtils.renderSuccessResult(checkBill);
	}
	
	/**    
	 * 功能描述：生成盘点单
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value="/create/{bill}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateCheckInfo(@PathVariable("bill") String checkBill){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<PhaCheckInfo> checkList = undoneCheckInfoList(hosId, deptId);
		if(checkList==null||checkList.size()<1){//判断是否有未完成盘点   无未完成盘点执行
			try {
				//盘点列表
				List<PhaCheckInfo> checkInfoList =  new ArrayList<PhaCheckInfo>();
				//查询条件列表
				List<Object> values = new ArrayList<Object>();
				StringBuilder jql = new StringBuilder( " from PhaStoreInfo where stop = '1' AND DATEDIFF(day ,updateTime,getdate())<180 ");
				if(!StringUtils.isEmpty(deptId)){
					jql.append(" and deptId = ?");
					values.add(deptId);
				}
				if(!StringUtils.isEmpty(hosId)){
					jql.append(" and hosId = ? ");
					values.add(hosId);
				}
				List<PhaStoreInfo> storeInfoList = phaStoreInfoManager.find(jql.toString(), values.toArray());
				//封装插入的盘点单
				if(storeInfoList!=null&&storeInfoList.size()>0){//本人所在科室是否有药品信息
					if(!StringUtils.isEmpty(checkBill)){
						Date now =  new Date();
						for(PhaStoreInfo storeInfo:storeInfoList){
							PhaCheckInfo model = new PhaCheckInfo();
							//将药库相关信息对应赋值到盘点单中
							model.setHosId(hosId);		//医院id
							model.setDeptId(deptId);	//科室id
							model.setDrugInfo(storeInfo.getDrugInfo());			//主要获取drugId
							model.setCheckBill(checkBill);						//盘点单号
							model.setStoreId(storeInfo.getStoreId());			//库存id
							model.setDrugType(storeInfo.getDrugType());			//药品类型
							model.setDrugCode(storeInfo.getDrugCode());			//药品编号
							model.setTradeName(storeInfo.getTradeName());		//药品名称
							model.setSpecs(storeInfo.getSpecs());				//药品规格
							model.setBatchNo(storeInfo.getBatchNo());			//批次
							model.setApprovalNo(storeInfo.getApprovalNo());		//批号
							model.setProduceDate(storeInfo.getProduceDate());	//生产日期
							if(storeInfo.getCompanyInfo()!=null){
								model.setProducer(storeInfo.getCompanyInfo().getId());		//生产厂家
							}
							model.setValidDate(storeInfo.getValidDate());	//有效期
							model.setBuyPrice(storeInfo.getBuyPrice());		//采购价
							model.setSalePrice(storeInfo.getSalePrice());	//零售价
							model.setLocation(storeInfo.getLocation());		//药品位置
							model.setStartSum(storeInfo.getStoreSum());		//开始数量
							model.setMinUnit(storeInfo.getMinUnit());		//最小单位
							model.setCheckState("1");//盘点状态（1：开始盘点 2：录入保存 3：作废 4：结束盘点）
							
							model.setCreateOper(user.getName());
							model.setCreateTime(now);
							model.setUpdateOper(user.getName());
							model.setUpdateTime(now);
							checkInfoList.add(model);
						}
						//向盘点表插入盘点单
						this.phaCheckInfoManager.batchSave(checkInfoList);
					}else{
						return ResultUtils.renderFailureResult("无法生成盘点单号，请刷新后重试尝试！！");
					}
				}else{
					return ResultUtils.renderFailureResult("当前登录科室库房中没有药品，不能封账生成盘点单！！");
				}
				return ResultUtils.renderSuccessResult();
				
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("生成盘点单错误！！");
			}
		}else{//有未完成盘点给出提示
			return ResultUtils.renderFailureResult("您有未完成盘点，不能进行封账！！");
		}
		
	}
	
	/**    
	 * 功能描述：填写完盘点单
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月24日             
	*/
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		String hosId = user.getHosId();
		String deptId = user.getLoginDepartment().getId();
		//判断是否有盘点单
		List<PhaCheckInfo> checkList =undoneCheckInfoList(hosId, deptId);
		if(checkList!=null&&checkList.size()>0){
			List<PhaCheckInfo> checkInfoList = JSONUtils.parseObject(data, new TypeReference<List<PhaCheckInfo>>(){});
			if(checkInfoList==null){
				return ResultUtils.renderFailureResult("盘点单信息读取错误，请重新填写！！！");
			}else{
				updateCheckinfo(checkInfoList);
			}
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult("不存在未结存的盘点单！！");
		}
	}

	/**    
	 * 功能描述：更行列表中盘点数据
	 *@param checkInfoList       
	 *@author GW
	 *@date 2017年5月19日             
	*/
	private void updateCheckinfo(List<PhaCheckInfo> checkInfoList) {
		HcpUser user = this.getCurrentUser();
		Date now =  new Date();
		for(PhaCheckInfo model:checkInfoList){
			BigDecimal writeSum = model.getWriteSum();
			//包装数量
			Integer packQty = model.getDrugInfo().getPackQty();
			//整盒包装数量
			Integer packSum = model.getPackSum();
			//零散数量
			Integer miniSum = model.getMiniSum();
			
			if(packSum==null&&miniSum==null){//本次操作没有对数据进行修改
				if(writeSum==null){//没有暂存直接盘清
					writeSum = model.getStartSum();
				}
			}else{
				if(miniSum==null){
					miniSum = 0;
				}
				if(packSum==null){
					packSum = 0;
				}
				writeSum = new BigDecimal(packSum*packQty+miniSum);
			}
			model.setWriteSum(writeSum);
			//盈亏标志修改
			if(model.getWriteSum()!=null){//盘点单已录入
				model.setEndSum(model.getWriteSum());
				if(model.getWriteSum().compareTo(model.getStartSum())==1){//录入数量大于开始数量
					model.setProfitFlag(1);
				}else if(model.getWriteSum().compareTo(model.getStartSum())==-1){//录入数量小于开始数量
					model.setProfitFlag(-1);
				}else{//录入和库存数量相同
					model.setProfitFlag(0);
				}
			}
			
			model.setUpdateOper(user.getName());
			model.setUpdateTime(now);
			model.setCheckState("2");
		}
		//批量更新
		this.phaCheckInfoManager.batchSave(checkInfoList);
	}
	
	/**    
	 * 功能描述：盘点作废
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value = "/removeCheck",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result removeCheck(){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<PhaCheckInfo> checkInfoList = undoneCheckInfoList(hosId,deptId);
		try {
			if(checkInfoList!=null&&checkInfoList.size()>0){//判断是否存在未完成盘点单
				List<PhaCheckInfo> checkList  = new ArrayList<PhaCheckInfo>();
			for(PhaCheckInfo model:checkInfoList){
				model.setCheckState("3");//作废
				checkList.add(model);
			}
			//更新数据位作废
			this.phaCheckInfoManager.batchSave(checkList);
			}else{
				return ResultUtils.renderFailureResult("作废盘点操作失败：当前科室没有盘点单！！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("作废盘点操作失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**    
	 * 功能描述：盘点结清
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value = "/finish",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result finishCheckInfo(@RequestBody String data){
		HcpUser user = this.getCurrentUser();
		List<PhaCheckInfo> checkInfoData = JSONUtils.parseObject(data, new TypeReference<List<PhaCheckInfo>>(){});
		//如果提交上来的数据有所更改首先更新数据，然后盘清
		updateCheckinfo(checkInfoData);
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<PhaCheckInfo> checkInfoList = undoneCheckInfoList(hosId,deptId);
		try {
			if(checkInfoList!=null&&checkInfoList.size()>0){//判断是否存在
				List<PhaCheckInfo> checkList  = new ArrayList<PhaCheckInfo>();
				for(PhaCheckInfo model:checkInfoList){
					model.setCheckState("4");//完成
					if(model.getWriteSum()!=null){//盘点单已录入
						model.setEndSum(model.getWriteSum());
						if(model.getWriteSum().compareTo(model.getStartSum())==1){//录入数量大于开始数量
							model.setProfitFlag(1);
						}else if(model.getWriteSum().compareTo(model.getStartSum())==-1){//录入数量小于开始数量
							model.setProfitFlag(-1);
						}else{//录入和库存数量相同
							model.setProfitFlag(0);
						}
						checkList.add(model);
					}else{//若录入数量为空时录入结清数量与库存数量相同,盈亏标志设为0
						model.setWriteSum(model.getStartSum());
						model.setEndSum(model.getStartSum());
						model.setProfitFlag(0);
						checkList.add(model);
					}
				}
				//更新数据信息
				phaCheckInfoManagerImpl.updateStockInfo(checkList, user);
			}else{
				return ResultUtils.renderFailureResult("结清操作失败：当前科室没有正在进行中的盘点单！！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("结清失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**    
	 * 功能描述：导出盘点单汇总
	 *@param request
	 *@param response
	 *@param data
	 *@throws IOException       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	@RequestMapping(value = "/expertToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		CheckInfoBill query =  JSONUtils.deserialize(data, CheckInfoBill.class);
		JSONObject json = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String hosId = user.getHosId();
		
		StringBuilder jql = new StringBuilder( " from CheckInfoBill check where check.hosId = ? ");
		values.add(hosId);
		if(query!=null && !StringUtils.isEmpty(query.getCheckState())){
			jql.append(" and check.checkState = ? ");
			values.add(query.getCheckState());
		}
		if(query!=null && !StringUtils.isEmpty(query.getId())){
			jql.append(" and check.id like ? ");
			values.add("%"+query.getId()+"%");
		}
		if(json!=null && !StringUtils.isEmpty(json.get("selectedRowKeys"))){
			List ids = json.getJSONArray("selectedRowKeys");
			jql.append(" and check.id IN (");
			for(int i=0;i<ids.size();i++){
				jql.append("?");
				values.add(ids.get(i).toString());
				if(i != ids.size()-1)jql.append(",");
			}
			jql.append(")");
		}
		
		jql.append(" order by check.createTime desc ");
		List<CheckInfoBill> billList = (List<CheckInfoBill>) checkInfoBillManager.findByJql(jql.toString(), values.toArray());
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_盘点单";
		String header = request.getHeader("USER-AGENT");
		if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
			   fileName = URLEncoder.encode(fileName,"UTF8");
            }else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
            	fileName = new String(fileName.getBytes(), "ISO8859-1");
            }else{
            	fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
            }
		response.reset();
		response.setContentType("application/vnd.ms-word");
		// 定义文件名
		response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
		// 定义一个输出流
		OutputStream out = null;
		response.setCharacterEncoding("UTF-8");
		out = response.getOutputStream();
		createExcel(billList,out);
	}
	
	/**    
	 * 功能描述：导出单个盘点单详情
	 *@param request
	 *@param response
	 *@param data
	 *@throws IOException       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	@RequestMapping(value = "/expertBillToExcel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportBillToExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "data", defaultValue = "") String data) throws IOException {
		PhaCheckInfo query =  JSONUtils.deserialize(data, PhaCheckInfo.class);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String hosId = user.getHosId();

		StringBuilder jql = new StringBuilder( " from PhaCheckInfo check where 1=1 and hosId= ? ");
		values.add(hosId);
		
		if(!StringUtils.isEmpty(query.getCheckBill())){//盘点单号
			jql.append(" and check.checkBill = ? ");
			values.add(query.getCheckBill());
		}
		List<PhaCheckInfo> infoList = phaCheckInfoManager.find(jql.toString(), values.toArray());
	
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_盘点单明细";
		String header = request.getHeader("USER-AGENT");
		if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
			fileName = URLEncoder.encode(fileName,"UTF8");
		}else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
			fileName = new String(fileName.getBytes(), "ISO8859-1");
		}else{
			fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
		}
		response.reset();
		response.setContentType("application/vnd.ms-word");
		// 定义文件名
		response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
		// 定义一个输出流
		OutputStream out = null;
		response.setCharacterEncoding("UTF-8");
		out = response.getOutputStream();
		
		exportDetailToExcel(infoList,out);
	}
	
	/**    
	 * 功能描述：导出盘点单汇总信息到excel中
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年5月24日             
	*/
	public void createExcel(List<CheckInfoBill> inputInfoList,OutputStream out) {
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFCellStyle cellStyle = wb.createCellStyle();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			cellStyle.setFont(font);
			
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("入库明细统计");
			sheet.setColumnWidth(0,12 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			sheet.setColumnWidth(2,6 * 512);
			sheet.setColumnWidth(3,6 * 512);
			sheet.setColumnWidth(4,6 * 512);
			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
		    font.setFontHeightInPoints((short) 25);//高度
		    style.setFont(font);
		    style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
		    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			 row0.setHeightInPoints((short) 50);
			 XSSFCell cell = row0.createCell(0);
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("盘点单统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("盘点单号");
			row1.createCell(1).setCellValue("科室");
			row1.createCell(2).setCellValue("创建人");
			row1.createCell(3).setCellValue("创建时间");
			row1.createCell(4).setCellValue("盘点单状态");
			//循环将dataList插入表中
			if(inputInfoList!=null&& inputInfoList.size()>0){
				for(int i=0;i<inputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					CheckInfoBill info = inputInfoList.get(i);
					row.createCell(0).setCellValue(info.getId());//盘点单号
					row.createCell(1).setCellValue(info.getDeptName());//科室
					row.createCell(2).setCellValue(info.getCreateOper());
					row.createCell(3).setCellValue(DateUtils.date2String(info.getCreateTime(), "yyyy-MM-dd"));
					if(info.getCheckState()!=null){//盘点状态
						Dictionary dic = findDicByColumnNameAndKey("CHECK_STATE", info.getCheckState());
						if(dic!=null){
							row.createCell(4).setCellValue(dic.getColumnVal());
						}
					}
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
	}
	
	/**    
	 * 功能描述：
	 *@param inputInfoList
	 *@param out       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	public void exportDetailToExcel(List<PhaCheckInfo> inputInfoList,OutputStream out) {
		// 输出流
		try {
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFCellStyle cellStyle = wb.createCellStyle();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			cellStyle.setFont(font);
			
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("入库明细统计");
			sheet.setColumnWidth(0,6 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,12 * 512);
			sheet.setColumnWidth(2,10 * 512);
			sheet.setColumnWidth(3,10 * 512);
			sheet.setColumnWidth(4,6 * 512);
			sheet.setColumnWidth(5,6 * 512);
			sheet.setColumnWidth(6,6 * 512);
			sheet.setColumnWidth(7,10 * 512);
			sheet.setColumnWidth(8,6 * 512);
			sheet.setColumnWidth(9,8 * 512);
			sheet.setColumnWidth(10,6 * 512);
			sheet.setColumnWidth(11,6 * 512);
			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
			font.setFontHeightInPoints((short) 25);//高度
			style.setFont(font);
			style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
			style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			row0.setHeightInPoints((short) 50);
			XSSFCell cell = row0.createCell(0);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 11));//合并单元格（开始行，结束行，开始列，结束列）
			cell.setCellStyle(style);
			cell.setCellValue("盘点单明细");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			row1.createCell(0).setCellValue("药品分类");
			row1.createCell(1).setCellValue("药品名称");
			row1.createCell(2).setCellValue("编号");
			row1.createCell(3).setCellValue("规格");
			row1.createCell(4).setCellValue("批次");
			row1.createCell(5).setCellValue("批号");
			row1.createCell(6).setCellValue("药品位置");
			row1.createCell(7).setCellValue("有效期");
			row1.createCell(8).setCellValue("原始数量");
			row1.createCell(9).setCellValue("盘点数量");
			row1.createCell(10).setCellValue("结存数量");
			row1.createCell(11).setCellValue("盘点状态");
			//循环将dataList插入表中
			if(inputInfoList!=null&& inputInfoList.size()>0){
				for(int i=0;i<inputInfoList.size();i++){
					XSSFRow row = sheet.createRow(i+2);
					PhaCheckInfo info = inputInfoList.get(i);
					if(info.getDrugType()!=null){
						Dictionary dic = findDicByColumnNameAndKey("DRUG_TYPE", info.getDrugType());
						if(dic!=null){
							row.createCell(0).setCellValue(dic.getColumnVal());
						}
					}
					row.createCell(1).setCellValue(info.getTradeName());
					row.createCell(2).setCellValue(info.getDrugCode());
					row.createCell(3).setCellValue(info.getSpecs());
					row.createCell(4).setCellValue(info.getBatchNo());
					row.createCell(5).setCellValue(info.getApprovalNo());
					row.createCell(6).setCellValue(info.getLocation());
					row.createCell(7).setCellValue(DateUtils.date2String(info.getValidDate(), "yyyy-MM-dd"));
					BigDecimal startSum = info.getStartSum();//初始数量
					BigDecimal wirteSum = info.getWriteSum();//盘点数量
					BigDecimal endSum = info.getEndSum();//结存数量
					DecimalFormat myformat0=new DecimalFormat("0");//BigDecimal保留整数部分
					if(info.getDrugInfo()!=null && info.getDrugInfo().getPackQty()!=null&&info.getDrugInfo().getPackQty()>0
							&&startSum != null && startSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						BigDecimal[] results = startSum.divideAndRemainder(BigDecimal.valueOf(info.getDrugInfo().getPackQty()));
						if(!StringUtils.isEmpty(info.getDrugInfo().getPackUnit()) && !StringUtils.isEmpty(info.getDrugInfo().getMiniUnit())){
							if(results[1].compareTo(BigDecimal.ZERO)==1){//离散数量为0时不显示最小单位
								row.createCell(8).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit()+myformat0.format(results[1])+info.getDrugInfo().getMiniUnit());
							}else{
								row.createCell(8).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit());
							}
						}else{
							row.createCell(8).setCellValue(startSum.toString());
						}
					}else{
						row.createCell(8).setCellValue(0);
					}
					if(info.getDrugInfo()!=null && info.getDrugInfo().getPackQty()!=null&&info.getDrugInfo().getPackQty()>0
							&&wirteSum != null && wirteSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						BigDecimal[] results = wirteSum.divideAndRemainder(BigDecimal.valueOf(info.getDrugInfo().getPackQty()));
						if(!StringUtils.isEmpty(info.getDrugInfo().getPackUnit()) && !StringUtils.isEmpty(info.getDrugInfo().getMiniUnit())){
							if(results[1].compareTo(BigDecimal.ZERO)==1){
								row.createCell(9).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit()+myformat0.format(results[1])+info.getDrugInfo().getMiniUnit());
							}else{
								row.createCell(9).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit());
							}
						}else{
							row.createCell(9).setCellValue(wirteSum.toString());
						}
					}else{
						row.createCell(9).setCellValue(0);
					}
					if(info.getDrugInfo()!=null && info.getDrugInfo().getPackQty()!=null&&info.getDrugInfo().getPackQty()>0
							&&endSum != null && endSum.compareTo(BigDecimal.ZERO) == 1){//包装数量存在并且初始数量大于0
						BigDecimal[] results = endSum.divideAndRemainder(BigDecimal.valueOf(info.getDrugInfo().getPackQty()));
						if(!StringUtils.isEmpty(info.getDrugInfo().getPackUnit()) && !StringUtils.isEmpty(info.getDrugInfo().getMiniUnit())){
							if(results[1].compareTo(BigDecimal.ZERO)==1){
								row.createCell(10).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit()+myformat0.format(results[1])+info.getDrugInfo().getMiniUnit());
							}else{
								row.createCell(10).setCellValue(myformat0.format(results[0])+info.getDrugInfo().getPackUnit());
							}
						}else{
							row.createCell(10).setCellValue(endSum.toString());
						}
					}else{
						row.createCell(10).setCellValue(0);
					}
					if(info.getCheckState()!=null){//盘点状态
						Dictionary dic = findDicByColumnNameAndKey("CHECK_STATE", info.getCheckState());
						if(dic!=null){
							row.createCell(11).setCellValue(dic.getColumnVal());
						}
					}
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
	}
	
	/**    
	 * 功能描述：正在进行中的盘点
	 *@param hosId 医院id
	 *@param deptId 科室id
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	private List<PhaCheckInfo> undoneCheckInfoList(String hosId,String deptId){
		StringBuilder jql = new StringBuilder( "from PhaCheckInfo where 1=1 ");
		List<Object> values  = new ArrayList<Object>();
		if(!StringUtils.isEmpty(hosId)){
			jql.append("and hosId = ? ");
			values.add(hosId);
		}
		if(!StringUtils.isEmpty(deptId)){
			jql.append("and deptId = ? ");
			values.add(deptId);
		}
		//未完成条件添加
		jql.append("and ( checkState = ? or checkState = ?)");
		values.add("1");//开始状态
		values.add("2");//录入保存
		
		List<PhaCheckInfo> checkInfoList = (List<PhaCheckInfo>) phaCheckInfoManager.find(jql.toString(), values.toArray());
		return checkInfoList;
	}
	
	/**    
	 * 功能描述：根据columnName和key查询指定字典对应项
	 * 			（后续此方法可以作为公共方法）
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年6月14日             
	*/
	public Dictionary findDicByColumnNameAndKey(String columnName,String key) {
		Dictionary model = null;
		if(!StringUtils.isEmpty(columnName) && !StringUtils.isEmpty(key)){
			StringBuilder idSql = new StringBuilder();
			List<String> values = new ArrayList<String>();
			idSql.append("SELECT dict from Dictionary dict WHERE columnName = ?  and stop = true and columnKey = ? ");
			values.add(columnName);
			values.add(key);
			
			model = dictionaryManager.findOne(idSql.toString(), values.toArray());
		}
		return model;
	}
}
