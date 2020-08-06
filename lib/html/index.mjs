#!/usr/bin/env -S node --experimental-modules

import {inspect} from 'util';

import fs from 'fs-extra';
import path from 'path';

import matter from 'gray-matter';

import pretty from 'pretty';
import prettier from 'prettier';
import cheerio from 'cheerio';

import marked from 'marked';
import moment from 'moment';
import tz from 'moment-timezone';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import padStart from 'lodash/padStart.js';
import merge from 'lodash/merge.js';

import handlebars from 'handlebars';


/**
 credit: https://github.com/helpers/handlebars-helpers/blob/master/lib/array.js
 * Reverse the elements in an array, or the characters in a string.
 *
 * ```handlebars
 * <!-- value: 'abcd' -->
 * {{reverse value}}
 * <!-- results in: 'dcba' -->
 * <!-- value: ['a', 'b', 'c', 'd'] -->
 * {{reverse value}}
 * <!-- results in: ['d', 'c', 'b', 'a'] -->
 * ```
 * @param {Array|String} `value`
 * @return {Array|String} Returns the reversed string or array.
 * @api public
 */

handlebars.registerHelper('reverse', function(val) {
   if (Array.isArray(val)) {
     val.reverse();
     return val;
   }
   if (val && typeof val === 'string') {
     return val.split('').reverse().join('');
   }
 })

handlebars.registerHelper("isAbove", function(context, min, options) {
   if(context > min) return options.fn(context);
 });

handlebars.registerHelper("matches", function(a, b, options) {
  return (a == b);

  // console.log({a,b});
  //  if(a == b){
  //    console.log(options);
  //    if(options.fn){
  //      return options.fn(this);
  //   }
  //  }
 });



import beautifulPagination from 'beautiful-pagination';






async function main(options){



console.log('Reset Destination Directory');


console.log('Copy Files');
fs.copySync(path.resolve(options.website.template.files), path.resolve(path.join(options.website.directory)))
fs.copySync(path.resolve(options.sourceDatabase.audio), path.resolve(path.join(options.website.directory, path.basename(path.resolve(options.sourceDatabase.audio)))))
fs.copySync(path.resolve(options.sourceDatabase.image), path.resolve(path.join(options.website.directory, path.basename(path.resolve(options.sourceDatabase.image)))))

console.log('Load Partials');
fs.readdirSync(path.join(options.website.template.path, options.website.partials))
.filter(name=>name.endsWith('.hbs'))
.map(file=>({file, name: path.basename(file, '.hbs')}))
.map(o=>({...o, path: path.join(options.website.template.path, options.website.partials, o.file)}))
.map(o=>({...o, content: fs.readFileSync(o.path).toString()}))
.forEach(o=>handlebars.registerPartial(o.name, o.content));

console.log('Load News Feed');
const newsLocation = path.resolve(path.join(options.newsFeed.directory, options.newsFeed.file));
const news = fs.readFileSync(newsLocation).toString().split(/\n/).filter(i=>i).filter(i=>!i.match(/^\s*#/)).map(line=>{
  let [date, title, text] = line.split('|').map(i=>i.trim());
  return { date:(new Date(date)).toString(), title, text};
})

console.log('Load Data Feed');
const dataLocation = path.resolve(path.join(options.dataFeed.directory, options.dataFeed.file));
const feed = merge( {news}, fs.readJsonSync(dataLocation), options.variables ); // direction from left to right so a, b, a is deep overloaded by b



 

// NOTE: Create poem specific pages.
const poemTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.website.template.path, options.website.template.poem))).toString());

for (let section of feed.chapter.data){
  for (let poem of section.data){
    const filename = poem.meta.id + '.html';
    // NOTE: Render poemTemplate and save the page
    let poemHtml = poemTemplate(Object.assign({filename},feed,poem));
    poemHtml = pretty(poemHtml, {ocd: true});
    const fileLocation = path.resolve(path.join(options.website.directory, filename));
    fs.writeFileSync(fileLocation, poemHtml);
  }
}



function render(id, feed){
// NOTE: Creation of an easy to browse table of contents, based on sections.
const filename = options.website[id];
const indexTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.website.template.path, options.website.template[id]))).toString());
const indexLocation = path.resolve(path.join(options.website.directory, filename));
// NOTE: Render Template
let indexHtml = indexTemplate(merge({filename},feed));
indexHtml = pretty(indexHtml, {ocd: true});
// NOTE: Save the page to index file
fs.writeFileSync(indexLocation, indexHtml);
}


render('index', feed);
render('toc', feed);
render('poems', feed);
render('news', feed);

const cnameLocation = path.resolve(path.join(options.website.directory, options.website.cname));
fs.writeFileSync(cnameLocation, feed.cname);


}


export default main;
