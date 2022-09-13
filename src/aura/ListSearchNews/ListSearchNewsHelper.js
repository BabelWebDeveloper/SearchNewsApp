({
    sendSearchListFromEventToComponent: function( component, articlesFromHandleSearchListEvent ) {
        component.set("v.searchListFromHandleSearchListEvent",articlesFromHandleSearchListEvent);
        return;
    },
    addArticleToBlacklistHelper: function( component, selectedArticle ){
        let addArticleToBlacklistBackend = component.get( "c.addArticleToBlacklist" );
        addArticleToBlacklistBackend.setParams({
            selectedArticle: selectedArticle
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