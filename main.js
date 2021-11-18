const dapp = "TalesofCryptStaking";
const endpoint = "testnet.wax.pink.gg";
const chainId =
  "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";
const tokenContract = { WAX: "eosio.token" };


var anchorAuth="owner";
main();
var loggedIn = false;
var switchtostaked=true;


async function main() {

  if(!loggedIn)
  autoLogin();
else
{

  ratespromise = GetRates();
  rates = await ratespromise;

  userpromise = GetUser(rates);
  user = await userpromise;


 assetPromise=GetAssets(rates);
  assets=await assetPromise;

  stakepromise=FilterStaked(assets);
  staked= await stakepromise;
  
  balancepromise=GetBalance();
  balance= await balancepromise;

  unstaked= FilterUnstaked(assets,staked);


  PopulateMenu(staked,unstaked,user,balance);
}
}


async function stakeall() {

  if(unstaked.length==0)
{
  ShowToast("No unstaked assets!");
return;
}
  if (loggedIn) {

    HideMessage();

    var ids=[];
    for(let i=0;i<unstaked.length;i++)
    {
      ids.push(parseInt(unstaked[i].asset_id));
    }
    try {

      const result = await wallet_transact([
        {
          account: contract,
          name: "stakeassets",
          authorization: [{ actor: wallet_userAccount, permission: anchorAuth }],
          data:{
            _user:wallet_userAccount,
            asset_ids:ids
        },
        },
      ]);
      ShowMessage(
        '<div class="complete">Success</div><div class="link"><a href="https://wax.bloks.io/transaction/' +
          result.transaction_id +
          '?tab=traces'+ ' target="_blank">View transaction</a></div>'
      );
      main();
    } catch (e) {
      ShowToast(e.message);
    }
  
  }else {

    WalletListVisible(true);}
}

async function stakeasset(assetId) {

  if (loggedIn) {

    HideMessage();

    try {

      var data1=
      {
          _user:wallet_userAccount,
          asset_ids:[assetId]
      };
      const result = await wallet_transact([
        {
          account: contract,
          name: "stakeassets",
          authorization: [{ actor: wallet_userAccount, permission: anchorAuth }],
          data:{
            _user:wallet_userAccount,
            asset_ids:[assetId]
        },
        },
      ]);
      ShowMessage(
        '<div class="complete">Success</div><div class="link"><a href="https://wax.bloks.io/transaction/' +
          result.transaction_id +
          '?tab=traces'+ ' target="_blank">View transaction</a></div>'
      );
      main();
    } catch (e) {
      ShowToast(e.message);
    }
  
  }else {
    WalletListVisible(true);}
}

async function unstakeasset(assetId) {
  if (loggedIn) {

    HideMessage();

    try {

      var data1=
      {
          _user:wallet_userAccount,
          asset_ids:[assetId]
      };
      const result = await wallet_transact([
        {
          account: contract,
          name: "removenft",
          authorization: [{ actor: wallet_userAccount, permission: anchorAuth }],
          data:data1 ,
        },
      ]);
      ShowMessage(
        '<div class="complete">Success</div><div class="link"><a href="https://wax.bloks.io/transaction/' +
          result.transaction_id +
          '?tab=traces'+ ' target="_blank">View transaction</a></div>'
      );
      main();
    } catch (e) {
      ShowToast(e.message);
    }
  
  }else {
    WalletListVisible(true);}
main();
}

async function claimbalance() {
  if (loggedIn) {

    HideMessage();

    try {

      var data1=
      {
          _user:wallet_userAccount,
      };
      const result = await wallet_transact([
        {
          account: contract,
          name: "claim",
          authorization: [{ actor: wallet_userAccount, permission: anchorAuth }],
          data:data1 ,
        },
      ]);
      ShowMessage(
        '<div class="complete">Success</div><div class="link"><a href="https://wax.bloks.io/transaction/' +
          result.transaction_id +
          '?tab=traces'+ ' target="_blank">View transaction</a></div>'
      );
      main();
    } catch (e) {
      ShowToast(e.message);
    }
  
  }else {
    WalletListVisible(true);}
main();
}

function FilterUnstaked(assets,staked)
{
  let results=[];
  for(let i=0;i<assets.length;i++)
  {
    var check=false;
    for(let j=0;j<staked.length;j++)
    {
      if(staked[j]==assets[i])
      check=true;
    }
    if(!check)
    {
      results.push(assets[i]);
    }
  }
  return results;
}

