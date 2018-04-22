//package com.lenovohit.ssm.app.base.web.rest;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.lenovohit.core.dao.Page;
//import com.lenovohit.core.exception.BaseException;
//import com.lenovohit.core.manager.GenericManager;
//import com.lenovohit.core.utils.JSONUtils;
//import com.lenovohit.core.utils.StringUtils;
//import com.lenovohit.core.web.MediaTypes;
//import com.lenovohit.core.web.rest.BaseRestController;
//import com.lenovohit.core.web.utils.Result;
//import com.lenovohit.core.web.utils.ResultUtils;
//import com.lenovohit.ssm.app.base.model.Images;
//import com.lenovohit.ssm.app.base.utils.ImagesUtils;
//
//@RestController
//@RequestMapping("/ssm/el/base/images/")
//public class ImagesRestController extends BaseRestController {
//	
//	@Autowired
//	private GenericManager<Images, String> imagesManager;
//	
//
//	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
//	public Result forCreate(@RequestBody String data) {
//		if (StringUtils.isEmpty(data)) {
//			throw new BaseException("输入数据为空！");
//		}
//
//		Images model = JSONUtils.deserialize(data, Images.class);
//		if (null == model) {
//			throw new BaseException("输入数据为空！");
//		}
//		
//		model = this.imagesManager.save(model);
//		return ResultUtils.renderSuccessResult(model);
//	}
//	
//	
//	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forInfo(@PathVariable("id") String id) {
//		if (StringUtils.isEmpty(id)) {
//			throw new BaseException("输入Id为空！");
//		}
//		Images model = this.imagesManager.get(id);
//		return ResultUtils.renderSuccessResult(model);
//	}
//	
//	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
//	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
//		log.info("修改详情，输入数据为：【" + data + "】");
//		if (StringUtils.isEmpty(data)) {
//			throw new BaseException("输入数据为空！");
//		}
//
//		Images model = JSONUtils.deserialize(data, Images.class);
//		if (null == model) {
//			throw new BaseException("输入数据为空！");
//		}
//		if (StringUtils.isEmpty(id)) {
//			throw new BaseException("输入ID不可为空！");
//		}
//
//		Images tModel = this.imagesManager.get(id);
//		if (null == tModel) {
//			throw new BaseException("更新记录不存在！");
//		}
//		if(model.getFkId() != null){
//			tModel.setFkId(model.getFkId());;
//		}
//		if(model.getMemo() != null){
//			tModel.setMemo(model.getMemo());;
//		}
//		if(model.getPath() != null){
//			tModel.setPath(model.getPath());;
//		}
//		if(model.getFileName() != null){
//			tModel.setFileName(model.getFileName());;
//		}
//		if(model.getExtName() != null){
//			tModel.setExtName(model.getExtName());;
//		}
//		if(model.getResolution() != null){
//			tModel.setResolution(model.getResolution());;
//		}
//		if(model.getSize() != null){
//			tModel.setSize(model.getSize());;
//		}
//		if(model.getSortNum() != null){
//			tModel.setSortNum(model.getSortNum());;
//		}
//		
//		tModel = this.imagesManager.save(tModel);
//
//		return ResultUtils.renderSuccessResult(tModel);
//	}
//	
//	
//	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
//	public Result forDelete(@PathVariable("id") String id) {
//		if (StringUtils.isEmpty(id)) {
//			throw new BaseException("输入Id为空！");
//		}
//		Images model = this.imagesManager.delete(id);
//		
//		return ResultUtils.renderSuccessResult(model);
//	}
//	
//	
//	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
//			@RequestParam(value = "data", defaultValue = "") String data) {
//		log.info("查询新闻列表，输入查询条件为：【" + data + "】");
//		Images model = JSONUtils.deserialize(data, Images.class);
//		StringBuffer jql = new StringBuffer("from Images n where 1=1 ");
//		List<String> values = new ArrayList<String>();
//		if(null != model){
//			if(StringUtils.isNotBlank(model.getFkId())){
//				jql.append(" and n.fkId = ?");
//				values.add(model.getFkId());
//			}
//			if(StringUtils.isNotBlank(model.getFkType())){
//				jql.append(" and n.fkType = ?");
//				values.add(model.getFkType());
//			}
//			if(StringUtils.isNotBlank(model.getFileName())){
//				jql.append(" and n.fileName like ?");
//				values.add("%"+ model.getFileName() +"%");
//			}
//			if(StringUtils.isNotBlank(model.getExtName())){
//				jql.append(" and n.extName like ?");
//				values.add("%"+ model.getExtName() +"%");
//			}
//		}
//		
//		Page page = new Page();
//		page.setStart(start);
//		page.setPageSize(pageSize);
//		page.setQuery(jql.toString());
//		page.setValues(values.toArray());
//		this.imagesManager.findPage(page);
//		
//		return ResultUtils.renderSuccessResult(page);
//	}
//	
//	@RequestMapping(value = "view/{id}", method = RequestMethod.GET)
//	public void forView(@PathVariable("id") String id) throws Exception{
//		if (StringUtils.isEmpty(id)) {
//			throw new BaseException("输入Id为空！");
//		}
//		Images model = this.imagesManager.get(id);
//		ImagesUtils.viewImage(this.getResponse().getOutputStream(), model.getFileName());
//	}
//	
//	@RequestMapping(value = "upload", method = RequestMethod.POST)
//	public Result handleUpload(
//			@RequestParam(value = "fkId", defaultValue = "") String fkId,
//			@RequestParam(value = "fkType", defaultValue = "") String fkType,
//			@RequestParam(value = "memo", defaultValue = "") String memo,
//			@RequestParam(value = "resolution", defaultValue = "") String resolution,
//			@RequestParam(value = "sortNum", defaultValue = "") String sortNum,
//			@RequestParam(value = "file") MultipartFile file) throws Exception{
//		
//		if (this.getRequest().getCharacterEncoding() == null) {
//			this.getRequest().setCharacterEncoding("UTF-8");
//	    }
//		if (!file.isEmpty()) {
//			Images model = new Images();
//			try {
//				if(StringUtils.isNotBlank(fkId)){
//					model.setFkId(fkId);
//				}
//				if(StringUtils.isNotBlank(fkType)){
//					model.setFkType(fkType);
//				}
//				if(StringUtils.isNotBlank(memo)){
//					model.setMemo(memo);
//				}
//				if(StringUtils.isNotBlank(sortNum)){
//					model.setSortNum(Integer.valueOf(sortNum));
//				} else {
//					model.setSortNum(0);
//				}
//				if(StringUtils.isNotBlank(resolution)){
//					model.setMemo(resolution);
//				}
//				
//				Map<String, Object> map = ImagesUtils.uploadImage(file);
//				model.setSize(Double.valueOf((String)map.get("fileSize")));
//				model.setFileName((String) map.get("fileName"));
//				model.setExtName((String) map.get("fileExt"));
//				model.setPath((String) map.get("filePath"));
//				this.imagesManager.save(model);
//				
//				/*String fileName =  new String(file.getOriginalFilename().getBytes(), "UTF-8");
//				String extName = fileName.substring(fileName.lastIndexOf("."), fileName.length());
//				model.setSize(Double.longBitsToDouble(file.getSize()));
//				model.setFileName(fileName);
//				model.setExtName(extName);
//				this.imagesManager.save(model);
//				
//				byte[] bytes = file.getBytes();
//				os = new BufferedOutputStream(
//						new FileOutputStream(new File(SystemPath.getClassPath()+"/images/"+ fileName)));
//				os.write(bytes);
//				os.close();*/
//				return ResultUtils.renderSuccessResult(model);
//			} catch (Exception e) {
//				e.printStackTrace();
//				return ResultUtils.renderFailureResult("上传图片失败！");
//			}
//		} else {
//			return ResultUtils.renderFailureResult("文件为空！");
//		}
//	}
//	
//}
