const cheerio = require('cheerio');

exports.genericClassesPlugin = function({rules,template}){
    const genericClassesInTemplate = getGenericClassesInTemplate(template); 
    let genericRules = getGenericRules(rules);
    const appliedRules = getAppliedRules(genericRules,genericClassesInTemplate);
    genericRules = genericRules.concat(appliedRules).filter(rule => !rule.isTemplate);
    console.log(genericRules)
    return appliedRules;
}

function getGenericClassesInTemplate(template){
    const $ = cheerio.load(template);

    let genericClassesInTemplate = []; 
    $('*').each(function(){
        const classList = $(this).attr('class') || '';

        //generische Klassen beinhalten immer eine Klammer
        const genericClasses = classList.split(/\s/).filter(cls => cls.includes('('));
        genericClassesInTemplate = genericClassesInTemplate.concat(genericClasses);
    })
    return genericClassesInTemplate;
}

function getGenericRules(rules){

    const genericRules =  Object.values(rules).map(rule => {
        const clonedRule = JSON.parse(JSON.stringify(rule));
        clonedRule.selector = rule.selector.replace(/[(),@]/g, '\\$&');
        clonedRule.args = rule.selector.replace(/.*\((.*)\)/,"$1").split(',');
        clonedRule.isTemplate = rule.selectorRaw.includes('(');
        clonedRule.selectorName = rule.selector.replace(/(.*)\(.*/,"$1")
        return clonedRule;
    })
    return genericRules;
}

function getAppliedRules(genericRules,genericClassesInTemplate){
    const addedRules = [];
    for(templateClass of genericClassesInTemplate){
        const templateClassName = templateClass.replace(/(.*)\(.*/,".$1");
        const templateClassArgs = templateClass.replace(/.*\((.*)\)/,"$1").split(',');

        for(genericRule of genericRules)
        {
            if(genericRule.args.length == templateClassArgs.length && genericRule.selectorName == templateClassName)
            {
                const clonedRule = JSON.parse(JSON.stringify(genericRule));
                const value = replaceParameters(genericRule.value,templateClassArgs,clonedRule.args);
                clonedRule.style = clonedRule.selector+value;
                clonedRule.isCompiled = true;
                clonedRule.args = templateClassArgs;
                clonedRule.value = value;
                delete clonedRule.isTemplate;
                addedRules.push(clonedRule);
            }
        }
    }
    return addedRules;
}

function replaceParameters(style, templateArgs, ruleArgs)
{
    let retStyle = style;
    for(i in templateArgs)
    {
        retStyle = retStyle.replace(ruleArgs[i],templateArgs[i]);
    }
    return retStyle;
}