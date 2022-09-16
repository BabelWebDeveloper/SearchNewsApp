({
    getPopularArticlesHelper: function(component, event, helper){
        console.log('helper work');
        let getPopularArticlesFromBackend = component.get( "c.getPopularArticles" );
        getPopularArticlesFromBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            component.set("v.popularArticles", responseSearchList);
            console.log(responseSearchList);
            return;
        });
        $A.enqueueAction( getPopularArticlesFromBackend );
    }
})