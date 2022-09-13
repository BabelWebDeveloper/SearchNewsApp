({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
    selectArticle : function(component, event, helper){
        var target = component.get("v.searchListFromHandleSearchListEvent")[event.currentTarget.dataset.record],
        selectedArticle = JSON.stringify(target);
        component.set("v.isModalOpen", true);
        component.set("v.articleInfo", target.author);
        console.log(target);

    },
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false
        component.set("v.isModalOpen", false);
    },
    submitDetails: function(component, event, helper) {
        // Set isModalOpen attribute to false
        //Add your code to call apex method or do some processing
        component.set("v.isModalOpen", false);
    },
})