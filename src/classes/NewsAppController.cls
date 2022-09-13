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
//        System.debug(' size of listExternalArticlesNotVerified: ' + listExternalArticlesNotVerified.size());
        Set<String> blacklistArticles = getBlacklistArticles();
//        System.debug(' size of blacklistArticles: ' + blacklistArticles.size());
        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticles);
//        System.debug(' size of listExternalArticlesVerified: ' + listExternalArticlesVerified.size());
        List<Article> listInternalArticlesVerified = getInternalArticles();
//        System.debug(' size of listInternalArticlesVerified: ' + listInternalArticlesVerified.size());

//        mergowanie ich w jedną listę

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

    public static Set<String> getBlacklistArticles() {
        List<Article_From_Black_List__c> blacklistArticles = [
                SELECT
                        Article_Parent__r.Title__c
                FROM Article_From_Black_List__c
                WHERE CreatedById IN (SELECT Id FROM User)
        ];


        return getBlacklistArticleTitles(blacklistArticles);
    }

    public static Set<String> getBlacklistArticleTitles(List<Article_From_Black_List__c> blacklistArticles) {
        Set<String> blacklistArticleTitles = new Set<String>();
        for (Article_From_Black_List__c blacklistArticle : blacklistArticles) {
            blacklistArticleTitles.add(blacklistArticle.Article_Parent__r.Title__c);
        }
        return blacklistArticleTitles;
    }

    private static List<Article> verifyListExternalArticles(List<Article> listExternalArticlesNotVerified,
            Set<String> blacklistArticles) {
        List<Article> listExternalArticlesVerified = new List<Article>();
        if (!blacklistArticles.isEmpty()) {
            for (Article articleNotVerified : listExternalArticlesNotVerified) {
                if (!blacklistArticles.contains(articleNotVerified.title)) {
                    listExternalArticlesVerified.add(articleNotVerified);
                }
            }
        } else {
            listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
        }
        return listExternalArticlesVerified;
    }

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
                        SourceName__c,
                        CreatedDate
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
        String sth;
        for (Article__c internalArticle : internalArticles) {
            ArticleBuilder builder = new ArticleBuilder();
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
            sth = internalArticle.PublishedAt__c;
        }
        System.debug(sth);
        String replaceStringT = '(?i)(T)';
        String replaceStringZ = '(?i)(Z)';
        sth = sth.replaceFirst(replaceStringT,' ');
        sth = sth.replaceFirst(replaceStringZ,' ');
        System.debug(sth);
        return convertedArticlesToClassObject;
    }
}