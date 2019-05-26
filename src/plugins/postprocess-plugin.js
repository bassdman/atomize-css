function stylesEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    const parentElem = $('body') ? $('body') : $(':root');
    $(parentElem).append(`<style>${cssrules}</style>`);
    return $.html(':root');
}

function stylesStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    const parentElem = $('head') ? $('head') : $(':root');
    $(parentElem).prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesHeadStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('head').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesHeadEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('head').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesBodyStartStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('body').prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesBodyEndStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    $('body').append(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesBeforeCurrentStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    curElem.prepend(`<style>${cssrules}</style>`);

    return $.html(':root');
}

function stylesAfterCurrentStrategy(matches, template, $) {
    const cssrules = matches.map(match => match.style).join('');
    curElem.append(`<style>${cssrules}</style>`);

    return $.html(':root');
}

exports.outputplugin = function({matches,template,$,css,outputEntry}) {
    switch (outputEntry) {
        case 'htmltag_end': return stylesEndStrategy(matches, template, $); break;
        case 'htmltag_start': return stylesStartStrategy(matches, template, $); break;
        case 'htmltag_headstart': return stylesHeadStartStrategy(matches, template, $); break;
        case 'htmltag_headend': return stylesHeadEndStrategy(matches, template, $); break;
        case 'htmltag_bodystart': return stylesBodyStartStrategy(matches, template, $); break;
        case 'htmltag_bodyend': return stylesBodyEndStrategy(matches, template, $); break;
        case 'htmltag_beforeelem': return stylesBeforeCurrentStrategy(matches, template, $); break;
        case 'htmltag_afterelem': return stylesAfterCurrentStrategy(matches, template, $); break;
        default: return css; break;
    }
}