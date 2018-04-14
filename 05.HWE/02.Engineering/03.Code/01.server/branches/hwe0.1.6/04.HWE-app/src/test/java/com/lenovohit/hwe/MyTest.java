package com.lenovohit.hwe;


import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.hwe.org.model.Account;

public class MyTest {
	public static void main(String[] args) {
		Account account = new Account();
		account.setUsername("17778001473");
		account.setPassword("12345678");
		account = (Account) AuthUtils.encryptAccount(account);
		System.out.println("username：" + account.getUsername() + "，password：" + account.getPassword());
	}
}
