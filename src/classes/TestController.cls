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
        blacklistArticles = new List<Article>();
        apiKey = 'ff61ef2230634d3ab71be1e01e7c2d52';//custom settings
    }

    public void getArticles(String address){
//        https://newsapi.org/v2/top-headlines?q=&country=us&category=business&apiKey=
        String requestBody = address + apiKey;
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);
        System.debug(listExternalArticlesNotVerified);

        blacklistArticles.add(listExternalArticlesNotVerified[0]);
        blacklistArticles.add(listExternalArticlesNotVerified[1]);
        blacklistArticles.add(listExternalArticlesNotVerified[2]);
        blacklistArticles.add(listExternalArticlesNotVerified[3]);
        blacklistArticles.add(listExternalArticlesNotVerified[4]);
        blacklistArticles.add(listExternalArticlesNotVerified[5]);
        blacklistArticles.add(listExternalArticlesNotVerified[6]);
        blacklistArticles.add(listExternalArticlesNotVerified[7]);
        blacklistArticles.add(listExternalArticlesNotVerified[8]);
        blacklistArticles.add(listExternalArticlesNotVerified[9]);
        blacklistArticles.add(listExternalArticlesNotVerified[10]);
        blacklistArticles.add(listExternalArticlesNotVerified[11]);
        blacklistArticles.add(listExternalArticlesNotVerified[12]);
        blacklistArticles.add(listExternalArticlesNotVerified[13]);
        blacklistArticles.add(listExternalArticlesNotVerified[14]);
        blacklistArticles.add(listExternalArticlesNotVerified[15]);
        blacklistArticles.add(listExternalArticlesNotVerified[16]);
        blacklistArticles.add(listExternalArticlesNotVerified[17]);

        System.debug('_____________________________________');

        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticles);
        System.debug(listExternalArticlesVerified);
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