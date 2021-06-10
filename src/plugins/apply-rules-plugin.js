const cheerio = require('cheerio');

exports.applyRules = function(rules,template) {
    const $ = cheerio.load(template);
    const matchingRules = [];

    Object.values(rules).forEach(rule => {
        const matches = $(rule.selector);
        if(matches.length)
            matchingRules.push(rule);
    })
    return matchingRules;
}