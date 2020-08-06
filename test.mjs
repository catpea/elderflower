#!/usr/bin/env -S node --experimental-modules --trace-warnings

import merge from 'lodash/merge.js';
import assign from 'lodash/assign.js';

const result1 = assign( {name:'eeny'}, {name: 'meeny'}, {name: 'miny'}, {name: 'moe'}, {name:undefined} );
const result2 = merge( {}, {name:undefined}, {}, {name: 'moe'}, {} , {name:undefined});

console.log(result1);
console.log(result2);
