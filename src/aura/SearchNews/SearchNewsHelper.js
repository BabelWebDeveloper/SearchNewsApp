({
    handleSearch: function( component, searchKeyWord, searchCategory, event ) {
        let getArticlesFromBackend = component.get( "c.getArticles" );

        if (searchKeyWord === undefined) {
            searchKeyWord = "";
        }
        if (searchCategory === undefined) {
            searchCategory = "";
        }

        getArticlesFromBackend.setParams({
            searchKeyWord: searchKeyWord,
            searchCategory: searchCategory
        });

        getArticlesFromBackend.setCallback( this, function( response ) {
            let category = component.get("v.category");
            let responseSearchList = response.getReturnValue();
            let handleSearchListEvent = $A.get( "e.c:HandleSearchListEvent" );
            handleSearchListEvent.setParams({
                "articles" : responseSearchList,
                "category" : category
            });
            if(responseSearchList == null){
                let eventSpinner = $A.get("e.c:LayoutSpinnerClose");
                    eventSpinner.fire();
            }
            handleSearchListEvent.fire();
            return;
        });
        $A.enqueueAction( getArticlesFromBackend );
    },

    handleSearchBlacklist: function( component, event ) {
        let getBlacklistArticlesFromBackend = component.get( "c.showBlacklistArticles" );

        getBlacklistArticlesFromBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            let handleSearchListEvent = $A.get( "e.c:HandleSearchListEvent" );
            handleSearchListEvent.setParams({
                "articles" : responseSearchList
            });
            if(responseSearchList == null){
                let eventSpinner = $A.get("e.c:LayoutSpinnerClose");
                    eventSpinner.fire();
            }
            handleSearchListEvent.fire();
            return;
        });
        $A.enqueueAction( getBlacklistArticlesFromBackend );
    },

    handleSearchWhitelist: function( component, event ) {
        let getBlacklistArticlesFromBackend = component.get( "c.showWhitelistArticles" );

        getBlacklistArticlesFromBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            let handleSearchListEvent = $A.get( "e.c:HandleSearchListEvent" );
            handleSearchListEvent.setParams({
                "articles" : responseSearchList
            });
            if(responseSearchList == null){
                let eventSpinner = $A.get("e.c:LayoutSpinnerClose");
                    eventSpinner.fire();
            }
            handleSearchListEvent.fire();
            return;
        });
        $A.enqueueAction( getBlacklistArticlesFromBackend );
    },


})