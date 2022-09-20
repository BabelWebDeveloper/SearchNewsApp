({
    hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false)
    },
    afterSearchSpinner : function(component, event , helper){
        component.set('v.toggleSpinner',true);
    },
    changeVisibilityToList : function(component, event, helper) {
        console.log('event ChangeVisibilityToListEvent worked in layoutNews');
        component.set("v.showSelectedArticles",true);
        let getListType = event.getParam("title");
        if (getListType == 'blacklist'){
            let changeSearchListTitleToBlacklist = $A.get("e.c:ChangeSearchListTitleToBlacklistEvent");
                    changeSearchListTitleToBlacklist.fire();
        } else if (getListType == 'whitelist'){
            let changeSearchListTitleToWhitelist = $A.get("e.c:ChangeSearchListTitleToWhitelistEvent");
                    changeSearchListTitleToWhitelist.fire();
        } else {
            let changeSearchListTitleToDefault = $A.get("e.c:ChangeSearchListTitleToDefaultEvent");
                                changeSearchListTitleToDefault.fire();
        }
    },
})