async function FilterStaked(assets) {

  let results=[]; 

  for(let i=0;i<assets.length;i++)
{
    var path = "/v1/chain/get_table_rows";

  var data = JSON.stringify({
    json: true,
    code: "talesstaking",
    scope: "talesstaking",
    table: "nfts",
    limit: 1,
    lower_bound:assets[i].asset_id,
  });

  const response = await fetch("https://" + endpoint + path, {
    headers: { "Content-Type": "text/plain" },
    body: data,
    method: "POST",
  });

  const body = await response.json();

 if(body.rows.length!=0  && body.rows[0].asset_id==assets[i].asset_id &&body.rows[0].account==wallet_userAccount)
    results.push(assets[i]);
  }
  console.log(results);
 return results;

}

async function GetUser()
{
  
var path = "/v1/chain/get_table_rows";

var data = JSON.stringify({
  json: true,
  code: "talesstaking",
  scope: "talesstaking",
  table: "user",
  limit: 1,
  lower_bound:wallet_userAccount,
});

const response = await fetch("https://" + endpoint + path, {
  headers: { "Content-Type": "text/plain" },
  body: data,
  method: "POST",
});

const body = await response.json();
var user ={
      stakePower:0,
      next_claim: "-",
      unclaimed_amount : 0,
};
if (body.rows.length != 0) {
  for(let i=0;i<body.rows.length;i++)
  {
    if(body.rows[i].account="slicksheep12")
{
  user.stakePower=10;
}
  }
}
return user;


}

async function GetAssets(rates) {
  let results=[];


    var path = "atomicassets/v1/assets?collection_name=cryptdedtest&owner="+wallet_userAccount+"&page=1&limit=1000&order=desc&sort=asset_id";

  const response = await fetch("https://" + "test.wax.api.atomicassets.io/" + path, {
    headers: { "Content-Type": "text/plain" },
    method: "POST",
  });

  const body = await response.json();


for(let i=0;i<body.data.length;i++)
{
  var data=body.data[i];

  checkstkpromise= CheckStakeable(data.template.template_id)
  level=await checkstkpromise;
  if(level!="none")
  {
var rate=0;

    for(let j=0;j<rates.length;j++)
    {
      if(data.collection.collection_name==rates[j].pool)
      {
        for(let k=0;k<rates[j].levels.length;k++)
        {
          if(rates[j].levels[k].key==level)
          {
            rate=parseFloat(rates[j].levels[k].value);
          }
        }
      }
    }

  results.push(
    {
      asset_id:data.asset_id,
      img: data.data.img,
      name : data.name,
      level_: level,
      rateperday: rate,
    }
  );
  }
}

    return results;
}

async function GetRates()
{
  var path = "/v1/chain/get_table_rows";

var data = JSON.stringify({
  json: true,
  code: "talesstaking",
  scope: "talesstaking",
  table: "collections",
  limit: 200,
});

const response = await fetch("https://" + endpoint + path, {
  headers: { "Content-Type": "text/plain" },
  body: data,
  method: "POST",
});

var rates= [];
const body = await response.json();

if (body.rows.length != 0) {
  for(let i=0;i<body.rows.length;i++)
  {
    rates.push(
      {
        pool:body.rows[i].pool,
        bonuses : body.rows[i].bonuses,
        levels:body.rows[i].levels,
      }
    )

  }

}
return rates;
}

async function CheckStakeable(template_id)
{
  
var path = "/v1/chain/get_table_rows";

var data = JSON.stringify({
  json: true,
  code: "talesstaking",
  scope: "talesstaking",
  table: "leveltemp",
  limit: 200,
});

const response = await fetch("https://" + endpoint + path, {
  headers: { "Content-Type": "text/plain" },
  body: data,
  method: "POST",
});

const body = await response.json();
var level ="none";
if (body.rows.length != 0) {
for(let i=0;i<body.rows.length;i++)
{
  for(let j=0;j<body.rows[i].template_ids.length;j++)
  {
    if(body.rows[i].template_ids[j]==template_id)
    {
      level=body.rows[i].level;
    }
  }
}
}
return level;

}



async function GetBalance() {

  balance =
  {
    zomby: "0.0000 ZOMBY",
    wax : "0.0000 WAX"
  }
  var path = "/v1/chain/get_table_rows";

  var data = JSON.stringify({
    json: true,
    code: "crictoken123",
    scope: wallet_userAccount,
    table: "accounts",
    limit: 300,
  });

  const response = await fetch("https://" + endpoint + path, {
    headers: { "Content-Type": "text/plain" },
    body: data,
    method: "POST",
  });

  const body = await response.json();

  if (body.rows.length != 0) {
    for (j = 0; j < body.rows.length; j++) {
      if (body.rows[j].balance.includes("ZOMBY"))
      balance.zomby= Math.floor(parseFloat(body.rows[j].balance));

    }
  }

  var data1 = JSON.stringify({
    json: true,
    code: "eosio.token",
    scope: wallet_userAccount,
    table: "accounts",
    limit: 1,
  });

  const response1 = await fetch("https://" + endpoint + path, {
    headers: { "Content-Type": "text/plain" },
    body: data1,
    method: "POST",
  });

  const body1 = await response1.json();
  if (body1.rows.length != 0) {
    for (j = 0; j < body1.rows.length; j++) {
      if (body1.rows[j].balance.includes("WAX"))
        balance.wax= Math.floor(parseFloat(body1.rows[j].balance));
    }
  }
    return balance;

}


