package com.lenovohit.hwe;


import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;

import org.apache.http.HttpResponse;
import org.apache.http.client.utils.URLEncodedUtils;

import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.EncodeUtils;
import com.lenovohit.hwe.org.model.Account;

public class MyTest {
	public static void main(String[] args) throws UnsupportedEncodingException {
//		Account account = new Account();
//		account.setUsername("15346172906");
//		account.setPassword("12345678");
//		account = (Account) AuthUtils.encryptAccount(account);
//		System.out.println("username：" + account.getUsername() + "，password：" + account.getPassword());
		String url = "http://tjdev.lenovohit.com/api/hwe/weixin/common/test?route=route";		url = URLEncoder.encode(url, "UTF-8");
		System.out.println(url);
		String string = "http%3A%2F%2Ftjdev.lenovohit.com%2Fapi%2Fhwe%2Fweixin%2Fcommon%2Fredirect&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
		url = URLDecoder.decode(string, "UTF-8");
		System.out.println(url);
	}
}
