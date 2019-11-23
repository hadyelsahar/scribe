    /*  _____________________________________________________________________________
    * |                                                                             |
    * |                    === WARNING: GLOBAL GADGET FILE ===                      |
    * |                  Changes to this page affect many users.                    |
    * | Please discuss changes on the talk page or on [[WT:Gadget]] before editing. |
    * |_____________________________________________________________________________|
    * 
    * Imported from version 0.0.1 as of 2019-11-04 from [[:en:MediaWiki:Gadget-scribe.js]]
    * Using this script allows you to edit articles in underrepresented wikipedias, see [[User:Eugene233/scribe]]
    */

    /* global mw, ve */

    ( function () {
        var api = new mw.Api(),
            fieldsetElements = [],
            fieldsetContent = [],
            fieldsetContainer = [],
            stackPanels = [],
            fieldsetContentData = [],
            viewControl = 0,
            slideIndex = 1,
            stack;

        /**
         * Create a checkbox to represent section to select.
         *
         * @param {Object} section - The section to be used to create checkbox.
         * @return {Object} - The itemFieldLayout containing the section element.
         */

        function makeSectionHomeItem( section ) {
            var homeItem, itemFieldLayout;
            homeItem = new OO.ui.CheckboxInputWidget( {
                value: section.number,
                id:'input-' + section.number,
                required: true
            } );
            itemFieldLayout = new OO.ui.FieldLayout(
                homeItem,
                {  label: section.line, align: 'inline' } );
            return itemFieldLayout;
        }

        /**
         * Create a StackLayout.
         *
         * @param {Object} stackPanels - The panels to be added to the stack.
         * @return {Object} - The StackLayout containing panels.
         */

        function makeStack( stackPanels ) {
            return new OO.ui.StackLayout( {
                classes: ['container'],
                items: stackPanels,
                padded: true
            });
        }

        /**
            * Get data from a fieldset by their label and value.
            *
            * @param {Object} fieldset - the fielset where the data is obtained.
            * @return {Object} - The fieldset data.
            */

        function getFieldSetData(fieldset) {
            var fieldData = [];
            fieldset.forEach(function (field) {
                if (field.label) {
                    fieldData.push( field.label);
                } else {
                    fieldData.push( field.value);
                }
            });
            return fieldData;
        }

        /**
            * Gets the data from an object holding fieldsets.
            *
            * @param {Object} fieldsetContainer - The container of fieldsets.
            * @return {Object} - The content of the fieldset.
            */

        function getFieldSetContendData(fieldsetContainer) {
            var ContentData = [];
            fieldsetContainer.forEach(function (fieldset) {
                var fieldsetData = getFieldSetData(fieldset);
                ContentData.push(fieldsetData);
            });
            return ContentData;
        }
        /**
        * Create a LabelWidget.
        *
        * @param {Object} dict - The dictionary of configurations.
        * @return {Object} - The LabelText.
        */

        function makeLabelText(label) {
            return new OO.ui.LabelWidget({
                label: label,
                classes: ['formWizard-label']
            });
        }

        /**
            * Create a FieldsetLayout.
            *
            * @param {Object} contentElements - The elements added to the fielset.
            * @return {Object} - The FieldsetLayout.
            */

        function createFieldSet(contentElements) {
            var fieldset = new OO.ui.FieldsetLayout({
                classes: ['container'],
                align: 'inline',
                padded: true
            });
            fieldset.addItems(contentElements);
            return fieldset;
        }

        /**
            * Adds fioelset elements to  PanelLayout.
            *
            * @param {Object} fieldSetContentElements - The elements of the fieldset.
            * @return {Object} - The panel containing elements.
            */

        function addPanelElementsToPanel(fieldSetContentElements) {
            var fieldSet,
                panel;
            fieldSet = createFieldSet(fieldSetContentElements);
            panel = new OO.ui.PanelLayout({
                padded: true,
                expanded: false,
                align: 'center',
                scrollable: true,
                classes: ['container']
            });
            panel.$element.append(fieldSet.$element);
            return panel;
        }

        /**
        * Creates the first view shown to the user on launch.
        *
        * @param {Object} pageTitle - The page which is actively under edit.
        * @param {Object} articleSections - The sections in the page.
        * @return {Object} - The panel containing elements of the edit interface.
        */

        function createHomeView(pageTitle, articleSections ) {
            var articleNameLabel, articleLegend, homeFieldSet, homePanel,
                homeElements = [], homeviewElements = [];

            articleNameLabel = new OO.ui.LabelWidget( {
                label: pageTitle,
                align: 'left',
                padded: true,
                id: 'mw-scribe-action-page-title'
            }  );

            articleLegend = new OO.ui.LabelWidget( {
                label: '\n Select the sections You wish to use in the article',
                padded: true,
            } );

            homeElements.push( articleNameLabel );
            homeElements.push( articleLegend );

            articleSections.forEach(function (section) {
                var sectionLine = makeSectionHomeItem( section );
                homeElements.push( sectionLine );
            } );
            homeFieldSet = createFieldSet( homeElements );
            homePanel = addPanelElementsToPanel(homeFieldSet);

            homeviewElements.push( homePanel );
            homeviewElements.push( homeFieldSet );
            return homeviewElements;
        }

        function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("mySlides");

            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex-1].style.display = "block";
        }

            // Next/previous controls
        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function makeSliderHtml() {
            // TODO: We have to generate the sections with id mw-scribe-ref-box
            // dynamically given the data we have from resources

        var html =  '<div id="mw-scribe-slider">' +
                        '<div class="slideshow-container">' +
                            '<div class="mySlides fade">' +
                                '<div class="text">' +
                                    '<div class=\'mw-scribe-ref-box\'>' +
                                        '<p class=\'mw-scribe-ref-text\'>Resource Number 1 </p>' +
                                        '<div class=\'mw-scribe-ref-link-box\'>' +
                                            '<a id=\'mw-scribe-ref-link\'> https://mediawiki.org/Special:Gadgets </a> <p id=\'mw-scribe-ref-domain\'>#SCIENCE</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="mySlides fade">' +
                                '<div class="text">' +
                                    '<div class=\'mw-scribe-ref-box\'>' +
                                        '<p class=\'mw-scribe-ref-text\'>Resource Number 2 </p>' +
                                        '<div class=\'mw-scribe-ref-link-box\'>' +
                                            '<a class=\'mw-scribe-ref-link\'> https://mediawiki.org/ </a> <p id=\'mw-scribe-ref-domain\'>#HISTORY</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<a class="prev">&#10094;</a> ' +
                            '<a class="next">&#10095;</a>' +
                        '</div>' +
                    '</div>';
            return html;
        }

        /**
        * Creates PanelLayout of a section's edit interface.
        *
        * @param {Object} section - The section whose edit interface we want to create.
        * @return {Object} - The panel containing elements of the edit interface.
        */

        function createEditSectionPanel( section ){
            var sectionTitle, editSurface, referenceAddButton, editButtonGroup, 
                referenceSection, editSectionFieldSet, sectionFieldSetItems = [], editSectionPanel, html;
            sectionTitle = new OO.ui.LabelWidget( {
                label: section.line,
                align: 'left',
                padded: true,
                id: 'mw-scribe-action-page-title'
            } );

            console.log( 'section ===>', section);
            editButtonGroup = new OO.ui.ButtonGroupWidget( {
                items: [
                    new OO.ui.ButtonWidget( {
                        icon: 'textStyle',
                        indicator: 'down',
                        id: 'mw-scribe-edit-section-menu-btn-1'
                    } ),
                    new OO.ui.ButtonWidget( {
                        icon: 'link',
                        label: 'Link',
                        id: 'mw-scribe-edit-section-menu-btn-2'
                    } ),
                    new OO.ui.ButtonWidget( {
                        icon: 'quotes',
                        label: 'Cite',
                        id: 'mw-scribe-edit-section-menu-btn-3'
                    } )
                ],
                id: 'mw-scribe-action-button-group',
                padded: false
            } );

            editSurface = new OO.ui.MultilineTextInputWidget( {
                rows: 17,
                autosize: true,
                placeholder: 'Start writing something here, select references from below',
                autofocus: true
            } );

            html = makeSliderHtml();
            referenceAddButton = new OO.ui.ButtonWidget( {
                label: '',
                align: 'center',
                icon: 'articleAdd',
                flags: [
                    'primary',
                    'progressive'
                ],
                classes: [ 'mw-scribe-ref-btn' ]
            } );

            referenceSection = new OO.ui.LabelWidget( {
                label: $(html),
                classes: [ 'mw-scribe-reference-section' ]
            } );

            sectionFieldSetItems.push( sectionTitle );
            sectionFieldSetItems.push( editButtonGroup );
            sectionFieldSetItems.push( editSurface );
            sectionFieldSetItems.push( referenceAddButton );
            sectionFieldSetItems.push( referenceSection );

            editSectionPanel = addPanelElementsToPanel( sectionFieldSetItems );
            return editSectionPanel;
        }

        /**
        * Create an instance of a dialog.
        *
        * @param {Object} config - dialog configuration.
        * Note: Changing this name FormWizardDialog means changing the dialog
        * name name below.
        */

        function ScribeDialog( config ) {
            ScribeDialog.parent.call( this, config );
        }

        /**
        * Return a promise from the api call.
        *
        * @param {Object} pageTitle - The current page the user is editing with ve.
        * @return {Object} - The promise.
        */

        function getArticleListPromise( pageTitle ) {
            var article_list = api.get( {
                action: 'parse',
                page: pageTitle,
                format: 'json',
                formatversion: 2,
                prop: 'sections'
            } );
            return article_list;
        }

        function activeOnClickEventForPrev( prevClass ) {
            $( prevClass ).on( 'click', function () {
                plusSlides( -1 );
            });
        }

        function activeOnClickEventForNext( nextClass ) {
            $( nextClass ).on( 'click', function () {
                plusSlides( 1 );
            });
        }

        // function addReferenceSectionToPanel() {
        //     var html = '<div id=\'slider\'>' + '<div id=\'ref_box\'> <p>We are Here</p></div></div>';
        //     $('#mw-scribe-add-reference-button').append(html);
        // }
        mw.hook( 've.activationComplete' ).add(function () {
            var articleSectionsPromise, homePageFieldSetElements,
                selectedSectionsToEdit = [];

            articleSectionsPromise = getArticleListPromise( mw.config.get( 'wgTitle' ) );
            articleSectionsPromise.done( function ( data ) {
                var articleSections = data.parse.sections;

                OO.inheritClass( ScribeDialog, OO.ui.ProcessDialog );
                ScribeDialog.static.name = 'scribeDialog';
                ScribeDialog.static.title = 'Welcome To Scribe';
                ScribeDialog.static.actions = [
                    {
                        action: 'continue', modes: 'edit', label: 'Next', flags: ['primary',
                            'constructive']
                    },
                    { modes: ['edit', 'final'], label: 'Cancel', flags: 'safe' },
                    { modes: 'final', action: 'save', label: 'Done', flags: 'primary' }
                ];

                ScribeDialog.prototype.initialize = function () {

                    ScribeDialog.parent.prototype.initialize.apply( this, arguments );

                    // use the sections to create the elements in the home view
                    homeviewElements = createHomeView( mw.config.get( 'wgTitle' ), articleSections );
                    stackPanels.push( homeviewElements[ 0 ] );

                    // Home Page FieldSet Elements for the Home view used to determine which
                    // sections goes on next panels
                    homePageFieldSetElements = homeviewElements[ 1 ];

                    // // For all the selected sections we create an edit panel and add to stack
                    articleSections.forEach( function ( section ) {
                        var editSectionInterface = createEditSectionPanel( section );
                        stackPanels.push( editSectionInterface );
                    } );

                    // create a new stack with items araray of panels
                    stack = makeStack( stackPanels );
                    this.stackLayout = stack;
                    this.$body.append( this.stackLayout.$element );
                    this.stackLayout.setItem( stackPanels[ 0 ] );
                    showSlides(slideIndex); //We show the slides for the reference section
                };

                ScribeDialog.prototype.getSetupProcess = function ( data ) {
                    return ScribeDialog.super.prototype.getSetupProcess.call(
                        this, data )
                        .next( function () {
                            this.actions.setMode( 'edit' );
                        }, this );
                };

                ScribeDialog.prototype.getActionProcess = function ( action ) {
                    var dialog, sectionNumber;

                    // Activate on click event for the reference section next/prev
                    activeOnClickEventForNext( '.next' );
                    activeOnClickEventForPrev( '.prev' );

                    // The Done button has been clicked
                    if ( action === 'save' ) {
                        // we get the fieldsetContentData from the container of fieldsets
                        
                        // We make the necessary operations requests here

                        // Here we close the dialog after processing
                        dialog = this;
                        return new OO.ui.Process(function () {
                            // do something about the edit
                            dialog.close();
                        } );
                    } else if ( action === 'continue' && viewControl <
                        ( stackPanels.length ) ) {

                            homePageFieldSetElements.items.forEach( function ( e ) {
                                if ( e.align == 'inline' ) {
                                    if ( e.fieldWidget.selected === true) {
                                        selectedSectionsToEdit.push( Number( e.fieldWidget.value ) );
                                    }
                                }
                            } );

                        // We test of the sections to be editted have been chosen
                        if ( selectedSectionsToEdit.length !== 0 && 
                            viewControl < selectedSectionsToEdit[ viewControl ] ) {
                            
                            // sectionNumber is the section number the user chose to edit
                            sectionNumber = selectedSectionsToEdit[ viewControl ];
                            this.stackLayout.setItem( stackPanels[ sectionNumber ] );

                        } else if( selectedSectionsToEdit.length === 0 ) {
                            OO.ui.alert( 'Please select a section!' ).done( function () {
                                console.log( 'User closed the dialog.' );
                            } );
                            viewControl--;
                        }
                        viewControl++;
                        selectedSectionsToEdit = [];

                        if ( viewControl  === ( stackPanels.length - 1 ) ||
                            sectionNumber === ( stackPanels.length -1 ) ) {

                            this.actions.setMode( 'final' );
                        }
                    } else {
                        //closing the dialog
                        // dialog.close();
                        // window.location.reload();
                    }
                    return ScribeDialog.parent.prototype.getActionProcess
                        .call( this, action );
                };

                // set the height of the dialog box
                ScribeDialog.prototype.getBodyHeight = function () {
                    return $(window).height();
                };
                // create new windowManager
                windowManager = new OO.ui.WindowManager();
                $( document.body ).append( windowManager.$element );
                // set the width of the dialog
                ProcessDialog = new ScribeDialog( {} );
                ProcessDialog.size = 'medium';
                dialog = new ScribeDialog();
                windowManager.addWindows( [ dialog ] );
                windowManager.openWindow( dialog );
            } );
        } );
    } () );
