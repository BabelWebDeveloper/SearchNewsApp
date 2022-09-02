public with sharing class NewsAppController {
    public String title;
    public String category;
    public String country;

    private static String apiKey;

    public NewsSyncRequest newsSyncRequest;
    public Article article;
    public Source source;

    public static List<Article> blacklistArticles;

    public NewsAppController(){
        article = new Article();
        blacklistArticles = getBlacklistArticles();
        apiKey = 'ff61ef2230634d3ab71be1e01e7c2d52';//custom settings
    }

    public List<Article> getBlacklistArticles(){
        List<Article__c> blacklistArticles = new List<Article__c>();//tutaj query
        return convertBlacklistArticlesToClass(blacklistArticles);
    }

    public List<Article> convertBlacklistArticlesToClass(List<Article__c> blacklistArticles){
        List<Article> convertedBlacklistArticles = new List<Article>();
        return convertedBlacklistArticles;
    }

    @AuraEnabled
    public static List<Article> getArticles(String address){
        String requestBody = address + 'ff61ef2230634d3ab71be1e01e7c2d52';
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);
        System.debug(JSON.serialize(listExternalArticlesNotVerified));

//        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
//                blacklistArticles);
        return listExternalArticlesNotVerified;
    }

    private static List<Article> getListExternalArticlesNotVerifiedCallout(String requestBody){
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
                    JSON.deserialize(jsonString,NewsSyncRequest.class);
            List<Article> externalArticlesNotVerified = deserializeNewsSyncRequest.articles;

            return externalArticlesNotVerified;
        } catch (Exception e){
            System.debug(e);
            return null;
        }
    }

    private static List<Article> verifyListExternalArticles(List<Article> listExternalArticlesNotVerified,
            List<Article> blacklistArticles){
        List<Article> listExternalArticlesVerified = new List<Article>();
        if (!blacklistArticles.isEmpty()) {
            for(Article articleNotVerified : listExternalArticlesNotVerified) {
                if (!blacklistArticles.contains(articleNotVerified)) {
                    listExternalArticlesVerified.add(articleNotVerified);
                }
            }
        } else {
            listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
        }

        return listExternalArticlesVerified;
    }
}