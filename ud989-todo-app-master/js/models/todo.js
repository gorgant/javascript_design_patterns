/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false,
			priority: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},

		//GCR: MY ATTEMPT AT A PRIORITY ACTION BASED ON THE ONE ABOVE -- SHOULD TOGGLE VALUE
		togglePriority: function() {
			this.save({
				priority: !this.get('priority')
			});
			// console.log("Priority Toggled");
		}
	});
})();
