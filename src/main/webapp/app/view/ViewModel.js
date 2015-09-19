Ext.define('Demo.view.ViewModel', {
	extend: 'Ext.app.ViewModel',

	alias: 'viewmodel.main',

	// formulas: {
	// 	isDomainSelected: function (get) {
	// 		return !!get('domainsGrid.selection');
	// 	}
	// },

	data: {
		name: 'Demo'
	},

	stores: {
		domains: {
			model: 'Demo.model.Domain',
			autoLoad: true,
			autoSync: true,
			remoteFilter: true,
			remoteSort: true,
			pageSize: 100,
			proxy: {
				type: 'linkrest',
				url: '/cms/rest/domain',
				include: [
					'id',
					'name',
					'vhost',
					'articles'
				]
			}
		},
		
		articles: {
			model: 'Demo.model.Article',
			autoLoad: true,
			autoSync: false,
			remoteFilter: true,
			remoteSort: true,
			pageSize: 100,

			filters: [
				{
					exactMatch: true,
					property: 'domain',
					value: '{domainsGrid.selection.id}'
				}
			],

			proxy: {
				type: 'linkrest',
				url: '/cms/rest/article',
				batchActions: true,
				include: [
					'id',
					'title',
					'body',
					'publishedOn',
					'domain'
				]
			}
		}
	}
});