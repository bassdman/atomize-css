#! /usr/bin/env node
const path = require('path');
let config = {};
//keine Parameter
if(process.argv.length == 2)
{
    throw `You need minimum 1 Parameter.
        1 Parameter(configpath)
        3 Parameters (src,dest,configpath)
    `
}
//keine Parameter
else if(process.argv.length == 3)
{
    config = require(path.join(process.cwd(),process.argv[2]));
}
else if(process.argv.length == 4)
{
    config = {
        src:  path.join(process.cwd(),process.argv[2]),
        dest: path.join(process.cwd(),process.argv[3])
    }
}
else if(process.argv.length == 5)
{
    config = require(path.join(process.cwd(),process.argv[4]));
    config.src = path.join(process.cwd(),process.argv[2]);
    config.dest = path.join(process.cwd(),process.argv[3]);
}

require('../src/index')(config);