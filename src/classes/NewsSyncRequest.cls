public with sharing class NewsSyncRequest {
    @AuraEnabled
    public String status;
    @AuraEnabled
    public Integer totalResults;
    @AuraEnabled
    public List<Article> articles;
}