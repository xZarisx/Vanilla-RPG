//sets the default starting location
var currentWorldSectionX = 0;
var currentWorldSectionY = 0;
//really this renders the current screen
function renderWorld(x,y){
    var nextWorldIndex = 0;
    for(i = 11;i < 88; i += 10){
        for(j = 0; j < 8; j++){
            document.getElementById((i + j).toString()).className = world.x[x].y[y].screen[nextWorldIndex].block + " block";
            nextWorldIndex++;
        }
    }
}
//this determines what which tile the player is on
var lastLocation = 23;

var enemylevel = 1;
var enemyhp = 10;

var selftitle = "";
var selfexp = 1;
var selflevel = 1;
var selfstr = 9;
var selfspeed = 9;
var selfarmor = 9;
var selfhp = 10;
var selfcurrenthp = 10;
var gold = 100;
var goldLoot = 0;
var selfItems = {items:[
]};
var itemsEquipped = {"head":"","body":"","hand":"","legs":"","feet":"","shield":"","ring":"","neck":""};
// these store the total bonus from equipped items
var selfBonusStr = 0;
var selfBonusSpeed = 0;
var selfBonusArmor = 0;
var selfBonusHp = 0;

function setName(){
    selftitle = prompt("Please enter your name","");
}

//detect key strokes for PC users
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        up();
    }
    else if (e.keyCode == '40') {
        down();
    }
    else if (e.keyCode == '37') {
        left();
    }
    else if (e.keyCode == '39') {
        right();
    }
    else if (e.keyCode == '65') {
        attack();
    }
}

//checks to see if there is anything in localStorage and if there is set all vars
function checkSave(){
    if (localStorage.getItem("selftitle") != null){
        selftitle = localStorage.getItem("selftitle");
        selfexp = parseInt(localStorage.getItem("selfexp"));
        selflevel = parseInt(localStorage.getItem("selflevel"));
        selfstr = parseInt(localStorage.getItem("selfstr"));
        selfspeed = parseInt(localStorage.getItem("selfspeed"));
        selfarmor = parseInt(localStorage.getItem("selfarmor"));
        selfhp = parseInt(localStorage.getItem("selfhp")); 
        selfcurrenthp = parseInt(localStorage.getItem("selfcurrenthp")); 
        gold = parseInt(localStorage.getItem("gold"));		
		selfItems = JSON.parse(localStorage.getItem("selfItems"));		
		itemsEquipped = JSON.parse(localStorage.getItem("itemsEquipped"));
        currentWorldSectionX = parseInt(localStorage.getItem("currentWorldSectionX"));
        currentWorldSectionY = parseInt(localStorage.getItem("currentWorldSectionY"));
        lastLocation = parseInt(localStorage.getItem("lastLocation")); 
        lastLocationNode=document.getElementById(23);
        lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
        var node=document.createElement("h1");
        var textnode=document.createTextNode("x");
        node.appendChild(textnode);
        document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
        setSelf();
        renderWorld(currentWorldSectionX,currentWorldSectionY);
    }
	else{
		newGame();
	}
}

function saveGame(){
    localStorage.setItem("selftitle", selftitle);
    localStorage.setItem("selfexp", selfexp);
    localStorage.setItem("selflevel", selflevel);
    localStorage.setItem("selfstr", selfstr);
    localStorage.setItem("selfspeed", selfspeed);
    localStorage.setItem("selfarmor", selfarmor);
    localStorage.setItem("selfhp", selfhp);
    localStorage.setItem("selfcurrenthp", selfcurrenthp);
    localStorage.setItem("gold", gold);
    localStorage.setItem("currentWorldSectionX", currentWorldSectionX);
    localStorage.setItem("currentWorldSectionY", currentWorldSectionY);
    localStorage.setItem("lastLocation", lastLocation);	
    localStorage.setItem("selfItems", JSON.stringify(selfItems));
    localStorage.setItem("itemsEquipped", JSON.stringify(itemsEquipped));
}

