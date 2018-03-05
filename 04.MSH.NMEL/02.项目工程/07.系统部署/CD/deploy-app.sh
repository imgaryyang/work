#!/bin/bash

# COMMAND LINE VARIABLES
# THIRD ARGUMENT project name, deploy folder name 
# Ex: el | elh | els
projectName=$1

# app jar version
# Ex 0.9.1-SNAPSHOT
appVersion=$2

# deploy port SECOND ARGUMENT
# Ex: 8090 | 8091 | 8092 
serverPort=$3

# FOURTH ARGUMENT external config file name
# Ex: application-localhost.yml
#configFile=$4
configFile=application-$projectName.properties

appJarName=$projectName-$appVersion.jar

#### CONFIGURABLE VARIABLES ######
#destination absolute path. It must be pre created or you can
# improve this script to create if not exists
destAbsPath=/opt/jenkins-workspace/$projectName
configFolder=resources
##############################################################

#####
##### DONT CHANGE HERE ##############
#jar file
# $WORKSPACE is a jenkins var
sourFile=$WORKSPACE/target/$appJarName
destFile=$destAbsPath/$appJarName

#config files folder
sourConfigFolder=$WORKSPACE/$configFolder
destConfigFolder=$destAbsPath/$configFolder

properties=--spring.config.location=$destAbsPath/$configFolder/$configFile

#CONSTANTS
logFile=initServer-$projectName-$serverPort.log
dstLogFile=$destAbsPath/logs/$logFile
#whatToFind="Started Application in"
whatToFind="Started "
msgLogFileCreated="$logFile created"
msgBuffer="Buffering: "
msgAppStarted="Application Started... exiting buffer!"

### FUNCTIONS
##############
function stopServer(){
    echo " "
    echo "Stoping process on port: $serverPort"
    fuser -n tcp -k $serverPort > redirection &
    echo " "
}

function deleteFiles(){
    echo "Deleting $destFile"
    rm -rf $destFile

#    echo "Deleting $destConfigFolder"
#    rm -rf $destConfigFolder

#    echo "Deleting $dstLogFile"
#    rm -rf $dstLogFile

    echo " "
}

function copyFiles(){
    echo "Copying files from $sourFile"
    cp $sourFile $destFile

#    echo "Copying files from $sourConfigFolder"
#    cp -r $sourConfigFolder $destConfigFolder

    echo " "
}

function run(){

   #echo "java -jar $destFile --server.port=$serverPort $properties" | at now + 1 minutes

   nohup nice java -jar $destFile --server.port=$serverPort $properties > $dstLogFile 2>&1 &

   echo "COMMAND: nohup nice java -jar $destFile --server.port=$serverPort $properties $> $dstLogFile 2>&1 &"

    echo " "
}
function changeFilePermission(){

    echo "Changing File Permission: chmod 777 $destFile"

    chmod 777 $destFile

    echo " "
}   

function watch(){

    tail -f $dstLogFile |

        while IFS= read line
            do
                echo "$msgBuffer" "$line"

                if [[ "$line" == *"$whatToFind"* ]]; then
                    echo $msgAppStarted
                    pkill  tail
                fi
        done
}

### FUNCTIONS CALLS
#####################
# Use Example of this file. Args: enviroment | port | project name | external resourcce
# BUILD_ID=dontKillMe /path/to/this/file/api-deploy.sh dev 8082 spring-boot application-localhost.yml

# 1 - stop server on port ...
stopServer

# 2 - delete destinations folder content
deleteFiles

# 3 - copy files to deploy dir
copyFiles

changeFilePermission
# 4 - start server
run

# 5 - watch loading messages until  ($whatToFind) message is found
watch
