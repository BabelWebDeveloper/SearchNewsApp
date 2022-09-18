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
    },
})