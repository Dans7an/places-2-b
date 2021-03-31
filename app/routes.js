module.exports = function(app, passport, db) {

  // normal routes ===============================================================
  var async = require('async');
  const request = require('request');

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  function searchAPI(place, callback){
    const foursquareId = 'API_ID';
    const foursquareSecret = 'API_SECRET';
    const foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=';
    // const url = `${foursquareUrl}${place}&limit=10&client_id=${foursquareId}&client_secret=${foursquareSecret}&v=20201202`

    request({
        url: 'https://api.foursquare.com/v2/venues/explore',
        method: 'GET',
        qs: {
          client_id: foursquareId,
          client_secret: foursquareSecret,
          near: place,
          // query: 'coffee',
          v: '20180323'
          // limit: 1,
        },
      },
      function(err, apiresponse, body) {
        if (err) {
          console.error(err);
        } else {
          const data = JSON.parse(body)
          const dataInfo = data.response.groups[0].items
          console.log("dataInfo is ", dataInfo);
          callback(dataInfo)
        }
      }
    );

  }

  // app.post('/search', (req, res) => {
  //   console.log("successful");
  //   const place = req.body.placeName
  //   console.log(place);
  //   searchAPI(place,(dataInfo) => {
  //     console.log(dataInfo.length);
  //     res.render('profile.ejs', {
  //       user: req.user,
  //       data: dataInfo
  //     })
  //   })
  //
  // })

  app.get('/profile', isLoggedIn, function(req, res) {
    if(req.query.search){
      console.log("successful");
      const place = req.query.search
      console.log(place);
      searchAPI(place,(dataInfo) => {
        console.log(dataInfo.length);
        res.render('profile.ejs', {
          user: req.user,
          data: dataInfo
        })
      })
    }else {
      res.render('profile.ejs', {
        user: req.user,
        data: []
      })
    }

  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================
  app.get('/favs', isLoggedIn, function(req, res) {
    db.collection('places').find({email: req.user.local.email}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('favs.ejs', {
        user: req.user,
        data: result
      })
    })
  });

  app.post('/favs', (req, res) => {
    db.collection('places').save({
      name: req.body.name,
      category: req.body.category,
      icon: req.body.icon,
      location: req.body.location,
      city: req.body.city,
      email: req.user.local.email
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.status(200).send('Saved to My favorites')
    })
  })

  app.delete('/favs', (req, res) => {
    console.log(req.body.name);
    db.collection('places').findOneAndDelete({
      name: req.body.name,
      location: req.body.location
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

      // _id: req.body._id
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