function newGame(){
	if(confirm("Are you sure you want to start a new game?")){
		localStorage.removeItem("selftitle");
		localStorage.removeItem("selfexp");
		localStorage.removeItem("selflevel");
		localStorage.removeItem("selfstr");
		localStorage.removeItem("selfspeed");
		localStorage.removeItem("selfarmor");
		localStorage.removeItem("selfhp");
		localStorage.removeItem("selfcurrenthp");
		localStorage.removeItem("gold");
		localStorage.removeItem("currentWorldSectionX");
		localStorage.removeItem("currentWorldSectionY");
		localStorage.removeItem("lastLocation");
		localStorage.removeItem("selfItems");
		localStorage.removeItem("itemsEquipped");
		selfexp = 1;
		gold = 100;
		currentWorldSectionX = 0;
		currentWorldSectionY = 0;
		lastLocation = 23;
		selfItems = {items:[]};		
		itemsEquipped = {"head":"","body":"","hand":"","legs":"","feet":"","shield":"","ring":"","neck":""};
		expCal();
		heal();
		setName();
		setSelf();
	}
}

//makes the displayed HTML reflect the vars
function setSelf(){
	calcBonus();
    document.getElementById("menu-self-title").innerHTML = "Name: " + selftitle;
    document.getElementById("menu-self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
    document.getElementById("healthText").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
	document.getElementById("healthBar").style.width = (selfcurrenthp / (selfhp + selfBonusHp) * 100).toString() + "%";
    document.getElementById("menu-self-str").innerHTML = "STR: " + (selfstr + selfBonusStr) + "(" + selfBonusStr + ")";
    document.getElementById("menu-self-spe").innerHTML = "SPEED: " + (selfspeed + selfBonusSpeed) + "(" + selfBonusSpeed + ")";
    document.getElementById("menu-self-armor").innerHTML = "ARMOR: " + (selfarmor + selfBonusArmor) + "(" + selfBonusArmor + ")";
    document.getElementById("menu-self-exp").innerHTML = "EXP: " + selfexp;  
    document.getElementById("menu-self-level").innerHTML = "LEVEL: " + selflevel; 
    document.getElementById("menu-gold").innerHTML = "Gold: " + gold;
    document.getElementById("gold").innerHTML = "Gold: " + gold;
    document.getElementById("self-title").innerHTML = "Name: " + selftitle;    
    document.getElementById("enemy-level").innerHTML = "LEVEL: " + enemylevel;    
    document.getElementById("enemy-hp").innerHTML = "HP: " + enemyhp;    
    document.getElementById("self-exp").innerHTML = "EXP: " + selfexp;  
    document.getElementById("self-level").innerHTML = "LEVEL: " + selflevel; 
    document.getElementById("self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
    document.getElementById("self-str").innerHTML =  "STR: " + (selfstr + selfBonusStr) + "(" + selfBonusStr + ")"; 
    document.getElementById("self-spe").innerHTML = "SPEED: " + (selfspeed + selfBonusSpeed) + "(" + selfBonusSpeed + ")";
    document.getElementById("self-armor").innerHTML = "ARMOR: " + (selfarmor + selfBonusArmor) + "(" + selfBonusArmor + ")";
}

//need to make this not run when not in combat
function attack(){
    enemyhp -= Math.floor(100 / (100 + enemylevel * 4 - (selfspeed + selfBonusSpeed)) * (selfstr + selfBonusStr));
    document.getElementById("enemy-hp").innerHTML = "HP: " + enemyhp; 
    if(enemyhp <= 0){
        selfexp += enemylevel * 10;
        expCal();
        loot();
    }
    else if(0 == 0){
		var tempArmor = selfarmor + selfBonusArmor - enemylevel * 8;
		if(tempArmor < -80){
			tempArmor = -80;
		}
        selfcurrenthp -= Math.floor(100 / (100 + tempArmor) * (enemylevel + 1));
		document.getElementById("self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")"; 
		document.getElementById("menu-self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
		document.getElementById("healthBar").style.width = (selfcurrenthp / (selfhp + selfBonusHp) * 100).toString() + "%";
		document.getElementById("healthText").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
        if(selfcurrenthp < 1){
            death();
            showWorld();
        }
    }
}

//hides the views and controls. Used when transitioning screens
function hideViews(){
	var gameChildrenLength = document.getElementById("game").childNodes.length - 1;
	for(i = gameChildrenLength; i >= 0; i--){
		document.getElementById("game").childNodes[i].className = "hide";
	}	
	document.getElementById('characterInfo').className = "";
}

//Just a big list of all the possible loot
var lootTable = {loot:[
{rarity:[
{"itemName":"Long Sword","type":"hand","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"1","high":"2"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"1.2"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Short Bow","type":"hand","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"1","high":"1.5"}],
	selfBonusSpeed:[{"low":"1","high":"2"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Helm","type":"head","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"2"}],
	selfBonusHp:[{"low":"1","high":"2"}]},
{"itemName":"Chain Mail","type":"body","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2","high":"3"}],
	selfBonusHp:[{"low":"1","high":"2.2"}]},
{"itemName":"Boots","type":"feet","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"1.5"}],
	selfBonusHp:[{"low":"1","high":"1.1"}]},
{"itemName":"Legs","type":"legs","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1.3","high":"2.5"}],
	selfBonusHp:[{"low":"1.2","high":"2.2"}]},
{"itemName":"Dagger","type":"hand","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"1","high":"1.4"}],
	selfBonusSpeed:[{"low":"1","high":"2"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Staff","type":"hand","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"1","high":"1.3"}],
	selfBonusSpeed:[{"low":"1","high":"2"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Mace","type":"hand","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"1","high":"2.4"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Shield","type":"shield","rarity":"normal","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"2"}],
	selfBonusHp:[{"low":"1","high":"2"}]},
]},
{rarity:[
{"itemName":"Long Sword","type":"hand","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"2","high":"2.5"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1.2","high":"1.7"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Short Bow","type":"hand","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"1.5","high":"2"}],
	selfBonusSpeed:[{"low":"2","high":"2.8"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Helm","type":"head","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2","high":"3"}],
	selfBonusHp:[{"low":"2","high":"3"}]},
{"itemName":"Chain Mail","type":"body","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"3","high":"4"}],
	selfBonusHp:[{"low":"2.2","high":"2.8"}]},
{"itemName":"Boots","type":"feet","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1.5","high":"2"}],
	selfBonusHp:[{"low":"1.1","high":"1.6"}]},
{"itemName":"Legs","type":"legs","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2.5","high":"3"}],
	selfBonusHp:[{"low":"2.2","high":"2.9"}]},
{"itemName":"Dagger","type":"hand","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"1.4","high":"2"}],
	selfBonusSpeed:[{"low":"2","high":"2.8"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Staff","type":"hand","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"1.3","high":"1.8"}],
	selfBonusSpeed:[{"low":"2","high":"3"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Mace","type":"hand","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"2.4","high":"3.9"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Shield of Life","type":"shield","rarity":"uncommon","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"3","high":"4"}],
	selfBonusHp:[{"low":"3","high":"4"}]},
]},
{rarity:[
{"itemName":"Long Sword","type":"hand","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"2.5","high":"3"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1.7","high":"2.2"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Short Bow","type":"hand","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"2","high":"2.5"}],
	selfBonusSpeed:[{"low":"2.8","high":"3.3"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Helm","type":"head","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"3","high":"4"}],
	selfBonusHp:[{"low":"3","high":"4"}]},
{"itemName":"Chain Mail","type":"body","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"4","high":"5"}],
	selfBonusHp:[{"low":"2.8","high":"3.4"}]},
{"itemName":"Boots","type":"feet","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2","high":"2.5"}],
	selfBonusHp:[{"low":"1.6","high":"2"}]},
{"itemName":"Legs","type":"legs","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"3","high":"3.5"}],
	selfBonusHp:[{"low":"2.9","high":"3.4"}]},
{"itemName":"Dagger","type":"hand","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"2","high":"2.4"}],
	selfBonusSpeed:[{"low":"2.8","high":"3.6"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Staff","type":"hand","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"1.8","high":"2.3"}],
	selfBonusSpeed:[{"low":"3","high":"4"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Mace","type":"hand","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"3.9","high":"4.8"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Ring of Health","type":"ring","rarity":"rare","ability":"",
	selfBonusStr:[{"low":".5","high":"1"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":".5","high":"1"}],
	selfBonusHp:[{"low":"3","high":"4"}]},
{"itemName":"Necklace of Health","type":"neck","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":".6"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":".3","high":"1"}],
	selfBonusHp:[{"low":"2","high":"3"}]},
{"itemName":"Shield of Health","type":"shield","rarity":"rare","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"4","high":"5"}],
	selfBonusHp:[{"low":"4","high":"5"}]},
]},
{rarity:[
{"itemName":"Long Sword","type":"hand","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"3","high":"3.5"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2.2","high":"2.7"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Short Bow","type":"hand","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"2.5","high":"3"}],
	selfBonusSpeed:[{"low":"3.3","high":"3.8"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Helm","type":"head","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"4","high":"5"}],
	selfBonusHp:[{"low":"4","high":"5"}]},
{"itemName":"Chain Mail","type":"body","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"5","high":"6"}],
	selfBonusHp:[{"low":"3.4","high":"4"}]},
{"itemName":"Boots","type":"feet","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"2.5","high":"3"}],
	selfBonusHp:[{"low":"2","high":"2.5"}]},
{"itemName":"Legs","type":"legs","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"0","high":"0"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"3.5","high":"4"}],
	selfBonusHp:[{"low":"3.4","high":"4.2"}]},
{"itemName":"Dagger","type":"hand","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"2.4","high":"3"}],
	selfBonusSpeed:[{"low":"3.6","high":"4"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Staff","type":"hand","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"2.3","high":"3"}],
	selfBonusSpeed:[{"low":"4","high":"5"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Mace","type":"hand","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"4.8","high":"6"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"0","high":"0"}],
	selfBonusHp:[{"low":"0","high":"0"}]},
{"itemName":"Ring of Life","type":"ring","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"1","high":"2"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"1.1"}],
	selfBonusHp:[{"low":"4","high":"5"}]},
{"itemName":"Necklace of Life","type":"neck","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":"0","high":".6"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"1","high":"1.1"}],
	selfBonusHp:[{"low":"3","high":"3.7"}]},
{"itemName":"Shield of Life","type":"shield","rarity":"legendary","ability":"",
	selfBonusStr:[{"low":".2","high":"1"}],
	selfBonusSpeed:[{"low":"0","high":"0"}],
	selfBonusArmor:[{"low":"5","high":"6"}],
	selfBonusHp:[{"low":"5","high":"6"}]},
]},
]};

