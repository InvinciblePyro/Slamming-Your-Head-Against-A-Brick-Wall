class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Intro, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Intro extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("Continue?")
        }
    }


    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Intro, choice.Target);
        } else {
            this.engine.gotoScene(Wall, "Wall");
        }
    }
}

class Wall extends Scene{
    update() {
        //stats
        console.log(
            "==========\n" +
            "WallHP: " + this.WallHP + "\n" +
            "Walldamage: " + this.Walldamage + "\n" +
            "WallMaxDam: " + this.WallMaxDam + "\n" +
            "WallMinDam: " + this.WallMinDam + "\n" + 
            "RockChance: " + this.RockChance + "%\n" +
            "keyChance: " + this.keyChance + "%\n" +
            "==========\n" +
            "Player HP: " + this.HP + "\n" +
            "Slams: " + this.slams + "\n" +
            "healing: " + this.healing+ "\n" + 
            "(actual healing): healing*slams: " + this.healing * this.slams + "\n" + 
            "Player Damage: " + this.PlDamage + "\n" +
            "HasKey: " + this.Haskey + "\n" +
            "PlInv: " + this.PlInv + "\n" +
            "==========\n" 
        );
        //win
        if (this.WallHP<=0){ this.engine.gotoScene(Win, null, this); }

        //dead
        if (this.HP <= 0) 
            { 
                alert("You Died...");
                this.engine.show("==================")
                this.engine.show("Your Slams: " + this.slams)
        
                this.engine.gotoScene(End, null, this); 
            }

        //has rocks:
        if(this.rocks>0){ this.engine.show("Rocks: " + this.rocks)}
        this.engine.addChoice("SLAM")

        //Rock Retail:
        if (this.Haskey) { this.engine.addChoice("$RockRetail$", "$RockRetail$") }
        
        //adds choices for the items in the players inventory:
        if (this.PlInv.length > 0){ for (const el of this.PlInv){ this.engine.addChoice(el, el)} }
        
        //Rock and key chances increase the more you slam
        this.RockChance += 0.01;
        this.keyChance += 0.01;

        //displays wall
        if (this.WallHP > this.InitialWallHP * 0.75) {
            this.engine.show("==================")
            this.engine.show("__________________")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("==================")
        } else if (this.WallHP > this.InitialWallHP * 0.5) {
            this.engine.show("==================")
            this.engine.show("__________________")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("___|____[]_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("==================")
        } else if (this.WallHP > this.InitialWallHP * 0.25) {
            this.engine.show("==================")
            this.engine.show("__________________")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|___.[]=.___|______|")
            this.engine.show("___|____[]_____|___")
            this.engine.show("|_____|___*=[].____|")
            this.engine.show("___|_____|_____|___")
            this.engine.show("|_____|_____|______|")
            this.engine.show("==================")
        } else {
            this.engine.show("==================")
            this.engine.show("__________________")
            this.engine.show("__[]_____|_____|___")
            this.engine.show("|___.[]=.__//______|")
            this.engine.show("___|___[[O]]___|___")
            this.engine.show("|____//___*=[].____|")
            this.engine.show("___[]____|_____[]__")
            this.engine.show("|_____|_____|______|")
            this.engine.show("==================")
        }
        
    }
    
    
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; 
        if (this.WallHP === undefined) 
        {
            //Wall Stats
            this.InitialWallHP = 1000000;
            this.WallHP = this.InitialWallHP;
            this.WallMaxDam = 2;
            this.WallMinDam = 1;
            this.Walldamage = Math.floor(Math.random() * this.WallMaxDam) + this.WallMinDam;
            
            //Rock Stats
            this.rocks = 0;
            this.RockChance = 2;

            //Key stats
            this.Haskey = false;
            this.keyChance = 2;

            //Player Stats
            this.HP = 99;
            this.slams = 1;
            this.healing = 0.01;
            this.PlDamage = 1;
            this.PlInv = [];
        }
        
        this.update();
        
    }

