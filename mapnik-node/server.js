const  express = require("express");
require("dotenv").config();
const mapnik = require('mapnik');
const mercator = require('./utils/sphericalmercator')

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();
      

createWebServer = () => {
    const app =  express();
    app.use("/",(req,res,next) => {
        if (req.url.includes("admin")) {
            const map = new mapnik.Map(128, 128 );
            const path = req.url.split('/');
            const z = parseInt(path[2]);
            const x = parseInt(path[3]);
            const y= parseInt(path[4].split('.')[0]); 
            console.log(x,y,z);
            const style = req.url.includes("admin0") ? './style-admin0.xml' : './style-admin1.xml';
            map.load(style, function(err,map) {
                if (err) throw err;
                const bbox = mercator.xyz_to_envelope(x,y,z);
                map.extent = bbox
                var im = new mapnik.Image(map.width, map.height);
                map.render(im, function(err,im) {
                  if (err) throw err;
                  im.encode('png', function(err,buffer) {
                      if (err) throw err;
                      res.end(im.encodeSync('png'));
                    });
                });
            });
        } else {
            next();
        }
     });
    app.use(express.static('./dist'));
     try {
        var server = app.listen(process.env.PORT, () => {console.log("started")});    

     } catch {
        process.exit();
     }
     process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); })

}

createWebServer();

