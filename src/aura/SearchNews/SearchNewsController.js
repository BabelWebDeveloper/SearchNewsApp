({
    onInit: function( component, event, helper ) {
        console.log('onInit work');
    },
    search : function (component, event, helper) {
        let searchKeyWord = component.get( "v.searchKeyWord" );
        let searchCategory = component.get( "v.searchCategory" );
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.handleSearch( component, searchKeyWord );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    },

    getInternal : function (component, event, helper) {
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            console.log('controller');
            helper.internalSearch( component );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    }


});