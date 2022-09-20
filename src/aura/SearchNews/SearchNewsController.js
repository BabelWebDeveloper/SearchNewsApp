({
    onInit: function( component, event, helper ) {
        component.set( "v.category", "Business" );
        return;
    },
    onSingleSelectChange: function(component) {
        let selectCmp = component.find("InputSelectSingle");
        component.set( "v.category", selectCmp.get("v.value") );
        return;
    },
    setCategoryForNewArticle: function(component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set( "v.categoryNew", selectCmp.get("v.value") );
        return;
    },

    search : function (component, event, helper) {
        let searchKeyWord = component.get( "v.searchKeyWord" );
        let searchCategory = component.get( "v.category" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.handleSearch( component, searchKeyWord, searchCategory, event );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.searchTitle", "Search List");
//        let eventSpinner = $A.get("e.c:LayoutSpinner");
//                    eventSpinner.fire();
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
//        changeVisibilityToListEvent.setParams({
//                            "title" : "search"
//                        });
                    changeVisibilityToListEvent.fire();
                    return;
    },

    searchBlacklist : function (component, event, helper) {
        let searchKeyWord = component.get( "v.searchKeyWord" );
        let searchCategory = component.get( "v.category" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.handleSearchBlacklist( component, event );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.searchTitle", "Blacklist");
//        let eventSpinner = $A.get("e.c:LayoutSpinner");
//                    eventSpinner.fire();
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
//        changeVisibilityToListEvent.setParams({
//                    "title" : "blacklist"
//                });
                    changeVisibilityToListEvent.fire();
                    return;
    },

    searchWhitelist : function (component, event, helper) {
        let searchKeyWord = component.get( "v.searchKeyWord" );
        let searchCategory = component.get( "v.category" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.handleSearchWhitelist( component, event );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
        component.set("v.searchTitle", "Whitelist");
        let eventSpinner = $A.get("e.c:LayoutSpinner");
                    eventSpinner.fire();
        let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
                    changeVisibilityToListEvent.fire();
                    return;
    },


    handleSelect: function (component, event) {
        let selectedMenuItemValue = event.getParam("value");
        if (selectedMenuItemValue === 'popular'){
             $A.get('e.force:refreshView').fire();
        }
        else if (selectedMenuItemValue === 'blacklist') {
            component.set('v.toggleSpinner',true);
            let eventBlacklist = $A.get("e.c:ShowBlacklistArticles");
                eventBlacklist.fire();
//            let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
//                                changeVisibilityToListEvent.fire();
        }
        else if (selectedMenuItemValue === 'whitelist') {
            component.set('v.toggleSpinner',true);
            let eventWhitelist = $A.get("e.c:ShowWhitelistArticles");
                eventWhitelist.fire();
//            let changeVisibilityToListEvent = $A.get("e.c:ChangeVisibilityToListEvent");
//                                changeVisibilityToListEvent.fire();
        }
    },
    hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false)
    },
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
        component.set( "v.newComment", '' );
        component.set( "v.showApproveForComment", true );
        component.set("v.imageUrl","none");
        component.set("v.newArticleTitle","");
        component.set("v.newArticleDescription","");
        component.set("v.newArticleContent","");
        component.set("v.newArticleAuthor","");
        return;
    },
    addNewArticle : function(component,event,helper){
        component.set("v.isModalOpen", true);
    },
    handleUploadFinished: function (component, event, helper) {
        if(event.getParam("files").length > 0) {
            let uploadedImage = event.getParam("files");
            let contentId;
            uploadedImage.forEach(file => contentId = file.documentId);
            let action = component.get('c.getPictureUrl');
            action.setParams({
                id: contentId
            });
            action.setCallback(this, function (response) {
                component.set("v.imageUrl", response.getReturnValue());
            });
            $A.enqueueAction(action);
        }
    },
    saveNewArticle : function (component, event, helper){
        let imageUrl = component.get("v.imageUrl");
        let title = component.get("v.newArticleTitle");
        let description = component.get("v.newArticleDescription");
        let content = component.get("v.newArticleContent");
        let author = component.get("v.newArticleAuthor");
        let category = component.get("v.categoryNew");

        let saveArticleBackend = component.get( "c.saveArticle" );

        saveArticleBackend.setParams({
            imageUrl: imageUrl,
            title: title,
            description: description,
            title: title,
            content: content,
            author: author,
            category: category
        });

        saveArticleBackend.setCallback( this, function( response ) {
            let responseSearchList = response.getReturnValue();
            let responseStatus = response.getState();
            return;
        });
        $A.enqueueAction( saveArticleBackend );
        var a = component.get('c.closeModel');
                $A.enqueueAction(a);

    },
    refreshView : function (component, event, helper){
        $A.get('e.force:refreshView').fire();
    },
});