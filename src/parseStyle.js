const CLASSNAME_PLACEHOLDER = '#selector';

function parseStyle(style, classname,found) {
    if (style.includes('{'))
        return ' ' + style.replace(CLASSNAME_PLACEHOLDER, classname);
    return ` .${classname}{${style}}`;
}
exports.parseStyle = parseStyle;
