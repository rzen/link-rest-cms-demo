Ext.define('Demo.model.Domain', {
	extend: 'Demo.model.BaseModel',
	fields: ['id', 'name', 'vhost'],
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
});