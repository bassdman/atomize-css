const { stylesCSSStrategy, 
    stylesEndStrategy, 
    stylesStartStrategy, 
    stylesHeadStartStrategy,
    stylesHeadEndStrategy,
    stylesBodyStartStrategy,
    stylesBodyEndStrategy,
    stylesBeforeCurrentStrategy,
    stylesAfterCurrentStrategy
 } = require("./outputStrategies");

const { HTMLTemplate } = require("./HTMLTemplate");

const fs = require('fs-extra');


module.exports = function (config = {}) {
    if (config.src == undefined)
        throw new Error('src is undefined');

    const defaults = {
        transform: {},
        outputStrategy: 'htmltag_end'
    };
    config = Object.assign({}, defaults, config);

    const content = fs.readFileSync(config.src, 'UTF-8');
    const template = new HTMLTemplate(content, config);

    template.setVar('styletagidentifier', 'atomiccss_' + (Math.random().toString(36).substring(7)));



    template.addRules(config.rules);

    console.log(template.getMatches())
    console.log(template.html());

    const matches = template.getMatches();
    let output = getOutput(matches, config.outputStrategy, template);

    console.log(output);
}

function getOutput(matches, output, template) {
    if (typeof output == 'function')
        return output.apply(this, [matches, template, template.$])

    switch (output) {
        case 'css': return stylesCSSStrategy(matches, template, template.$); break;
        case 'htmltag_end': return stylesEndStrategy(matches, template, template.$); break;
        case 'htmltag_start': return stylesStartStrategy(matches, template, template.$); break;
        case 'htmltag_headstart': return stylesHeadStartStrategy(matches, template, template.$); break;
        case 'htmltag_headend': return stylesHeadEndStrategy(matches, template, template.$); break;
        case 'htmltag_bodystart': return stylesBodyStartStrategy(matches, template, template.$); break;
        case 'htmltag_bodyend': return stylesBodyEndStrategy(matches, template, template.$); break;
        case 'htmltag_beforeelem': return stylesBeforeCurrentStrategy(matches, template, template.$); break;
        case 'htmltag_afterelem': return stylesAfterCurrentStrategy(matches, template, template.$); break;
        default: throw new Error('outputStrategy ' + config.outputStrategy + ' does not exist. Choose an existing one.')
    }
}
