const fs = require('fs');

module.exports = client => {
    fs.readdir('./events/', async (err, files) => {
        if (err) return new Error('\n[Events]\tThere was an error!');
        const jsfiles = files.filter(f => f.split('.').pop() === 'js');
        if (jsfiles.length === 0) throw new Error('\n[Events]\tNo events to load.');
        jsfiles.map(file => {
            let eventName = file.split('.')[0];
            let eventFunction = require(`./../events/${file}`);
            if (!eventFunction.run) throw new Error('\n${eventName} has no run function.');
            client.events.set(eventName, eventFunction);
            client.on(eventName, eventFunction.run.bind(null, client));
        });
        console.log(`[Events]\tLoaded a total of ${jsfiles.length} events.`);
    });
};