//generates loot saves it into selfItems
function loot(){
	var rarityArrayIndex = 0;
	var raritySetter = Math.floor(Math.round((Math.random() * 100) * 100) / 100);
	if(raritySetter < 70){
		rarityArrayIndex = 0;
	}
	else if(raritySetter < 85){
		rarityArrayIndex = 1;
	}
	else if(raritySetter < 95){
		rarityArrayIndex = 2;
	}
	else if(raritySetter < 101){
		rarityArrayIndex = 3;
	}
	lootTableLangth = lootTable.loot[rarityArrayIndex].rarity.length;
    hideViews();
	document.getElementById('loot').className = "";
	document.getElementById('lootControls').className = "";
	var lootItemIndex = Math.floor((Math.random() * lootTable.loot[rarityArrayIndex].rarity.length) + 1);
	lootItemIndex--;
	var newItem = {"itemName":"","type":"","level":"","rarity":"","selfBonusStr":"","selfBonusSpeed":"","selfBonusArmor":"","selfBonusHp":"","equipped":false};
	newItem.itemName = lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].itemName;
	newItem.type = lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].type;	
	newItem.level = selflevel;	
	newItem.rarity = lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].rarity;
	newItem.selfBonusStr = randomStats(lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusStr[0].high, lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusStr[0].low);
	newItem.selfBonusSpeed = randomStats(lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusSpeed[0].high, lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusSpeed[0].low);
	newItem.selfBonusArmor = randomStats(lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusArmor[0].high, lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusArmor[0].low);
	newItem.selfBonusHp = randomStats(lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusHp[0].high, lootTable.loot[rarityArrayIndex].rarity[lootItemIndex].selfBonusHp[0].low);
	selfItems['items'].push(newItem);
    var text = "<h3 class='" + newItem.rarity + "'>" + newItem.itemName + "</h3>";
        text += "<ul class='" + newItem.rarity + "'>";
        text += "<li>Type: " + newItem.type + "</li>";		
        text += "<li>Rarity: " + newItem.rarity + "</li>";
        text += "<li>Level: " + newItem.level + "</li>";
        text += "<li>Bonus Str: " + newItem.selfBonusStr + "</li>";
        text += "<li>Bonus Speed: " + newItem.selfBonusSpeed + "</li>";
        text += "<li>Bonus Armor: " + newItem.selfBonusArmor + "</li>";		
        text += "<li>Bonus HP: " + newItem.selfBonusHp + "</li>";
		text += "</ul><button onclick='equip(" + (selfItems.items.length - 1) + ",0)'>Equip</button>";
		document.getElementById("itemLoot").innerHTML = text;
}

