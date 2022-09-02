({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
})