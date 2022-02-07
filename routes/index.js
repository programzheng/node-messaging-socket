const express = require('express');
const router = express.Router();
const pug = require('pug');

/**
 * Services
 */
const { Mailer } = require(__dirname + '/../services/mailer.js');
const mailer = new Mailer

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test_send_mail', async (req, res, next) => {
  await mailer.sendMailByHtml('foo@example.com', 'bar@example.com', 'hello world!', pug.renderFile('./views/index.pug', {
    title: 'Timothy'
  }))
});

module.exports = router;
