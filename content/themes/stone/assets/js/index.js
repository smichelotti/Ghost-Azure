( function ( $ ) {

	// Init animation
    $( 'body' ).animate({
    	opacity: 1
    }, 1000 );

    // aload images
    aload();

    // Polyfill for object-fit
    objectFit.polyfill({
        selector: 'img', // this can be any CSS selector
        fittype: 'cover' // either contain, cover, fill or none
    });

    // Initialize code highlighting
    hljs.initHighlightingOnLoad();

    // Close sidebar
    $( '.action-button' ).on( 'click', function ( e ) {

        e.preventDefault();
    	
    	var type = $( this ).attr( 'data-action' );

    	if ( type == 'close-sidebar' ) {

    		$( '.sidebar-header' ).addClass( 'closed' );
    		$( '.content' ).addClass( 'full-size' );
    	}

        if ( type == 'open-sidebar' ) {

            $( '.sidebar-header' ).removeClass( 'closed' );
            $( '.content' ).removeClass( 'full-size' );
        }

    	if ( type == 'show-menu' ) {
            $( '.mobile-menu' ).addClass( 'active' );

            setTimeout( function () {

    		    $( '.mobile-menu' ).addClass( 'visible' );
            }, 400 );
        }

    });

    $( '.close' ).on( 'click', function ( e ) {
        e.preventDefault();

        $( '.mobile-menu' ).removeClass( 'active visible' );
    })


}) ( jQuery );