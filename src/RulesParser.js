const less = require('less');
const {escapeSelectorLight} = require('./escapeSelector');

function RulesParser() {
    return {
        parse: function (rules) {
            return less.render(rules,{minify:true})
                .then(output => {
                    const matches = rules.split('}');

                    const rulesOutput = {}
                    
                    matches.map(match => match + '}')
                        .forEach(match => {
                            const selector = match.split('{')[0].replace('\\n','').replace(/[\s\.]/g,'');
                            if(selector != '}')
                            rulesOutput[selector] = escapeSelectorLight(match);
                        })
                    return rulesOutput;
                })
                .catch(err => {
                    console.log( "\x1b[31m",`Error parsing the rules: "${err.message}" in rule`)
                    console.log("\x1b[36m",err.extract.join('\n'))
                    console.log("\x1b[37m")
                    return {};
                });
        }
    };
}

module.exports = RulesParser;
