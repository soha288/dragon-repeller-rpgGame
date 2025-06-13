// Sound effects
const attackSound = new Audio("attacksound.wav");
const monsterDeathSound = new Audio("monsterdeathsound.wav");
const playerDeathSound = new Audio("playerdeathsound.mp3");



//initializing variables
let xp=0;
let health=100;
let gold=50;
let currentWeapon=0;
let fighting;
let monsterHealth;
let inventory=["stick"];
const button1=document.querySelector("#button1");
const button2=document.querySelector("#button2");
const button3=document.querySelector("#button3");
const text=document.querySelector("#text");
const xptext=document.querySelector("#xpval");
const healthtext=document.querySelector("#healthval");
const goldtext=document.querySelector("#goldval");
const monsterstats=document.querySelector("#monsterstats");
const monstername=document.querySelector("#monstername");
const monsterhealth=document.querySelector("#monsterhealth");

const locations=[
    {
        name:"town square",
        "button text":['Go to store','Go to cave','Fight dragon'],
        "button functions":[store,cave,fightdragon],
        text:"You are in the town square. You see a sign that says \"Store.\""
    },
    
    {   name:"store",
        "button text":['Buy 10 health(10 gold)','Buy Weapon(30 gold)','Go to town square!'],
        "button functions":[buyhealth,buyweapon,gotown],
        text:"You entered the store."
    },

    {
        name:"cave",
        "button text":["Fight slime","Fight fanged beast","Go to town square"],
        "button functions":[fightslime,fightBeast,gotown],
        text:"You enter the cave.You see some monsters."
    },
    {
        name:"fight",
        "button text":['Attack','Dodge','Run'],
        "button functions":[attack,dodge,gotown],
        text:"You are fighting a monster."
    },
    {
        name:"kill monster",
        "button text":['Go to town square!','Easter Egg',''],
        "button functions":[gotown,easteregg,null],
        text:'The monster screams "Arg!" as it dies. You gain experience and find gold.'
    },
    {   name:"lose",
        "button text":['REPLAY?','',''],
        "button functions":[restart,null,null],
        text:"You die.☠️"

    },
    {
        name:"win",
        "button text":['REPLAY?','',''],
        "button functions":[restart,null,null],
        text:"You defeat the dragon! YOU WIN THE GAME!🎉️"
    },
    {
        name:"easter egg",
        "button text":['2','8','go to town square?'],
        "button functions":[pickTwo,pickEight,gotown],
        text:"You find a secret game.Pick a number above.Ten numbers will be randomly chosen between 0 and 10.If the number you choose matches one of the random numbers,you win!"
    }

];


const weapons=[
    {
        name:"stick",
        power:5
    },
    {
        name:"dagger",
        power:30
    },
    {
        name:"claw hammer",
        power:50
    },
    {
        name:"sword",
        power:100
    }

];

const monsters=[
    {
        name:"slime",
        level:2,
        health:15
    },
    {
        name:"fanged beast",
        level:8,
        health:60
    },
    {
        name:"dragon",
        level:20,
        health:300
    }

];

//initialize buttons
button1.onclick=store;
button2.onclick=cave;
button3.onclick=fightdragon;

function update(location){
monsterstats.style.display="none";
text.innerText=location.text;
const buttons=[button1,button2,button3];
for(let i=0;i<3;i++){
    const btntxt=location["button text"][i];
    const btnfnc=location["button functions"][i];

    if(btntxt===''||btnfnc===null){
        buttons[i].style.display='none';
    }
    else{
        buttons[i].style.display="inline-block";
        buttons[i].innerText=btntxt;
        buttons[i].onclick=btnfnc;
    }

}
}


function store(){
    update(locations[1]);
}

function cave(){
   update(locations[2]);
}



