const options = {

  variables:{
    title: '',
    subtitle: '',
    author: '',
    email: '',
    version: '',

    website: '',
    canonical: '',
    sourcecode: '',
  },


  // Database Containing Posts
  sourceDatabase: {
    path: './db',
    audio: './db/audio',
    image: './db/image',
  },

  // Root Directory for all the generated code.
  distributionDirectory: {
    path: './dist',
  },

  dataBase: {
    directory: 'database',
  },

  dataFeed: {
    file: 'feed.json',
    directory: 'feed',
  },



  // Configuration for the poetry book generation
  website: {
 
    directory: 'poetry-book',
    partials: 'partials',

    stylesheet: 'css/stylesheet.css',
    styleguide: 'styleguide.html',

    index: 'index.html',
    news: 'news.html',
    toc: 'toc.html',
    poems: 'poems.html',

    changelog: 'changelog.html',

    sectionFileName:'section-{{id}}.html',
    sectionName:'section-{{id}}',

    template: {
      files: 'templates/poetry-book/files',
      path: 'templates/poetry-book',

      page: 'page.hbs',
      index: 'index.hbs',
      news: 'news.hbs',
      toc: 'toc.hbs',
      poems: 'poems.hbs',
      poem: 'poem.hbs',
      print: 'print.hbs',

      stylesheet: 'stylesheet.hbs',
      styleguide: 'styleguide.hbs',
      changelog: 'changelog.hbs',
    },

    css: {
      path: 'templates/poetry-book',
      main: 'stylesheet.mjs',
    }

  },


}


export default options;
