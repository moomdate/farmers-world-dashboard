const WOOD_PRICE_ROW = 2;
const FOOD_PRICE_ROW = 3;
const GOLD_PRICE_ROW = 4;
const FWG_PRICE_COL = 7;

const GATEIO_WAX_PRICE_ROW = 14;
const GATEIO_BAHT_ROW = 15;
const GATEIO_TIMESTAMP = 16;
const GATEIO_COL = 4;

const getToolsConfig_ = () => {
    var data = {
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "toolconfs",
        lower_bound: "",
        upper_bound: "",
        index_position: 1,
        key_type: "",
        limit: 100,
        reverse: false,
        show_payer: false,
    };
    var payload = JSON.stringify(data);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    Logger.log("request tools config working...");
    return Array.from(body.rows);
};
const tools_ = toolsCaching_();

function toolsCaching_() {
    const cache = CacheService.getScriptCache();
    let jsonText = cache.get("tools");
    if (jsonText === null) {
        const tools = getToolsConfig_();
        jsonText = tools;
        cache.put("tools", JSON.stringify(tools));
    } else {
        jsonText = JSON.parse(jsonText);
    }
    return jsonText;
}

function status() {
    const sheet = getSheetStatus_();
    sheet.getRange(3, 1).setValue("loading...");
    loadFarmersWorldData1();
    // loadAxe();
    loadAacorMarket();
    loadWaxpPrice();
    loadAccountBalance();
    loadMindAbleTime();
    loadTools();
    getTokenBalance();
    sheet.getRange(3, 1).setValue([null]);
}

function loadAacorMarket() {
    const url = "https://wax.alcor.exchange/api/markets";
    const response = UrlFetchApp.fetch(url);
    const body = JSON.parse(response);
    const dataArr = Array.from(body);
    const [woodDetail] = dataArr.filter(
        (p) => p.quote_token.symbol.name === "FWW"
    );
    const [foodDetail] = dataArr.filter(
        (p) => p.quote_token.symbol.name === "FWF"
    );
    const [goodDetail] = dataArr.filter(
        (p) => p.quote_token.symbol.name === "FWG"
    );
    const sheet = getSheetStatus_();
    sheet.getRange(2, 7).setValue([(+woodDetail.last_price).toFixed(3)]);
    sheet.getRange(3, 7).setValue([(+foodDetail.last_price).toFixed(3)]);
    sheet.getRange(4, 7).setValue([(+goodDetail.last_price).toFixed(3)]);
    sheet.getRange(5, 7).setValue([getTimeStamp_()]);

    // sheet.getRange(3,2).setValue([price]);
}

function loadWaxpPrice() {
    const url =
        "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=WAXP_USDT";
    const response = UrlFetchApp.fetch(url);
    const [body] = JSON.parse(response);
    const sheet = getSheetStatus_();
    sheet.getRange(14, 4).setValue([body.last]);
    sheet.getRange(16, 4).setValue([getTimeStamp_()]);
}

function getAccount_() {
    const sheet = getSheetStatus_();
    return sheet.getRange(1, 2).getValue();
}

function getMiningLogSheet_() {
    const sheetName = "mining-log";
    return SpreadsheetApp.getActive().getSheetByName(sheetName);
}

function getSheetStatus_() {
    const sheetName = "status";
    return SpreadsheetApp.getActive().getSheetByName(sheetName);
}

function getSheetDailyLog_(sheetName) {
    return SpreadsheetApp.getActive().getSheetByName(sheetName);
}

function getTimeStamp_() {
    var timeZone = Session.getScriptTimeZone();
    return Utilities.formatDate(new Date(), timeZone, "HH:mm:ss yyyy/MM/dd");
}

function getLastRowSpecial_(range) {
    var rowNum = 0;
    var blank = false;
    for (var row = 0; row < range.length; row++) {
        if (range[row][0] === "" && !blank) {
            rowNum = row;
            blank = true;
        } else if (range[row][0] !== "") {
            blank = false;
        }
    }
    return rowNum;
}

