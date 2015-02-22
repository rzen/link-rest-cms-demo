package org.objectstyle.linkrest.cms.cayenne;

import java.util.Date;

import org.objectstyle.linkrest.cms.cayenne.auto._Article;

public class Article extends _Article {

	private static final long serialVersionUID = 1L;

	@Override
	protected void onPostAdd() {
		setPublishedOn(new Date());
	}
}
