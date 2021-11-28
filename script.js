const WOOD_PRICE_ROW = 2;
const FOOD_PRICE_ROW = 3;
const GOLD_PRICE_ROW = 4;
const FWG_PRICE_COL = 7;

const GATEIO_WAX_PRICE_ROW = 14;
const GATEIO_BAHT_ROW = 15;
const GATEIO_TIMESTAMP = 16;
const GATEIO_COL = 4;

const tools_ = [
    {
      template_name: "Axe",
      img: "QmUCg2d1Ww2734tiCwEPA5s3WL1Pr9jMTNsoPx3A9vKsJe",
      schema_name: "tools",
      type: "Wood",
      rarity: "Common",
      level: 1,
      template_id: 203881,
      energy_consumed: 10,
      durability_consumed: 5,
      mints: ["400.0000 GOLD", "2400.0000 WOOD"],
      rewards: ["5.0000 WOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Saw",
      img: "QmPiXkBCNYgKw1J4Yxnj9Z6RUPfmxER5ePPc8YCkdykinN",
      schema_name: "tools",
      type: "Wood",
      rarity: "Uncommon",
      level: 2,
      template_id: 203883,
      energy_consumed: 30,
      durability_consumed: 15,
      mints: ["1200.0000 GOLD", "7200.0000 WOOD"],
      rewards: ["17.0000 WOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Chainsaw",
      img: "QmZFGkTKNGb52N7B8JDKC8WpRmAXoGRodb3fuDn8rtM8Eh",
      schema_name: "tools",
      type: "Wood",
      rarity: "Rare",
      level: 3,
      template_id: 203886,
      energy_consumed: 60,
      durability_consumed: 45,
      mints: ["3600.0000 GOLD", "21600.0000 WOOD"],
      rewards: ["54.0000 WOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Fishing Rod",
      img: "QmVy4xphMjDCYGmzQR6FhU8E6gHEaMpKbzf39wKFyqNBVV",
      schema_name: "tools",
      type: "Food",
      rarity: "Common",
      level: 1,
      template_id: 203887,
      energy_consumed: 0,
      durability_consumed: 5,
      mints: ["200.0000 GOLD", "1200.0000 WOOD"],
      rewards: ["5.0000 FOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Fishing Net",
      img: "QmPRWao5gLUmTktJZHdEg7A4dLYA9TzBjSGDvLNk3aCeh4",
      schema_name: "tools",
      type: "Food",
      rarity: "Uncommon",
      level: 2,
      template_id: 203888,
      energy_consumed: 0,
      durability_consumed: 20,
      mints: ["800.0000 GOLD", "4800.0000 WOOD"],
      rewards: ["20.0000 FOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Fishing Boat",
      img: "QmSWBPJ5edSngtFAZMBw26EjexWMMYTHcHghWfSp9aWMdq",
      schema_name: "tools",
      type: "Food",
      rarity: "Rare",
      level: 3,
      template_id: 203889,
      energy_consumed: 0,
      durability_consumed: 32,
      mints: ["3200.0000 GOLD", "19200.0000 WOOD"],
      rewards: ["80.0000 FOOD"],
      charged_time: 3600,
    },
    {
      template_name: "Mining Excavator",
      img: "QmfM1hip56o1sUKfQFEhVVMjMcwpnC61dNwEtPrV67tagy",
      schema_name: "tools",
      type: "Gold",
      rarity: "Common",
      level: 1,
      template_id: 203891,
      energy_consumed: 133,
      durability_consumed: 5,
      mints: ["4000.0000 GOLD", "24000.0000 WOOD"],
      rewards: ["100.0000 GOLD"],
      charged_time: 7200,
    },
    {
      template_name: "Stone Axe",
      img: "QmPUoWpAkUVAhWo2EFwqaGxEczBptftCv5cdJXsFvfGr6T",
      schema_name: "tools",
      type: "Wood",
      rarity: "Common",
      level: 1,
      template_id: 260763,
      energy_consumed: 5,
      durability_consumed: 3,
      mints: ["800.0000 WOOD", "135.0000 GOLD"],
      rewards: ["1.7000 WOOD"],
      charged_time: 3600,
    },
  ];

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

// function loadAxe() {
//   var data = {
//     json: true,
//     code: "farmersworld",
//     scope: "farmersworld",
//     table: "tools",
//     lower_bound: getAccount(),
//     upper_bound: getAccount(),
//     index_position: 2,
//     key_type: "i64",
//     limit: "100",
//     reverse: false,
//     show_payer: false,
//   };
//   var payload = JSON.stringify(data);
//   var options = {
//     method: "POST",
//     contentType: "application/json",
//     payload: payload,
//   };
//   var url = "https://api.wax.alohaeos.com/v1/chain/get_table_rows";
//   var response = UrlFetchApp.fetch(url, options);
//   var body = JSON.parse(response);
//   const rowData = body.rows[0];
//   var sheet = getSheetStatus();
//   sheet.getRange(7, 4).setValue([rowData.current_durability]);
//   sheet
//     .getRange(8, 4)
//     .setValue([rowData.durability - rowData.current_durability]);
// }
function toHours_(time){
  return time/3600;
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

function loadTools() {
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
  const rowsData = body.rows;

  const sheet = getSheetTools_();
  const sheetStatus = getSheetStatus_();

  var columnToCheck = sheet.getRange("A:A").getValues();
  const START_ROW = 2;
  var lastRow = getLastRowSpecial_(columnToCheck);
  for (let i = START_ROW; START_ROW <= lastRow && i <= lastRow; i++) {
    for(let j = 1; j <= 8; j++){
     sheet.getRange(i, j).setValue(null);
     }
  }

  for (let i = 0; i < rowsData.length; i++) {
    const rowData = rowsData[i];
    // const tools = Array.from(body.rows);
    const tool = mapTools_(rowData.template_id);
    const waxPriceUsd = +sheetStatus.getRange(GATEIO_WAX_PRICE_ROW, GATEIO_COL).getValue();
    const bathRate = +sheetStatus.getRange(GATEIO_BAHT_ROW, GATEIO_COL).getValue();

    // Logger.log(`${waxPriceUsd}, ${bathRate}`);

    sheet.getRange(i + START_ROW, 1).setValue([tool.template_name]);

    sheet
      .getRange(i + START_ROW, 2)
      .setValue([dateFormat_(new Date(rowData.next_availability * 1000))]);

    sheet.getRange(i + START_ROW, 3).setValue([rowData.current_durability]);

    sheet
      .getRange(i + START_ROW, 4)
      .setValue([rowData.durability - rowData.current_durability]);

    sheet.getRange(i + START_ROW, 5).setValue([calCulateReward_(tool)]);

    sheet
      .getRange(i + START_ROW, 6)
      .setValue([calCulateReward_(tool) * waxPriceUsd * bathRate]);

    sheet
      .getRange(i + START_ROW, 7)
      .setValue([(rowData.current_durability/tool.durability_consumed) * toHours_(tool.charged_time)]);

    sheet
      .getRange(i + START_ROW, 8)
      .setValue([tool.energy_consumed]);
  }

  const toolsMaped = rowsData.map(t=>mapTools_(t.template_id))
  const energyPerDay = toolsMaped.map(d=>d.energy_consumed).reduce((a,b)=>a+b,0)
  const durabilityPerDay = toolsMaped.map(d=>d.durability_consumed).reduce((a,b)=>a+b,0)
  sheet.getRange(1,11).setValue([energyPerDay*24])
  sheet.getRange(2,11).setValue([durabilityPerDay*24])
  // const sheet = getSheetTools();
}

function calCulateReward_(tool) {
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

function getFarmerTokenBalance_(){
  const json = buildBody_('farmerstoken', getAccount_());
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
  return balance.map(d=>mapSymbol_(d));
}

function getTokenBalance(){
  const list = [...getFarmerTokenBalance_(), ...getEosioTokenBalance_()];
  const sheet = getSheetStatus_();

  list.forEach((token,index)=>{
    sheet.getRange(index+2, 9).setValue([token.balance]);
    sheet.getRange(index+2, 10).setValue([token.symbol]);
  })
  sheet.getRange(list.length+2, 9).setValue(["LAST UPDATED"]).setFontColor('yellow');
  sheet.getRange(list.length+2, 10).setValue([getTimeStamp_()]);
}

function getEosioTokenBalance_(){
  const json = buildBody_('eosio.token', getAccount_());
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
  return balance.map(d=>mapSymbol_(d));
}

function getGameFree_(){
  const json = {"json":true,"code":"farmersworld","scope":"farmersworld","table":"config","limit":"1"}
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
  return +(balance[0].fee);
}

function buildBody_(code, scope){
  return  {
    "json":true,
    "code": code,
    "table":"accounts",
    "scope": scope,
    "limit":1000
  }
}

function mapSymbol_(rowData){
  const bl = String(rowData.balance).split(" ")
  return {
    balance: +bl[0],
    symbol: bl[1]
  }
}
