public with sharing class ArticleBuilderObject {
    private final Article__c article;

    public ArticleBuilderObject() {
        article = new Article();
    }

    public ArticleBuilderObject setAuthor(String author) {
        article.Author__c = author;
        return this;
    }

    public ArticleBuilderObject setTitle(String title) {
        article.Title__c = title;
        return this;
    }

    public ArticleBuilderObject setDescription(String description) {
        article.Description__c = description;
        return this;
    }

    public ArticleBuilderObject setUrl(String url) {
        article.Url__c = url;
        return this;
    }

    public ArticleBuilderObject setUrlToImage(String urlToImage) {
        article.UrlToImage__c = urlToImage;
        return this;
    }

//    public ArticleBuilderObject setPublishedAt(Datetime publishedAt) {
//        article.PublishedAt__c = publishedAt;
//        return this;
//    }

    public ArticleBuilderObject setContent(String content) {
        article.Content__c = content;
        return this;
    }

    public ArticleBuilderObject setCategory(String category) {
        article.Category__c = category;
        return this;
    }


    public ArticleBuilderObject setSource(String sourceName) {
        article.SourceName__c = sourceName;
        return this;
    }

    public Article getArticle() {
        return article;
    }
}