({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        if (articlesFromHandleSearchListEvent.length > 0){
            component.set("v.isSearchListNotEmpty",true);
//            todo tutaj odpalić event który zamknie spinner i tak samo poniżej closeSpinnerInEmergency
        } else {
            component.set("v.isSearchListNotEmpty",false);
            component.set("v.message","No news searched in selected parameters, try to write different keyword or category.");
        }
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
    selectArticle : function(component, event, helper){
        let target = component.get("v.searchListFromHandleSearchListEvent")[event.currentTarget.dataset.record],
                selectedArticle = JSON.stringify(target);
        component.set("v.isModalOpen", true);
        component.set("v.selectedArticle", target);
        let id = target.id;
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.getCommentsHelper( component, id );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    },
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
        component.set( "v.newComment", '' );
        component.set( "v.showApproveForComment", true );
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
    selectComment: function(component, event, helper){
        let target = component.get("v.comments")[event.currentTarget.dataset.record],
                selectedArticle = JSON.stringify(target);
    },
    saveNewComment : function (component, event, helper) {
        let comment = component.get( "v.newComment" );
        let selectedArticle = component.get("v.selectedArticle");
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.saveCommentHelper( component, comment, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set( "v.showApproveForComment", false );
    },
    doInit : function(component, event, helper) {
    let action = component.get("c.fetchUser");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let storeResponse = response.getReturnValue();
                console.log(storeResponse.MediumPhotoURL)
                component.set("v.userInfo", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
})