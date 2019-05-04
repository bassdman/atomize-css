const CLASSNAME_PLACEHOLDER = '#selector';

function parseStyle(style, classname, metadata) {
    const styleWithoutParams = style.includes('{') ? style.replace(CLASSNAME_PLACEHOLDER, metadata.stylesheetSelector) : `.${metadata.stylesheetSelector}{${style}}`

    return replaceParameters(styleWithoutParams, metadata.parameters)
}
exports.parseStyle = parseStyle;

function replaceParameters(style, parameters) {
    for (key of Object.keys(parameters)) {
        style = style.replace(new RegExp(key, 'g'), parameters[key]);
    }
    return style;
}