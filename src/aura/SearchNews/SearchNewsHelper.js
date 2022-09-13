({
    handleSearch: function( component, searchKeyWord ) {
        let getArticlesFromBackend = component.get( "c.getArticles" );
        let address = 'https://newsapi.org/v2/top-headlines?q=';
        if (searchKeyWord === undefined) {
            console.log('undefined')
            searchKeyWord = "";
        } else if(searchKeyWord !== '' || searchKeyWord !== undefined || searchKeyWord !== null){
            console.log(searchKeyWord)
            address += searchKeyWord;
        }
        address += '&country=us&category=business&apiKey=';
        console.log(address);
        getArticlesFromBackend.setParams({
            address: address
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
})