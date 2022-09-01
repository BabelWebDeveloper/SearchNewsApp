public with sharing class TestController {
    public String title;
    public String category;
    public String country;

    private String apiKey;

    public NewsSyncRequest newsSyncRequest;
    public Article article;
    public Source source;

    public List<Article> blacklistArticles;

    public TestController(){
        article = new Article();
        apiKey = 'ff61ef2230634d3ab71be1e01e7c2d52';//tutaj query po api key przypisany do usera
    }

    public void getArticles(String address){
//        https://newsapi.org/v2/top-headlines?q=&country=us&category=business&apiKey=
        String requestBody = address + apiKey;
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);
        System.debug(listExternalArticlesNotVerified);
        System.debug('_____________________________________');

//        Map<String, Article> mapExternalArticlesNotVerified =
//                setExternalArticlesNotVerifiedMap(listExternalArticlesNotVerified);

//        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
//                blacklistArticles);
//        System.debug(listExternalArticlesVerified);
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
            System.debug(deserializeNewsSyncRequest);
            List<Article> externalArticlesNotVerified = deserializeNewsSyncRequest.articles;
            System.debug(externalArticlesNotVerified);

            return externalArticlesNotVerified;
        } catch (Exception e){
            System.debug(e);
            return null;
        }
    }

//    private static Map<String, Article> setExternalArticlesNotVerifiedMap (
//            List<Article> listExternalArticlesNotVerified){
//
//        Map<String, Article> mapExternalArticlesNotVerified = new Map<String, Article>();
//        for(Article article : listExternalArticlesNotVerified) {
//            mapExternalArticlesNotVerified.put(article.url, article);
//        }
//
//        return mapExternalArticlesNotVerified;
//    }

    private static List<Article> verifyListExternalArticles(List<Article> listExternalArticlesNotVerified,
            List<Article> blacklistArticles){
        List<Article> listExternalArticlesVerified = new List<Article>();
        for(Article articleNotVerified : listExternalArticlesNotVerified) {
            if (!blacklistArticles.contains(articleNotVerified)) {
                listExternalArticlesVerified.add(articleNotVerified);
            }
        }

        return listExternalArticlesVerified;
    }
}