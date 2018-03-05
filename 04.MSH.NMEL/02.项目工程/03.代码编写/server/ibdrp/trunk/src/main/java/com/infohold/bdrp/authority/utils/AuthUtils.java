package com.infohold.bdrp.authority.utils;

import java.io.UnsupportedEncodingException;

import org.apache.shiro.crypto.hash.Hash;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.core.utils.Encodes;

public class AuthUtils {
	public static AuthUser encryptUser(AuthUser user) {
		user.setPassword(
				encryptPassword(
						user.getPassword(),
						getSalt(user)
				)
		);
		return user;
	}

	public static String getSalt(AuthUser user) {
		String id = user.getUsername()+user.getPassword();
		int length = id.length();
		if(id.length()>8){
			id =  id.substring(0,4)+id.substring(length-4,length);
		}
		try {
			return Encodes.encodeHex(id.getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			return Encodes.encodeHex(id.getBytes());
		}
	}

	public static String encryptPassword(String password, String salt) {
		byte[] saltByte = Encodes.decodeHex(salt);
		Hash hash = new SimpleHash(Encodes.HASH_ALGORITHM, password,
				ByteSource.Util.bytes(saltByte), Encodes.HASH_INTERATIONS);
		return hash.toHex();
	}
	/*public static void main(String args[]){
		String id = "123456789";
		System.out.println(id.substring(0,4)+id.substring(id.length()-4,id.length()));
	}*/
}
