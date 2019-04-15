

const hbs = require('hbs');
hbs.registerHelper('equal', function(a, b) {
    if(a == b) 
        return true;
    else
        return false;
}); 