module.exports = {
    src: './examples/basic/template.html',
    dist: 'dist/template.html',
    rules: {
        displayNone: 'display:none;',
        widthabc: '.widthabc{width:5px}',
        aligncenter: '.#selector{width:5px}',
        'width(#width)': '.#selector{width: #width;}',
        'width(#width,#margin)': 'width: #width; margin: #margin}',
    }
}