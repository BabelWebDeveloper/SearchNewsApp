({
    testHelper : function( component, pageSize, event ){
        let action = component.get("c.getOpportunities");
        action.setCallback(this, function(response){
            let state = response.getState();
            let responseSearchList = response.getReturnValue();
            if (state === "SUCCESS"){
                component.set("v.articleList", responseSearchList);
                component.set("v.totalSize", component.get("v.articleList").length);
                component.set("v.start",0);
                component.set("v.end",pageSize-1);
                let paginationList = [];
                for(let i=0; i< pageSize; i++){
                    paginationList.push(responseSearchList[i]);
                }
                component.set("v.paginationList", paginationList);
            }
            });

        $A.enqueueAction(action);
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
    saveCommentHelper: function( component, comment, article, categoryFromController ){
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
        let category = categoryFromController;

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
            comment: comment,
            category: category
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
    addArticleToBlacklistHelper: function( component, selectedArticle, categoryFromController ){
        component.set('v.toggleSpinner',true);
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
        let category = categoryFromController;


        addArticleToBlacklistBackend.setParams({
            id: id,
            source: source,
            author: author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content,
            category: category
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
    addArticleToWhitelistHelper: function( component, selectedArticle, categoryFromController ){
        component.set('v.toggleSpinner',true);
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
        let category = categoryFromController;


        addArticleToWhitelistBackend.setParams({
            id: id,
            source: source,
            author: author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content,
            category: category
        });

        addArticleToWhitelistBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            let responseStatus = response.getState();
            return;
        });
        $A.enqueueAction( addArticleToWhitelistBackend );
        component.set("v.isModalOpen", false);
        let eventSpinner = $A.get("e.c:SearchAgain");
        eventSpinner.fire();
    },
    removeFromWhitelistHelper: function( component, selectedArticle ) {
        component.set('v.toggleSpinner',true);
        let id = selectedArticle.id;
        let removeFromWhitelistBackend = component.get( "c.removeFromWhitelistBackend" );
        removeFromWhitelistBackend.setParams({
            id: id
        });
        removeFromWhitelistBackend.setCallback( this, function( response ) {
            return;
        });
        $A.enqueueAction( removeFromWhitelistBackend );
        component.set("v.isModalOpen", false);
        let eventSpinner = $A.get("e.c:SearchAgain");
                        eventSpinner.fire();
    },
    removeFromBlacklistHelper: function( component, selectedArticle ) {
        component.set('v.toggleSpinner',true);
        let id = selectedArticle.id;
        let removeFromBlacklistBackend = component.get( "c.removeFromBlacklistBackend" );
        removeFromBlacklistBackend.setParams({
            id: id
        });
        removeFromBlacklistBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            return;
        });
        $A.enqueueAction( removeFromBlacklistBackend );
        component.set("v.isModalOpen", false);
        let eventSpinner = $A.get("e.c:SearchAgain");
                        eventSpinner.fire();
    },
    getBlacklistArticlesHelper: function( component ) {
        let showBlacklistArticlesBackend = component.get( "c.showBlacklistArticles" );
        showBlacklistArticlesBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            component.set("v.articleList", responseSearchList)
            component.set("v.isSearchListNotEmpty", true);
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
            component.set("v.articleList", responseSearchList);
            component.set("v.isSearchListNotEmpty", true);
            return;
        });
        $A.enqueueAction( showWhitelistArticles );
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
        changeVisibilityToListEvent.fire();
    },
})