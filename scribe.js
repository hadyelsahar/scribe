/* Translate the following to your language: */
if ( !mw.messages.exists( 've-scribe-dialog-title' ) ) {
	mw.messages.set( {
        've-scribe-dialog-title': 'Scribe',
        've-scribe-select-section-txt':'Select the sections You wish to use in the article',
        've-scribe-section-textbox-placeholder': 'Start writing something here',
        've-scribe-btn-next': 'Next',
        've-scribe-btn-cancel': 'Cancel',
        've-scribe-btn-done': 'Done',
        've-scribe-button-group-link-btn':'Link',
        've-scribe-button-group-cite-btn': 'Cite',
        've-scribe-no-section-selected-dialog-msg': 'Please select a section',
        've-scribe-server-error': 'Unable to Reach Server Right now',
	} );
}

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

(function () {
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

    function makeSectionHomeItem(section) {
        var homeItem, itemFieldLayout;
        homeItem = new OO.ui.CheckboxInputWidget({
            value: section.number,
            id: 'input-' + section.number,
            required: true
        });
        itemFieldLayout = new OO.ui.FieldLayout(
            homeItem,
            { label: section.line, align: 'inline' });
        return itemFieldLayout;
    }

    /**
     * Create a StackLayout.
     *
     * @param {Object} stackPanels - The panels to be added to the stack.
     * @return {Object} - The StackLayout containing panels.
     */

    function makeStack(stackPanels) {
        return new OO.ui.StackLayout({
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
                fieldData.push(field.label);
            } else {
                fieldData.push(field.value);
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

    function createHomeView(pageTitle, articleSections) {
        var articleNameLabel, articleLegend, homeFieldSet, homePanel,
            homeElements = [], homeviewElements = [];

        articleNameLabel = new OO.ui.LabelWidget({
            label: pageTitle,
            align: 'left',
            padded: true,
            id: 'mw-scribe-action-page-title'
        });

        articleLegend = new OO.ui.LabelWidget({
            label: '\n ' + mw.msg( 've-scribe-select-section-txt' ),
            padded: true,
        });

        homeElements.push(articleNameLabel);
        homeElements.push(articleLegend);

        articleSections.forEach(function (section) {
            var sectionLine = makeSectionHomeItem(section);
            homeElements.push(sectionLine);
        });
        homeFieldSet = createFieldSet(homeElements);
        homePanel = addPanelElementsToPanel(homeFieldSet);

        homeviewElements.push(homePanel);
        homeviewElements.push(homeFieldSet);
        return homeviewElements;
    }

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");

        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        if (slides.length > 0) {
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex - 1].style.display = "block";
        }
    }

    // Next/previous controls
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function setSliderContainerStyle(container) {
        container.css({
            'position': 'relative',
            'overflow': 'hidden',
            'border-radius': '5px',
            'border': '0.5px solid black',
            'width': '377px',
            'height': '120px',
            'background-color': 'grey',
            'margin-top': '25px',
            'z-index': '1'
        });
    }

    function makeSliderHtml(section_number) {
        // TODO: We have to generate the sections with id mw-scribe-ref-box
        // dynamically given the data we have from resources
        var html = '<div id="mw-scribe-slider-' + section_number + '">' +
            '<div id="slideshow-container-' + section_number + '">' +
            '<a class="prev">&#10094;</a> ' +
            '<a class="next">&#10095;</a>' +
            '</div>' +
            '</div>';
        return html;
    }

    function addSliderSectionChildNodes(section_number) {
        if ($("#slideshow-container-" + (section_number - 1).toString())) {
            var slides1 = $("#slideshow-container-" + (section_number - 1).toString()).children('.mySlides')

            for (var i = 0; i < slides1.length; i++) {
                if (slides1[i].className.split(' ')[0]) {
                    slides1[i].className = "";
                }
            }
        }

        // $.get('https://tools.wmflabs.org/scribe/api/v1?article=' + mw.config.get( 'wgTitle' ).toLowerCase())
        $.get('https://tools.wmflabs.org/scribe/api/v1?article=test')
            .done(function (response) {
                var resource = response.resources;
                resource.forEach(function (item) {
                    $("#slideshow-container-" + section_number.toString()).append(
                        '<div class="mySlides fade">' +
                        '<div class="text">' +
                        '<div class=\'mw-scribe-ref-box\'>' +
                        '<p class=\'mw-scribe-ref-text\'>' + item.content + '</p>' +
                        '<div class=\'mw-scribe-ref-link-box\'>' +
                        '<a class=\'mw-scribe-ref-link\'> ' + item.url + '</a> <p id=\'mw-scribe-ref-domain\'>#' + item.domain + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                });
                setSliderContainerStyle($("#slideshow-container-" + section_number.toString()));
            });
    }

    /**
    * Creates PanelLayout of a section's edit interface.
    *
    * @param {Object} section - The section whose edit interface we want to create.
    * @return {Object} - The panel containing elements of the edit interface.
    */

    function createEditSectionPanel(section) {
        var sectionTitle, editSurface, referenceAddButton, editButtonGroup,
            referenceSection, editSectionFieldSet, sectionFieldSetItems = [], editSectionPanel, html;
        sectionTitle = new OO.ui.LabelWidget({
            label: section.line,
            align: 'left',
            padded: true,
            id: 'mw-scribe-action-page-title'
        });

        editButtonGroup = new OO.ui.ButtonGroupWidget({
            items: [
                new OO.ui.ButtonWidget({
                    icon: 'textStyle',
                    indicator: 'down',
                    id: 'mw-scribe-edit-section-menu-btn-1'
                }),
                new OO.ui.ButtonWidget({
                    icon: 'link',
                    label: mw.msg( 've-scribe-button-group-link-btn' ),
                    id: 'mw-scribe-edit-section-menu-btn-2'
                }),
                new OO.ui.ButtonWidget({
                    icon: 'quotes',
                    label: mw.msg( 've-scribe-button-group-cite-btn' ),
                    id: 'mw-scribe-edit-section-menu-btn-3'
                })
            ],
            id: 'mw-scribe-action-button-group',
            padded: false
        });

        editSurface = new OO.ui.MultilineTextInputWidget({
            rows: 17,
            autosize: true,
            placeholder: mw.msg( 've-scribe-section-textbox-placeholder' ),
            autofocus: true
        });

        html = makeSliderHtml(section.number);
        referenceAddButton = new OO.ui.ButtonWidget({
            label: '',
            align: 'center',
            icon: 'articleAdd',
            flags: [
                'primary',
                'progressive'
            ],
            classes: ['mw-scribe-ref-btn']
        });

        referenceSection = new OO.ui.LabelWidget({
            label: $(html),
            classes: ['mw-scribe-reference-section']
        });

        sectionFieldSetItems.push(sectionTitle);
        sectionFieldSetItems.push(editButtonGroup);
        sectionFieldSetItems.push(editSurface);
        sectionFieldSetItems.push(referenceAddButton);
        sectionFieldSetItems.push(referenceSection);

        editSectionPanel = addPanelElementsToPanel(sectionFieldSetItems);
        return editSectionPanel;
    }

    /**
    * Create an instance of a dialog.
    *
    * @param {Object} config - dialog configuration.
    * Note: Changing this name FormWizardDialog means changing the dialog
    * name name below.
    */

    function ScribeDialog(config) {
        ScribeDialog.parent.call(this, config);
    }

    /**
    * Return a promise from the api call.
    *
    * @param {Object} pageTitle - The current page the user is editing with ve.
    * @return {Object} - The promise.
    */

    function getArticleListPromise(pageTitle) {
        var article_list = api.get({
            action: 'parse',
            page: pageTitle,
            format: 'json',
            formatversion: 2,
            prop: 'sections'
        });
        return article_list;
    }

    function activeOnClickEventForPrev(prevClass) {
        $(prevClass).on('click', function () {
            plusSlides(-1);
        });
    }

    function activeOnClickEventForNext(nextClass) {
        $(nextClass).on('click', function () {
            plusSlides(1);
        });
    }

    function buildDialogView(articleSectionsPromise) {
        articleSectionsPromise.done(function (data) {

            console.log('data now is --->', data)
            var articleSections = data.parse.sections,
                selectedSectionsToEdit = [];

            OO.inheritClass(ScribeDialog, OO.ui.ProcessDialog);
            ScribeDialog.static.name = 'scribeDialog';
            ScribeDialog.static.title = mw.msg( 've-scribe-dialog-title' );
            ScribeDialog.static.actions = [
                {
                    action: 'continue', modes: 'edit', label: mw.msg( 've-scribe-btn-next' ), flags: ['primary',
                        'constructive']
                },
                { modes: ['edit', 'final'], label: mw.msg( 've-scribe-btn-cancel' ), flags: 'safe' },
                { modes: 'final', action: 'save', label: mw.msg( 've-scribe-btn-done' ), flags: 'primary' }
            ];

            ScribeDialog.prototype.initialize = function () {

                ScribeDialog.parent.prototype.initialize.apply(this, arguments);

                // use the sections to create the elements in the home view
                homeviewElements = createHomeView(mw.config.get('wgTitle'), articleSections);
                stackPanels.push(homeviewElements[0]);

                // Home Page FieldSet Elements for the Home view used to determine which
                // sections goes on next panels
                homePageFieldSetElements = homeviewElements[1];

                // // For all the selected sections we create an edit panel and add to stack
                articleSections.forEach(function (section) {
                    var editSectionInterface = createEditSectionPanel(section);
                    stackPanels.push(editSectionInterface);
                });

                // create a new stack with items araray of panels
                stack = makeStack(stackPanels);
                this.stackLayout = stack;
                this.$body.append(this.stackLayout.$element);
                this.stackLayout.setItem(stackPanels[0]);
            };

            ScribeDialog.prototype.getSetupProcess = function (data) {
                return ScribeDialog.super.prototype.getSetupProcess.call(
                    this, data)
                    .next(function () {
                        this.actions.setMode('edit');
                    }, this);
            };

            ScribeDialog.prototype.getActionProcess = function (action) {
                var dialog, sectionNumber;

                // Activate on click event for the reference section next/prev
                activeOnClickEventForNext('.next');
                activeOnClickEventForPrev('.prev');

                // The Done button has been clicked
                if (action === 'save') {
                    // we get the fieldsetContentData from the container of fieldsets

                    // We make the necessary operations requests here

                    // Here we close the dialog after processing
                    dialog = this;
                    return new OO.ui.Process(function () {
                        // do something about the edit
                        dialog.close();
                    });
                } else if (action === 'continue' && viewControl <
                    (stackPanels.length)) {

                    homePageFieldSetElements.items.forEach(function (e) {
                        if (e.align == 'inline') {
                            if (e.fieldWidget.selected === true) {
                                selectedSectionsToEdit.push(Number(e.fieldWidget.value));
                            }
                        }
                    });

                    // We test of the sections to be editted have been chosen
                    if (selectedSectionsToEdit.length !== 0 &&
                        viewControl < selectedSectionsToEdit[viewControl]) {

                        // sectionNumber is the section number the user chose to edit
                        sectionNumber = selectedSectionsToEdit[viewControl];
                        this.stackLayout.setItem(stackPanels[sectionNumber]);

                        addSliderSectionChildNodes(sectionNumber);
                        showSlides(slideIndex); //We show the slides for the reference section

                    } else if (selectedSectionsToEdit.length === 0) {
                        OO.ui.alert( mw.msg( 've-scribe-no-section-selected-dialog-msg' ) ).done(function () {
                            console.log('User closed the dialog.');
                        });
                        viewControl--;
                    }
                    viewControl++;
                    selectedSectionsToEdit = [];

                    if (viewControl === (stackPanels.length - 1) ||
                        sectionNumber === (stackPanels.length - 1)) {

                        this.actions.setMode('final');
                    }
                } else {
                    //closing the dialog
                    // dialog.close();
                    // window.location.reload();
                }
                return ScribeDialog.parent.prototype.getActionProcess
                    .call(this, action);
            };

            // set the height of the dialog box
            ScribeDialog.prototype.getBodyHeight = function () {
                return $(window).height();
            };
            // create new windowManager
            windowManager = new OO.ui.WindowManager();
            $(document.body).append(windowManager.$element);
            // set the width of the dialog
            ProcessDialog = new ScribeDialog({});
            ProcessDialog.size = 'medium';
            dialog = new ScribeDialog();
            windowManager.addWindows([dialog]);
            windowManager.openWindow(dialog);
        });
    }

    mw.hook('ve.activationComplete').add(function () {
        var articleSectionsPromise, homePageFieldSetElements, page_sections;
        articleSectionsPromise = getArticleListPromise(mw.config.get('wgTitle'));
        new mw.Api().get({
            action: "query",
            titles: [mw.config.get('wgTitle')],
        }).then(function (ret) {

            $.each(ret.query.pages, function () {

                if (this.missing !== "") {
                    buildDialogView(articleSectionsPromise);

                } else {
                    buildDialogView(
                        $.get('http://localhost:5000/api/v1/sections?article=' + mw.config.get('wgTitle')));
                }
            });
        }, function (error) {
            OO.ui.alert( mw.msg( 've-scribe-server-error' ) ).done(function () {
                console.log('User closed the dialog.');
            });
        });
    });
}());
