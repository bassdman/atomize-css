module.exports = {
    src: './examples/basic/template.html',
    dest: 'dist/template.html',
    rules: `
        .customclass{
            width: 100%;
        }

        .customclass(){
         width: 100%;
        }
    `,
}