module.exports = {
	weapons: [

		{name:"Bare hand",
		damage:0,
		range:0,
		ammo: null,
		silent:true,
		speceffect: function(){}},

		{name:"Knife",
		damage:0.1,
		range:0,
		ammo: null,
		silent:true,
		speceffect: function(){}},

		{name:"Pipegun",
		damage:0.2,
		range:0.3,
		ammo: {
			rarity: 0.75,
			ammoSingle: "bullet",
			ammoPlural: "ammo"
		},
		silent:false,
		speceffect: function(){}},

	]
}

