const db = require('quick.db');
module.exports.level = (client, user) => {
    if(user.id === client.owner) return 10;
    else if(client.admins.includes(user.id)) return 9;
    else if(client.blacklisted.includes(user.id)) return 0;
    else if(user.guild) {
        let settings = db.fetch(`settings_${user.guild.id}`);
        if(user.guild.ownerID === user.id) return 8;
        else if(user.hasPermission('ADMINISTRATOR')) return 7;
        else if(user.hasPermission('MANAGE_SERVER')) return 6;
        else if(settings.djRole && user.roles.has(settings.djRole)) return 5;
        else if(user.hasPermission('KICK_MEMBERS') || user.hasPermission('BAN_MEMBERS')) return 4;
        else if(user.hasPermission('MANAGE_MESSAGES')) return 3;
        else return 1; /// normal member
    }
    else return 1; // normal user
};