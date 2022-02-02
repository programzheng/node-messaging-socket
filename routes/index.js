const express = require('express');
const router = express.Router();

/**
 * Services
 */
const { Mailer } = require(__dirname + '/../services/mailer.js');
const mailer = new Mailer

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test_send_mail', async () => {
  console.log(mailer.transporter)
  await mailer.sendMail()
});

module.exports = router;
