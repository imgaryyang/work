package com.lenovohit.hwe.mobile.zfb.mananger.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipaySystemOauthTokenRequest;
import com.alipay.api.response.AlipaySystemOauthTokenResponse;
import com.lenovohit.hwe.mobile.zfb.configration.ZfbMpProperties;
import com.lenovohit.hwe.mobile.zfb.mananger.ZfbBaseManger;
import com.lenovohit.hwe.mobile.zfb.model.ZfbToken;


@Component("zfbBaseManger")
@EnableConfigurationProperties(ZfbMpProperties.class)
public class ZfbBaseMangerImpl implements ZfbBaseManger {
	@Autowired
	private ZfbMpProperties properties;

	@Override
	public ZfbToken getToken(String auth_code) {
		ZfbToken token = new ZfbToken();
		try {
			AlipayClient client = new DefaultAlipayClient(properties.getOpen_api_domain(), properties.getAppid(),
					properties.getPrivate_key(), "json", "utf-8", properties.getAlipay_public_key(), properties.getSign_type());
			AlipaySystemOauthTokenRequest req = new AlipaySystemOauthTokenRequest();
			req.setCode(auth_code);
			req.setGrantType("authorization_code");
			AlipaySystemOauthTokenResponse response = client.execute(req);
			// 注意这里请用getUserID的方法获得，AlipaySystemOauthTokenResponse
			// 还有个方法getAlipayUserId获得到的就是32位的user_id
			token.setUserId(response.getUserId());	
			token.setAccess_token(response.getAccessToken());
			token.setExpires_in(response.getExpiresIn());
			token.setRefresh_token(response.getRefreshToken());
			token.setErrcode(response.getSubCode());
			token.setErrmsg(response.getSubMsg());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return token;
	}
	public static void main(String args[]){
		AlipayClient client = new DefaultAlipayClient(
				"https://openapi.alipay.com/gateway.do", 
				"2017070707676458",
				"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV18O2pCaWtlX+5Km+EYl/NoDxFyBcwRsntvgsrzcapgCuSjU78dVdaQO6xyblcH61xIRnHhpLUuiiJ47hqKtPdSVz0eZqSXUktzsKPS9dIrShkGlt9JT0C8APOHy8lYD/ikV2lvruisQoyBOHYMKz6/i5yl0zUzmQJ5Af7mOz9DElOzIUvMdiQe/f2uwKC93KNBQjBEFv0JL1I3Dp7fe8LuDfU/jGcQ6ZIYD1cHhBe+3N1Thmch8fBFtKGm6F15MprgzYDiCHmEb372icLrdWDnQq/etsNe/V3ezIh8cUvSL+yZluSd511UFtanYte0rUtucu8AkqCPLmRMYhqsM/AgMBAAECggEAP2UEwW3bgaHs6iU2B1sGEBMwJFADehqc8YWAo+8RYi3fVd3BffYHrjhywn/lXeblROO6nKHov/t4vrn7wk8JA1ntmX2xfUBM1lbLHL7cHgxD3aLqaAG1Tzb1b7sXUvXxmKuYTd78lRWSfip/0KPIXDS2i2wpWECatvl2CXxjJEu+6o9XWg6ArqA+LkyhVaRm4z4ywsd6eE4FGMFzrMH80ydKAHyqUTe2qs9ojpPSOVkBbVbnlNwCizhHtwuI+dcF9aKbV5IJIfR20hZ/WDypPG3udkRqob84bTVoowoB/bGWFCTUuwzHRpRtBNNzImza99UUCNiPlt1Qol80sBPviQKBgQD033QuFrGsX8uKtfyP3ZVkl4o97jpVpT1271jIgwiREIOPWoEZZR76Xg6qY04dU59f9BiHyF9F9HyFjAt0HP2L+45wIZqoKkX6ANMjIjdPF5jmDEoDeWeb1I8tdxsDUwsL17i9yTmSXgCcKayRXqKfrWv3/REvj906I/7z32onbQKBgQCcptl5EiBQ2sViXGk+j7M/olpOAMS9NqQVw8o6qHPgoFlBU5HDnjOx1yLfTiYm2Ez3aoPHeJUqqaHMYvI3saclwzqu4/5MaCojw1kVmODIQ9vf+g7/oRirb75bFPGNOIR5D37CEiB/eILIBinTlKIW4rXhSBRN6gIkNsitqDSN2wKBgQDXiNvFOXp4A/WviVHd+6bkXLJ0ony8J+67Ah9+lj9zGDsEciASDzy+GQ4FkdUO4Sz2E2+IDKk3dOQp1EO8l0vg67HLJvjvLg5b6F/vm81dE6MkUgrPlgvJUMYZua2QNocRjHZyrmy7VXxp+BCJ/+dabxYKuLhoydNquoZNeAgC3QKBgDac9LSA3UNTAf2IuihVcOh+cX1AR1av9gSgfaB1mfB19qgPuoG4Zc1ac43mcOaaAjs/pzGjmF2HRiE7XbaM+PjxV0QhuEZrCkXtlOEyqysmfUFYrGHyh+c8zeBzLMNPMOADxu1h5HKMUQvrGinpZ5kS8NXZizqemqCFePER80CBAoGAV947DWgfCeUQurwF9qjoFQ0zACivJrwgyV5h6Euq/WU5vfdsedcSriqQfbrDs60YY2Hi4Zqa+B6Pcmt/GMbj0vINNvF8lkz+Va8XeW2Jpyrt6vohkC06kovZcY0gaL2BeYLCGQ+m1UaYRS1hsgP7xRAa7URilFUQj2iwLg25br0=", 
				"json", "utf-8", 
				"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmjzPQkMLtLw+CA2GIKE6t1umOdgDhOPdc2sCuG8E7nPC4CaOb0x04xXxOyFiqMXV8PSlES7BGpxYQBZnEigS95QKcCl06fa/SC6+3tS4PeQ3cWDnDhcJBZQTefpdOk/0Je2gbjfoyza3hzq/jtfR3aotiRuM6q3heLEY4HFyf9nZlix0w3+o4mz6UpkIiywIAfvheIDEmWH5PcidUYKzmR9ac5BsxaLOxTceMiiEoFMe/70Jc5iyu1cp7F19APZnPQzZkjWhNPmtKS5jun4QOj4oBfOTXcZ7x47UGqassz49ndweor/gT6XhcbO0LDJYNnlBPayHvwqtXqvoniO1ewIDAQAB", 
				"RSA2");
		AlipaySystemOauthTokenRequest req = new AlipaySystemOauthTokenRequest();
		req.setCode("85cf59d9599f4f8d8d544d248a8fUX94");
		req.setGrantType("authorization_code");
		try {
			AlipaySystemOauthTokenResponse response = client.execute(req);
			System.out.println("response.getUserId()" +  response.getUserId());
		} catch (AlipayApiException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// 注意这里请用getUserID的方法获得，AlipaySystemOauthTokenResponse
		// 还有个方法getAlipayUserId获得到的就是32位的user_id
	}
}