    handleChoice(choice) {
        console.log("handleChoice(choice): "+ choice);
        //handles choices OTHER than "Slam":
        if (choice && choice === "$RockRetail$") {
            this.engine.show("Welcome kid, to Rock Retail!");
            this.engine.show("I sell scraps for slabs!");
            this.engine.gotoScene(RockRetail, null, this);
            return;
        } 
        if (choice && choice === "Pickaxe") {
            this.engine.show("You swing the mighty Pickaxe with all your strength...");
            this.engine.show("*~* CRAAACK *~*");
            this.WallHP = 0;
            this.update();
            return;
        }



        // the slam
        let slamNoise = Math.floor(Math.random() * 3) + 1;
        switch (slamNoise) {
            case 1: 
                this.engine.show("#-#Thump#-#")
                break;
            case 2: 
                this.engine.show("*~*Crunch*~*")
                break;
            case 3:
                this.engine.show("x!*Slam*!x")
                break;
        }
        
        this.HP -= this.Walldamage;
        this.slams++;

        //Wall
        this.Walldamage = Math.floor(Math.random() * this.WallMaxDam) + this.WallMinDam;
        this.WallHP -= this.PlDamage;
        this.WallMaxDam += (this.slams * 0.001);
        
        //healing 
        this.HP += this.healing * this.slams;
            
        //rock chance
        let findRock = Math.floor(Math.random() * 101); 
        if (findRock<=this.RockChance)
            {
                this.rocks++;
                this.engine.show("#*#THUNK#*#")
                this.engine.show("A chunk of the wall has broken off the wall and fallen onto the floor.")
            } 

        //Pebble Passkey Chance
        let findKey = Math.floor(Math.random() * 101); 
        if (this.Haskey == false && findKey <= this.keyChance) 
            { 
                this.Haskey = true; 
                this.engine.show("You found a strange key looking rock....")
                this.engine.show("It seems like it has the words 'Pebble Passkey' engraved on it.")
            } 

        this.update();
    }
}

class RockRetail extends Scene {
    create() {
        this.pickPrice = 999;

        if (this.prevScene.rocks > 0) {
            this.engine.addChoice("1 Rock: +slams/10 HP", "1 Rock: +slams/10 HP");
            this.engine.addChoice("1 Rock: +5 Damage", "1 Rock: +5 Damage");
            this.engine.addChoice(this.pickPrice + " Rock: Pickaxe", "Pickaxe");

        } else {
            this.engine.show("....kid you're done broke.")
            this.engine.show("no boulders no barters now BEAT IT!")
        }

        this.engine.addChoice("Leave the shop", "leave");
    }

    handleChoice(choice) {
        switch (choice) {
            case "1 Rock: +slams/10 HP":
                this.prevScene.rocks--;
                this.prevScene.HP += this.prevScene.slams * 0.1;
                this.engine.gotoScene(RockRetail, null, this.prevScene);
                break;
            case "1 Rock: +5 Damage":
                this.prevScene.rocks--;
                this.prevScene.PlDamage += 5;
                this.engine.gotoScene(RockRetail, null, this.prevScene);
                break;
            case "Pickaxe":
                if(this.prevScene.rocks>=this.pickPrice)
                {
                    this.prevScene.rocks-=this.pickPrice;
                    this.prevScene.PlInv.push("Pickaxe");
                    this.engine.gotoScene(RockRetail, null, this.prevScene);
                    break;
                } else { this.engine.show("You can't afford this beauty are you kidding me???") }

            case "leave":
            default:
                this.engine.gotoScene(() => this.prevScene);
                break;
        }

        //show current amount of rocks.
        this.engine.show("Rocks: " + this.prevScene.rocks);
    }

    constructor(engine, prevScene) {
        super(engine);
        this.prevScene = prevScene; // To keep track of player state
    }
}


class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

class Win extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show("You break away at the last pieces of the wall.");
        alert("Holy shit you actually did it?");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');