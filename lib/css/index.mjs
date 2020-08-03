#!/usr/bin/env -S node --experimental-modules

import fs from 'fs-extra';
import path from 'path';

import prettier from 'prettier';

import postcss  from 'postcss';
import postcssJs  from 'postcss-js';
import precss  from 'precss';
import sorting  from 'postcss-sorting';
import autoprefixer  from 'autoprefixer';
import Midas from 'midas';

import merge from 'lodash/merge.js';
import moment from 'moment';
import tz from 'moment-timezone';

import handlebars from 'handlebars';

async function main(options){

// Load Partials
fs.readdirSync(path.join(options.website.template.path, options.website.partials))
.filter(name=>name.endsWith('.hbs'))
.map(file=>({file, name: path.basename(file, '.hbs')}))
.map(o=>({...o, path: path.join(options.website.template.path, options.website.partials, o.file)}))
.map(o=>({...o, content: fs.readFileSync(o.path).toString()}))
.forEach(o=>handlebars.registerPartial(o.name, o.content));


const midas = new Midas({wrap: true});

const sortingOptions = {
      'order': [
        'custom-properties',
        'dollar-variables',
        'declarations',
        'rules',
        'at-rules',
      ],

      'properties-order': 'alphabetical',

      'unspecified-properties-position': 'bottom'
    };



    function rem(str){return str+'rem'};

    function calculate(options){
      const base = merge({}, options.styles);
      const responsive = {};

      options.breakpoints.forEach((breakpointWidth,index)=>{
        const containerWidth = options.container[index];
        responsive[`@media (min-width: ${breakpointWidth}px)`] = {'body > *':{maxWidth: `${containerWidth}px`}};
      })

      options.breakpoints.forEach((breakpointWidth,index)=>{
        const containerWidth = options.container[index];
        responsive[`@media (min-width: ${breakpointWidth}px)`] = {'body > *':{maxWidth: `${containerWidth}px`}};
      })

      options.responsive.forEach((item)=>{
         let location = base;
        for(let fragment of item.path){
          if(!location[fragment]) location[fragment] = {};
          location = location[fragment];
        }
        for(let setup of item.property){
          location[setup.name] = setup.from + setup.unit;
        }
      });

      options.responsive.forEach((item)=>{
        options.breakpoints.forEach((breakpointWidth,increase)=>{

          let location = responsive[`@media (min-width: ${breakpointWidth}px)`]
          for(let fragment of item.path){
            if(!location[fragment]) location[fragment] = {};
            location = location[fragment];
          }
          for(let setup of item.property){
            let fraction = (setup.to - setup.from) / options.breakpoints.length;
            // ????????????? location[setup.name] = setup.from + setup.unit;
            location[setup.name] = (setup.from + (fraction*(increase+1))).toFixed(2) + setup.unit;
          }
        })
      })

      const response = merge({}, base, responsive);
      return response;
    }


    async function objectCss(options){

      const css = calculate(options);
      return css;

    }




  const setup = (await import( path.resolve(path.join(options.website.css.path, options.website.css.main)) )).default;



  const {css:precssCss} = await postcss().process(await objectCss(setup), { parser: postcssJs, from:undefined });

  const {css:unformattedCss} = await postcss([ precss({}), autoprefixer(), sorting(sortingOptions) ]).process(precssCss,{from:undefined});

  const css = prettier.format(unformattedCss, { parser: "css" });

  //console.log(css);



  const stylesheetLocation = path.resolve(path.join(options.website.directory, options.website.stylesheet));
  const stylesheetOptions = {
    meta: {
      title: 'CSS Stylesheet',
      timestamp: moment((new Date())).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z"),
      author: options.author,
      canonical: options.website.canonical,
    },
    data:{
      css
    }
  };


  const stylesheetTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.website.template.path, options.website.template.stylesheet))).toString());
  const stylesheet = stylesheetTemplate(stylesheetOptions);
  //console.log(stylesheet);

  fs.ensureDirSync(path.dirname(stylesheetLocation));
  fs.writeFileSync(stylesheetLocation, stylesheet);




  const styleguideLocation = path.resolve(path.join(options.website.directory, options.website.styleguide));
  const styleguideOptions = {
    meta: {
      title: 'CSS Stylesheet',
      timestamp: moment((new Date())).tz("America/Detroit").format("MMMM Do YYYY, h:mm:ss a z"),
      author: options.author,
      canonical: options.website.canonical,
    },
    data:{
      html: postcss().process(stylesheet, {stringifier: midas.stringifier}).css
    }
  };
  const styleguideTemplate = handlebars.compile(fs.readFileSync(path.resolve(path.join(options.website.template.path, options.website.template.styleguide))).toString());
  const styleguide = styleguideTemplate(styleguideOptions);


  fs.ensureDirSync(path.dirname(styleguideLocation));
  fs.writeFileSync(styleguideLocation, styleguide);





}

export default main;
