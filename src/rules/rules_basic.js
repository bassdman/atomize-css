module.exports = `
    @defaultmar: 5px;

    .margin(@margin){margin: @margin;}
    .displayNone{display: none;}
    .display(@type){display:@type}
    .background(@color){color: @color;}
    .border(@bd){border: @bd;}
    .border(@width,@type,@color){border: @width @type @color;}
    .visibility(@visibility){visibility: @visibility}
`
/*    'width(#width)': '.#selector{width: #width;}',
    'content(#content)': 'content: "#content"',
    'bg(#color)': 'background: #color;',
    'c(#color)': 'color: #color',
    'padding(#padding)': 'padding: #padding',
    displayBlock: 'display:block;'
}*/