//generates random stats for item being created. The high and low are based off the high and low from the lootTable
function randomStats(high, low){
	y = parseFloat(high);	
	z = parseFloat(low);
	x = Math.floor(selflevel * ((Math.random() * (y - z)) + z));
	return x;
}
function death(){
    heal();
    saveGame();
    gold = Math.floor(gold * .8);
    setSelf();
    var lastLocationNode=document.getElementById(lastLocation);
    lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
    currentWorldSectionX = 0;
    currentWorldSectionY = 0;
    lastLocation = 23; 
    renderWorld(currentWorldSectionX,currentWorldSectionY);
    var node=document.createElement("h1");
    var textnode=document.createTextNode("x");
    node.appendChild(textnode);
    document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
}

function heal(){
    selfcurrenthp = selfhp + selfBonusHp; 
    document.getElementById("self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
    document.getElementById("menu-self-hp").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
    document.getElementById("healthText").innerHTML = "HP: " + selfcurrenthp + "/" + (selfhp + selfBonusHp) + "(" + selfBonusHp + ")";
	document.getElementById("healthBar").style.width = (selfcurrenthp / (selfhp + selfBonusHp) * 100).toString() + "%";
}
//needed for display purposes
var itemTypes = ["head","body","hand","legs","feet","shield","ring","neck"];
//Need to find a better way to do this. It gets really slow when there is a lot of items
function showInventory() {
	hideViews();
    document.getElementById("Inventory").className = "";
	document.getElementById("invintoryControls").className = "";
	    var text = "";
		var itemsLength = selfItems.items.length - 1;
		for(i = 0; i < itemTypes.length; i++){
			text += "<h3>" + itemTypes[i] + "</h3><table>";
			text +=	"<tr>";
			text +=	"<td><span>Name</span></td>";
			text +=	"<td><span>Type</span></td> ";
			text +=	"<td><span>Level</span></td> ";
			text +=	"<td><span>Str</span></td>";
			text +=	"<td><span>Spe</span></td>";
			text +=	"<td><span>Arm</span></td>";
			text +=	"<td><span>HP</span></td>";
			text +=	"<td><span>Equip</span></td>";
			text +=	"<td><span>Sell</span></td>";
			text +=	"</tr>";
			for(i2 = 0; i2 <= itemsLength; i2++){
				if(selfItems.items[i2].type == itemTypes[i]){
					var equippedText = "";
					text += "<tr class='" + selfItems.items[i2].rarity + "'><td>" + selfItems.items[i2].itemName + "</td>";
					text += "<td>" + selfItems.items[i2].type + "</td>";
					text += "<td>" + selfItems.items[i2].level + "</td>";
					text += "<td>" + selfItems.items[i2].selfBonusStr + "</td>";
					text += "<td>" + selfItems.items[i2].selfBonusSpeed + "</td>";
					text += "<td>" + selfItems.items[i2].selfBonusArmor + "</td>";		
					text += "<td>" + selfItems.items[i2].selfBonusHp + "</td>";
					if(selfItems.items[i2].equipped == true){
						equippedText = "<input type='checkbox' onclick='equip(" + i2 + ",1)' checked>";
					}
					else{
						equippedText = "<input type='checkbox' onclick='equip(" + i2 + ",0)'>";
					}
					text += "<td>" + equippedText + "</td>";	
					text += "<td><button onclick='sellItem(" + i2 + ")'>Sell</button></td></tr>";
				}
			}
		text +=	"</table>";
		}
    document.getElementById("Inventory").innerHTML = text;
}
function sellItem(x){
	var y = 0;
	if(x == undefined){
		x = selfItems.items.length - 1;
		y = 1;
	}
	gold += selfItems.items[x].selfBonusStr + selfItems.items[x].selfBonusSpeed + selfItems.items[x].selfBonusArmor + selfItems.items[x].selfBonusHp;
	if(selfItems.items[x].equipped == true){
		equip(x,1);
	}
	selfItems.items.splice(x,1);
	for(i = 0; i < selfItems.items.length; i++){
		if(selfItems.items[i].equipped == true){			
			itemsEquipped[selfItems.items[i].type] = i;
		}
	}
	if(y == 0){
		showInventory();
	}
	else{
		showWorld();
	}
}
function sellUnequipped(rarity){
	if(rarity != null){
		for(x = (selfItems.items.length - 1); x >= 0; x--){
			if(selfItems.items[x].equipped != true && selfItems.items[x].rarity == rarity){
				gold += selfItems.items[x].selfBonusStr + selfItems.items[x].selfBonusSpeed + selfItems.items[x].selfBonusArmor + selfItems.items[x].selfBonusHp;
				selfItems.items.splice(x,1);
			}
		}		
	}
	else{
		for(x = (selfItems.items.length - 1); x >= 0; x--){
			if(selfItems.items[x].equipped != true){
				gold += selfItems.items[x].selfBonusStr + selfItems.items[x].selfBonusSpeed + selfItems.items[x].selfBonusArmor + selfItems.items[x].selfBonusHp;
				selfItems.items.splice(x,1);
			}
		}
	}
	for(i = 0; i < selfItems.items.length; i++){
		if(selfItems.items[i].equipped == true){
			itemsEquipped[selfItems.items[i].type] = i;
		}
	}
	showInventory();
}
//sets an item as equipped
function equip(itemIndex, isEquipped){
	if(isEquipped == 1){
		selfItems.items[itemIndex].equipped = false;
		itemsEquipped[selfItems.items[itemIndex].type] = "";
	}
	else{
		var itemType = selfItems.items[itemIndex].type;		
		if(itemsEquipped[itemType] !== ""){
			selfItems.items[itemsEquipped[itemType]].equipped = false;
		}
		selfItems.items[itemIndex].equipped = true;	
		itemsEquipped[itemType] = itemIndex;
	}
	showInventory();
	calcBonus();
	setSelf();
}
//I would like to figure out a way to have multiple rings equipped
var itemsEquippedArray = [];
//calculates stat bonus based on items equipped
function calcBonus(){
	if(itemsEquipped == null){
		itemsEquipped = {"head":"","body":"","hand":"","legs":"","feet":"","shield":"","ring":"","neck":""};
	}
	itemsEquippedArray = [itemsEquipped.head, itemsEquipped.body, itemsEquipped.hand, itemsEquipped.legs, itemsEquipped.feet, itemsEquipped.shield, itemsEquipped.ring, itemsEquipped.neck];
	selfBonusStr = 0;
	selfBonusSpeed = 0;
	selfBonusHp = 0;	
	selfBonusArmor = 0;
	for(i = 0; i < itemsEquippedArray.length; i++){
		if(itemsEquippedArray[i] !== ""){
			selfBonusStr += selfItems.items[itemsEquippedArray[i]].selfBonusStr;
			selfBonusSpeed += selfItems.items[itemsEquippedArray[i]].selfBonusSpeed;
			selfBonusHp += selfItems.items[itemsEquippedArray[i]].selfBonusHp;
			selfBonusArmor += selfItems.items[itemsEquippedArray[i]].selfBonusArmor;
		}
	}
}

//Need to figure out a better way to do the following functions they are very similar
function hideInventory(){
	hideViews();
    document.getElementById("menu").className = "";
	document.getElementById("controls3").className = "";
}
function editValue(x){
	window[x] = parseInt(document.getElementById(x).value);
}
function showWorld(){
	hideViews();
    document.getElementById("screen").className = "";
    document.getElementById("controls").className = "";
}

function exit(){
	hideViews();
    document.getElementById("screen").className = "";
    document.getElementById("controls").className = "";
}

function menu(){
	hideViews();
    document.getElementById("menu").className = "";
    document.getElementById("controls3").className = "";
}

// vars for calculating level
var factor = 4.5;
var log = Math.log(150);

//Calculates the amount of exp and gold gained per fight also sets stats based on level
function expCal(){
    selflevel = Math.floor(Math.pow(Math.log(selfexp) / log,factor)) + 1;
    selfstr = selflevel * 3;
    selfspeed = selflevel * 3;
    selfarmor = selflevel * 3;
    selfhp = selflevel * 10;
    gold += enemylevel * (Math.floor((Math.random()*3)+1));
    setSelf();
    saveGame();
}

//determins if there is going to be a fight and generates the fight
function randomEvent(){
    var randomMizer = Math.floor((Math.random()*10)+1);
    if(document.getElementById(lastLocation).classList.contains("grass") &&  randomMizer == 1){
        enemylevel = Math.floor(selflevel * 1.3);
        enemyhp = Math.floor(enemylevel * 10);
		hideViews();
        document.getElementById("battle").className = "";
        document.getElementById("controls2").className = "";
        document.getElementById("enemy-name").innerHTML = "enemy";
        document.getElementById("enemy-hp").innerHTML = "HP: " + enemyhp;
        document.getElementById("enemy-level").innerHTML = "LEVEL: " + enemylevel;     
    }
}

//Controls: for moving the player
function up(){
    if(document.getElementById(lastLocation - 10) && document.getElementById(lastLocation - 10).classList.contains("mount")) {
        return;
    }
    else{
        var lastLocationNode=document.getElementById(lastLocation);
        lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
        lastLocation -= 10;
        if(lastLocation < 11){
            lastLocation += 80;
            currentWorldSectionY--;
            renderWorld(currentWorldSectionX,currentWorldSectionY);
        }
        var node=document.createElement("h1");
        var textnode=document.createTextNode("x");
        node.appendChild(textnode);
        document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
    }
    randomEvent();
}
function left(){
    if(document.getElementById(lastLocation - 1) && document.getElementById(lastLocation - 1).classList.contains("mount")) {
        return;
    }
    else{
        var lastLocationNode=document.getElementById(lastLocation);
        lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
        lastLocation -= 1;
        if(lastLocation%10 == 0){
            lastLocation += 8;
            currentWorldSectionX--;
            renderWorld(currentWorldSectionX,currentWorldSectionY);
        }
        var node=document.createElement("h1");
        var textnode=document.createTextNode("x");
        node.appendChild(textnode);
        document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
    }
    randomEvent();
}
function right(){
    if(document.getElementById(lastLocation + 1) && document.getElementById(lastLocation + 1).classList.contains("mount")) {
        return;
    }
    else{
        var lastLocationNode=document.getElementById(lastLocation);
        lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
        lastLocation += 1;
        if((lastLocation%(10)) == 9 ){
            lastLocation -= 8;
            currentWorldSectionX++;
            renderWorld(currentWorldSectionX,currentWorldSectionY);
        }   
		var node=document.createElement("h1");
		var textnode=document.createTextNode("x");
		node.appendChild(textnode);
		document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
    }
    randomEvent();
}
function down(){
    if(document.getElementById(lastLocation + 10) && document.getElementById(lastLocation + 10).classList.contains("mount")) {
        return;
    }
    else{
        var lastLocationNode=document.getElementById(lastLocation);
        lastLocationNode.removeChild(lastLocationNode.childNodes[0]);
        lastLocation += 10;
        if(lastLocation > 88 ){
            lastLocation -= 80;
            currentWorldSectionY++;
            renderWorld(currentWorldSectionX,currentWorldSectionY);
        }
        var node=document.createElement("h1");
        var textnode=document.createTextNode("x");
        node.appendChild(textnode);
        document.getElementById(lastLocation).insertBefore(node,document.getElementById(lastLocation).firstChild);
    }
    randomEvent();
}
