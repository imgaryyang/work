const openLog = true;
function speak(audioKey){
	var audioDom = document.getElementById("audio_"+audioKey);
	if(audioDom && audioDom.play)audioDom.play();
}
function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms))
}
//function loggerFactory(module){
//	function logger(msg){
//		if(openLog)console.info(module+"."+msg);
//	}
//	return logger;
//}
function getLogger(module){
	function log(msg){
		if(openLog)console.info(module+"."+msg);
	} 
	return {log:log};
}
const util={
	speak:speak,
	sleep:sleep,
	getLogger:getLogger
}
export default util; 