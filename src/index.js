const fs = require('fs-extra');
const path = require('path');

const basicRules = require('./rules/rules_basic');
const { defaultPostprocessing: defaultPostprocessingPlugin } = require('./plugins/default-postprocess-plugin');
const { cssparseplugin } = require('./plugins/css-parse-plugin')
const { applyRules } = require('./plugins/apply-rules-plugin');
const { genericClassesPlugin } = require('./plugins/css-generic-classes-plugin');

module.exports = async function (initialConf = {}) {
    if (initialConf.src == undefined)
        throw new Error('src is undefined');

    const defaults = {
        rules: '',
        preprocess: function({rules}){return rules;},
        postprocess: function(config){console.log('cnf',config);return config.output;}
    };
    const config = Object.assign({}, defaults, initialConf);
    const template = await fs.readFile(config.src, 'UTF-8');
    const preprocessedCss = await preprocess(config.preprocess,config.rules,template);
    
    const rules = basicRules.concat(preprocessedCss);
    const parsedRules = cssparseplugin(rules);
    const parsedRulesGeneric = genericClassesPlugin({rules:parsedRules,template});
    const outputRules = applyRules(parsedRulesGeneric,template)
    const output = await postprocess(outputRules,config.postprocess,template);
    
    console.log('output',output)
    if (config.dest)
        writeOutputToFile(config.dest, output);
}

async function preprocess(preprocessors,rules,template){
    if(typeof preprocessors === 'function')
        preprocessors = [preprocessors]

        let modifiedRules = rules;
        for(processor of preprocessors){
            modifiedRules = await Promise.resolve(processor({rules: modifiedRules, template: template}));
        }
        return modifiedRules;
}

async function postprocess(matches, outputEntries, template) {
    let output = matches.map(match => match.style).join(' ');

    if(outputEntries == undefined)
        return output;

    if(!Array.isArray(outputEntries))
        outputEntries = [outputEntries];

    for(entry of outputEntries){
        console.log('outputy')
        if (typeof entry == 'function')
            output = await Promise.resolve(entry({ matches, template, output: output, outputEntry: entry }));
        else 
            output = await Promise.resolve(defaultPostprocessingPlugin({ matches, template, output, outputEntry: entry }));
    }
    console.log('outputx',output)
    return output;
}

function writeOutputToFile(filepath, output) {
    fs.ensureDirSync(path.dirname(filepath));
    fs.outputFileSync(filepath, output);
}