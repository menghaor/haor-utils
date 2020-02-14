/**
 * Mount the utility class to the Vue prototype
 * Author: haor
 * Creation date 2020/10/10
 */

import * as utils from "./index";
export default {
	install(Vue) {
		if (Vue) Vue.prototype.$utils = utils;
	}
};
