Ext.define('Demo.view.grid.Articles', {
	extend: 'Demo.view.grid.BaseGrid',

	xtype: 'demo_grid_articles',

	title: 'Articles',

	reference: 'articlesGrid',

	tbar: [
		{
			text: 'Add',
			handler: 'addArticle',
			bind: {
				disabled: '{!domainsGrid.selection}'
			}
		},

		{
			text: 'Remove...',
			handler: 'removeArticle'
		}
	],

	bbar: {
		xtype: 'pagingtoolbar',
		bind: {
			store: '{articles}'
		}
	},

	columns: {
		defaults: {
			xtype: 'templatecolumn',
			flex: 1
		},

		items: [
			{
				text: 'Title',
				flex: 2,
				dataIndex: 'title',
				tpl: '{title}',
				editor: 'textfield'
			}, {
				text: 'Published On',
				dataIndex: 'publishedOn',
				tpl: '{publishedOn:date("m/d/Y")}',
				editor: 'datefield'
			}, {
				text: 'Body',
				flex: 3,
				dataIndex: 'body',
				tpl: '{body}',
				editor: 'textarea'
			}
		]
	}
});