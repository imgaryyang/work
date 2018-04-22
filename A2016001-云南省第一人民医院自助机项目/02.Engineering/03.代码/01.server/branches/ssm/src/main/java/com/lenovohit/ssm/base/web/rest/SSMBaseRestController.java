package com.lenovohit.ssm.base.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.UnauthenticatedException;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.Operator;
import com.lenovohit.ssm.base.model.User;

public class SSMBaseRestController  extends AuthorityRestController{
	@Autowired
	private GenericManagerImpl<Machine,String> machineManager;
	protected  User getCurrentUser(){
		AuthPrincipal user = this.getCurrentPrincipal();
		if(null == user){
			throw new UnauthenticatedException("当前无登录用户");
		}
		if(!(user instanceof User)){
			User hcpUser = new User();
			hcpUser.setId(user.getId());
			hcpUser.setName(user.getName());
			return hcpUser;
		}
		return (User)user;
	}
	protected Machine getCurrentMachine(){
		Machine machine = (Machine)this.getSession().getAttribute(SSMConstants.SSM_MACHINE_KEY);
		if(machine != null )return machine;
		
		HttpServletRequest request = this.getRequest();
		String mac = request.getHeader("mac");
		System.out.println("request mac "+mac);
		if(StringUtils.isEmpty(mac) ){
			throw new UnauthenticatedException("非法请求，无mac地址信息");
		}
		List<Machine> machines = this.machineManager.find("from Machine where mac = ? ", mac);
		if(machines.isEmpty()){
			throw new UnauthenticatedException("未注册的自助机，请联系管理人员");
		}
		if(machines.size() > 1 ){
			throw new UnauthenticatedException("重复注册的自助机，请联系管理人员");
		}
		this.getSession().setAttribute(SSMConstants.SSM_MACHINE_KEY,machines.get(0)); 
		
		machine = (Machine)this.getSession().getAttribute(SSMConstants.SSM_MACHINE_KEY);
		if(machine != null )return machine;
		else {
			throw new UnauthenticatedException("找不到当前自助机");
		}
	}
	protected Operator getCurrentOperator(){
		Operator operator = (Operator)this.getSession().getAttribute(SSMConstants.SSM_OPERATOR_KEY);
		if(operator != null )return operator;
		else {
			throw new UnauthenticatedException("找不到操作员");
		}
	}
	/** 
	 * 返回Mac地址 
	 * @param 
	 * @return ip String 
	 * @throws Exception 
	 */  
	public String getMacAddr() throws Exception {  
		return this.getRequest().getHeader("mac");  
	}  
	 /** 
	 * 返回IP地址 
	 * @param request HttpServletRequest 
	 * @return ip String 
	 * @throws Exception 
	 */  
	public String getIpAddr() throws Exception {  
		HttpServletRequest request = this.getRequest();
	    String ip = request.getHeader("x-forwarded-for");  
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	        ip = request.getHeader("Proxy-Client-IP");  
	    }  
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	        ip = request.getHeader("WL-Proxy-Client-IP");  
	    }  
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	        ip = request.getHeader("HTTP_CLIENT_IP");  
	    }  
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	        ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
	    }  
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	        ip = request.getRemoteAddr();  
	    }  
	    return ip;  
	}  
	
	 /** 
	 * 通过IP地址获取MAC地址 
	 * @param ip String,127.0.0.1格式 
	 * @return mac String 
	 * @throws Exception 
	 */  
	public String getMACAddress(String ip) throws Exception {  
	    String line = "";  
	    String macAddress = "";  
	    final String MAC_ADDRESS_PREFIX = "MAC Address = ";  
	    final String LOOPBACK_ADDRESS = "127.0.0.1";  
	    //如果为127.0.0.1,则获取本地MAC地址。  
	    if (LOOPBACK_ADDRESS.equals(ip)) {  
	        InetAddress inetAddress = InetAddress.getLocalHost();  
	        //貌似此方法需要JDK1.6。  
	        byte[] mac = NetworkInterface.getByInetAddress(inetAddress).getHardwareAddress();  
	        //下面代码是把mac地址拼装成String  
	        StringBuilder sb = new StringBuilder();  
	        for (int i = 0; i < mac.length; i++) {  
	            if (i != 0) {  
	                sb.append("-");  
	            }  
	            //mac[i] & 0xFF 是为了把byte转化为正整数  
	            String s = Integer.toHexString(mac[i] & 0xFF);  
	            sb.append(s.length() == 1 ? 0 + s : s);  
	        }  
	        //把字符串所有小写字母改为大写成为正规的mac地址并返回  
	        macAddress = sb.toString().trim().toUpperCase();  
	        return macAddress;  
	    }  
	    //获取非本地IP的MAC地址  
	    try {  
	        Process p = Runtime.getRuntime().exec("nbtstat -A " + ip);  
	        InputStreamReader isr = new InputStreamReader(p.getInputStream());  
	        BufferedReader br = new BufferedReader(isr);  
	        while ((line = br.readLine()) != null) {  
	            if (line != null) {  
	                int index = line.indexOf(MAC_ADDRESS_PREFIX);  
	                if (index != -1) {  
	                    macAddress = line.substring(index + MAC_ADDRESS_PREFIX.length()).trim().toUpperCase();  
	                }  
	            }  
	        }  
	        br.close();  
	    } catch (IOException e) {  
	        e.printStackTrace(System.out);  
	    }  
	    return macAddress;  
	} 
}
