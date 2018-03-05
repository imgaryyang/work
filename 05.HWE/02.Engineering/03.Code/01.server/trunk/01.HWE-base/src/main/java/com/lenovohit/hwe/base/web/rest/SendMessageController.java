package com.lenovohit.hwe.base.web.rest;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.utils.jpush.Jdpush;
import com.lenovohit.hwe.base.utils.jpush.JpushClientUtil;

@RestController
@RequestMapping("/hwe/app/message")
public class SendMessageController extends BaseController {
	private static final String appKey ="e198d7fd1d7f4b209ccd35f7";  
    private static final String masterSecret = "7d8f464f9732fb997e6c1f5c";
    /*@Autowired
	private GenericManager<ConsultReply, String> consultReplyManager;
    
    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    public Result get(@PathVariable("id") String id) {
    	ConsultReply entity = null;
        if (StringUtils.isNotBlank(id)){
            entity = consultReplyManager.get(id);
        }
        if (entity == null){
            entity = new ConsultReply();
        }
        return ResultUtils.renderSuccessResult(entity);
    }
    
    @RequiresPermissions("sys:sysSendMessage:view")
    @RequestMapping(value = {"list", ""})
    public String list(SysSendMessage sysSendMessage, HttpServletRequest request, HttpServletResponse response, Model model) {
        Page<SysSendMessage> page = sysSendMessageService.findPage(new Page<SysSendMessage>(request, response), sysSendMessage); 
        model.addAttribute("page", page);
        return "modules/sys/sysSendMessageList";
    }
    
    @ResponseBody
    @RequestMapping(value ="interface/api_list")
    public String listt(SysSendMessage sysSendMessage, HttpServletRequest request, HttpServletResponse response, Model model) throws JsonProcessingException {
        Page<SysSendMessage> page = sysSendMessageService.findPage(new Page<SysSendMessage>(request, response), sysSendMessage); 
        model.addAttribute("page", page);
        Result r = new Result();
        r.setCode("1");
        r.setData(page);
        r.setMessage("这是所有的消息");
        ObjectMapper objectMapper = new ObjectMapper();
        String text = objectMapper.writeValueAsString(r);
        return text;
    }
    

    @RequiresPermissions("sys:sysSendMessage:view")
    @RequestMapping(value = "form")
    public String form(SysSendMessage sysSendMessage, Model model) {
        model.addAttribute("sysSendMessage", sysSendMessage);
        return "modules/sys/sysSendMessageForm";
    }*/

    @RequestMapping(value = "save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    public Result save(@RequestBody String data) {
        //String str = sysSendMessage.getMessage();
         Jdpush.testSendPush(appKey,masterSecret);
         JpushClientUtil.sendToAllAndroid("群发消息", "尊敬的用户", "谢谢关注MSH客户端", "goodbye!");
        /*if (!beanValidator(model, sysSendMessage)){
            return form(sysSendMessage, model);
        }*/
        //sysSendMessageService.save(sysSendMessage);
        return ResultUtils.renderSuccessResult();
    }
    
    
   /* @RequiresPermissions("sys:sysSendMessage:edit")
    @RequestMapping(value = "delete")
    public String delete(SysSendMessage sysSendMessage, RedirectAttributes redirectAttributes) {
        sysSendMessageService.delete(sysSendMessage);
        addMessage(redirectAttributes, "删除消息成功");
        return "redirect:"+Global.getAdminPath()+"/sys/sysSendMessage/?repage";
    }
    
    @ResponseBody
    @RequestMapping(value = "interface/api_delete",method=RequestMethod.POST)    
    public String delete(SysSendMessage sysSendMessage) throws JsonProcessingException {
        sysSendMessageService.delete(sysSendMessage);
        Result r = new Result();
        r.setCode("1");
        r.setMessage("删除消息成功");
        ObjectMapper objectMapper = new ObjectMapper();
        String text = objectMapper.writeValueAsString(r);
        return text;
    }*/

}
