var assert = require('assert'),
    config = require('../config');
var func_module = {};

var api_key = config.api_key,
    domain = 'connected-china.org',
    sendcloud_api_key = config.sendcloud_api_key,
    sendcloud_api_user = config.sendcloud_api_user;

function defaultVal(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}

function removeBlank(target) {
    if (target === undefined || target.length === 0) {
        return;
    }
    while (true) {
        if (target.indexOf('') != -1) {
            target.splice(target.indexOf(''), 1);
        }
        else {
            break;
        }
    }
}

function email_mailgun(sender, receiver, replyTo, subject, content, templateName, templateVars, cc, bcc) {

  // param override
  if (templateName !== undefined && templateName !== '') {
    var jade = require('jade'),
        path = require('path'),
        subPath = '../email_templates/' + templateName + '.jade',
        template_path = path.resolve(__dirname, subPath),
        content = jade.renderFile(template_path, templateVars);
  }

  removeBlank(cc);
  removeBlank(bcc);

  var Mailgun = require('mailgun-js');
  var mailgun = new Mailgun({apiKey: api_key, domain: domain});

  var mailContent = {
    from: sender,
    to: receiver,
    "h:Reply-To": replyTo,
    subject: subject,
    html: content
  };

  if (cc !== undefined && cc.length > 0) {
    mailContent.cc = cc.join();
  }
  if (bcc !== undefined && bcc.length > 0) {
    mailContent.bcc = bcc.join();
  }

  mailgun.messages().send(mailContent, function(err, body) {
    if (err) {
        console.log(err);
    }
  });
}

function email(sender, receiver, replyTo, subject, content, templateName, templateVars, cc, bcc) {

    // param override
    if (templateName !== undefined && templateName !== '') {
        var jade = require('jade');
        var path = require('path');
        var subPath = '../email_templates/'+ templateName + '.jade';
        var template_path = path.resolve(__dirname, subPath);
        content = jade.renderFile(template_path, templateVars);
    }

    removeBlank(cc);
    removeBlank(bcc);

    // QQ Mail condition
    if (receiver.indexOf('qq.com') == -1) {
        var Mailgun = require('mailgun-js');
        var mailgun = new Mailgun({apiKey: api_key, domain: domain});

        var mailContent = {
            from: sender,
            to: receiver,
            "h:Reply-To": replyTo,
            subject: subject,
            html: content
        };

        if (cc !== undefined && cc.length > 0) {
            mailContent.cc = cc.join();
        }
        if (bcc !== undefined && bcc.length > 0) {
            mailContent.bcc = bcc.join();
        }

        mailgun.messages().send(mailContent, function(err, body) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {

        var sender_addr = sender;
        var sender_name = '';

        if (sender.indexOf('<') != -1) {
            sender_addr = sender.substring(sender.indexOf('<') + 1, sender.indexOf('>'));
            sender_name = sender.substring(0, sender.indexOf('<'));
        }

        if (cc !== undefined && cc.length > 0) {
            sendcloud_options.cc = cc.join(';');
        }
        if (bcc !== undefined && bcc.length > 0) {
            sendcloud_options.bcc = bcc.join(';');
        }

        var submail_json = {
            api_key: sendcloud_api_key,
            api_user: sendcloud_api_user,
            from: sender_addr,
            fromname: sender_name,
            to: receiver,
            replyto: replyTo,
            subject: subject,
            html: content,
        };

        var qs = require('querystring');

        // var submail_json_string = JSON.stringify(submail_json);
        var submail_json_string = qs.stringify(submail_json);

        var https = require('https');
        var options = {
            hostname: 'sendcloud.sohu.com',
            port: 443,
            path: '/webapi/mail.send.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': submail_json_string.length
            }
        };

        var https_req = https.request(options, function(result) {
            result.setEncoding('utf8');
            result.on('error',function(err) {
                console.log("result error", err);
            });
            result.on('data', function(d) {
                console.log("status", d);
            });
            result.on('end', function(ending) {
                // console.log("request finished", ending);
            });
        });

        https_req.on('error', function(https_error) {
            console.log('https error', https_error);
        });

        https_req.write(submail_json_string);
        https_req.end();
    }
}

/**
 * Insert data into a running mongodb
 * @param  {String} collectionName collection name
 * @param  {Object} data           JS Object of data
 * @param  {String} dbName         database name (Optional)
 * @param  {String} username       username for db if auth enabled (Optional)
 * @param  {String} password       password for db if auth enabled (Optional)
 */
func_module.insertToDatabase = function(collectionName, data, dbName, username, password) {

    if (!data || Object.keys(data) === 0) {
        return;
    }

    // optional params
    dbName = defaultVal(dbName, config.db.name);
    username = defaultVal(username, config.db.username);
    password = defaultVal(password, config.db.password);

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://" + username + ":" + password + "@localhost:27017/" + dbName;

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection(collectionName);

        collection.find(data).toArray(function(err, docs) {
            // prevent duplication
            if (docs.length === 0) {
                collection.insert(data, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        db.close();
                    }
                });
            }
            else {
                db.close();
            }
        });
    });
};

/**
 * Send email server-side
 * @param  {String} sender       from field
 * @param  {Array}  receivers    to field
 * @param  {String} replyTo      reply-to field
 * @param  {String} subject      subject field
 * @param  {String} content      html content
 * @param  {String} templateName template to render (optional)
 * @param  {Object} templateVars template vars to attach (optional)
 * @param  {Array}  cc           cc field (optional)
 * @param  {Array}  bcc          bcc field (optional)
 */
func_module.autoEmail = function(sender, receivers, replyTo, subject, content, templateName, templateVars, cc, bcc) {

    receivers.forEach(function(receiver) {
        if (receiver !== '') {
            email(sender, receiver, replyTo, subject, content, templateName, templateVars, cc, bcc);
        }
    });
};

/**
 * Add email address to list
 * @param {String} address  email address of target
 * @param {String} name     name of target
 * @param {String} listName Mail List name
 * @param {Object} info     Additional info (Optional)
 */
func_module.addToMailList = function(address, name, listName, info) {

    // optional params
    info = defaultVal(info, {});

    var Mailgun = require('mailgun-js');
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var profile = {};
    profile.address = address;
    profile.name = name;
    profile.vars = info;

    mailgun.lists(listName).info(function(err, dta) {
        if (!dta.list) {
            mailgun.lists().create({
                address: listName
            }, function(err, info) {
                mailgun.lists(listName).members().create(profile, function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
        else {
            mailgun.lists(listName).members().create(profile, function(err, data) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};

module.exports = func_module;
