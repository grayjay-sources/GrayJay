source.getComments = function (url: string): CommentPager {
  log('getComments called with url: ' + url);
  return new CommentsPager(url);
};

source.getSubComments = function (comment: Comment): CommentPager {
  log('getSubComments called');
  return new SubCommentsPager(comment);
};

