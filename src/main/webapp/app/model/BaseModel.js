Ext.define("Demo.model.BaseModel", {
	extend: "Ext.data.Model",
	
	fields: [
		{ name: 'id', type: 'int', allowNull: true }
	],

	idProperty: "id",

	schema: {
		namespace: "Demo.model"
	}
});