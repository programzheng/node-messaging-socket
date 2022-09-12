const express = require('express');
const router = express.Router();
const pug = require('pug');
const MailerService = require('../services/mailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

if(process.env.MAILER_DEBUG === 'true'){
  router.get('/test_email/:email', async function(req, res, next) {
    const mailerService = MailerService.getInstance()
    const email = req.params.email
    const result = await mailerService.sendMailByHtml(
      process.env.MAILER_FROM,
      email,
      'programzheng\'s node messaging socket test email', pug.renderFile('./emails/test.pug')
    )
    res.render('index', { title: `Sent test email to: ${email}` })
  })
}


module.exports = router;
