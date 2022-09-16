({
    hideSpinner : function(component,event,helper){
        component.set("v.toggleSpinner", false)
    },
    afterSearchSpinner : function(component, event , helper){
        component.set('v.toggleSpinner',true);
    },
})