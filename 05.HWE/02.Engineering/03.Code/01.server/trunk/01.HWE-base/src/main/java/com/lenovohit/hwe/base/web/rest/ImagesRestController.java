package com.lenovohit.hwe.base.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.print.attribute.standard.DateTimeAtCompleted;

import org.apache.jasper.tagplugins.jstl.core.ForEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Images;
import com.lenovohit.hwe.base.utils.ImagesUtils;

@RestController
@RequestMapping("/hwe/base/images")
public class ImagesRestController extends BaseController {

	@Autowired
	private GenericManager<Images, String> imagesManager;

	@RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Images model = JSONUtils.deserialize(data, Images.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		model = this.imagesManager.save(model);

		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Images model = JSONUtils.deserialize(data, Images.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		Images tModel = this.imagesManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if (model.getFkId() != null) {
			tModel.setFkId(model.getFkId());
			;
		}
		if (model.getMemo() != null) {
			tModel.setMemo(model.getMemo());
			;
		}
		if (model.getPath() != null) {
			tModel.setPath(model.getPath());
			;
		}
		if (model.getFileName() != null) {
			tModel.setFileName(model.getFileName());
			;
		}
		if (model.getExtName() != null) {
			tModel.setExtName(model.getExtName());
			;
		}
		if (model.getResolution() != null) {
			tModel.setResolution(model.getResolution());
			;
		}
		if (model.getSize() != null) {
			tModel.setSize(model.getSize());
			;
		}
		tModel = this.imagesManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Images model = this.imagesManager.get(id);

		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询新闻列表，输入查询条件为：【" + data + "】");
		Images model = JSONUtils.deserialize(data, Images.class);
		StringBuffer jql = new StringBuffer("from Images n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (null != model) {
			if (StringUtils.isNotBlank(model.getFkId())) {
				jql.append(" and n.fkId = ?");
				values.add(model.getFkId());
			}
			if (StringUtils.isNotBlank(model.getFkType())) {
				jql.append(" and n.fkType = ?");
				values.add(model.getFkType());
			}
			if (StringUtils.isNotBlank(model.getFileName())) {
				jql.append(" and n.fileName like ?");
				values.add("%" + model.getFileName() + "%");
			}
			if (StringUtils.isNotBlank(model.getExtName())) {
				jql.append(" and n.extName like ?");
				values.add("%" + model.getExtName() + "%");
			}
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.imagesManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询新闻列表，输入查询条件为：【" + data + "】");
		Images model = JSONUtils.deserialize(data, Images.class);
		StringBuffer jql = new StringBuffer("from Images n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (null != model) {
			// 上传格式中，id以","隔开
			if (StringUtils.isNotBlank(model.getId())) {
				String idsString = "";
				String[] ids = model.getId().split(",");
				for (int idx = ids.length - 1; idx > -1; idx--) {
					if (StringUtils.isBlank(ids[idx])) {
						continue;
					}
					if (StringUtils.isBlank(idsString)) {
						idsString = " n.id = ? ";
					} else {
						idsString += " or n.id = ? ";
					}
					values.add(ids[idx]);
				}
				
				if (!StringUtils.isBlank(idsString)) {
					jql.append(" and (" + idsString + ")");
				}
			}
			if (StringUtils.isNotBlank(model.getFkId())) {
				jql.append(" and n.fkId = ?");
				values.add(model.getFkId());
			}
			if (StringUtils.isNotBlank(model.getFkType())) {
				jql.append(" and n.fkType = ?");
				values.add(model.getFkType());
			}
			if (StringUtils.isNotBlank(model.getFileName())) {
				jql.append(" and n.fileName like ?");
				values.add("%" + model.getFileName() + "%");
			}
			if (StringUtils.isNotBlank(model.getExtName())) {
				jql.append(" and n.extName like ?");
				values.add("%" + model.getExtName() + "%");
			}
			
			jql.append(" order by fkId, fkType, sort");
		}
		List<Images> models = this.imagesManager.find(jql.toString(), values.toArray());

		return ResultUtils.renderSuccessResult(models);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		
		try {
			this.imagesManager.delete(id);
		} catch (Exception e) {
			return ResultUtils.renderFailureResult();
		}
		
		return ResultUtils.renderSuccessResult();
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveAll(@RequestBody String data) {
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM BASE_IMAGES WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			this.imagesManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/view/{id}", method = RequestMethod.GET)
	public void forView(@PathVariable("id") String id) throws Exception {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Images model = this.imagesManager.get(id);
		ImagesUtils.viewImage(this.getResponse().getOutputStream(), model);
	}

	@RequestMapping(value = "/{fkId}/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forFkIdList(@PathVariable("fkId") String fkId) {
		log.info("查询图片，输入查询条件为：【" + fkId + "】");
		if (StringUtils.isBlank(fkId)) {
			throw new BaseException("输入fkId为空！");
		}
		StringBuffer jql = new StringBuffer("from Images n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (StringUtils.isNotBlank(fkId)) {
			jql.append(" and n.fkId = ?");
			values.add(fkId);
		}

		List<Images> image = this.imagesManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(image);
	}

	@RequestMapping(value = "/viewByFkId/{fkId}/{fkType}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void forViewByFkId(@PathVariable("fkId") String fkId, @PathVariable("fkType") String fkType)
			throws Exception {
		if (StringUtils.isEmpty(fkId)) {
			throw new BaseException("输入fkId为空！");
		}
		StringBuffer jql = new StringBuffer("from Images n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (StringUtils.isNotBlank(fkId)) {
			jql.append(" and n.fkId = ?");
			values.add(fkId);
		}
		if (StringUtils.isNotBlank(fkType)) {
			jql.append(" and n.fkType = ?");
			values.add(fkType);
		}

		List<Images> image = this.imagesManager.find(jql.toString(), values.toArray());
		ImagesUtils.viewImages(this.getResponse().getOutputStream(), image);
	}
	
	@CrossOrigin
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public Result forUpload(@RequestParam(value = "id", defaultValue = "") String id,
			@RequestParam(value = "fkId", defaultValue = "") String fkId,
			@RequestParam(value = "fkType", defaultValue = "") String fkType,
			@RequestParam(value = "memo", defaultValue = "") String memo,
			@RequestParam(value = "resolution", defaultValue = "") String resolution,
			@RequestParam(value = "sortNum", defaultValue = "") String sortNum,
			@RequestParam(value = "file") MultipartFile file) throws Exception {

		if (this.getRequest().getCharacterEncoding() == null) {
			this.getRequest().setCharacterEncoding("UTF-8");
		}
		if (!file.isEmpty()) {
			Images model = new Images();
			try {
				if (StringUtils.isNotBlank(id)) {
					model.setId(id);
				}
				if (StringUtils.isNotBlank(fkId)) {
					model.setFkId(fkId);
				}
				if (StringUtils.isNotBlank(fkType)) {
					model.setFkType(fkType);
				}
				if (StringUtils.isNotBlank(memo)) {
					model.setMemo(memo);
				}
				if (StringUtils.isNotBlank(resolution)) {
					model.setMemo(resolution);
				}
				Map<String, Object> map = ImagesUtils.uploadImage(file);
				Images i = this.imagesManager.findOne("from Images n where fkId = ? and fileName like ? ", fkId,
						"%" + id + "%");
				if (i != null) {
					model.setId(i.getId());
				}
				// model.setId((String)map.get("id"));
				model.setSize(new BigDecimal((String) map.get("fileSize")));
				model.setFileName((String) map.get("fileName"));
				model.setExtName((String) map.get("fileExt"));
				model.setPath((String) map.get("filePath"));
				Images image = this.imagesManager.save(model);
						
				/*
				 * String fileName = new
				 * String(file.getOriginalFilename().getBytes(), "UTF-8");
				 * String extName =
				 * fileName.substring(fileName.lastIndexOf("."),
				 * fileName.length());
				 * model.setSize(Double.longBitsToDouble(file.getSize()));
				 * model.setFileName(fileName); model.setExtName(extName);
				 * this.imagesManager.save(model);
				 * 
				 * byte[] bytes = file.getBytes(); os = new
				 * BufferedOutputStream( new FileOutputStream(new
				 * File(SystemPath.getClassPath()+"/images/"+ fileName)));
				 * os.write(bytes); os.close();
				 */
				return ResultUtils.renderSuccessResult(image);
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("上传图片失败！");
			}
		} else {
			return ResultUtils.renderFailureResult("文件为空！");
		}
	}
	
	@CrossOrigin
	@RequestMapping(value = "/uploadImage", method = RequestMethod.POST)
	public Result forUploadImage(@RequestParam(value = "fkId", defaultValue = "") String fkId,
			@RequestParam(value = "fkType", defaultValue = "") String fkType,
			@RequestParam(value = "memo", defaultValue = "") String memo,
			@RequestParam(value = "resolution", defaultValue = "") String resolution,
			@RequestParam(value = "sortNum", defaultValue = "") String sortNum,
			@RequestParam(value = "file") MultipartFile file) throws Exception {

		if (this.getRequest().getCharacterEncoding() == null) {
			this.getRequest().setCharacterEncoding("UTF-8");
		}
		if (!file.isEmpty()) {
			Images model = new Images();
			try {
				if (StringUtils.isNotBlank(fkId)) {
					model.setFkId(fkId);
				}
				if (StringUtils.isNotBlank(fkType)) {
					model.setFkType(fkType);
				}
				if (StringUtils.isNotBlank(memo)) {
					model.setMemo(memo);
				}
				if (StringUtils.isNotBlank(resolution)) {
					model.setMemo(resolution);
				}
				
				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Map<String, Object> map = ImagesUtils.uploadImage(file, fileName);
				model.setSize(new BigDecimal((String) map.get("fileSize")));
				model.setFileName((String) map.get("fileName"));
				model.setExtName((String) map.get("fileExt"));
				model.setPath((String) map.get("filePath"));
				Date now = new Date();
				model.setUpdatedAt(now);
				model.setCreatedAt(now);
				Images image = this.imagesManager.save(model);
				return ResultUtils.renderSuccessResult(image);
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("上传图片失败！");
			}
		} else {
			return ResultUtils.renderFailureResult("文件为空！");
		}
	}

}
