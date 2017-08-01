#!/usr/bin/env node
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs-extra');
const path = require('path');

if (argv.help){
    console.log(`
        generate-index-html <options> 
        
        --filename - defaults to index.html. specify the output file name.
         
                     generate-index-html --filename my-index.html
        
        --cwd      - defaults to process.cwd(). specify different working directory
        
        --root     - defaults to current dir. changes the path link to file. 
        
        --pattern  - defaults to **/*. override the pattern to find files
        
        --console  - defaults to false. will print the content to console instead of a file
    `);
}

const filename = argv.filename || 'index.html';
const pattern = argv.pattern || '**/*';

const opts = {};

if (argv.cwd){
    opts.cwd = argv.cwd || process.cwd();
}

if (argv.root){
    opts.root = argv.root || process.cwd();
}


glob(pattern, opts, function(err, files){
    const body = files.map((f)=>({relative: path.join(opts.root, f), original: f})).filter((f)=>fs.lstatSync(f.relative).isFile()).map((f)=>`<a href=${f.original}>${f.original}</a>`).join('<br/>');
    const filecontent = `<html><body>${body}</body></html>`;
    if (argv.console) {
        console.log(filecontent);
    }else{
        fs.ensureDir(path.dirname(filename));
        fs.writeFileSync(filename,filecontent);
    }
});