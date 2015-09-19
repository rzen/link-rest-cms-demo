Ext.define('Demo.view.grid.BaseGrid', {
	extend: 'Ext.grid.Panel',

	requires: [
		'Ext.grid.plugin.CellEditing'
	],

	deferEmptyText: true,
	emptyText: '<div class="empty-grid">Nothing to show.</div>',

	forceFit: true,
	border: true,
	autoScroll: true,

	viewConfig: {
		stripeRows: true
	},

	plugins: [
		'cellediting'
	],

	// tools: [
	// 	{
	// 		type: 'plus',
	// 		tooltip: 'Add',
	// 		handler: function (ev, toolEl, panelHeader) {
	// 			this.up('grid').getStore().add({});
	// 		}

	// 	}, {
	// 		type: 'minus',
	// 		tooltip: 'Delete',
	// 		handler: function (ev, toolEl, panelHeader) {
	// 			var grid = this.up('grid');
	// 			Ext.Msg.confirm('Are you sure?', 'Click OK to delete selected record.', function (btn) {
	// 				if (btn==='yes') {
	// 					grid.getStore().remove(grid.getSelection());
	// 				}
	// 			})
	// 		}

	// 	}
	// ],

	initComponent: function() {
		// this.dockedItems = [{
		// 	dock: 'bottom',
		// 	xtype: 'pagingtoolbar',
		// 	store: this.store
		// }];

		this.callParent(arguments);
	}
});