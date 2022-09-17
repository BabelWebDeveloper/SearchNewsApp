({
    hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false)
    },
    afterSearchSpinner : function(component, event , helper){
        component.set('v.toggleSpinner',true);
    },
    showBlacklistArticles : function(component, event, helper) {
        console.log('event showBlacklistArticles worked in layoutNews');
    },
})