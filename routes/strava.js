'use strict';

var express = require('express'),
  debug = require('debug')('fatcakeclub:strava'),
  config = require('config'),
  stravaConfig = config.get('strava'),
  corsConfig = config.get('cors'),
  stravaBase = 'https://www.strava.com',
  stravaUrl = 'https://www.strava.com',
  url = require('url'),
  router = express.Router(),
  _ = require('underscore'),
  request = require('request');

function get(path, query, cb) {
  var iurl = url.parse(stravaBase + path);

  if(!cb) {
    cb = query;
    query = undefined;
  }

  if(!iurl.query) {
    iurl.query = {};
  }

  _.extend(iurl.query, query);
  iurl = url.format(iurl);
  request({
    url: url.format(iurl),
    headers: {
      Authorization: 'Bearer ' + stravaConfig.access_token
    }}, function(err, response, body) {
      if(err) {
        cb(err);
      }
      else if(response.statusCode !== 200) {
        cb({
          error: 'non 200 response',
          body: body
        });
      }
      else {
        cb(undefined, JSON.parse(body));
      }
  });
}

function post(path, data, cb) {
  var iurl = url.parse(stravaUrl + path);
  request.post({
    url:url.format(iurl),
    form: data
  }, function(err, response, body) {
    if(err) {
      debug('err:', err);
      cb(err);
    }
    else if(response.statusCode !== 200) {
      cb({
        error: body
      });
    }
    else {
      cb(undefined, JSON.parse(body));
    }
  });
}

router.get('/access_token', function(req, res) {

  var access_token_url = url.parse(stravaUrl + '/oauth/authorize/'),
    redirect_uri = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: '/strava/access_token'
    });

  if(req.query.error) {
    res
      .status(401)
      .render('strava/access_token_error', {
        error_reason: req.query.error_reason,
        error_description: req.query.error_description
    });
    return;
  }
  if(req.query.code) {
    post('/oauth/token', {
      client_id: stravaConfig.client_id,
      client_secret: stravaConfig.client_secret,
      code: req.query.code
    }, function(err, body) {
      if(err) {
        res.send(err.error);
        return;
      }
      res.render('strava/access_token', {
        access_token: body.access_token
      });
    });
    return;
  }


  if(!stravaConfig.client_id) {
    res.send('no strava.client_id set in config');
    return;
  }
  access_token_url.query = {
    client_id: stravaConfig.client_id,
    redirect_uri: redirect_uri,
    response_type: 'code'
  };

  res.redirect(url.format(access_token_url));
});

router.get('/announcements', function(req, res) {
  var origin = req.header('Origin');

  if(!stravaConfig.access_token || '' === stravaConfig.access_token) {
    res.jsonp({
      'status': 'error',
      'error': 'Please set the strava.access_token in the config'
    });
    return;
  }

  if(!stravaConfig.club_id || '' === stravaConfig.club_id) {
    res.jsonp({
      'status': 'error',
      'error': 'Please set the strava.club_id in the config'
    });
    return;
  }

  if(origin && _.contains(corsConfig.allowedOrigins, origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  get('/api/v3/clubs/'+ stravaConfig.club_id +'/announcements', function(err, announcements) {
    if(err) {
      debug('announcements error', err);
      res.jsonp('error');
      return;
    }
    announcements.length = 3;
    res.jsonp(announcements);
  });
});

module.exports = router;
