Ext.define('Demo.view.grid.Domains', {
	extend: 'Demo.view.grid.BaseGrid',

	xtype: 'demo_grid_domains',

	reference: 'domainsGrid',

	title: 'Domains',

	tbar: [
		{
			text: 'Add',
			handler: 'addDomain'
		},

		{
			text: 'Remove...',
			handler: 'removeDomain'
		}
	],

	bbar: {
		xtype: 'pagingtoolbar',
		bind: {
			store: '{domains}'
		}
	},

	columns: {
		defaults: {
			xtype: 'templatecolumn',
			editor: 'textfield',
			flex: 1
		},

		items: [
			{
				text: 'Name',
				dataIndex: 'name',
				tpl: '{name}'
			}, {
				text: 'Virtual Host',
				dataIndex: 'vhost',
				tpl: '{vhost}'
			}
		]
	}
});