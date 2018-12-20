class Actor{
	constructor(){
		this.maxHP = 1;
		this.hp = this.maxHP;
		this.name = "Wiseguy";
		this.controlledByPlayer = false;
		this.act;
	}
}

class Goodguy extends Actor{
	constructor(){
		super();
		this.name = "Goodguy";
		this.controlledByPlayer = true;
	}
}

class Badguy extends Actor{
	constructor(){
		super();
		this.name = "Badguy";
	}
}

module.exports = {
	Actor,
	Goodguy,
	Badguy
}