({
    handleSearch: function( component, searchKeyWord, searchCategory ) {
        console.log('helper'+searchCategory);
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
            handleSearchListEvent.fire();
            return;
        });
        $A.enqueueAction( getArticlesFromBackend );
    },

//    handleSearch: function( component, searchKeyWord, searchCategory ) {
//        console.log('helper'+searchCategory);
//        let getArticlesFromBackend = component.get( "c.getArticles" );
//        let address = 'https://newsapi.org/v2/top-headlines?q=';
//        if (searchKeyWord === undefined) {
//            searchKeyWord = "";
//        } else if(searchKeyWord !== '' || searchKeyWord !== undefined || searchKeyWord !== null){
//            address += searchKeyWord;
//        }
//        address += '&country=us&category=business&apiKey=';
//        getArticlesFromBackend.setParams({
//            address: address
//        });
//
//        getArticlesFromBackend.setCallback( this, function( response ) {
//            let responseSearchList = response.getReturnValue();
//            let handleSearchListEvent = $A.get( "e.c:HandleSearchListEvent" );
//            handleSearchListEvent.setParams({
//                "articles" : responseSearchList
//            });
//            console.log('search click:')
//            console.log(responseSearchList);
//            handleSearchListEvent.fire();
//            return;
//        });
//        $A.enqueueAction( getArticlesFromBackend );
//    },
//
})