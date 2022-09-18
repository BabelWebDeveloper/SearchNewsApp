public with sharing class ArticleBuilder {
    private final Article article;
    private Source source;

    public ArticleBuilder() {
        article = new Article();
    }

    public ArticleBuilder setId(String id) {
        article.id = id;
        return this;
    }

    public ArticleBuilder setAuthor(String author) {
        article.author = author;
        return this;
    }

    public ArticleBuilder setTitle(String title) {
        article.title = title;
        return this;
    }

    public ArticleBuilder setDescription(String description) {
        article.description = description;
        return this;
    }

    public ArticleBuilder setUrl(String url) {
        article.url = url;
        return this;
    }

    public ArticleBuilder setUrlToImage(String urlToImage) {
        article.urlToImage = urlToImage;
        return this;
    }

    public ArticleBuilder setPublishedAt(Datetime publishedAt) {
        article.publishedAt = publishedAt;
        return this;
    }

    public ArticleBuilder setContent(String content) {
        article.content = content;
        return this;
    }

    public ArticleBuilder setCategory(String category) {
        article.category = category;
        return this;
    }

    public ArticleBuilder setWhitelist(Boolean category) {
        article.isWhitelist = category;
        return this;
    }

    public ArticleBuilder setBlacklist(Boolean category) {
        article.isBlacklist = category;
        return this;
    }


    public ArticleBuilder setSource(String sourceName) {
        source = new Source();
        source.name = sourceName;
        article.source = source;
        return this;
    }

    public Article getArticle() {
        return article;
    }
}


//public static Builder getBuilder() {
//return new Builder();
//}
//
//public class Builder {
//private Article article;
//private Source source;
//
//private Builder() {
//article = new Article();
//}
//
//public Builder setAuthor(String author) {
//article.author = author;
//return this;
//}
//
//public Builder setTitle(String title) {
//article.title = title;
//return this;
//}
//
//public Builder setDescription(String description) {
//article.description = description;
//return this;
//}
//
//public Builder setUrl(String url) {
//article.url = url;
//return this;
//}
//
//public Builder setPublishedAt(String publishedAt) {
//article.publishedAt = publishedAt;
//return this;
//}
//
//public Builder setContent(String content) {
//article.content = content;
//return this;
//}
//
//public Builder setSource(String sourceName) {
//source = new Source();
//source.name = sourceName;
//article.source = source;
//return this;
//}
//}