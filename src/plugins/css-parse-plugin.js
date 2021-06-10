const parser = require('css');

exports.cssparseplugin = function (config) {
    if (typeof config == 'string')
        config = { rules: config };

    const rules = {};

    const ast = parser.parse(config.rules);

    ast.stylesheet.rules.forEach(rule => {
        if (!rule.selectors)
            return;

        rule.selectors.forEach(selector => {
            if (!rules[selector])
                rules[selector] = [];

            let value;

            switch (rule.type) {
                case 'rule': value = getValue(rule, selector); break;
                case 'document': value = getValue(rule.document, selector); break;
                case 'host': value = getValue(rule.host, selector); break;
                case 'media': value = getValue(rule.media, selector); break;
                case 'supports': value = getValue(rule.supports, selector); break;
            }
            rules[selector] = value;
        })
    });

    return rules;
}

function getValue(rule, selector) {
    if (rule == undefined)
        return;

    if (!rule.declarations)
        return '';

    let retVal = {
        value: '{',
        properties: {},
        selectorRaw: selector,
        selector
    };

    rule.declarations.forEach(declaration => {

        retVal.value += `${declaration.property}:${declaration.value};`
        retVal.properties[declaration.property] = declaration.value;
    });

    retVal.value += '}';
    retVal.valueRaw = retVal.value;
    retVal.style = selector + retVal.value;

    return retVal;
}