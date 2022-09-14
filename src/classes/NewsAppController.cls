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
        Set<String> blacklistArticles = getBlacklistArticles();
        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticles);

        List<Article> internalArticles = getInternalArticles(searchKeyWord, searchCategory);

        List<Article> mergedArticlesNotSorted = new List<Article>();
        mergedArticlesNotSorted.addAll(listExternalArticlesVerified);
        mergedArticlesNotSorted.addAll(internalArticles);
        // todo: podwójne wartości gdy usunę z blacklisty

//        System.debug(' size of listExternalArticlesNotVerified: ' + listExternalArticlesNotVerified.size());
//        System.debug(' size of blacklistArticles: ' + blacklistArticles.size());
//        System.debug(' size of listExternalArticlesVerified ' + listExternalArticlesVerified.size());
//        System.debug(' size of mergedListNotSorted: ' + listExternalArticlesVerified.size());

//        mergowanie ich w jedną listę

        return mergedArticlesNotSorted;
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
            Set<String> blacklistArticleTitles) {
        List<Article> listExternalArticlesVerified = new List<Article>();
        if (!blacklistArticleTitles.isEmpty()) {
            for (Article articleNotVerified : listExternalArticlesNotVerified) {
                if (!blacklistArticleTitles.contains(articleNotVerified.title)) {
                    listExternalArticlesVerified.add(articleNotVerified);
                } else {
//                    System.debug('contains: ' + articleNotVerified);
                }
            }
        } else {
            listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
        }
        return listExternalArticlesVerified;
    }

    private static List<Article> getInternalArticles(String searchKeyWord, String searchCategory) {
//        todo wyszukiwarka wewnętrzna nie działa na wpisany tekst - wyszukuje wszystko, trzeba zrobić duże query wyszukujące słowo kluczowe wszędzie
        String query =
                'SELECT ' +
                        '' +
                        'Name, ' +
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
        List<Article> convertedArticlesToClassObject = sObjectToClassArticle(internalArticles);

        return filterArticles(convertedArticlesToClassObject,
                searchKeyWord, searchCategory);
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

    public static List<Article> sObjectToClassArticle(List<Article__c> internalArticles) {
        List<Article> convertedArticlesToClassObject = new List<Article>();
        String sth;
        for (Article__c internalArticle : internalArticles) {
            ArticleBuilder builder = new ArticleBuilder();
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
//        todo pobrana wartość z JSa jest nullem, trzeba przekazać pojedyńcze parametry jako string...
        ArticleBuilder builder = new ArticleBuilder();
        builder.setAuthor(author);
        builder.setContent(content);
        builder.setDescription(description);
        builder.setPublishedAt(publishedAt);
        builder.setTitle(title);
        builder.setUrl(url);
        builder.setUrlToImage(urlToImage);
        builder.setSource(source);
        Article article = builder.getArticle();
// kurwa głupi dałnie insertujesz article__c a nie article .....
        insert article;
    }
}