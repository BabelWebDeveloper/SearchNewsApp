public with sharing class NewsAppController {
    public String title;
    public String category;
    public String country;

    private static String apiKey;

    public NewsSyncRequest newsSyncRequest;
    public Article article;
    public Source source;

    public List<Article> blacklistArticles;

    public Article__c objectArticle;

    public NewsAppController() {
        article = new Article();
        blacklistArticles = new List<Article>();
        apiKey = 'ff61ef2230634d3ab71be1e01e7c2d52';//custom settings
    }

    @AuraEnabled
    public static List<Article> getArticles(String searchKeyWord, String searchCategory) {
        String requestBody = createRequestBody(searchKeyWord, searchCategory);
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);
        Set<String> blacklistArticlesTitles = getBlacklistArticles();

        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticlesTitles);
//        mamy teraz zweyfikowane articles bez obiektów z blacklist,
//        przed połączeniem z internalami trzeba porównać ich tytuły i jeśli się powtarzają wybierz ten który ma Id
        List<Article> internalArticles = getInternalArticles(searchKeyWord, searchCategory);

        Set<String> internalArticlesTitles = getInternalArticlesTitles(internalArticles);
        List<Article> mergedArticles = mergeArticlesAndRemoveDuplicatesKeepRecordsWithId(internalArticles,
                listExternalArticlesVerified, internalArticlesTitles);

        // todo: musi być wpisywana domyślna wartość do pola category inaczej nie będzie id
        return mergedArticles;
    }

    private static String createRequestBody(String searchKeyWord, String searchCategory){
        String requestBody = 'https://newsapi.org/v2/top-headlines?q=';
        String address2 = '&country=us&category=business&apiKey=';
        if (searchKeyWord == 'undefined' || searchKeyWord == '' || searchKeyWord == null) {
            requestBody += '&country=us&category=';
        } else {
            requestBody += searchKeyWord + '&country=us&category=';
        }
        if (searchCategory != 'undefined' || searchCategory != '' || searchCategory != null) {
            requestBody += searchCategory;
        }
        String api = 'ff61ef2230634d3ab71be1e01e7c2d52';
        requestBody += '&apiKey=' + api;
        return requestBody;
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

    private static Set<String> getBlacklistArticles() {//tutaj bierzesz artykułu z blacklisty oraz te zapisane które jednocześnie nie należą do whitelist
        List<Article_From_Black_List__c> blacklistArticles = [
                SELECT
                        Article_Parent__r.Title__c
                FROM Article_From_Black_List__c
                WHERE CreatedById IN (SELECT Id FROM User)
        ];


        return getBlacklistArticleTitles(blacklistArticles);
    }

    private static Set<String> getBlacklistArticleTitles(List<Article_From_Black_List__c> blacklistArticles) {
        Set<String> blacklistArticleTitles = new Set<String>();
        for (Article_From_Black_List__c blacklistArticle : blacklistArticles) {
            blacklistArticleTitles.add(blacklistArticle.Article_Parent__r.Title__c);
        }
        return blacklistArticleTitles;
    }

    private static List<Article> verifyListExternalArticles(List<Article> listExternalArticlesNotVerified,
            Set<String> blacklistArticleTitles) {
        List<Article> listExternalArticlesVerified = new List<Article>();
        if (!blacklistArticleTitles.isEmpty()) {
            for (Article articleNotVerified : listExternalArticlesNotVerified) {
                if (!blacklistArticleTitles.contains(articleNotVerified.title)) {
                    listExternalArticlesVerified.add(articleNotVerified);
                }
            }
        } else {
            listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
        }
        return listExternalArticlesVerified;
    }

    private static List<Article> getInternalArticles(String searchKeyWord, String searchCategory) {
        String query =
                'SELECT ' +
                        '' +
                        'Name, ' +
                        'Id, ' +
                        'Author__c, ' +
                        'Content__c, ' +
                        'Description__c, ' +
                        'PublishedAt__c, ' +
                        'Title__c, ' +
                        'Url__c, ' +
                        'UrlToImage__c, ' +
                        'SourceName__c, ' +
                        'CreatedDate, ' +
                        'Category__c ' +
                        'FROM Article__c ' +
                        'WHERE Id NOT IN ( ' +
                        'SELECT ' +
                            'Article_Parent__c ' +
                        'FROM Article_From_Black_List__c ) ' +
                        'AND OwnerId IN ( ' +
                        'SELECT ' +
                        '   Id ' +
                        'FROM User )';
        List<Article__c> internalArticles = Database.query(query);
        System.debug(internalArticles);

        List<Article> convertedArticlesToClassObject = sObjectToClassArticle(internalArticles);

        return filterArticles(convertedArticlesToClassObject,
                searchKeyWord, searchCategory);
    }

    private static List<Article> sObjectToClassArticle(List<Article__c> internalArticles) {
        List<Article> convertedArticlesToClassObject = new List<Article>();
        String sth;
        for (Article__c internalArticle : internalArticles) {
            ArticleBuilder builder = new ArticleBuilder();
            builder.setId(internalArticle.Id);
            builder.setAuthor(internalArticle.Author__c);
            builder.setContent(internalArticle.Content__c);
            builder.setDescription(internalArticle.Description__c);
            builder.setPublishedAt(internalArticle.CreatedDate);
            builder.setTitle(internalArticle.Title__c);
            builder.setUrl(internalArticle.Url__c);
            builder.setUrlToImage(internalArticle.UrlToImage__c);
            builder.setSource(internalArticle.SourceName__c);
            builder.setCategory(internalArticle.Category__c);
            Article article = builder.getArticle();
            convertedArticlesToClassObject.add(article);
        }
        return convertedArticlesToClassObject;
    }

    private static List<Article> filterArticles(List<Article> convertedArticlesToClassObject,
            String searchKeyWord, String searchCategory){
        List<Article> filteredArticles = new List<Article>();

        if (searchKeyWord != 'undefined' || searchKeyWord != '' || searchKeyWord != null ||
                searchCategory != 'undefined' || searchCategory != '' || searchCategory != null) {
            for (Article article : convertedArticlesToClassObject){
                if ((article.title.contains(searchKeyWord) || article.description.contains(searchKeyWord) ||
                        article.content.contains(searchKeyWord)) && article.category == searchCategory) {
                    filteredArticles.add(article);
                }
            }
        }

        return filteredArticles;
    }

    private static Set<String> getInternalArticlesTitles(List<Article> internalArticles){
        Set<String> internalArticlesTitles = new Set<String>();
        for (Article internalArticle : internalArticles) {
            internalArticlesTitles.add(internalArticle.title);
        }
        return internalArticlesTitles;
    }

    private static List<Article> mergeArticlesAndRemoveDuplicatesKeepRecordsWithId(List<Article> internalArticles,
            List<Article> listExternalArticlesVerified, Set<String> internalArticlesTitles){
        List<Article> mergedListOfArticles = new List<Article>();

        mergedListOfArticles.addAll(internalArticles);
        for (Article externalArticleVerified : listExternalArticlesVerified){
            if (!internalArticlesTitles.contains(externalArticleVerified.title)) {
                mergedListOfArticles.add(externalArticleVerified);
            }
        }

        return mergedListOfArticles;
    }

    @AuraEnabled
    public static void addArticleToBlacklist(
            String source,
            String author,
            String title,
            String description,
            String url,
            String urlToImage,
            Datetime publishedAt,
            String content){
        ArticleBuilderObject builder = new ArticleBuilderObject();
        builder.setAuthor(author);
        builder.setContent(content);
        builder.setDescription(description);
        builder.setPublishedAt(publishedAt);
        builder.setTitle(title);
        builder.setUrl(url);
        builder.setUrlToImage(urlToImage);
        builder.setSource(source);
        Article__c article = builder.getArticle();
        insert article;

//        Article_From_Black_List__c articleToBlackList = new Article_From_Black_List__c();
//        articleToBlackList.Article_Parent__c = article.Id;
//        insert articleToBlackList;
    }
}