//function of store()
function buyhealth(){
    gold-=10;health+=10;
    if(gold>=0){
    text.innerText="health bought!";
    healthtext.innerText=health;
    goldtext.innerText=gold;
    }
    else{
        text.innerText="You do not have enough gold!";  
    }
}
function buyweapon(){
    if (currentWeapon<weapons.length-1){
    if (gold>=30){
        gold-=30;
        currentWeapon++;
        goldtext.innerText=gold;
        let newweapon=weapons[currentWeapon].name;
        text.innerText="You now have a new "+ newweapon+".\n";
        inventory.push(newweapon);
        text.innerText+= "In your inventory, you have: "+ inventory;
     }
    else{
        text.innerText="You do not have enough gold to buy weapons!";
    }
}
else{
    text.innerText="You already have the most powerful weapon!";
    button2.innerText="Sell weapon for 15 gold";
    button2.addEventListener("click",()=>{
        if(inventory.length>1){
       gold+=15;
       let newweapon=weapons[currentWeapon].name;//currentweapon=inventory.shift();text inner text is same
       text.innerText="You have sold "+ newweapon+".\n";
        inventory.pop(newweapon);
        text.innerText+= "In your inventory, you have: "+ inventory;
        goldtext.innerText=gold;
        currentWeapon--;
        }
        else{
            text.innerText="Dont sell your only weapon!";
        }
    });

}
}       
function gotown(){
   update(locations[0]);
}

function fightslime(){
    fighting=0;
    gofight();

}
function fightBeast(){
    fighting=1;
    gofight();

}
function fightdragon(){
    fighting=2;
    gofight();
}
function gofight(){
 update(locations[3]);
 monsterHealth=monsters[fighting].health;
 monsterstats.style.display="block";
 monstername.innerText=monsters[fighting].name;
 monsterhealth.innerText=monsterHealth;
}
function attack(){
    attackSound.currentTime = 0;
    attackSound.play();
     text.innerText="The "+ monsters[fighting].name + "attacks.";
     text.innerText+= "You attack it with your "+ weapons[currentWeapon].name+ ".";
     if(ismonsterhit()){
     health-=getmonsterAttackvalue(monsters[fighting].level);
     }
     else{
      text.innerText+="You miss.";
     }
     monsterHealth-=weapons[currentWeapon].power+Math.floor(Math.random()*xp)+1;
     healthtext.innerText=health;
     monsterhealth.innerText=monsterHealth;
     console.log(monsterHealth);
     if(health<=0){
        lose();
     }
     else if(monsterHealth<=0){
        (fighting===2)?winGame() : defeatMonster();    
       
     }
     if(Math.random()<= .1 && inventory.length!==1){
        text.innerText+="Your "+ inventory.pop()+ "breaks.";
        currentWeapon--;
     }
}
function getmonsterAttackvalue(level){
    let hit=(level *5)-(Math.floor(Math.random()*xp));
    console.log(hit);
    return hit;
}
function ismonsterhit(){
    return Math.random()> .2||health<20;
}
function dodge(){
    text.innerText="You dodged the attack from the "+ monsters[fighting].name + ".";
    
}
function defeatMonster(){
    monsterDeathSound.currentTime = 0;
    monsterDeathSound.play();
    gold+=Math.floor(monsters[fighting].level*6.7);
    xp+=monsters[fighting].level;
    goldtext.innerText=gold;
    xptext.innerText=xp;
    update(locations[4]);
}
function lose(){
   
    playerDeathSound.currentTime = 0;
    playerDeathSound.play();
    update(locations[5]);

}
function restart(){
    xp=0;
    health=100;
    gold=50;
    currentWeapon=0;
    inventory=['stick'];
    goldtext.innerText=gold;
    healthtext.innerText=health;
    xptext.innerText=xp;
    gotown();
}
function winGame(){
  
    update(locations[6]);

}
function easteregg(){
  
    update(locations[7]);
    
}
function pickTwo(){
    pick(2);
}
function pickEight(){
    pick(8);
}
function pick(guess){
    let numbers=[];
    while(numbers.length<10){
        numbers.push(Math.floor(Math.random()*11));
    }
    text.innerText="You picked "+ guess + ".Here are the random numbers:\n";
    for(let i=0;i<10;i++){
       text.innerText+=numbers[i]+ "\n"; 
    }
    if(numbers.indexOf(guess)!==-1){
      text.innerText+="Right!You win 20 gold!";
      gold+=20;
      goldtext.innerText=gold;
    }
    else{
        text.innerText+="Wrong! You lose 10 health!";
        health-=10;
        healthtext.innerText=health;
        if(health<=0){
            lose();
        }
    }
}