const minify = require('minify'), 
    fs = require('fs'), 
    path = require('path'),
    input_file = path.join(path.dirname('../'), 'src/index.html')
    output_dir = 'build/', 
    output_file = `${output_dir}index.html`

minify(input_file, {
    html: {
        removeAttributeQuotes: false,
        removeOptionalTags: false,  
        ecma: 5,
    }})
    .then(minified => {
        if (!fs.existsSync(output_dir)) {
            fs.mkdirSync(output_dir)
        } else if (fs.existsSync(output_file)) {
            fs.rmSync(output_file)
        }

        try {
            fs.writeFileSync(output_file, minified)
            console.log(`build complete, final size: ${fs.statSync(output_file).size / 1000.0} KB`)    
        } catch (err) { 
            console.log(err)
        }
    })
    .catch(console.error)