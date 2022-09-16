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
            let responseSearchList = response.getReturnValue();
            let handleSearchListEvent = $A.get( "e.c:HandleSearchListEvent" );
            handleSearchListEvent.setParams({
                "articles" : responseSearchList
            });
            console.log('search click:')
            console.log(responseSearchList);
            if(responseSearchList == null){
                let eventSpinner = $A.get("e.c:LayoutSpinnerClose");
                    eventSpinner.fire();
            }
            handleSearchListEvent.fire();
            return;
        });
        $A.enqueueAction( getArticlesFromBackend );
    },
})