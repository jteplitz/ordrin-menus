
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/*
 * Menu page
 */

exports.menu = function(req, res){
  req._ordrinMenus.getMenuHtml(req.params.rid, function(err, data){
    res.send(data);
  });
}
