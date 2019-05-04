const cheerio = require('cheerio');

const { parseStyle } = require("./parseStyle");


function HTMLTemplate(content, config = {}) {
    const $ = cheerio.load(content);
    const variables = {};
    const rules = {};

    return {
        html: function () {
            return $.html(':root');
        },
        $: $,
        matchesRule: function (selectorRaw) {
            //notwendig, da sonst $(selectorRaw einen Fehler wirft)
            const selector = '.' + escapeSelector(selectorRaw);

            if ($(selector).length > 0)
                return true;

            const cleanedSelector = selector.replace(/(\.|\\|\(.*\))/g, "") + '(';
            const attrSelector = `[class^="${cleanedSelector}"],[class*=" ${cleanedSelector}"]`;
            return $(attrSelector).length > 0
        },
        getMatches: function(){
            const stylesParsed = [];

            Object.keys(rules).forEach(selector => {        
                if (this.matchesRule(selector))
                {    
                    const style = rules[selector];
                    console.log('use selector' + selector)
                    stylesParsed.push( {
                         style: parseStyle(style, selector) || '',
                         selectorRule: selector,
                         found: 'found'
                    })
                }
            })
            return stylesParsed;
        },
        addRules: function(newRules){
            if(newRules == undefined)
                throw new Error('HTMLTemplate.addRules(rules): rules is null');
            
            if(! typeof newRules === 'object')
                throw new Error('HTMLTemplate.addRules(rules): rules must be an object {}.')

            Object.assign(rules,newRules);
        },
        getVar(name) {
            return variables[name];
        },
        setVar(name, value) {
            return variables[name] = value;
        }
    };
}

function escapeSelector(selector) {
    return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.HTMLTemplate = HTMLTemplate;
