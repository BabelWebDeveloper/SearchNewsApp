({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
    selectArticle : function(component, event, helper){
        let target = component.get("v.searchListFromHandleSearchListEvent")[event.currentTarget.dataset.record],
        selectedArticle = JSON.stringify(target);
        component.set("v.isModalOpen", true);
        component.set("v.selectedArticle", target);
    },
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
    },
    addToBlacklist: function(component, event, helper) {
        let selectedArticle = component.get("v.selectedArticle");
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.addArticleToBlacklistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    },
//    onclick get object v.selectedArticle przekazanie go do handlera
//    w handlerze opalenie funkcji na backendzie która z przekazanego Article stworzy Article__c, wezmie jego Id i stworzy nowy rekord w blacklist
})