function toHours_(time) {
    return time / 3600;
}

function loadFarmersWorldData1() {
    var data = {
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "accounts",
        lower_bound: getAccount_(),
        upper_bound: getAccount_(),
        index_position: 1,
        key_type: "i64",
        limit: "100",
        reverse: false,
        show_payer: false,
    };
    var payload = JSON.stringify(data);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    const rowData = body.rows[0];
    const balance = Array.from(rowData.balances);
    const goldStr = balance.find((a) => a.indexOf("GOLD") > 1);
    const gold = goldStr ? goldStr.split(" ")[0] : 0;
    const woodStr = balance.find((a) => a.indexOf("WOOD") > 1);
    const wood = woodStr != null ? woodStr.split(" ")[0] : 0;
    const foodStr = balance.find((a) => a.indexOf("FOOD") > 1);
    const food = foodStr != null ? foodStr.split(" ")[0] : 0;

    var sheet = getSheetStatus_();

    sheet.getRange(10, 4).setValue([getTimeStamp_()]);
    sheet.getRange(2, 4).setValue([wood]);
    sheet.getRange(3, 4).setValue([gold]);
    sheet.getRange(4, 4).setValue([food]);
    sheet.getRange(5, 4).setValue([rowData.energy]);
    sheet.getRange(6, 4).setValue([rowData.max_energy - rowData.energy]);
    sheet.getRange(7, 4).setValue([getGameFree_()]);
}

function loadAccountBalance() {
    var data2 = { account_name: getAccount_() };
    var payload2 = JSON.stringify(data2);
    var options2 = {
        method: "POST",
        contentType: "application/json",
        payload: payload2,
    };
    var url2 = "https://chain.wax.io/v1/chain/get_account";
    var response2 = UrlFetchApp.fetch(url2, options2);
    var body2 = JSON.parse(response2);
    // const wax = body2.core_liquid_balance.split(" ")[0];
    const sheet = getSheetStatus_();
    // sheet.getRange(9, 4).setValue([wax]);

    // resource
    sheet.getRange(20, 4).setValue([Math.round(body2.ram_usage / 1024)]);
    sheet
        .getRange(21, 4)
        .setValue([Math.round((body2.ram_quota - body2.ram_usage) / 1024)]);
    sheet.getRange(22, 4).setValue([Math.round(body2.cpu_limit.used / 1024)]);
    sheet
        .getRange(23, 4)
        .setValue([Math.round(body2.cpu_limit.available / 1024)]);
    sheet.getRange(24, 4).setValue([Math.round(body2.net_limit.used / 1024)]);
    sheet
        .getRange(25, 4)
        .setValue([Math.round(body2.net_limit.available / 1024)]);
}

function loadMindAbleTime() {
    var sheet = getSheetStatus_();
    const vol = sheet.getRange(11, 7).getValue();
    var timeZone = Session.getScriptTimeZone();
    const now = new Date(Date.now() + 1000 * 60 * 60 * vol);

    var date = Utilities.formatDate(now, timeZone, "HH:mm:ss dd-MM-yyyy");
    sheet.getRange(12, 7).setValue(date);
    sheet.getRange(13, 7).setValue([getTimeStamp_()]);
}

function loadLogToDailyLog() {
    loadLog_("daily-log");
}

function loadLogToMiningLog() {
    loadLog_("mining-log");
}

