({
    sendSearchListFromEventToComponent: function( component, articlesFromHandleSearchListEvent ) {
        console.log('articlesFromHandleSearchListEvent: ' + articlesFromHandleSearchListEvent)
        component.set("v.searchListFromHandleSearchListEvent",articlesFromHandleSearchListEvent);
        component.set("v.articleInWhitelist",false);
        component.set("v.articleInBlacklist",false);
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
        let eventSpinner = $A.get("e.c:SearchAgain");
                        eventSpinner.fire();
    },
    addArticleToWhitelistHelper: function( component, selectedArticle ){
        console.log('selectedArticle helper: ' + selectedArticle);
        console.log('selectedArticle ID helper: ' + selectedArticle.id);
        let addArticleToWhitelistBackend = component.get( "c.addArticleToWhitelist" );

        let id = selectedArticle.id;
        let source = selectedArticle.source.name;
        let author = selectedArticle.author;
        let title = selectedArticle.title;
        let description = selectedArticle.description;
        let url = selectedArticle.url;
        let urlToImage = selectedArticle.urlToImage;
        let publishedAt = selectedArticle.publishedAt;
        let content = selectedArticle.content;

        addArticleToWhitelistBackend.setParams({
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

        addArticleToWhitelistBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            return;
        });
        $A.enqueueAction( addArticleToWhitelistBackend );
        component.set("v.isModalOpen", false);
        let eventSpinner = $A.get("e.c:SearchAgain");
                                eventSpinner.fire();
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
        try{
            $A.enqueueAction( saveCommentBackend );
        } catch(e){
            console.log(e);
        }

    },
    getBlacklistArticlesHelper: function( component ) {
        console.log('helper event fired');
        let showBlacklistArticlesBackend = component.get( "c.showBlacklistArticles" );
        showBlacklistArticlesBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            console.log(responseSearchList);
            component.set("v.searchListFromHandleSearchListEvent", responseSearchList);
            component.set("v.isSearchListNotEmpty", true);
            // zwraca article c a do searchów jest article
            return;
        });
        $A.enqueueAction( showBlacklistArticlesBackend );
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
                                        changeVisibilityToListEvent.fire();
    },
    getWhitelistArticlesHelper: function( component ) {
        let showWhitelistArticles = component.get( "c.showWhitelistArticles" );
        showWhitelistArticles.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            console.log(responseSearchList);
            component.set("v.searchListFromHandleSearchListEvent", responseSearchList);
            component.set("v.isSearchListNotEmpty", true);
            return;
        });
        $A.enqueueAction( showWhitelistArticles );
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
                                        changeVisibilityToListEvent.fire();
    },
    removeFromWhitelistHelper: function( component, selectedArticle ) {
        let id = selectedArticle.id;
        console.log('selectedArticleId:' + id);
        let removeFromWhitelistBackend = component.get( "c.removeFromWhitelistBackend" );
        removeFromWhitelistBackend.setParams({
                    id: id
                });
        removeFromWhitelistBackend.setCallback( this, function( response ) {
//            let responseSearchList = response.getReturnValue();
//            component.set("v.articleInBlacklist", true);
                component.set("v.isModalOpen", false);
            return;
        });
        $A.enqueueAction( removeFromWhitelistBackend );
    },
    removeFromBlacklistHelper: function( component, selectedArticle ) {
        let id = selectedArticle.id;
        console.log('selectedArticleId:' + id);
        let removeFromBlacklistBackend = component.get( "c.removeFromBlacklistBackend" );
        removeFromBlacklistBackend.setParams({
                    id: id
                });
        removeFromBlacklistBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
//            component.set("v.articleInBlacklist", true);
                component.set("v.isModalOpen", false);
            return;
        });
        $A.enqueueAction( removeFromBlacklistBackend );
    },



})