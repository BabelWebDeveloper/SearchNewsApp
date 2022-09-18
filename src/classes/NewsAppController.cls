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
        List<Article> listExternalArticlesNotVerified = getListExternalArticlesNotVerifiedCallout(requestBody);//git
        Set<String> blacklistArticlesTitles = getBlacklistArticles();

        List<Article> listExternalArticlesVerified = verifyListExternalArticles(listExternalArticlesNotVerified,
                blacklistArticlesTitles);
        List<Article> internalArticles = getInternalArticles(searchKeyWord, searchCategory);

        Set<String> internalArticlesTitles = getInternalArticlesTitles(internalArticles);
        List<Article> mergedArticles = mergeArticlesAndRemoveDuplicatesKeepRecordsWithId(internalArticles,
                listExternalArticlesVerified, internalArticlesTitles);

        return mergedArticles;
    }

    private static String createRequestBody(String searchKeyWord, String searchCategory) {
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

    private static Set<String> getBlacklistArticles() {
        List<Article_From_Black_List__c> blacklistArticles = [
                SELECT
                        Article_Parent__r.Title__c
                FROM Article_From_Black_List__c
                WHERE CreatedById IN (SELECT Id FROM User)
        ];

        return getBlacklistArticleTitles(blacklistArticles);
    }

    @AuraEnabled
    public static List<Article> showBlacklistArticles() {
        System.debug('backend ShowSelectedArticlesEvent work');
        List<Article__c> blacklistArticles = [
                SELECT
                        Description__c,
                        OwnerId,
                        SourceName__c,
                        Content__c,
                        Author__c,
                        Url__c,
                        UrlToImage__c,
                        CreatedDate,
                        Title__c,
                        Category__c,
                        IsBlackList__c,
                        IsWhiteList__c
                FROM Article__c
                WHERE Id IN (
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

        return sObjectToClassArticle(blacklistArticles);
    }

    @AuraEnabled
    public static List<Article> showWhitelistArticles() {
        System.debug('backend ShowSelectedArticlesEvent work');
        List<Article__c> whitelistArticles = [
                SELECT
                        Description__c,
                        OwnerId,
                        SourceName__c,
                        Content__c,
                        Author__c,
                        Url__c,
                        UrlToImage__c,
                        CreatedDate,
                        Title__c,
                        Category__c,
                        IsBlackList__c,
                        IsWhiteList__c
                FROM Article__c
                WHERE Id IN (
                        SELECT
                                Article_Parent__c
                        FROM Article_From_White_List__c
                )
                AND OwnerId IN (
                        SELECT
                                Id
                        FROM User
                )
        ];

        return sObjectToClassArticle(whitelistArticles);
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
        try {
            if (!listExternalArticlesNotVerified.isEmpty()) {
                if (!blacklistArticleTitles.isEmpty()) {
                    for (Article articleNotVerified : listExternalArticlesNotVerified) {
                        if (!blacklistArticleTitles.contains(articleNotVerified.title)) {
                            listExternalArticlesVerified.add(articleNotVerified);
                        }
                    }
                } else {
                    listExternalArticlesVerified.addAll(listExternalArticlesNotVerified);
                }
            }
        } catch (Exception e) {
            System.debug(e);
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
                        'Category__c, ' +
                        'IsBlackList__c, ' +
                        'IsWhiteList__c ' +
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

    private static List<Article> sObjectToClassArticle(List<Article__c> internalArticles) {
        System.debug(internalArticles);
        List<Article> convertedArticlesToClassObject = new List<Article>();
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
            builder.setWhitelist(internalArticle.IsWhiteList__c);
            builder.setBlacklist(internalArticle.IsBlackList__c);
            Article article = builder.getArticle();
            convertedArticlesToClassObject.add(article);
        }
        System.debug(convertedArticlesToClassObject);
        return convertedArticlesToClassObject;
    }

    private static List<Article> filterArticles(List<Article> convertedArticlesToClassObject,
            String searchKeyWord, String searchCategory) {
        List<Article> filteredArticles = new List<Article>();

        if (searchKeyWord != 'undefined' || searchKeyWord != '' || searchKeyWord != null ||
                searchCategory != 'undefined' || searchCategory != '' || searchCategory != null) {
            for (Article article : convertedArticlesToClassObject) {
                if ((article.title.contains(searchKeyWord) || article.description.contains(searchKeyWord) ||
                        article.content.contains(searchKeyWord)) && article.category == searchCategory) {
                    filteredArticles.add(article);
                }
            }
        }

        return filteredArticles;
    }

    private static Set<String> getInternalArticlesTitles(List<Article> internalArticles) {
        Set<String> internalArticlesTitles = new Set<String>();
        for (Article internalArticle : internalArticles) {
            internalArticlesTitles.add(internalArticle.title);
        }
        return internalArticlesTitles;
    }

    private static List<Article> mergeArticlesAndRemoveDuplicatesKeepRecordsWithId(List<Article> internalArticles,
            List<Article> listExternalArticlesVerified, Set<String> internalArticlesTitles) {
        List<Article> mergedListOfArticles = new List<Article>();

        mergedListOfArticles.addAll(internalArticles);
        if (!listExternalArticlesVerified.isEmpty()) {
            for (Article externalArticleVerified : listExternalArticlesVerified) {
                if (!internalArticlesTitles.contains(externalArticleVerified.title)) {
                    mergedListOfArticles.add(externalArticleVerified);
                }
            }
        }

        return mergedListOfArticles;
    }

    @AuraEnabled
    public static void addArticleToBlacklist(
            String id,
            String source,
            String author,
            String title,
            String description,
            String url,
            String urlToImage,
            Datetime publishedAt,
            String content) {
        try {
            if (id == null || id == '') {
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
                article.IsBlackList__c = true;
                insert article;

                Article_From_Black_List__c articleToBlackList = new Article_From_Black_List__c();
                articleToBlackList.Article_Parent__c = article.Id;
                insert articleToBlackList;
            } else {
                Article__c article = [SELECT Id, IsWhiteList__c FROM Article__c WHERE Id = :id];
                if (article.IsWhiteList__c != true) {
                    article.IsBlackList__c = true;
                    update article;
                    Article_From_Black_List__c articleToBlackList = new Article_From_Black_List__c();
                    articleToBlackList.Article_Parent__c = article.Id;
                    insert articleToBlackList;
                }
            }
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled
    public static void addArticleToWhitelist(
            String id,
            String source,
            String author,
            String title,
            String description,
            String url,
            String urlToImage,
            Datetime publishedAt,
            String content) {
        try {
            if (id == null || id == '') {
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
                article.IsWhiteList__c = true;
                insert article;
                System.debug('addArticleToWhitelist, id jest nullem, NEW article: ' + article);

                Article_From_White_List__c articleToWhiteList = new Article_From_White_List__c();
                articleToWhiteList.Article_Parent__c = article.Id;
                insert articleToWhiteList;
                System.debug(articleToWhiteList);
            } else {
                System.debug('addArticleToWhitelist id nie jest nullem: ' + id);
                Article__c article = [SELECT Id, IsBlackList__c FROM Article__c WHERE Id = :id];
                if (article.IsBlackList__c != true) {
                    article.IsWhiteList__c = true;
                    update article;
                    Article_From_White_List__c articleToWhiteList = new Article_From_White_List__c();
                    articleToWhiteList.Article_Parent__c = article.Id;
                    insert articleToWhiteList;
                    System.debug('article in white list: ' + articleToWhiteList);
                }
            }
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled
    public static List<Comment__c> getComments(String id) {
        return [
                SELECT CommentText__c, Article_Parent__c, CreatedDate
                FROM Comment__c
                WHERE Article_Parent__c = :id
        ];
    }

    @AuraEnabled
    public static void saveComment(
            String id,
            String source,
            String author,
            String title,
            String description,
            String url,
            String urlToImage,
            Datetime publishedAt,
            String content,
            String comment) {
        try {
            if (id == null || id == '') {
                System.debug('id jest nullem: ' + id);
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
                System.debug('article.id: ' + article.id);

                Comment__c newComment = new Comment__c();
                newComment.CommentText__c = comment;
                newComment.Article_Parent__c = article.id;
                insert newComment;
                System.debug('newComment: ' + newComment);
            } else {
                System.debug('id nie jest nullem: ' + id);
                Comment__c newComment = new Comment__c(
                        CommentText__c = comment,
                        Article_Parent__c = id);
                System.debug('newComment: ' + newComment);
                insert newComment;
            }
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled
    public static List<Article> getPopularArticles() {
        List<Article__c> articleObjects = [
                SELECT
                        Title__c,
                        PublishedAt__c,
                        UrlToImage__c,
                        Url__c,
                        Author__c,
                        Description__c,
                        Content__c,
                        SourceName__c,
                        CreatedDate,
                        Category__c,
                        IsBlackList__c,
                        IsWhiteList__c
                FROM Article__c
                LIMIT 3
        ];
        return sObjectToClassArticle(articleObjects);
    }

    @AuraEnabled
    public static User fetchUser() {
        User user = [SELECT Id,Name,MediumPhotoURL from User WHERE Id = :userInfo.getUserId()];
        return user;
    }

    @AuraEnabled
    public static void removeFromBlacklistBackend(String id) {
        Article__c articleToUpdate = [
                SELECT Id, Name
                FROM Article__c
                WHERE Id = :id
        ];
        articleToUpdate.IsBlackList__c = false;
        update articleToUpdate;
        Article_From_Black_List__c articleToRemove = [
                SELECT Id, Name
                FROM Article_From_Black_List__c
                WHERE Article_Parent__c = :id
        ];
        delete articleToRemove;
    }

    @AuraEnabled
    public static void removeFromWhitelistBackend(String id) {
        Article__c articleToUpdate = [
                SELECT Id, Name
                FROM Article__c
                WHERE Id = :id
        ];
        articleToUpdate.IsWhiteList__c = false;
        update articleToUpdate;
        Article_From_White_List__c articleToRemove = [
                SELECT Id, Name
                FROM Article_From_White_List__c
                WHERE Article_Parent__c = :id
        ];
        delete articleToRemove;
    }


}
//todo Zmienić układ modala: zdjęcie po lewej, po prawej description i content, po kliknięciu show comments pojawiają się komentarze i możliwość ich dodania