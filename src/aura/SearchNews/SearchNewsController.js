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
});