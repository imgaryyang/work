package com.lenovohit.ssm.service;

import javax.xml.namespace.QName;

import org.apache.cxf.endpoint.Client;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;

public class DynamicCallTest {

    public static void main(String[] args) {
        JaxWsDynamicClientFactory dcf = JaxWsDynamicClientFactory.newInstance();
        // url为调用webService的wsdl地址
        Client client = dcf.createClient("http://192.170.211.214:8080/webws/HisWebService?wsdl");
        // namespace是命名空间，methodName是方法名
        QName minus = new QName("http://service.ssm.lenovohit.com/", "minus");
        QName divide = new QName("http://service.ssm.lenovohit.com/", "divide");
        QName multiply = new QName("http://service.ssm.lenovohit.com/", "multiply");
        QName plus = new QName("http://service.ssm.lenovohit.com/", "plus");
        
        float x = 100;
        float y = 100;
        // paramvalue为参数值
        Object[] object1;
        Object[] object2;
        Object[] object3;
        Object[] object4;
        try {
            object1 = client.invoke(minus, x, y);
            object2 = client.invoke(divide, x, y);
            object3 = client.invoke(multiply, x, y);
            object4 = client.invoke(plus, x, y);
            System.out.println(object1[0].toString());
            System.out.println(object2[0].toString());
            System.out.println(object3[0].toString());
            System.out.println(object4[0].toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
