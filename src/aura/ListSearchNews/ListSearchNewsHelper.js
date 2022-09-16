({
    sendSearchListFromEventToComponent: function( component, articlesFromHandleSearchListEvent ) {
        component.set("v.searchListFromHandleSearchListEvent",articlesFromHandleSearchListEvent);
        return;
    },
    addArticleToBlacklistHelper: function( component, selectedArticle ){
        let addArticleToBlacklistBackend = component.get( "c.addArticleToBlacklist" );

        let id = selectedArticle.id;
        let source = selectedArticle.source.name;
        let author = selectedArticle.author;
        let title = selectedArticle.title;
        let description = selectedArticle.description;
        let url = selectedArticle.url;
        let urlToImage = selectedArticle.urlToImage;
        let publishedAt = selectedArticle.publishedAt;
        let content = selectedArticle.content;

        addArticleToBlacklistBackend.setParams({
            id: id,
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
            return;
        });
        $A.enqueueAction( addArticleToBlacklistBackend );
        component.set("v.isModalOpen", false);
    },
    getCommentsHelper: function( component, id ){
        let getCommentsFromBackend = component.get( "c.getComments" );
        getCommentsFromBackend.setParams({
            id: id
        });
        getCommentsFromBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            component.set("v.comments", responseSearchList);
            return;
        });
        $A.enqueueAction( getCommentsFromBackend );
    },
    saveCommentHelper: function( component, comment, article ){
        let saveCommentBackend = component.get( "c.saveComment" );

        let id = article.id;
        let source = article.source.name;
        let author = article.author;
        let title = article.title;
        let description = article.description;
        let url = article.url;
        let urlToImage = article.urlToImage;
        let publishedAt = article.publishedAt;
        let content = article.content;

        console.log('saveCommentHelper: '+id);
        console.log('saveCommentHelper: '+title);

        saveCommentBackend.setParams({
            id: id,
            source: source,
            author: author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content,
            comment: comment
        });
        saveCommentBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getState();
            return;
        });
        $A.enqueueAction( saveCommentBackend );
    }
})