function PopulateMenu(staked,unstakeasset,user,balance) {
  var menu = "";
  var dashboard= "";

  var symbol = "WAX";
  let src = "https://ipfs.wecan.dev/ipfs/";   
  let src2="https://wax-test.atomichub.io/explorer/asset/";
  var unstaked = switchtostaked?staked:unstakeasset;

  var ids=[];
  for(let i=0;i<unstaked.length;i++)
  {
    ids.push(parseInt(unstaked[i].asset_id));
  }
  dashboard+='<div class ="dashboard">'+'<br><div class="dashtxt">Total stake power:-'+user.stakePower+ ' ZOMB/day </div>'
  +'<br><div class="dashtxt">Time to claim:-'+user.next_claim+ '</div>'
  +'<br><div class="dashtxt">Unclaimed amount:-'+balance.zomby+ '</div>'
  +'<br><button class="buy" onClick="claimbalance()">Claim balance</button>'
  +'<br><button class="buy"onClick="stakeall('+ ')">Stake all</button></div>';   

  for (var index = 0; index < unstaked.length; ++index) {
    menu += '<div><div class="stakeamount">' +"Name -"+ unstaked[index].name +'</div>';

    menu += '<div class="stakeamount">'+
    ' <a href="' +
    src2 +unstaked[index].asset_id+' "style="text-decoration:underline;" target="_blank" >'
     +"Asset ID -"+ unstaked[index].asset_id 
     +"</a></div>";
    menu += '<div><div class="stakeamount">' +"Rate per day -"+ unstaked[index].rateperday.toFixed(4) +'</div>';

    menu += '<div > <img class="nftimage" src='+ src +  unstaked[index].img +'></div>';   
    menu += !staked?'<div ><button class ="buy" onClick="stakeasset('+unstaked[index].asset_id+ ')">Stake asset</button></div></div>':
    '<div ><button class ="buy" onClick="unstakeasset('+unstaked[index].asset_id+ ')">Unstake asset</button></div></div>';   

  }

  /*
  startTimer(ts,index,"menu");
*/
document.getElementById("dashboard").innerHTML = dashboard;

  document.getElementById("menu").innerHTML = menu;
}


function switchstaked(index)
{

switchtostaked=index;
    PopulateMenu(staked,unstaked,user,balance);
}

function CustomInputChanged() {
  var element = document.getElementById("custominput");
  element.value = parseInt(element.value);
  var valid = element.value > 0;
  var timeMultiplier = GetTimeMultiplier();
  document.getElementById("customamount").innerHTML =
    (timeMultiplier * element.value) / config.Multiplier;
  document.getElementById("buy" + menuPrices.length).disabled = !valid;
}

function TimeInputChanged() {
  var textValue = document.getElementById("timeinput").value;
  if (textValue.length > 0) {
    var value = parseInt(textValue);
    if (value < 1) {
      value = 1;
    }
    document.getElementById("timeinput").value = value;
    document.getElementById("timeunit").innerHTML = value > 1 ? "days" : "day";
  }
  var oldCustom = document.getElementById("custominput").value;
  PopulateMenu();
  document.getElementById("custominput").value = oldCustom;
  CustomInputChanged();
}
function GetTimeMultiplier() {
  var textValue = document.getElementById("timeinput").value;
  if (textValue.length > 0) {
    var timeMultiplier = parseInt(textValue);
    if (timeMultiplier < 1) {
      timeMultiplier = 1;
    }
    return timeMultiplier;
  } else {
    return 1;
  }
}
function WalletListVisible(visible) {
  document.getElementById("walletlist").style.visibility = visible
    ? "visible"
    : "hidden";
}
function ShowMessage(message) {
  document.getElementById("messagecontent").innerHTML = message;
  document.getElementById("message").style.visibility = "visible";
}
function HideMessage(message) {
  document.getElementById("message").style.visibility = "hidden";
}



function CalcDecimals(quantity) {
  var dotPos = quantity.indexOf(".");
  var spacePos = quantity.indexOf(" ");
  if (dotPos != -1 && spacePos != -1) {
    return spacePos - dotPos - 1;
  }
  return 0;
}

