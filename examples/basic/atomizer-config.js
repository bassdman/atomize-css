module.exports = {
    src: './examples/basic/template.html',
    dest: 'dist/template.html',
    rules: {
        customclass: 'background:blue;content:"mei da is content"'
    },
    pseudoSelectors: {
        'h':'hover'
    }
}