var Comment = require('../models').Comment;

var validator = require('validator'),
  utils = require('../libs/utils');

exports.create = function(req, res){
  var articleId = req.body.article_id,
    realName = validator.trim(req.body.real_name),
    email = validator.trim(req.body.email),
    site = validator.trim(req.body.site || ''),
    comment = validator.trim(req.body.comment);

  var error = '';
  if('' == realName || '' == email){
    error = '姓名或者邮箱不能为空!';
    res.json({status: 'failed', message: error});
    return;
  }

  if(!validator.isEmail(email)){
    error = '邮箱格式不正确!';
    res.json({status: 'failed', message: error});
    return;
  }

  if('' == comment){
    error = '评论内容不能为空!';
    res.json({status: 'failed', message: error});
    return;
  }

  var gravatar = 'http://www.gravatar.com/avatar/' + utils.md5(email) + '?s=32';
  var newComment = new Comment({
    name: realName,
    email: email,
    site: site,
    comment: comment,
    gravatar: gravatar,
    article_id: articleId
  });

  newComment.save(function(err, comment){
    if(err){
      error = '评论失败!';
      res.json({status: 'failed', message: error});
      return err;
    }
    res.json({status: 'success', comment: comment});
  });
};