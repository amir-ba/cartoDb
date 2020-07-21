// 'use strict';

// // const fs = require('fs');
// // const mapnik = require('mapnik');
// // const path = require('path');


// // const TILE_SIZE = 256;

// // const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
// // map.load('./style-admin0.xml', function(err, map) {
// //     map.zoomAll();
// //     const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
// //     map.render(im, function(err, im) {
// //         im.encode('png', function(err, buffer) {
// //             fs.writeFile('map.png', buffer);
// //          });
// //     });
// // });

// var mapnik = require('mapnik');
// var fs = require('fs');
// // mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

// // register fonts and datasource plugins
// mapnik.register_default_fonts();
// mapnik.register_default_input_plugins();

// var map = new mapnik.Map(256, 256);
// map.load('./style-admin0.xml', function(err,map) {
//     if (err) throw err;
//     map.zoomAll();
//     var im = new mapnik.Image(256, 256);
//     map.render(im, function(err,im) {
//       if (err) throw err;
//       im.encode('png', function(err,buffer) {
//           if (err) throw err;
//           fs.writeFile('map.png',buffer, function(err) {
//               if (err) throw err;
//               console.log('saved map image to map.png');
//           });
//       });
//     });
// });

var http = require('http');
var mapnik = require('mapnik');
var mappool = require('./utils/pool.js');
var url = require('url');

var port = 8000;
var pool_size = 10;

var usage = 'usage: wms.js <stylesheet> <port>';

// register datasource plugins
if (mapnik.register_default_input_plugins) mapnik.register_default_input_plugins();

var stylesheet = process.argv[2];

if (!stylesheet) {
   console.log(usage);
   process.exit(1);
}

var port = process.argv[3];

if (!port) {
   console.log(usage);
   process.exit(1);
}

var maps = mappool.create_pool(10);

var aquire = function(id,options,callback) {
    methods = {
        create: function(cb) {
                var obj = new mapnik.Map(options.width || 256, options.height || 256);
                obj.load(id, {strict: true},function(err,obj) {
                    if (options.bufferSize) {
                        obj.bufferSize = options.bufferSize;
                    }
                    cb(err,obj);
                });
            },
            destroy: function(obj) {
                delete obj;
            }
    };
    maps.acquire(id,methods,function(err,obj) {
      callback(err, obj);
    });
};


http.createServer(function(req, res) {
  var query = url.parse(req.url.toLowerCase(), true).query;
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  if (query && query.bbox !== undefined) {

      var bbox = query.bbox.split(',');
      aquire(stylesheet, {}, function(err,map) {
          if (err) {
              res.end(err.message);
          } else {
              var im = new mapnik.Image(map.width, map.height);
              map.extent = bbox;
              map.render(im, function(err, im) {
                  maps.release(stylesheet, map);
                  if (err) {
                      res.end(err.message);
                  } else {
                      res.writeHead(200, {
                        'Content-Type': 'image/png'
                      });
                      res.end(im.encodeSync('png'));
                  }
              });
          }

      });
  } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end('No BBOX provided! Try a request like <a href="http://127.0.0.1:' + port + '/?bbox=-20037508.34,-5009377.085697313,-5009377.08569731,15028131.25709193">this</a>');
  }
}).listen(port);


console.log('Server running at http://127.0.0.1:' + port + '/');