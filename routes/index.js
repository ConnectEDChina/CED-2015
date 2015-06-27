var express = require('express');
var router = express.Router();

var config = require('../config');

// Mailgun init
var Mailgun = require('mailgun-js');

var api_key = config.api_key,
    domain = 'connected-china.org',
    from_who = 'ConnectED China ' + '<no-reply' + '@' + domain + '>',
    replyTo = 'info@connected-china.org';

// Custom functions
var func = require('./func_module');


/* GET home page. */
router.get(['/', '/m', '/mobile'], function(req, res, next) {
    res.render('home', {
        title: 'ConnectED China 2015 | Home',
        currentPage: 'home',
        greyFooter: true,
        intro: require(global.appRoot + '/views/obj/intro').intro,
        schedule: require(global.appRoot + '/views/obj/schedule').schedule,
        speakers: require(global.appRoot + '/views/obj/speaker').speakers,
        pre_e_schedule: require(global.appRoot + '/views/obj/schedule').pre_e_schedule
    });
});

// GET registration page
router.get('/registration', function(req, res, next) {
    res.render('register', {
        title: 'ConnectED China 2015 | Registration',
        currentPage: 'registration',
        greyFooter: false,
        functions: require(global.appRoot + '/views/obj/ticket').functions,
        ticket_kind: require(global.appRoot + '/views/obj/ticket').ticket_kind,
        basicInfo: require(global.appRoot + '/views/obj/form').basicInfo,
        contactInfo: require(global.appRoot + '/views/obj/form').contactInfo,
        team_info: require(global.appRoot + '/views/obj/form').team_info
    });
});

// GET about page
router.get('/about', function(req, res, next) {

    var obj = require(global.appRoot + '/views/obj/about');

    res.render('about', {
        title: 'ConnectED China 2015 | About Us',
        currentPage: 'about',
        greyFooter: true,
        founder: obj.founder,
        executive_board: obj.executive_board,
        contacts: obj.contacts,
        partners: obj.partners
    });
});

// GET sitemap
router.get('/sitemap.xml', function(req, res, next) {

    var sitemap = require('sitemap').createSitemap({
      hostname: 'http://connected-china.org',
      cacheTime: 600000,
      urls: [
        { url: '/', changeFreq: 'daily', priority: 0.3 },
        { url: '/registration/', changeFreq: 'weekly', priority: 0.4 },
        { url: '/about/', changeFreq: 'weekly', priority: 0.7 }
      ]
    });

    sitemap.toXML( function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
    });
});

// GET sendmail
router.get('/sendmail', function(req, res, next) {
    res.render('sendmail', { title: 'ConnectED China 2015 | Email Sender', currentPage: 'Email' });
});

// POST email submission
router.post('/emailOut', function(req, res, next) {

    var data = req.body;

    if (data.email_pwd != config.api.email.password) {
        res.status(400).end("wrong pwd");
        return;
    }

    var from_field = 'ConnectED China Info ' + '<info' + '@' + domain + '>';

    var to_field = data.email_to.split(',');
    var cc_field = data.email_cc.split(',');
    var bcc_field = data.email_bcc.split(',');
    bcc_field.concat(config.api.email.ad_board);

    // console.log("debug", to_field, cc_field, bcc_field);

    func.email_mailgun(
      from_field,
      to_field,
      replyTo,
      data.email_subject,
      data.email_content,
      '',
      {},
      cc_field,
      bcc_field);

    res.status(200).end();
});

// POST Team ID Ajax Validation
router.post('/id_validate', function(req, res, next) {
    // if data !null , continue
    var data = req.body;

    var findRes;

    if (Object.keys(data).length === 0) {
        res.status(400).end("Error, invalid data");
    }

    var MongoClient = require('mongodb').MongoClient;
    // db vars
    var dbName = config.db.name,
        username = config.db.username,
        password = config.db.password;

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://" + username + ":" + password + "@localhost:27017/" + dbName;

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('registrant');

        // query id for duplication
        collection.find(data).toArray(function(err, doc) {
            findRes = doc.length;
            db.logout(function(err, result) {
                if (!err) {
                    db.close();
                    if (findRes === 0) {
                        res.status(200).end("zero");
                    }
                    else if (findRes < doc[0].team_member_count) {
                        res.status(200).end("team_not_full");
                    }
                    else {
                        res.status(200).end("team_full");
                    }
                }
            });
        });
    });
});

// POST Sign Up Form
router.post(config.api.signup, function(req, res, next) {

    var data = req.body;

    if (Object.keys(data).length === 0) {
        res.status(400).end("Error, invalid data");
        return;
    }

    func.autoEmail(from_who,
                   [data.signup_email],
                   replyTo,
                   'Thank You for Your Interest in ConnectED China 2015 Startup Idea Fair',
                   '',
                   'signup_confirm',
                   {firstName: data.signup_name});
    if (data.signup_intention === 'as_volunteer') {
        func.addToMailList(data.signup_email, data.signup_name, config.mailList.potential_v, {school: data.signup_school, intention: data.signup_intention});
    }
    else if (data.signup_intention === 'as_competitor') {
        func.addToMailList(data.signup_email, data.signup_name, config.mailList.potential_c, {school: data.signup_school, intention: data.signup_intention});
    }

    func.insertToDatabase('signup', data);

    res.status(200).end();
});

// POST registration form
router.post(config.api.register, function(req, res, next) {

    // if data !null, continue
    var data = req.body;
    var files = req.files;

    if (Object.keys(data).length === 0) {
        res.status(400).end("Error, invalid data");
        return;
    }

    if (data.ticket_class === 'competitor') {
        func.autoEmail(from_who,
                       [data.email],
                       replyTo,
                       'Thank You for Registering ConnectED China 2015 Startup Idea Fair',
                       '',
                       'confirm_comp',
                       {firstName: data.name});
        func.addToMailList(data.email, data.name, config.mailList.c, data);
    }
    else if (data.ticket_class === 'audience') {
        func.autoEmail(from_who,
                       [data.email],
                       replyTo,
                       'Thank You for Registering ConnectED China 2015 Startup Idea Fair',
                       '',
                       'confirm_audi',
                       {firstName: data.name});
        func.addToMailList(data.email, data.name, config.mailList.v, data);
    }

    func.insertToDatabase('registrant', data);

    res.status(200).end();
});

module.exports = router;
