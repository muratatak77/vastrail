var Enum = require('enum');

exports.order_status_enums = function () {
	return new Enum({'ACTIVE': 1, 'PASSIVE': 2, 'PENDING': 3});
}

