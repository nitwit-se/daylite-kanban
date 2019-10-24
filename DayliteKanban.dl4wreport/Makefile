
TARGETDIR=..
TARGET=$(TARGETDIR)/DayLiteKanbanDeploy.dl4wreport


CSS_FILES = \
	Main.css							\
	multiple-select.css					\
	print.css

JS_FILES= \
	Main.js								\
	accounting.js						\
	jquery-2.0.3.js						\
	jquery.leanModal.min.js				\
	jquery.multiple.select.js			\
	printThis.js						\
	redips-drag-min.js					\
	redips-drag.js						\
	redips-table-min.js					\
	redips.js    

OTHER_FILES= \
	Main.html							\
	Main2.html							\
	Reorder.html						\
	SetDetails.html						\
	SetFilter.html						\
	185-printer.png						\
	185-printer@2x.png					\
	21-wrench.png						\
	21-wrench@2x.png					\
	298-circlex@2x.png					\
	modal_close.png						\
	modal_close_white.png				\
	multiple-select.png					\
	jquery-ui-1.10.3.custom.min.js		


YUI_COMPRESSOR = java -jar yuicompressor-2.4.8.jar
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

CSS_MINIFIED = $(CSS_FILES:%=$(TARGET)/%)
JS_MINIFIED = $(JS_FILES:%=$(TARGET)/%)
OTHER_MINIFIED = $(OTHER_FILES:%=$(TARGET)/%)


deploy: $(TARGET) minify
	

# target: minify - Minifies CSS and JS.
minify: minify-css minify-js minify-other

# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)

# target: minify-js - Minifies JS.
minify-js: $(JS_FILES) $(JS_MINIFIED)

# target: minify-js - Minifies JS.
minify-other: $(OTHER_FILES) $(OTHER_MINIFIED)

$(TARGET)/%.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo

$(TARGET)/%.js: %.js
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

$(TARGET)/%: %
	@echo '==> Copying $<'
	cat $< >$@
	@echo


# target: clean - Removes minified CSS and JS files.
clean:
	rm -f $(CSS_MINIFIED) $(JS_MINIFIED) $(OTHER_MINIFIED)


$(TARGET):
	mkdir $(TARGET)
	
	
	