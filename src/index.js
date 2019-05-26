const fs = require('fs-extra');
const path = require('path');

const basicRules = require('./rules/rules_basic');
const { outputplugin } = require('./plugins/postprocess-plugin');
const { cssparseplugin } = require('./plugins/css-parse-plugin')
const { applyRules } = require('./plugins/apply-rules-plugin');

module.exports = async function (initialConf = {}) {
    if (initialConf.src == undefined)
        throw new Error('src is undefined');

    const defaults = {
        rules: '',
        preprocess: function({rules}){return rules;},
        postprocess: function({output}){return output;}
    };
    const config = Object.assign({}, defaults, initialConf);
    const template = await fs.readFile(config.src, 'UTF-8');
    const preprocessedCss = await preprocess(config.preprocess,config.rules,template);
    
    const rules = basicRules.concat(preprocessedCss);
    const parsedRules = cssparseplugin(rules);
    const outputRules = applyRules(parsedRules,template)
    const output = await postprocess(outputRules,config.postprocess,template);
    
    if (config.dest)
        writeOutputToFile(config.dest, output);
}

async function preprocess(preprocessors,rules,template){
    if(typeof preprocessors === 'function')
        preprocessors = [preprocessors]

        let modifiedRules = rules;
        for(processor of preprocessors){
            modifiedRules = await Promise.resolve(processor({rules: rules, template: template}));
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
        if (typeof entry == 'function')
            output = await Promise.resolve(outputEntries.apply(this, { matches, template, output, outputEntry: entry }));
        else 
            output = await Promise.resolve(outputplugin({ matches, template, output, outputEntry: entry }));
    }
    return output;
}

function writeOutputToFile(filepath, output) {
    fs.ensureDirSync(path.dirname(filepath));
    fs.outputFileSync(filepath, output);
}