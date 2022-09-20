({
    doInit : function(component, event, helper) {
        component.set('v.toggleSpinner',true);
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
    retrieveSearchListFromHandleSearchListEvent : function(component, event, helper){
        component.set('v.toggleSpinner',true);
        let pageSize = component.get("v.pageSize");
        let articlesFromHandleSearchListEvent = event.getParam('articles');
        let getSearchedCategory = event.getParam('category');
        component.set("v.categoryForSelect", getSearchedCategory);
        if (articlesFromHandleSearchListEvent.length > 0){
            component.set("v.isSearchListNotEmpty",true);
        } else {
            component.set("v.isSearchListNotEmpty",false);
            component.set("v.message","No news searched in selected parameters, try to write different keyword or category.");
        }
        component.set("v.articleList", articlesFromHandleSearchListEvent);
        component.set("v.totalSize", component.get("v.articleList").length);
        component.set("v.start",0);
        component.set("v.end",pageSize-1);
        let paginationList = [];
        for(let i=0; i< pageSize; i++){
            paginationList.push(articlesFromHandleSearchListEvent[i]);
        }
        component.set("v.paginationList", paginationList);
    },

    onSelectChange : function(component, event, helper) {
        component.set('v.toggleSpinner',true);
        let selected = component.find("records").get("v.value");
        let paginationList = [];
        let oppList = component.get("v.articleList");
        for(let i=0; i< selected; i++){
            paginationList.push(oppList[i]);
        }
        component.set("v.paginationList", paginationList);
    },

    searchKeyChange: function(component, event) {
        let searchKey =  component.find("input1").get("v.value");
        let action = component.get("c.getByName");
        let keysize = component.get("v.totalSize");
        action.setParams({
            "searchKey": searchKey
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (component.isValid() && state === "SUCCESS"){
                component.set("v.articleList", response.getReturnValue());
                component.set("v.totalSize", component.get("v.articleList").length);
                let paginationList = [];
                for(let i=0; i< keysize; i++){
                    paginationList.push(response.getReturnValue()[i]);
                }
                component.set("v.paginationList", paginationList);
            }
        });
        $A.enqueueAction(action);

    },
//
    first : function(component, event, helper){
        let oppList = component.get("v.articleList");
        let pageSize = component.get("v.pageSize");
        let paginationList = [];
        for(let i=0; i< pageSize; i++){
            paginationList.push(oppList[i]);
        }
        component.set("v.paginationList", paginationList);
    },
//
    last : function(component, event, helper){
        let oppList = component.get("v.articleList");
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
        let oppList = component.get("v.articleList");
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
        let oppList = component.get("v.articleList");
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
    selectArticle : function(component, event, helper){
        component.set('v.toggleSpinner',true);
        let target = component.get("v.paginationList")[event.currentTarget.dataset.record],
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
    saveNewComment : function (component, event, helper) {
        component.set('v.toggleSpinner',true);
        let comment = component.get( "v.newComment" );
        let selectedArticle = component.get("v.selectedArticle");
        let category = component.get("v.categoryForSelect");
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.saveCommentHelper( component, comment, selectedArticle, category );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set( "v.showApproveForComment", false );
        return;
    },
    addToBlacklist: function(component, event, helper) {
        component.set('v.toggleSpinner',true);
        let selectedArticle = component.get("v.selectedArticle");
        let category = component.get("v.categoryForSelect");
        console.log('addToBlacklist CONTROLLER category: ' + category);
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.addArticleToBlacklistHelper( component, selectedArticle, category );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        return;
    },
    addToWhitelist: function(component, event, helper) {
        component.set('v.toggleSpinner',true);
        let selectedArticle = component.get("v.selectedArticle");
        let category = component.get("v.categoryForSelect");
        console.log('addToWhitelist CONTROLLER category: ' + category);
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.addArticleToWhitelistHelper( component, selectedArticle, category );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        return;
    },
    removeFromWhitelist : function(component, event, helper) {
//        component.set('v.toggleSpinner',true);
        let selectedArticle = component.get( "v.selectedArticle" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.removeFromWhitelistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
//        let eventSpinner = $A.get("e.c:SearchAgain");
//                eventSpinner.fire();
        return;
    },
    removeFromBlacklist : function(component, event, helper) {
//        component.set('v.toggleSpinner',true);
        let selectedArticle = component.get( "v.selectedArticle" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.removeFromBlacklistHelper( component, selectedArticle );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
//        let eventSpinner = $A.get("e.c:SearchAgain");
//                eventSpinner.fire();
        return;
    },
    getBlacklistArticles : function(component, event, helper) {
        let emptyList = [];
        component.set("v.articleList", emptyList);
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
        let emptyList = [];
        component.set("v.articleList", emptyList);
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
        return;
    },
     hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false);
    },
    changeSearchListTitleToWhitelist : function(component, event, helper){
        component.set("v.listTitle", "Articles In Whitelist");
        console.log('component listTitle: '+ component.get("v.listTitle"));
    },
    changeSearchListTitleToBlacklist : function(component, event, helper){
        component.set("v.listTitle", "Articles In Blacklist");
        console.log('component listTitle: '+ component.get("v.listTitle"));
    },
    changeSearchListTitleToDefault : function(component, event, helper){
        component.set("v.listTitle", "Search List");
                console.log('component listTitle: '+ component.get("v.listTitle"));
    }

});