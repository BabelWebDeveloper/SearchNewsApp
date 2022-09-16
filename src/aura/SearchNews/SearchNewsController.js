({
    onInit: function( component, event, helper ) {
        component.set( "v.category", "Business" );
    },
    onSingleSelectChange: function(component) {
        let selectCmp = component.find("InputSelectSingle");
        component.set( "v.category", selectCmp.get("v.value") );
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
    }
});