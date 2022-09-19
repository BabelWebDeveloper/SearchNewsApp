({
    retrieveSearchListFromHandleSearchListEvent: function( component, event, helper ) {
        console.log('searchListFromHandleSearchListEvent work')
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        if (articlesFromHandleSearchListEvent.length > 0){
            component.set("v.isSearchListNotEmpty",true);
        } else {
            component.set("v.isSearchListNotEmpty",false);
            component.set("v.message","No news searched in selected parameters, try to write different keyword or category.");
        }
        component.set("v.listTitle", "News List");
        helper.sendSearchListFromEventToComponent( component, articlesFromHandleSearchListEvent );
        return;
    },
    selectArticle : function(component, event, helper){
        let target = component.get("v.searchListFromHandleSearchListEvent")[event.currentTarget.dataset.record],
                selectedArticle = JSON.stringify(target);
        component.set("v.selectedArticle", target);
        let id = target.id;
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.getCommentsHelper( component, id );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.isModalOpen", true);
        return;
    },
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
        component.set( "v.newComment", '' );
        component.set( "v.showApproveForComment", true );
        let eventSpinner = $A.get("e.c:SearchAgain");
            eventSpinner.fire();
        return;
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
        return;
    },
    addToWhitelist: function(component, event, helper) {
        let selectedArticle = component.get("v.selectedArticle");
        console.log('selectedArticle before in controller: ' + selectedArticle)
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.addArticleToWhitelistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        console.log('selectedArticle after in controller: ' + selectedArticle)
        return;
    },

    selectComment: function(component, event, helper){
        let target = component.get("v.comments")[event.currentTarget.dataset.record],
                selectedArticle = JSON.stringify(target);
                return;
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
        return;
    },
    getBlacklistArticles : function(component, event, helper) {
        component.set('v.toggleSpinner',true);
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.getBlacklistArticlesHelper( component );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.articleInWhitelist",false);
        component.set("v.articleInBlacklist",true);
        component.set("v.listTitle", "Articles In Blacklist");
        return;
    },
    getWhitelistArticles : function(component, event, helper) {
        component.set('v.toggleSpinner',true);
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.getWhitelistArticlesHelper( component );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.articleInBlacklist",false);
        component.set("v.articleInWhitelist",true);
        component.set("v.listTitle", "Articles In Whitelist");
        return;
    },

    doInit : function(component, event, helper) {
        let action = component.get("c.fetchUser");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let storeResponse = response.getReturnValue();
                component.set("v.userInfo", storeResponse);
            }
        });
        $A.enqueueAction(action);
        return;
    },
    removeFromWhitelist : function(component, event, helper) {
        let selectedArticle = component.get( "v.selectedArticle" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.removeFromWhitelistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        console.log('removeFromWhitelist controller STILL work');
        var a = component.get('c.getWhitelistArticles');
                        $A.enqueueAction(a);
        return;
    },
    removeFromBlacklist : function(component, event, helper) {
        let selectedArticle = component.get( "v.selectedArticle" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.removeFromBlacklistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
         var a = component.get('c.getBlacklistArticles');
                $A.enqueueAction(a);
        return;
    },
    hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false)
    },
    first : function(component, event, helper){
        let oppList = component.get("v.searchListFromHandleSearchListEvent");
        let pageSize = component.get("v.pageSize");
        let paginationList = [];
        for(let i=0; i< pageSize; i++){
            paginationList.push(oppList[i]);
        }
        component.set("v.paginationList", paginationList);
    },
//
    last : function(component, event, helper){
        let oppList = component.get("v.searchListFromHandleSearchListEvent");
        let pageSize = component.get("v.pageSize");
        let totalSize = component.get("v.totalSize");
        let paginationList = [];
        for(let i=totalSize-pageSize+1; i< totalSize; i++){
            paginationList.push(oppList[i]);
        }
        component.set("v.paginationList", paginationList);
    },
//
    next : function(component, event, helper){
        let oppList = component.get("v.searchListFromHandleSearchListEvent");
        let end = component.get("v.end");
        let start = component.get("v.start");
        let pageSize = component.get("v.pageSize");
        let paginationList = [];
        let counter = 0;
        for(let i=end+1; i<end+pageSize+1; i++){
            if(oppList.length > end){
                paginationList.push(oppList[i]);
                counter ++;
            }
        }
        start = start + counter;
        end = end + counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set("v.paginationList", paginationList);
    },

    previous : function(component, event, helper){
        let oppList = component.get("v.searchListFromHandleSearchListEvent");
        let end = component.get("v.end");
        let start = component.get("v.start");
        let pageSize = component.get("v.pageSize");
        let paginationList = [];
        let counter = 0;
        for(let i = start - pageSize; i < start ; i++){
            if(i > -1) {
                paginationList.push(oppList[i]);
                counter ++;
            } else {
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set("v.paginationList", paginationList);
    },

})