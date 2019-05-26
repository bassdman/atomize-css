const cheerio = require('cheerio');

exports.applyRules = function(rules,template) {
    console.log(rules)
    const $ = cheerio.load(template);
    const matchingRules = [];

    Object.values(rules).forEach(rule => {
        const matches = $(rule.selector);
        if(matches.length)
            matchingRules.push(rule);
    })
    return matchingRules;
}