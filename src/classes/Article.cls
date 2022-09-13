public with sharing class Article {
    @AuraEnabled
    public String id;

    @AuraEnabled
    public Source source;
    @AuraEnabled
    public String author;
    @AuraEnabled
    public String title;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String url;
    @AuraEnabled
    public String urlToImage;
    @AuraEnabled
    public Datetime publishedAt;
    @AuraEnabled
    public String content;

    @AuraEnabled
    public String status;
    @AuraEnabled
    public String country;
    @AuraEnabled
    public String category;
    @AuraEnabled
    public List<Comment> comments;
}