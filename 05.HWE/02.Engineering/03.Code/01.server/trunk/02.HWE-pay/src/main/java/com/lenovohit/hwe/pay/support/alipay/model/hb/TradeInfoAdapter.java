package com.lenovohit.hwe.pay.support.alipay.model.hb;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.support.alipay.utils.Utils;

/**
 * Created by liuyangkly on 15/9/28.
 */
public class TradeInfoAdapter implements JsonSerializer<List<TradeInfo>> {
    @Override
    public JsonElement serialize(List<TradeInfo> tradeInfoList, Type type, JsonSerializationContext jsonSerializationContext) {
        if (Utils.isListEmpty(tradeInfoList)) {
            return null;
        }

        TradeInfo tradeInfo = tradeInfoList.get(0);
        if (tradeInfo instanceof PosTradeInfo) {
            return new JsonPrimitive(StringUtils.join(tradeInfoList, ""));
        }

        return jsonSerializationContext.serialize(tradeInfoList);
    }
}