function loadLog_(sheetName) {
    var data = {
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "accounts",
        lower_bound: getAccount_(),
        upper_bound: getAccount_(),
        index_position: 1,
        key_type: "i64",
        limit: "100",
        reverse: false,
        show_payer: false,
    };
    var payload = JSON.stringify(data);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    const rowData = body.rows[0];
    const balance = Array.from(rowData.balances);
    const goldStr = balance.find((a) => a.indexOf("GOLD") > 1);
    const gold = goldStr ? goldStr.split(" ")[0] : 0;
    const woodStr = balance.find((a) => a.indexOf("WOOD") > 1);
    const wood = woodStr != null ? woodStr.split(" ")[0] : 0;
    const foodStr = balance.find((a) => a.indexOf("FOOD") > 1);
    const food = foodStr != null ? foodStr.split(" ")[0] : 0;

    var sheet = getSheetDailyLog_(sheetName);
    var columnToCheck = sheet.getRange("A:A").getValues();
    var lastRow = getLastRowSpecial_(columnToCheck);

    sheet.getRange(lastRow + 1, 1).setValue([getTimeStamp_()]);
    sheet.getRange(lastRow + 1, 2).setValue([wood]);
    sheet.getRange(lastRow + 1, 3).setValue([gold]);
    sheet.getRange(lastRow + 1, 4).setValue([food]);
    sheet
        .getRange(lastRow + 1, 5)
        .setValue([rowData.energy + "/" + rowData.max_energy]);

    var data2 = { account_name: getAccount_() };
    var payload2 = JSON.stringify(data2);
    var options2 = {
        method: "POST",
        contentType: "application/json",
        payload: payload2,
    };
    var url2 = "https://chain.wax.io/v1/chain/get_account";
    var response2 = UrlFetchApp.fetch(url2, options2);
    var body2 = JSON.parse(response2);
    const wax = body2.core_liquid_balance.split(" ")[0];
    sheet.getRange(lastRow + 1, 6).setValue([wax]);

    const profit = Number(wood) - Number(sheet.getRange(lastRow, 2).getValue());
    sheet.getRange(lastRow + 1, 7).setValue([profit]);
}

function doRequestMyTools_() {
    var data = {
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "tools",
        lower_bound: getAccount_(),
        upper_bound: getAccount_(),
        index_position: 2,
        key_type: "i64",
        limit: "100",
        reverse: false,
        show_payer: false,
    };
    var payload = JSON.stringify(data);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    return body.rows;
}

function loadTools() {
    const rowsData = doRequestMyTools_();
    const sheet = getSheetTools_();
    const sheetStatus = getSheetStatus_();
    const COL_SIZE = 9;
    const columnToCheck = sheet.getRange("A:A").getValues();
    const START_ROW = 2;
    const lastRow = getLastRowSpecial_(columnToCheck);

    // clear row
    for (let i = START_ROW; START_ROW <= lastRow && i <= lastRow; i++) {
        for (let j = 1; j <= COL_SIZE; j++) {
            sheet.getRange(i, j).setValue(null);
        }
    }

    // set value to sheet
    for (let i = 0; i < rowsData.length; i++) {
        const rowData = rowsData[i];
        const tool = mapTools_(rowData.template_id);
        const waxPriceUsd = +sheetStatus.getRange(GATEIO_WAX_PRICE_ROW, GATEIO_COL).getValue();
        const bathRate = +sheetStatus.getRange(GATEIO_BAHT_ROW, GATEIO_COL).getValue();

        // sheet.setRowHeight(i + START_ROW, 60);
        for (let col = 1; col <= COL_SIZE; col++) {
            const position = sheet.getRange(i + START_ROW, col)
            let value;
            const INDEX_START = 1;
            switch (col) {
                // case 1:
                //   position.setFormula('=image("https://mypinata.cloud/ipfs/' + tool.img + '")');
                //   position.setHorizontalAlignment("center");
                //   break;
                case INDEX_START:
                    value = tool.template_name;
                    break;
                case INDEX_START + 1:
                    value = dateFormat_(new Date(rowData.next_availability * 1000));
                    break;
                case INDEX_START + 2:
                    value = rowData.current_durability;
                    break;
                case INDEX_START + 3:
                    value = rowData.durability - rowData.current_durability
                    break;
                case INDEX_START + 4:
                    value = calculateReward_(tool)
                    break;
                case INDEX_START + 5:
                    value = calculateReward_(tool) * waxPriceUsd * bathRate
                    break;
                case INDEX_START + 6:
                    value = (rowData.current_durability / tool.durability_consumed) * toHours_(tool.charged_time);
                    break;
                case INDEX_START + 7:
                    value = tool.energy_consumed;
                    break;
            }
            if (!position.getValue()) {
                position.setValue([value])
            }
        }
    }

    const toolsMaped = rowsData.map((t) => mapTools_(t.template_id));
    const energyPerDay = toolsMaped.map((d) => d.energy_consumed).reduce((a, b) => a + b, 0);
    const durabilityPerDay = toolsMaped.map((d) => d.durability_consumed).reduce((a, b) => a + b, 0);
    sheet.getRange(1, 11).setValue([energyPerDay * 24]);
    sheet.getRange(2, 11).setValue([durabilityPerDay * 24]);
}

