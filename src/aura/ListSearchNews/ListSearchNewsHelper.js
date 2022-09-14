({
    sendSearchListFromEventToComponent: function( component, articlesFromHandleSearchListEvent ) {
        component.set("v.searchListFromHandleSearchListEvent",articlesFromHandleSearchListEvent);
        return;
    },
    addArticleToBlacklistHelper: function( component, selectedArticle ){
        let addArticleToBlacklistBackend = component.get( "c.addArticleToBlacklist" );

        let source = selectedArticle.source.name;
        let author = selectedArticle.author;
        let title = selectedArticle.title;
        let description = selectedArticle.description;
        let url = selectedArticle.url;
        let urlToImage = selectedArticle.urlToImage;
        let publishedAt = selectedArticle.publishedAt;
        let content = selectedArticle.content;

        addArticleToBlacklistBackend.setParams({
            source: source,
            author: author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content
        });

        addArticleToBlacklistBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
//            let responseStatus = response.status;
//            console.log('callback work');
            return;
        });
        console.log(selectedArticle.description);
        $A.enqueueAction( addArticleToBlacklistBackend );
        component.set("v.isModalOpen", false);
    }
})