const auth = require("./auth.json");
const Discord = require("discord.js");
const client = new Discord.Client();
var roleDemon = null;
var roleGentil = null;
var canCreateRole = false; //flag permettant de savoir si le bot peut ou non gérer les rôles
client.on("ready", () => {
  console.log("I am ready!");
  checkRolesAndChannels(client); //Appel de la fonction permettant d'init les roles
});

//Event sur la réception d'un message
client.on("message", (message) => {
	//check si message de commande
	if (message.content.startsWith("!")) {
		var user = message.author;
		//Message permettant de rejoindre les gentils. Supprime le role demon s'il y à
		if (message.content === "!gentil" && canCreateRole && roleGentil !== null){
			if(!message.member.roles.has(roleGentil.id)) {
				message.channel.send(`${user}` + ", rejoint le groupe " + `${roleGentil}` + " !");
				message.member.addRole(roleGentil).catch(console.error);
			} else {
				message.channel.send(`${user}` + ", fait déjà parti du groupe " + `${roleGentil}` + " !");
			}
			if(message.member.roles.has(roleGentil.id)){
				message.member.removeRole(roleGentil.id);
			}
		//De même pour les démon
		} else if (message.content === "!demon" && canCreateRole && roleDemon !== null){
			if(!message.member.roles.has(roleDemon.id)) {
				message.channel.send(`${user}` + ", rejoint le groupe " + `${roleDemon}` + " !");
				message.member.addRole(roleDemon).catch(console.error);
			} else {
				message.channel.send(`${user}` + ", fait déjà parti du groupe " + `${roleDemon}` + " !");
			}
			if(message.member.roles.has(roleGentil.id)){
				message.member.removeRole(roleGentil.id);
			}
		//Message de secours permerttant de refaire l'init des rôles  
		} else if (message.content === "!init" && message.channel.guild.ownerID === message.member.user.id && canCreateRole){
			console.log('!init');
			checkRolesAndChannels(client);
		}
	}
});

//Event sur la modification d'un membre. 
//Permet de savoir si le rôle du bot est modifer et s'il possède toujours le droit de gérer les rôles
client.on('guildMemberUpdate', function(oldMenber, newMember){
	if(newMember.user.id === client.user.id){
		canCreateRole = newMember.hasPermission('MANAGE_ROLES_OR_PERMISSIONS');
	}
});

//Fonction d'init
//Permet de créer les rôles et de savoir si le bot peut gérer les rôles
function checkRolesAndChannels(bot){
	var guild = bot.guilds.first()
	var roles = guild.roles;
	var channels = guild.channels;
	roleDemon = roles.find('name', 'demon');
	roleGentil = roles.find('name', 'gentil');
	//Boucle récupérant la liste des rôles du serv afin de savoir si le bot peux gérer les droits.
	//Pour celà il faut voir si dans chaque rôle le bot est présent et si tel est le cas on check si le rôle
	//permet la gestion des rôle.
	//Sinon on passe au prochain etc
	roles.forEach(function(role){
		role.members.forEach(function(member){
			if(member.user.id == client.user.id){
				if(member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')){
					canCreateRole = true;
					return true;
				}
			}
		});
		//fix pour break la boucle => optimisation de temps
		if(canCreateRole){
			return true;
		}
	});
//	console.log(roleDemon.hexColor);
//	console.log(roleGentil.hexColor);
//	console.log(roleDemon + "," + roleGentil);
	if(canCreateRole){
		if(roleDemon === null){
			roleDemon = guild.createRole({name:'demon', permissions:[], color:'#e91e63'});
		}
		if(roleGentil === null){
			roleGentil = guild.createRole({name:'gentil', permissions:[], color:'#f1c40f'});
		}
	}
}
if(auth != null){
	client.login(auth.token);
}
//const roleGentil = client.guild.roles.find("name", "gentil");