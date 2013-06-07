// Module dependencies.
var application_root = __dirname,
  express = require( 'express' ), //Web framework
  path = require( 'path' ), //Utilities for dealing with file paths
  mongoose = require( 'mongoose' ); //MongoDB integration
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'FIRe.log', json: false});
winston.remove(winston.transports.Console);
//Create server
var app = express();
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.enable("jsonp callback");
// Configure server
app.configure( function() {
  app.use(allowCrossDomain);
  //parses request body and populates request.body
  app.use( express.bodyParser() );

  //checks request.body for HTTP method overrides
  app.use( express.methodOverride() );

  //perform route lookup based on url and HTTP method
  app.use( app.router );

  //Where to serve static content
  app.use( express.static( path.join( application_root, 'site') ) );

  //Show all errors in development
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//Start server
var port = 4711;
app.listen( port, function() {
  winston.info('Express server listening on port ' + port + ' in ' + app.settings.env + ' mode');
})

// Routes
app.get( '/api', function( request, response ) {
  response.send( 'Fire API is running\r\n\r\n' );
});


mongoose.connect( 'mongodb://localhost/fire_database' );

//Schemas
var Responder = new mongoose.Schema({
  name: String,
  type: String,
})
//Models
var ResponderModel = mongoose.model( 'Responder', Responder );


app.all('/api/responders', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get( '/api/responders', function( request, response ) {
  return ResponderModel.find( function( err, responder ) {
    if( !err ) {
      return response.json( responder ); // This is JSON. Do not, under any circumstances attempt to concatenate it with a string.
    } else {
      return winston.info( err );
    }
  });
});

app.post( '/api/responders', function( request, response ) {
  var responder = new ResponderModel({
    name: request.body.name,
    type: request.body.type,
  });
  responder.save( function( err ) {
    if( !err ) {
      return winston.info( 'created' );
    } else {
      return winston.info( err );
    }
  });
  return response.send( responder );
});


app.get( '/api/responders/:id', function( request, response ) {
  return ResponderModel.findById( request.params.id, function( err, responder ) {
    if( !err ) {
      return response.send( responder );
    } else {
      return winston.log( err );
    }
  });
});


app.delete( '/api/responders/:id', function( request, response ) {

return ResponderModel.findById( request.params.id, function( err, book ) {
  return ResponderModel.findById( request.params.id, function( err, responder ) {

  return responder.remove( function( err ) {
    if( !err ) {
      winston.log( 'Responder removed' );
      return response.send( '' );
    } else {
      winston.log( err );
    }
  });
});
});
});
