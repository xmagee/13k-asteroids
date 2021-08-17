const minify = require('minify'), 
    fs = require('fs'), 
    path = require('path'),
    output_dir = 'build/';

if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir);
} else {
    fs.rmdirSync(output_dir, { recursive: true });
    fs.mkdirSync(output_dir);
}

minify(path.join(path.dirname('../'), 'src/index.html'), {
    html: {
        removeAttributeQuotes: false,
        removeOptionalTags: false,
    }})
    .then(m => {
        var output_file = `${output_dir}/index.html`;
        try {
            fs.writeFileSync(output_file, m);
            console.log(`minified html: ${fs.statSync(output_file).size / 1000.0} KB`)   ; 
        } catch (err) { 
            console.log(err);
        }
    })
    .catch(console.error);

minify(path.join(path.dirname('../'), 'src/index.js'), {
    js: {
        ecma: 5,
    }})
    .then(m => {
        var output_file = `${output_dir}/index.js`;
        try {
            fs.writeFileSync(output_file, m);
            console.log(`minified js: ${fs.statSync(output_file).size / 1000.0} KB`);
        } catch (err) { 
            console.log(err);
        }
    })
    .catch(console.error);