Ext.define('Demo.view.ViewController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	addDomain: function () {
		this.getView().getViewModel().getStore('domains').add({});
	},

	removeDomain: function () {
		var vm = this.getView().getViewModel(),
			sel = vm.get('domainsGrid.selection');

		vm.getStore('domains').remove(sel);
	},

	addArticle: function () {
		var vm = this.getView().getViewModel();

		vm.getStore('articles').add({
			title: 'New Article',
			domain_id: vm.get('domainsGrid.selection').getId()
		});
	},

	removeArticle: function () {
		var vm = this.getView().getViewModel();

		vm.getStore('articles').remove(vm.get('articlesGrid.selection'));
	}
});
