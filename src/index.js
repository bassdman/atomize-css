const fs = require('fs-extra');
const path = require('path');

const basicRulesFile = require('./rules/rules_basic');
const RulesParser = require('./RulesParser');
const { HTMLTemplate } = require("./HTMLTemplate");
const { outputplugin } = require('./plugins/outputplugin');

const rulesParser = new RulesParser();
module.exports = async function (config = {}) {
    if (config.src == undefined)
        throw new Error('src is undefined');

    const defaults = {
        rules: '',
        transform: {},
        outputStrategy: 'htmltag_end'
    };
    config = Object.assign({}, defaults, config);

    const content = await fs.readFile(config.src, 'UTF-8');
    const template = new HTMLTemplate(content, config);

    Promise.all([rulesParser.parse(basicRulesFile), rulesParser.parse(config.rules)])
        .then(rules => {
            template.addRules(rules[0]);
            template.addRules(rules[1]);
            const matches = template.getMatches();
            let output = getOutput(matches, config.output, template);

            if (config.dest)
                writeOutputToFile(config.dest, output);
        })
        .catch(err => {
            console.log(err)
        });


}

function getOutput(matches, outputEntry, template) {
    const css = allCSS(matches);

    console.log(matches)
    if (typeof outputEntry == 'function')
        return outputEntry.apply(this, { matches, template, $: template.$, css, outputEntry })

    return outputplugin({ matches, template, $: template.$, css, outputEntry });
}

function writeOutputToFile(filepath, output) {
    fs.ensureDirSync(path.dirname(filepath));
    fs.outputFileSync(filepath, output);
}

function allCSS(matches) {
    return matches.map(match => match.style).join('');
}