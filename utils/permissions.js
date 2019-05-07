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
        else if(user.hasPermission('KICK_MEMBERS') || user.hasPermission('BAN_MEMBERS')) return 5;
        else if(user.hasPermission('MANAGE_MESSAGES')) return 4;
        else if(settings.djRole && user.roles.has(settings.djRole)) return 3;
        else return 1; /// normal member
    }
    else return 1; // normal user
};

module.exports.get = (perm) => {
    switch(perm) {
      case 1: return 'Sorry, you are not allowed to use this command as you have been blacklisted. PM `ImmortalSnake#9836` for an appeal';
      case 2: return;
      case 3: return 'Only members with the DJ Role is allowed to use this command'
      case 4: return 'You need the `Manage Messages` permission to use this command';
      case 5: return 'You need the `Kick Members` or the `Ban Members` permission to use this command'
      case 6: return 'You need the `Manage Server` permission to use this command';
      case 7: return 'You need the `Administrator` permission to use this command';
      case 8: return 'Only guild owners can use this command'
      case 9: return 'Only bot admins can use this command'
      case 10: return 'Only the bot owner can use this command'
    }
};