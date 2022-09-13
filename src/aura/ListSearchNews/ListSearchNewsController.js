({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
    selectArticle : function(component, event, helper){
        var target = component.get("v.searchListFromHandleSearchListEvent")[event.currentTarget.dataset.record],
        selectedArticle = JSON.stringify(target);
        console.log(target);
    },
})