package com.lenovohit.ssm.base.web.rest;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Notice;
@RestController
@RequestMapping("/ssm/base/notice")
public class NoticeRestController extends SSMBaseRestController {
	
	@Value("${app.notice.assets}")
	private String noticeRoot;
	
	@RequestMapping(value = "/assets", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result assets() throws UnsupportedEncodingException{
		File root = new File(noticeRoot);
		if(!root.exists())root.mkdirs();
		File[] files = root.listFiles();
		List<Notice> assets = new ArrayList<Notice>();
		for(File file : files){
			Notice notice = new Notice();
			notice.setUrl("/ssm/base/notice/asset/"+new String(Base64Utils.encode(file.getName().getBytes()),"utf-8"));
			notice.setName(file.getName());
			assets.add(notice);
		}
		return ResultUtils.renderSuccessResult(assets);
	}
	@RequestMapping(value = "/asset/{name}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void asset(@PathVariable("name") String name) throws UnsupportedEncodingException{
		File file = new File(noticeRoot+"/"+new String(Base64Utils.decode(name.getBytes()),"utf-8"));
		if(file.exists()){
			String[] names = file.getName().split("\\.");
			String contentType="image/jpeg";
			if(names.length>1){
				contentType = "image/"+names[names.length-1];
			}
			this.getResponse().setContentType(contentType);
			try {
				byte[] buffer = new byte[1024];  
				FileInputStream fis = new FileInputStream(file);  
				BufferedInputStream  bis = new BufferedInputStream(fis);  
                OutputStream os = this.getResponse().getOutputStream();  
                int i = bis.read(buffer);  
                while (i != -1) {  
                    os.write(buffer, 0, i);  
                    i = bis.read(buffer);  
                } 
    			
                fis.close();  
                os.flush();  
                os.close();
                
    		} catch (FileNotFoundException e) {
    			e.printStackTrace();
    		} catch (IOException e) {
				e.printStackTrace();
			}
		}else{
			 
		}
	}
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
}