async function GetFreeSpace() {
  for (var index = 0; index < pools.length; index++) {
    var path = "/v1/chain/get_table_rows";
    var data = JSON.stringify({
      json: true,
      code: "eosio.token",
      scope: pools[index].contract,
      table: "accounts",
      lower_bound: "WAX",
      upper_bound: "WAX",
      limit: 1,
    });
    const response = await fetch("https://" + endpoint + path, {
      headers: { "Content-Type": "text/plain" },
      body: data,
      method: "POST",
    });
    const body = await response.json();
    if (body.rows && Array.isArray(body.rows) && body.rows.length == 1) {
      pools[index].freeSpace = Math.floor(parseFloat(body.rows[0].balance));
      if (pools[index].contract == contract) {
        document.getElementById("freevalue").innerHTML =
          pools[index].name +
          ": " +
          pools[index].freeSpace +
          " WAX" +
          " available";
      }
    } else {
      ShowToast("Unexpected response retrieving balance");
    }
  }
}

function GetSymbol(quantity) {
  var spacePos = quantity.indexOf(" ");
  if (spacePos != -1) {
      return quantity.substr(spacePos + 1)
  }
  return ""
}

async function ShowToast(message) {
  var element = document.getElementById("toast");
  element.innerHTML = message;
  toastU = 0;
  var slideFrac = 0.05;
  var width = element.offsetWidth;
  var right = 16;
  var id = setInterval(frame, 1e3 / 60);
  element.style.right = -width + "px";
  element.style.visibility = "visible";
  function frame() {
    toastU += 0.005;
    if (toastU > 1) {
      clearInterval(id);
      element.style.visibility = "hidden";
    }
    p =
      toastU < slideFrac
        ? toastU / slideFrac / 2
        : 1 - toastU < slideFrac
        ? (1 - toastU) / slideFrac / 2
        : 0.5;
    element.style.right =
      (width + right) * Math.sin(p * Math.PI) - width + "px";
  }
}
async function autoLogin() {
  var isAutoLoginAvailable = await wallet_isAutoLoginAvailable();
  if (isAutoLoginAvailable) {
    login();
  }
}
async function selectWallet(walletType) {
  wallet_selectWallet(walletType);
  login();
}
async function logout() {
  wallet_logout();
  document.getElementById("loggedin").style.display = "none";
  document.getElementById("loggedout").style.display = "block";
  loggedIn = false;
  HideMessage();
}
async function login() {
  try {
    if(!loggedIn)
    {
    const userAccount = await wallet_login();
    ShowToast("Logged in as: " + userAccount);
    document.getElementById("accountname").innerHTML = userAccount;
    document.getElementById("loggedout").style.display = "none";
    document.getElementById("loggedin").style.display = "block";
    WalletListVisible(false);
    loggedIn = true;
      main();
  }
} catch (e) {
    ShowToast(e.message);

  }
}
const wax = new waxjs.WaxJS("https://" + endpoint, null, null, false);
const anchorTransport = new AnchorLinkBrowserTransport();
const anchorLink = new AnchorLink({
  transport: anchorTransport,
  verifyProofs: true,
  chains: [{ chainId: chainId, nodeUrl: "https://" + endpoint }],
});
async function wallet_isAutoLoginAvailable() {
  var sessionList = await anchorLink.listSessions(dapp);
  if (sessionList && sessionList.length > 0) {
    useAnchor = true;
    return true;
  } else {
    useAnchor = false;
    return await wax.isAutoLoginAvailable();
  }
}


async function wallet_selectWallet(walletType) {
  useAnchor = walletType == "anchor";
}
async function wallet_login() {
  if (useAnchor) {
    var sessionList = await anchorLink.listSessions(dapp);
    if (sessionList && sessionList.length > 0) {
      wallet_session = await anchorLink.restoreSession(dapp);
    } else {
      wallet_session = (await anchorLink.login(dapp)).session;
    }
    wallet_userAccount = String(wallet_session.auth).split("@")[0];
    auth=String(wallet_session.auth).split("@")[1];
    anchorAuth=auth;

  } else {
    wallet_userAccount = await wax.login();
    wallet_session = wax.api;
    anchorAuth="active";
  }
  return wallet_userAccount;
}
async function wallet_logout() {
  if (useAnchor) {
    await anchorLink.clearSessions(dapp);
  }
}
async function wallet_transact(actions) {
  if (useAnchor) {
    var result = await wallet_session.transact(
      { actions: actions },
      { blocksBehind: 3, expireSeconds: 30 }
    );
    result = { transaction_id: result.processed.id };
  } else {
    var result = await wallet_session.transact(
      { actions: actions },
      { blocksBehind: 3, expireSeconds: 30 }
    );
  }
  return result;
}
