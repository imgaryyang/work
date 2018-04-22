@echo off

java -jar -Xms2048m -Xmx2048m -Xmn1024m -XX:PermSize=128m -XX:MaxPermSize=128m  ssm-server-1.0.0-SNAPSHOT-exec.jar

@pause