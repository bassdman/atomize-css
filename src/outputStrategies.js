function stylesCSSStrategy(matches, template, $) {
    return matches.map(match => match.style).join('');
}
exports.stylesCSSStrategy = stylesCSSStrategy;


function stylesEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    const parentElem = $('body') ? $('body') : $(':root');
    $(parentElem).append(`<style>${cssrules}</style>`);
    return $.html(':root');
}
exports.stylesEndStrategy = stylesEndStrategy;


function stylesStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    const parentElem = $('head') ? $('head') : $(':root');
    $(parentElem).prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesStartStrategy = stylesStartStrategy;


function stylesHeadStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('head').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesHeadStartStrategy = stylesHeadStartStrategy;


function stylesHeadEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('head').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesHeadEndStrategy = stylesHeadEndStrategy;


function stylesBodyStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('body').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesBodyStartStrategy = stylesBodyStartStrategy;


function stylesBodyEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('body').append(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesBodyEndStrategy = stylesBodyEndStrategy;


function stylesBeforeCurrentStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    curElem.prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesBeforeCurrentStrategy = stylesBeforeCurrentStrategy;


function stylesAfterCurrentStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    curElem.append(`<style>${cssrules}</style>`);

    return $.html(':root');
}
exports.stylesAfterCurrentStrategy = stylesAfterCurrentStrategy;

