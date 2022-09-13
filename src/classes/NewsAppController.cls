public with sharing class NewsAppController {
    public String title;
    public String category;
    public String country;

    private static String apiKey;

    public NewsSyncRequest newsSyncRequest;
    public Article article;
    public Source source;

    public List<Article> blacklistArticles;

    public NewsAppController() {
        article = new Article();
        blacklistArticles = new List<Article>();
        apiKey = 'ff61ef2230634d3ab71be1e01e7c2d52';//custom settings
    }

    @AuraEnabled
    public static List<Article> getArticles(String address) {
        String requestBody = address + 'ff61ef2230634d3ab71be1e01e7c2d52';
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);
        List<Article> blacklistArticles = getBlacklistArticles();

        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticles);
        return listExternalArticlesNotVerified;
    }

    private static List<Article> getListExternalArticlesNotVerifiedCallout(String requestBody) {
        try {
            Http myHttp = new Http();
            HttpRequest request = new HttpRequest();
            HttpResponse response = new HttpResponse();

            request.setEndpoint(requestBody);
            request.setMethod('GET');
            response = myHttp.send(request);

            String jsonString = response.getBody();
            Integer statusCode = response.getStatusCode();

            NewsSyncRequest deserializeNewsSyncRequest = (NewsSyncRequest)
                    JSON.deserialize(jsonString, NewsSyncRequest.class);
            List<Article> externalArticlesNotVerified = deserializeNewsSyncRequest.articles;

            return externalArticlesNotVerified;
        } catch (Exception e) {
            System.debug(e);
            return null;
        }
    }

    public static List<Article> getBlacklistArticles() {
//        List<Article_From_Black_List__c> blacklistArticles = [
//                SELECT
//                        Article_Parent__r.Author__c,
//                        Article_Parent__r.Content__c,
//                        Article_Parent__r.Description__c,
//                        Article_Parent__r.PublishedAt__c,
//                        Article_Parent__r.SourceName__c,
//                        Article_Parent__r.Title__c,
//                        Article_Parent__r.Url__c,
//                        Article_Parent__r.UrlToImage__c
//                FROM Article_From_Black_List__c
//                WHERE CreatedById IN (SELECT Id FROM User)
//        ];
        List<Article_From_Black_List__c> blacklistArticles = [
                SELECT
                        Article_Parent__r.Title__c
                FROM Article_From_Black_List__c
                WHERE CreatedById IN (SELECT Id FROM User)
        ];


        return convertBlacklistArticlesToClass(blacklistArticles);
    }

    public static Set<String> getBlacklistArticleTitles(List<Article_From_Black_List__c> blacklistArticles) {
        Set<String> blacklistArticleTitles = new Set<String>();
        for (Article_From_Black_List__c blacklistArticle : blacklistArticles) {
            blacklistArticleTitles.add(blacklistArticle.Article_Parent__r.Title__c);
        }
        return blacklistArticleTitles;
    }

    public static List<Article> convertBlacklistArticlesToClass(List<Article_From_Black_List__c> blacklistArticles) {
        List<Article> convertedBlacklistArticles = new List<Article>();
        return convertedBlacklistArticles;
    }

//    public static List<Article> convertBlacklistArticlesToClass(List<Article_From_Black_List__c> blacklistArticles) {
//        List<Article> convertedBlacklistArticles = new List<Article>();
////        for (Article_From_Black_List__c blacklistArticle : blacklistArticles) {
////            ArticleBuilder builder = new ArticleBuilder();
////            builder.setAuthor(blacklistArticle.Article_Parent__r.Author__c);
////            builder.setContent(blacklistArticle.Article_Parent__r.Content__c);
////            builder.setDescription(blacklistArticle.Article_Parent__r.Description__c);
////            builder.setPublishedAt(blacklistArticle.Article_Parent__r.PublishedAt__c);
////            builder.setTitle(blacklistArticle.Article_Parent__r.Title__c);
////            builder.setUrl(blacklistArticle.Article_Parent__r.Url__c);
////            builder.setUrlToImage(blacklistArticle.Article_Parent__r.UrlToImage__c);
////            builder.setSource(blacklistArticle.Article_Parent__r.SourceName__c);
////            Article article = builder.getArticle();
////            convertedBlacklistArticles.add(article);
////        }
//        return convertedBlacklistArticles;
//    }

    private static List<Article> verifyListExternalArticles(List<Article> listExternalArticlesNotVerified,
            List<Article> blacklistArticles) {
        List<Article> listExternalArticlesVerified = new List<Article>();
        if (!blacklistArticles.isEmpty()) {
            for (Article articleNotVerified : listExternalArticlesNotVerified) {
                if (!blacklistArticles.contains(articleNotVerified)) {
                    listExternalArticlesVerified.add(articleNotVerified);
                }
            }
        } else {
            listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
        }
//        System.debug('listExternalArticlesVerified: ' + listExternalArticlesVerified.size());
        return listExternalArticlesVerified;
    }

    @AuraEnabled
    public static List<Article> getInternalArticles() {
        List<Article__c> internalArticles = [
                SELECT
                        Name,
                        Author__c,
                        Content__c,
                        Description__c,
                        PublishedAt__c,
                        Title__c,
                        Url__c,
                        UrlToImage__c,
                        SourceName__c
                FROM Article__c
                WHERE Id NOT IN (
                        SELECT
                                Article_Parent__c
                        FROM Article_From_Black_List__c
                )
                AND OwnerId IN (
                        SELECT
                                Id
                        FROM User
                )
        ];
        List<Article> convertedArticlesToClassObject = sObjectToClassArticle(internalArticles);
        return convertedArticlesToClassObject;
    }

    public static List<Article> sObjectToClassArticle(List<Article__c> internalArticles) {
        List<Article> convertedArticlesToClassObject = new List<Article>();
        ArticleBuilder builder = new ArticleBuilder();
        for (Article__c internalArticle : internalArticles) {
            builder.setAuthor(internalArticle.Author__c);
            builder.setContent(internalArticle.Content__c);
            builder.setDescription(internalArticle.Description__c);
            builder.setPublishedAt(internalArticle.PublishedAt__c);
            builder.setTitle(internalArticle.Title__c);
            builder.setUrl(internalArticle.Url__c);
            builder.setUrlToImage(internalArticle.UrlToImage__c);
            builder.setSource(internalArticle.SourceName__c);
            Article article = builder.getArticle();
            convertedArticlesToClassObject.add(article);
        }
        return convertedArticlesToClassObject;
    }
}