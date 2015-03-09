Ext.define('Demo.model.Article', {
	extend: 'Demo.model.BaseModel',
	fields: ['id', 'title', 'body', 'publishedOn'],
	proxy: {
		type: 'linkrest',
		url: '/cms/rest/article',
		include: [
			'id',
			'title',
			'body',
			'publishedOn',
			'domain'
		]
	}
});