function escapeSelector(selector) {
    return selector.replace(/[.@*+?^${}()|[\]\\,\'\":]/g, '\\$&');
}
exports.escapeSelector = escapeSelector;

function escapeSelectorLight(selector){
    return selector.replace(/[(),]/g, '\\$&');
}
exports.escapeSelectorLight = escapeSelectorLight;
