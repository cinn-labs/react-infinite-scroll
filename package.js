Package.describe({
  name: 'cinn:react-infinite-scroll',
  version: '0.0.1',
  summary: 'React Infinite Scroll',
  git: 'https://github.com/cinn-labs/react-infinite-scroll',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.3.1');
  api.export('InfiniteScroll');
  api.use('ecmascript');
  api.addFiles('InfiniteScroll.jsx', 'client');
});
