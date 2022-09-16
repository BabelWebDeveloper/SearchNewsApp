({
    doInit: function(component, event, helper) {
        console.log('init!');
        let delayMillis = 500;
        let timeoutId = component.get( "v.searchTimeoutId" );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( $A.getCallback( function() {
            helper.getPopularArticlesHelper( component );
        }), delayMillis );
        component.set( "v.searchTimeoutId", timeoutId );
    }
})