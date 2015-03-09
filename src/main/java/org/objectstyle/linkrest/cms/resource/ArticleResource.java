package org.objectstyle.linkrest.cms.resource;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Configuration;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.objectstyle.linkrest.cms.cayenne.Article;

import com.nhl.link.rest.DataResponse;
import com.nhl.link.rest.LinkRest;
import com.nhl.link.rest.SimpleResponse;

@Path("article")
@Produces(MediaType.APPLICATION_JSON)
public class ArticleResource {

	@Context
	private Configuration config;

	@GET
	public DataResponse<Article> getAll(@Context UriInfo uriInfo) {
		return LinkRest.select(Article.class, config).uri(uriInfo).select();
	}

	@GET
	@Path("{articleId}")
	public DataResponse<Article> getOne(@PathParam("articleId") int id, @Context UriInfo uriInfo) {
		return LinkRest.select(Article.class, config).byId(id).uri(uriInfo).select();
	}

	@POST
	public DataResponse<Article> create(String data) {
		return LinkRest.create(Article.class, config).process(data);
	}

	@PUT
	@Path("{articleId}")
	public DataResponse<Article> createOrUpdate(@PathParam("articleId") int id, String data) {
		return LinkRest.createOrUpdate(Article.class, config).process(data);
	}

	@DELETE
	@Path("{articleId}")
	public SimpleResponse delete(@PathParam("articleId") int id, @Context UriInfo uriInfo) {
		return LinkRest.delete(Article.class, config).id(id).delete();
	}
}