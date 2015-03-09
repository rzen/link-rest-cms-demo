 /**
  * LinkRestProxy is the standard proxy for NHL Link applications.  It is designed specifically to work with the
  * Link REST API.
  * <br /><br />
  * In addition to standard property features, LinkRestProxy provides several additional features.
  * <br /><br />
  * You can include or exclude fields you want in the response, and you can do advanced querying using
  * Cayenne expressions.
  * <br /><br />
  * For additional information on using the Link REST API, see the 
  * [protocol details section on the wiki page](https://wiki.nhl.com/display/link/LinkRest+Framework#LinkRestFramework-ProtocolDetails)
  */
 Ext.define('Demo.data.LinkRestProxy', {
	 extend	: 'Ext.data.proxy.Rest',
 
	 alias	: 'proxy.linkrest',
		
	 /**
	  * Reader for LinkRest is JSON.
	  * @hide
	  */
	 reader: {
		 rootProperty	: 'data',
		 type			: 'json'
	 },
	
	 /**
	  * Writer for LinkRest is JSON.
	  * @hide
	  */
	 writer: {
		 type			: 'json',
		 writeAllFields	: false
	 },
 
 
	 config	: {
 
		 /**
		  * @cfg {String[]}
		  * Properties to be included in LinkRest response.
		  */
		 include: [],
 
		 /**
		  * @cfg {String[]}
		  * Properties to be excluded from LinkRest response.
		  */
		 exclude: [],
 
		 /**
		  * @cfg {String}
		  * Cayenne base expression is AND'ed to {#cayenneExp}
		  */
		 cayenneBaseExp: null,
 
		 /**
		  * @cfg {String}
		  * Cayenne expression
		  */
		 cayenneExp: null,
 
		 /**
		  * @cfg {Object}
		  * Params for cayenne expression
		  */
		 cayenneParams: {}
	 },
 
 
	 /**
	  * Helper method to set Cayenne expression and its parameters in a single call
	  * @param  {String} exp    Cayenne expression
	  * @param  {Object} params Paramenters
	  */
	 setCayenneExpParams: function (exp, params) {
		 this.setCayenneParams(params);
		 this.setCayenneExp(exp);
	 },
 
	 /**
	  * @private
	  */
	 updateInclude: function (val) {
		 var includes = [],
			 v;
 
		 for (var i=0, ln=val.length; i<ln; ++i) {
			 v = val[i];
			 if (Ext.isObject(v)) {
				 includes.push(Ext.JSON.encode(v));
			 } else {
				 includes.push(v);
			 }
		 }
		 
		 var extraParams = this.getExtraParams();
		 extraParams.include = includes;
		 this.setExtraParams(extraParams);
	 },
 
	 /**
	  * @private
	  */
	 updateExclude: function (val) {
		var extraParams = this.getExtraParams();
		 extraParams.exclude = val;
		 this.setExtraParams(extraParams);	 	
	 },
 
	 /**
	  * @private
	  */
	 updateCayenneBaseExp: function (val) {
		 this.setCayenneExp(this.getCayenneExp());
	 },
 
	 /**
	  * @private
	  */
	 updateCayenneExp: function (exp, params) {
		var extraParams = this.getExtraParams();
		
		 if (Ext.isEmpty(this.getCayenneBaseExp()) && Ext.isEmpty(this.getCayenneExp())) {
			delete extraParams.cayenneExp;
			 
		 } else {
			 extraParams.cayenneExp = Ext.JSON.encode({
				 exp: Ext.Array.clean([ this.getCayenneBaseExp(), this.getCayenneExp() ]).join(' and '),
				 params: this.getCayenneParams()
			 });
		 }
		 
		 this.setExtraParams(extraParams);	 
	 },
 
	 /**
	  * @private
	  */
	 updateCayenneParams: function (val) {
		 this.updateCayenneExp();
	 }
 });