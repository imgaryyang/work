package com.lenovohit.bdrp.authority.manager.impl;

import java.util.List;

import org.apache.shiro.config.Ini;
import org.apache.shiro.config.Ini.Section;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lenovohit.bdrp.authority.model.AuthPermission;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.core.utils.StringUtils;

//@Service("chainDefinitionSectionMetaSource")
public class ChainDefinitionSectionMetaSourceManagerImpl /*implements FactoryBean<Ini.Section>*/{  
 
//	@Autowired
//	private GenericDao<AuthPermission, String> authPermissionDao;
//	
//	@Value("${app.authority.filterChainDefinitions}")
//	private String filterChainDefinitions; 
//	
//	private String configPath;  
// 
//    /**
//     * 默认premission字符串  
//     */ 
//    public static final String PREMISSION_STRING="perms[\"{0}\"]";  
// 
//    public Section getObject() throws BeansException {  
//        //获取所有Resource  
//        List<AuthPermission> list = authPermissionDao.find("from AuthPermission", null);
// 
//        Ini ini = new Ini();  
//        //加载默认的url  
//        ini.load(filterChainDefinitions);  
//        Ini.Section section = ini.getSection(Ini.DEFAULT_SECTION_NAME);  
//        //循环Resource的url,逐个添加到section中。section就是filterChainDefinitionMap,  
//        //里面的键就是链接URL,值就是存在什么条件才能访问该链接  
//        for(AuthPermission perm : list){
//	        	//如果不为空值添加到section中  
//	            if(StringUtils.isNotEmpty(perm.getUri()) && StringUtils.isNotEmpty(perm.getPermission())) {  
////	                section.put(resource.getUri(),  MessageFormat.format(PREMISSION_STRING,resource.getPermission()));  
//	                
//	                section.put(perm.getUri(), perm.getPermission());  
//	            }  
//        }
//        
////        section.put("/**", "authc");  
//        return section;  
//    }  
////    protected Ini convertPathToIni(String path) {
////
////        Ini ini = new Ini();
////
////        //SHIRO-178: Check for servlet context resource and not
////        //only resource paths:
////        if (!ResourceUtils.hasResourcePrefix(path)) {
////            ini = getServletContextIniResource(path);
////            if (ini == null) {
////                String msg = "There is no servlet context resource corresponding to configPath '" + path + "'  If " +
////                        "the resource is located elsewhere (not immediately resolveable in the servlet context), " +
////                        "specify an appropriate classpath:, url:, or file: resource prefix accordingly.";
////                throw new ConfigurationException(msg);
////            }
////        } else {
////            //normal resource path - load as usual:
////            ini.loadFromPath(path);
////        }
////
////        return ini;
////    }
////    protected Ini getServletContextIniResource(String servletContextPath) {
////        String path = WebUtils.normalize(servletContextPath);
////        if (getServletContext() != null) {
////            InputStream is = getServletContext().getResourceAsStream(path);
////            if (is != null) {
////                Ini ini = new Ini();
////                ini.load(is);
////                if (CollectionUtils.isEmpty(ini)) {
////                    log.warn("ServletContext INI resource '" + servletContextPath + "' exists, but it did not contain " +
////                            "any data.");
////                }
////                return ini;
////            }
////        }
////        return null;
////    }
//
//    /**
//     * 通过filterChainDefinitions对默认的url过滤定义  
//     *    
//     * @param filterChainDefinitions 默认的url过滤定义  
//     */ 
//    public void setFilterChainDefinitions(String filterChainDefinitions) {  
//        this.filterChainDefinitions = filterChainDefinitions;  
//    }  
// 
//    public Class<?> getObjectType() {  
//        return this.getClass();  
//    }  
// 
//    public boolean isSingleton() {  
//        return true;  
//    }  
 
}  