function calculateReward_(tool) {
    const HOURS = 24;
    const [r] = tool.rewards;
    const reward = r.split(" ")[0];
    const rewardType = r.split(" ")[1];
    let costTypeValue = 0;
    const sheet = getSheetStatus_();

    const costGold =
        ((+tool.durability_consumed * HOURS) / 5) *
        Number(sheet.getRange(GOLD_PRICE_ROW, FWG_PRICE_COL).getValue());

    const costFood =
        ((+tool.energy_consumed * HOURS) / 5) *
        Number(sheet.getRange(FOOD_PRICE_ROW, FWG_PRICE_COL).getValue());

    switch (rewardType) {
        case "WOOD":
            costTypeValue = +sheet.getRange(WOOD_PRICE_ROW, FWG_PRICE_COL).getValue();
            break;
        case "FOOD":
            costTypeValue = +sheet.getRange(FOOD_PRICE_ROW, FWG_PRICE_COL).getValue();
            break;
        case "GOLD":
            costTypeValue = +sheet.getRange(GOLD_PRICE_ROW, FWG_PRICE_COL).getValue();
            break;
    }
    return +reward * HOURS * costTypeValue - (costGold + costFood);
}

function getTimeStamp_() {
    return dateFormat_(new Date());
}

function dateFormat_(date) {
    var timeZone = Session.getScriptTimeZone();
    return Utilities.formatDate(date, timeZone, "HH:mm:ss dd/MM/yyyy");
}

function getSheetTools_() {
    const sheetName = "tools";
    return SpreadsheetApp.getActive().getSheetByName(sheetName);
}

function mapTools_(templateId) {
    return tools_.find((t) => String(templateId).includes(String(t.template_id)));
}

function getFarmerTokenBalance_() {
    const json = buildBody_("farmerstoken", getAccount_());
    var payload = JSON.stringify(json);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    const balance = Array.from(body.rows);
    return balance.map((d) => mapSymbol_(d));
}

function getTokenBalance() {
    const list = [...getFarmerTokenBalance_(), ...getEosioTokenBalance_()];
    const sheet = getSheetStatus_();

    list.forEach((token, index) => {
        sheet.getRange(index + 2, 9).setValue([token.balance]);
        sheet.getRange(index + 2, 10).setValue([token.symbol]);
    });
    sheet
        .getRange(list.length + 2, 9)
        .setValue(["LAST UPDATED"])
        .setFontColor("yellow");
    sheet.getRange(list.length + 2, 10).setValue([getTimeStamp_()]);
}

function getEosioTokenBalance_() {
    const json = buildBody_("eosio.token", getAccount_());
    var payload = JSON.stringify(json);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    const balance = Array.from(body.rows);
    return balance.map((d) => mapSymbol_(d));
}

function getGameFree_() {
    const json = {
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "config",
        limit: "1",
    };
    var payload = JSON.stringify(json);
    var options = {
        method: "POST",
        contentType: "application/json",
        payload: payload,
    };
    var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
    var response = UrlFetchApp.fetch(url, options);
    var body = JSON.parse(response);
    const balance = Array.from(body.rows);
    return +balance[0].fee;
}

function buildBody_(code, scope) {
    return {
        json: true,
        code: code,
        table: "accounts",
        scope: scope,
        limit: 1000,
    };
}

function mapSymbol_(rowData) {
    const bl = String(rowData.balance).split(" ");
    return {
        balance: +bl[0],
        symbol: bl[1],
    };
}
