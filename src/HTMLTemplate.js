const { escapeSelector } = require("./escapeSelector");

const cheerio = require('cheerio');
const CLASSNAME_PLACEHOLDER = '#selector';

function HTMLTemplate(content, config = {}) {
    const $ = cheerio.load(content);
    const rules = {};

    return {
        html: function () {
            return $.html(':root');
        },
        $: $,
        matchedClasses: function (selectorRaw) {
            //notwendig, da sonst $(selectorRaw einen Fehler wirft)
            const selector = '.' + escapeSelector(selectorRaw);

            if ($(selector).length > 0)
                return $(selector);

            const endCharacter = selector.includes('(') ? '(': ':';
            const cleanedSelector = selector.replace(/(\.|\\|\(.*\)|\:.*)/g, "") + endCharacter;
            const attrSelector = `[class^="${cleanedSelector}"],[class*=" ${cleanedSelector}"]`;
            return $(attrSelector);
        },
        getMatches: function () {
            const stylesParsed = [];

            Object.keys(rules).forEach(selector => {
                const matches = this.matchedClasses(selector)
                if (matches.length <= 0)
                    return;

                matches.each(function (match) {
                    const classList = $(this).attr('class').split(/\s+/);
                    const matchingClass = classList.map(cls => {
                        const pseudoSelector = cls.replace(/.*\:/,':').includes(':') ? cls.replace(/.*\:/,':') : '';
                        const parametersUserclass = cls.includes(')') ? cls.replace(/.*\((.*)\)/, "$1").replace(pseudoSelector,'').split(',') : [];
                        const parametersTemplate = selector.includes(')') ? selector.replace(/.*\((.*)\)/, "$1").split(',') : [];
                        const classnameUserclass = cls.replace(/\(.*\)/, '').replace(pseudoSelector,'');
                        const classnameTemplate = selector.replace(/\(.*\)/, '');
                        const stylesheetSelector = escapeSelector(cls) + pseudoSelector;
                        const match = parametersUserclass.length == parametersTemplate.length
                            && classnameUserclass == classnameTemplate;

                        const parameters = {};

                        if(match)
                        {
                            for(i in parametersTemplate){
                                const key = parametersTemplate[i];
                                if(!key.startsWith('@'))
                                    throw new Error('Rule "'+selector+'": Parameters of a rule must start with a . Example: "aselector(@param1,@param2)"');
                                
                                const value = parametersUserclass[i];
                                parameters[key] = value;
                            }
                        }

                        const retVal = {
                            userclass: cls,
                            rule: selector,
                            parametersUserclass,
                            parametersTemplate,
                            classnameUserclass,
                            classnameTemplate,
                            stylesheetSelector,
                            match,
                            parameters,
                            pseudoSelector
                        }

                        return retVal;
                    })
                        .filter(metadata => metadata.match)
                        .forEach(metadata => {
                            const style = rules[selector];
                            stylesParsed.push({
                                style: parseStyle(style, selector,metadata) || '',
                                matchingRule: selector,
                                found: metadata.userclass,
                                params: metadata.parameters
                            })
                        });

                })
            })
            return stylesParsed;
        },
        addRules: function (newRules) {
            if (newRules == undefined)
                throw new Error('HTMLTemplate.addRules(rules): rules is null');

            if (! typeof newRules === 'string')
                throw new Error('HTMLTemplate.addRules(rules): rules must be a string.')

            Object.assign(rules, newRules);
        }
    };
}

function parseStyle(style, classname, metadata) {
    let styleParsed = style.includes('{') ? style.replace(CLASSNAME_PLACEHOLDER, metadata.stylesheetSelector+metadata.pseudoSelector) : `.${metadata.stylesheetSelector}{${style}}`

    for (key of Object.keys(metadata.parameters)) {
        styleParsed = styleParsed.replace(new RegExp(key, 'g'), metadata.parameters[key]);
    }
    return styleParsed;
}

exports.HTMLTemplate = HTMLTemplate;
