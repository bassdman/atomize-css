//import { src, dest } from 'vinyl-fs';
import parser from 'css';
import { EventEmitter } from 'events';
import { src } from 'vinyl-fs';
import map from 'map-stream';


function getSelectors(rules) {
    const found = [];
    for (let rule of rules) {
        found.push(...rule.selectors);
    }
    return found;
}

function addToSearchTermMap(file, map) {
    if (!file.content)
        return;

    const ast = parser.parse(file.content);
    const selectors = getSelectors(ast.stylesheet.rules);

    const queries = selectors.flatMap(selector => selector.split(/[\s\[\]\.#\"=*]/g).filter(entry => entry != ''))

    for (let query of queries) {
        if (!map[query])
            map[query] = [];

        map[query].push({
            ...file,
            found: false
        })
    }
}

function createSearchTermMap(files, events) {
    const searchTermsMapped = {};

    for (let file of files) {
        addToSearchTermMap(file, searchTermsMapped);
    }

    return searchTermsMapped;
}

async function initCssFiles(css = '', cssSrc) {
    const files = [];

    if (css) {
        files.push({
            file: '_inline',
            content: css
        })
    }

    if (cssSrc) {
        return new Promise((resolve, reject) => {
            src(cssSrc)
                .on('end', () => { resolve(files) })
                .pipe(map(function(file, cb) {
                    files.push(file)
                    cb(null, file)
                }))
        });
    }

    return files;
}
/**
 * 
 * @param conf 
 * .css - the css - already parsed
 * .cssSrc -- thecss-files source
 * .srcTemplates the html- and js-files, where the selectors are searched
 * .dest - destination where it should be written
 */
async function cssar(conf = {}) {
    const events = new EventEmitter();

    const files = await initCssFiles(conf.css, conf.cssSrc);
    const _map = createSearchTermMap(files, events);

    console.log(_map)

    return {
        events
    }
}

export {
    cssar
}