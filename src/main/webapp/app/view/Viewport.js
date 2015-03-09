Ext.define('Demo.view.Viewport', {
	extend: 'Ext.Panel',
	
	controller: 'main',
	viewModel: {
		type: 'main'
	},

	title: 'LinkRest DEMO',

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	items: [
		{
			xtype: 'demo_grid_domains',
			flex: 2,
			bind: {
				store: '{domains}'
			}
		}, {
			xtype: 'demo_grid_articles',
			flex: 3,
			bind: {
				store: '{articles}'
			}
		}
	]
});
