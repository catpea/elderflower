#!/usr/bin/env -S node --experimental-modules --trace-warnings

import fs from 'fs-extra';
import path from 'path';
import merge from 'lodash/merge.js';

import css from './lib/css/index.mjs'
import html from './lib/html/index.mjs'
import defaults from './options.mjs'

async function main(){
  //console.log(`Current directory: ${process.cwd()}`);

  const userOptions = await import(path.join(process.cwd(), 'options.mjs'));
  const user = userOptions.default;

  const options = merge({}, defaults, user);

  //console.log(options);

  if(!options.variables) throw new Error('Missing configuration object: options.variables');
  if(!options.dataFeed) throw new Error('Missing configuration object: options.dataFeed');
  if(!options.newsFeed) throw new Error('Missing configuration object: options.newsFeed');
  if(!options.sourceDatabase) throw new Error('Missing configuration: object options.sourceDatabase');
  if(!options.website) throw new Error('Missing configuration object: options.website');
  if(!options.website.css) throw new Error('Missing configuration sub object: options.website.css');
  if(!options.website.template) throw new Error('Missing configuration sub object: options.website.template');

  if(!options.variables.title) throw new Error('Missing user configuration variable: options.variables.title');
  if(!options.variables.subtitle) throw new Error('Missing user configuration variable: options.variables.subtitle');
  if(!options.variables.author) throw new Error('Missing user configuration variable: options.variables.author');
  if(!options.variables.email) throw new Error('Missing user configuration variable: options.variables.email');
  if(!options.variables.version) throw new Error('Missing user configuration variable: options.variables.version');
  if(!options.variables.website) throw new Error('Missing user configuration variable: options.variables.website');
  if(!options.variables.canonical) throw new Error('Missing user configuration variable: options.variables.canonical');
  if(!options.variables.cname) throw new Error('Missing user configuration variable: options.variables.cname');
  if(!options.variables.sourcecode) throw new Error('Missing user configuration variable: options.variables.sourcecode');

  if(!options.dataFeed.directory) throw new Error('Missing configuration variable: options.dataFeed.directory');
  if(!options.dataFeed.file) throw new Error('Missing configuration variable: options.dataFeed.file');
  if(!options.sourceDatabase.audio) throw new Error('Missing configuration variable: options.sourceDatabase.audio');
  if(!options.sourceDatabase.image) throw new Error('Missing configuration variable: options.sourceDatabase.image');
  if(!options.website.directory) throw new Error('Missing configuration variable: options.website.directory');
  if(!options.website.partials) throw new Error('Missing configuration variable: options.website.partials');
  if(!options.website.styleguide) throw new Error('Missing configuration variable: options.website.styleguide');
  if(!options.website.stylesheet) throw new Error('Missing configuration variable: options.website.stylesheet');
  if(!options.website.cname) throw new Error('Missing configuration variable: options.website.cname. It is used to specify the filename of the github CNAME file.');
  if(!options.website.css.main) throw new Error('Missing configuration variable: options.website.css.main');
  if(!options.website.css.path) throw new Error('Missing configuration variable: options.website.css.path');
  if(!options.website.template.files) throw new Error('Missing configuration variable: options.website.template.files');
  if(!options.website.template.path) throw new Error('Missing configuration variable: options.website.template.path');
  if(!options.website.template.poem) throw new Error('Missing configuration variable: options.website.template.poem');
  if(!options.website.template.styleguide) throw new Error('Missing configuration variable: options.website.template.styleguide');
  if(!options.website.template.stylesheet) throw new Error('Missing configuration variable: options.website.template.stylesheet');


  await css(options);
  await html(options);
}

main();
