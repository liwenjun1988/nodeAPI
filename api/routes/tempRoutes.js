'use strict';
module.exports = function(app){
	var temp = require('../controllers/tempController');
	app.route('/temp')
	  .get(temp.list_all_temp)
	  .post(temp.create_a_temp);

	app.route('/temp/:city')
	  .get(temp.read_a_temp)
	  .put(temp.update_a_temp)
	  .delete(temp.delete_a_temp);	
};