/* Translate the following to your language: */
if (!mw.messages.exists('ve-scribe-dialog-title')) {
    mw.messages.set({
        've-scribe-dialog-title': 'Scribe',
        've-scribe-select-section-txt': 'Select the sections You wish to use in the article',
        've-scribe-section-textbox-placeholder': 'Start writing something here',
        've-scribe-btn-next': 'Next',
        've-scribe-btn-cancel': 'Cancel',
        've-scribe-btn-done': 'Done',
        've-scribe-button-group-link-btn': 'Link',
        've-scribe-button-group-cite-btn': 'Cite',
        've-scribe-no-section-selected-dialog-msg': 'Please select a section',
        've-scribe-server-error': 'Unable to Reach Server Right now',
    });
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
            required: true,
            classes: ['mw-scribe-checkbox']
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
     * 
     * @param {String} sectionNumber the section number
     * @param {String} sectionName the name of the section 
     */
    function getFieldsetSectionDataStructure(sectionNumber, sectionName ){
        var data = {};
        data.section = sectionName;
        data.number = sectionNumber;
        return data;
    }

    /**
     * Adds fioelset elements to  PanelLayout
     * 
     * @param {String} sectionNumber the number of the section
     * @param {String} sectionName the name of the section
     * @param {Object} fieldSetContentElements the fieldset content with elements
     */
    function addPanelElementsToPanel(sectionNumber, sectionName, fieldSetContentElements) {
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
        if ( sectionName != 'undefined' && sectionNumber != -1 ){
            fieldsetContainer.push(getFieldsetSectionDataStructure(sectionNumber, sectionName));
        }

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
            label: mw.msg('ve-scribe-select-section-txt'),
            padded: true,
            classes: ['mw-scribe-select-info']
        });

        homeElements.push(articleNameLabel);
        homeElements.push(articleLegend);

        articleSections.forEach(function (section) {
            var sectionLine = makeSectionHomeItem(section);
            homeElements.push(sectionLine);
        });
        homeFieldSet = createFieldSet(homeElements);
        homePanel = addPanelElementsToPanel(-1, 'undefined', homeFieldSet);

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
                $('.mw-scribe-ref-box').removeClass('activeref');
            }
            slides[slideIndex - 1].style.display = "block";
            $('.mw-scribe-ref-box').addClass('activeref');
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

    function addSliderSectionChildNodes(section_number, active_section_title) {
        if ($("#slideshow-container-" + (section_number - 1).toString())) {
            var slides1 = $("#slideshow-container-" + (section_number - 1).toString()).children('.mySlides')

            for (var i = 0; i < slides1.length; i++) {
                if (slides1[i].className.split(' ')[0]) {
                    slides1[i].className = "";
                }
            }
        }

        // $.get('https://tools.wmflabs.org/scribe/api/v1/references?section=' + mw.config.get( 'wgTitle' ).toLowerCase())
        $.get('https://tools.wmflabs.org/scribe/api/v1/references?section=' + active_section_title)
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
     * Constructs link which VE should recognize
     *
     * @param {String} url the selected url in reference section
     */
    function createReferenceLink(url) {
        return '[' + url + ']';
    }

    /**
     * Insert a cite link at the cursor position in the editor
     *
     * @param {TextInputWidget} textEditor the text editor
     * @param {String} link the formatted url to insert
     */
    function insertLinkAtCursorPosition(textEditor, link) {
        //IE support
        if (document.selection) {
            textEditor.focus();
            sel = document.selection.createRange();
            sel.text = link;
        }
        //MOZILLA and others
        else if (textEditor.selectionStart || textEditor.selectionStart == '0') {
            var startPos = textEditor.selectionStart;
            var endPos = textEditor.selectionEnd;
            textEditor.value = textEditor.value.substring(0, startPos) + link + textEditor.value.substring(endPos, textEditor.value.length);
        } else {
            textEditor.value += link;
        }
    }

    /**
     *
     * @param {ButtonWidget} referenceAddButton the button to be activated
     * @param {String} sectionNumber the section number currently under edit
     */
    function addReferenceButtonClickAction(referenceAddButton, sectionNumber) {
        referenceAddButton.on('click', function () {
            var selectedUrl = $('.activeref')[0].lastChild.firstChild.innerHTML;
            var editor = $('.section-' + sectionNumber + 'text-editor')[0].firstChild;
            insertLinkAtCursorPosition(editor, createReferenceLink(selectedUrl));
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
            id: 'mw-scribe-section-' + section.number + '-title',
            classes: ['mw-scribe-section-name-text']
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
                    label: mw.msg('ve-scribe-button-group-link-btn'),
                    id: 'mw-scribe-edit-section-menu-btn-2'
                }),
                new OO.ui.ButtonWidget({
                    icon: 'quotes',
                    label: mw.msg('ve-scribe-button-group-cite-btn'),
                    id: 'mw-scribe-edit-section-menu-btn-3'
                })
            ],
            id: 'mw-scribe-action-button-group',
            padded: false
        });

        editSurface = new OO.ui.MultilineTextInputWidget({
            rows: 17,
            autosize: true,
            placeholder: mw.msg('ve-scribe-section-textbox-placeholder'),
            id: '#mw-scribe-section-' + section.number + '-text-editor',
            classes: ['section-' + section.number + 'text-editor', 'mw-scribe-text-editor'],
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
            //'section-'+ section.number + '-ref-button'
        });

        // we define the action when the ref button is clicked
        addReferenceButtonClickAction(referenceAddButton, section.number);

        referenceSection = new OO.ui.LabelWidget({
            label: $(html),
            classes: ['mw-scribe-reference-section']
        });

        sectionFieldSetItems.push(sectionTitle);
        sectionFieldSetItems.push(editButtonGroup);
        sectionFieldSetItems.push(editSurface);
        sectionFieldSetItems.push(referenceAddButton);
        sectionFieldSetItems.push(referenceSection);

        editSectionPanel = addPanelElementsToPanel(section.number, section.line, sectionFieldSetItems);
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

            var articleSections = data.parse.sections,
                selectedSectionsToEdit = [];

            OO.inheritClass(ScribeDialog, OO.ui.ProcessDialog);
            ScribeDialog.static.name = 'scribeDialog';
            ScribeDialog.static.title = mw.msg('ve-scribe-dialog-title');
            ScribeDialog.static.actions = [
                {
                    action: 'continue', modes: 'edit', label: mw.msg('ve-scribe-btn-next'), flags: ['primary',
                        'constructive']
                },
                { modes: ['edit', 'final'], label: mw.msg('ve-scribe-btn-cancel'), flags: 'safe' },
                { modes: 'final', action: 'save', label: mw.msg('ve-scribe-btn-done'), flags: 'primary' }
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
                var dialog, sectionNumber, activeSectionTitle;

                // removing the class which enalbes a reference to be selected by defualt
                $('.mw-scribe-ref-box').removeClass('activeref');

                // Activate on click event for the reference section next/prev
                activeOnClickEventForNext('.next');
                activeOnClickEventForPrev('.prev');

                // The Done button has been clicked
                if (action === 'save') {

                    // we get the fieldsetContentData from the container of fieldsets
                    var editData = [];
                    // the data in the fieldset container is extracted into the data object
                    // we will use write to VE interface
                    fieldsetContainer.forEach( function ( container ) {
                        var editDataObject = {};
                        var text = $('.section-' + container.number + 'text-editor')[0].firstChild.value.toString();
                        if( text  != '' ){
                            editDataObject.section = container.section;
                            editDataObject.content = text;
                            editData.push( editDataObject );
                        }
                    });
                    console.log(' Edit Data now is!',editData);
                    // We make the necessary operations requests here
                    // console.log(' The fieldset container ehh!',getFieldSetContendData(fieldsetContainer));
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

                        // We get the active section title to be able to get suggestion links from server
                        activeSectionTitle = $('#mw-scribe-section-' + sectionNumber + '-title').text();

                        // Populate the edit box with the content of the sections from the article

                        populateEditSectionTextBox(sectionNumber);

                        // We Add the slider section for edit view
                        addSliderSectionChildNodes(sectionNumber, activeSectionTitle);
                        showSlides(slideIndex); //We show the slides for the reference section

                    } else if (selectedSectionsToEdit.length === 0) {
                        OO.ui.alert(mw.msg('ve-scribe-no-section-selected-dialog-msg')).done(function () {

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
                    window.location.reload();
                }
                return ScribeDialog.parent.prototype.getActionProcess
                    .call(this, action);
            };

            // set the height of the dialog box
            ScribeDialog.prototype.getBodyHeight = function () {
                return $(window).height();
            };

            function ScribeTool(toolGroup, config) {
                OO.ui.Tool.call(this, toolGroup, config);

            }
            OO.inheritClass(ScribeTool, OO.ui.Tool);

            ScribeTool.static.name = 'ScribeTool';
            ScribeTool.static.title = 'Scribe';
            ScribeTool.static.icon = 'window';

            ScribeTool.prototype.onSelect = function () {
                // create new windowManager
                windowManager = new OO.ui.WindowManager();
                $(document.body).append(windowManager.$element);
                // set the width of the dialog
                ProcessDialog = new ScribeDialog({});
                ProcessDialog.size = 'large';
                dialog = new ScribeDialog();
                windowManager.addWindows([dialog]);
                windowManager.openWindow(dialog);
            };

            ScribeTool.prototype.onUpdateState = function () {
                this.setActive(false);
            };
            ve.ui.toolFactory.register(ScribeTool);
        });
    }

    function populateEditSectionTextBox(sectionNumber) {
        api.get({
            action: 'query',
            titles: mw.config.get('wgTitle'),
            format: 'json',
            formatversion: 2,
            rvprop: 'content',
            prop: 'revisions',
            rvsection: sectionNumber
        }).then(function (data) {
            var sectionContent = data.query.pages[0].revisions[0].content;
            if (sectionContent !== 'undefined') {
                //We get the text input element and add its section content for editing
                $('.section-' + sectionNumber + 'text-editor')[0].firstChild.value = sectionContent;
            } else {
                $('.section-' + sectionNumber + 'text-editor')[0].firstChild.value = '';
            }
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
                    console.log('page title', mw.config.get('wgTitle'))
                    buildDialogView(
                        $.get('https://tools.wmflabs.org/scribe/api/v1/sections?article=' + mw.config.get('wgTitle')));
                }
            });
            // We set the width of our frame to the width of the device
            $('.oo-ui-window-frame').css('width', $(document).width());
            $('.oo-ui-window-frame').css('height', $(document).height());
        }, function (error) {
            OO.ui.alert(mw.msg('ve-scribe-server-error')).done(function () {
            });
        });
    });
}());
