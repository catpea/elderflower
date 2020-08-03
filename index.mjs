#!/usr/bin/env -S node --experimental-modules

import path from 'path';
import merge from 'lodash/merge.js';

import css from './lib/css/index.mjs'
import html from './lib/html/index.mjs'
import defaults from './options.mjs'

async function main(){
  //console.log(`Current directory: ${process.cwd()}`);

  const userOptions = await import(path.join(process.cwd(), 'options.mjs'));
  const user = userOptions.default;

  const options = merge({},defaults,user);

  //console.log(options);

  await css(options);
  await html(options);
}

main();
