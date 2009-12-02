PRESENTATION-TARS=\
	tt/presentation/perl-dbus-presensation.tar.gz \
	tt/presentation/perl-gtk2-presensation.tar.gz

IGNORE_FOR_VALIDATION=\
	html/presentation/dynamic-static/moderny-web.html, \
	html/presentation/dynamic-static/moderny-web_files/st.html, \
	html/presentation/dynamic-static/moderny-web_files/mp00640.html, \
	html/presentation/catalyst-tricks/Monger.pod.html, \
	html/store.html ,\
	html/en/store.html ,\
	html/sitemap.xml, \

JS_FILES_TO_MINIFY=\
	src/js/01_jquery-1.2.6.js \
	src/js/02_jquery.sprintf-0.0.3.js \
	src/js/03_Gettext-0.04.js \
	src/js/04_i18n-0.04.js \
	src/js/05_thickbox-3.1.js \
	src/js/06_mongers.js \
	src/js/07_maps.js \
	src/js/08_dropShadow.js \
	src/js/08_jquery.cookies.2.1.0.js \
	src/js/09_feedback.js \
	src/js/99_google-analytics.js \

JS_i18n_FILES=\
	src/js/*thickbox-3.1.js \

CSS_FILES_TO_MINIFY=\
	src/stylesheets/01_main.css \
	src/stylesheets/02_thickbox.css \

XGETTEXT_JS=xgettext --join-existing --sort-by-file --omit-header -L C -ki18n:2c,3,4,4t -ki18n:2,3,3t -ki18n:1c,2,2t -ki18n
YUICOMPRESSOR=java -jar script/yuicompressor-2.4.2.jar

## Needed by xmllint and xsltproc in order to find our custom catalog
export XML_CATALOG_FILES=tt/dtd/catalog.xml


.PHONY: all
all: html/news.rdf html/en/news.rdf tt/events.tt2 tt/events.tt2-en tt/who.tt2 ${PRESENTATION-TARS} ${FORMS} html/js/script.js html/stylesheets/style.css html/js/jsloc-sk.js html/js/jsloc-en.js html/js/google-calendar.js
	script/ttree --dest html -f tt.cfg | grep -E '^  [+>!]' || true    # true there because grep returns exit value 1 if no line match
	script/ttree --dest html/en --define lang=en -f tt-lang.cfg | grep -E '^  [+>!]' || true    # true there because grep returns exit value 1 if no line match
	script/ttree --dest html/en --define lang=en -a -f tt-en.cfg | grep -E '^  [+>!]' || true    # true there because grep returns exit value 1 if no line match


.PHONY: clean
clean:
	rm -rf html/*.html html/review/*.html html/tutorial/*.html html/cgi/*.html \
	       ${PRESENTATION-TARS} \
	       tt/events.tt2 \
	       tt/events.tt2-en \
	       html/news.rdf \
	       html/en/news.rdf \
	       tt/who.tt2 \
	       html/en/* \
	       html/js/* \
	       html/stylesheets/style.css \

.PHONY: distclean
distclean: clean
	rm -rf html/*
	svn co https://cle.sk/repos/pub/www/pm html

html/news.rdf: etc/events.xml tt/dtd/events-1.0.dtd xslt/events-to-rdf.xslt
	xmllint --valid --noout $<
	xsltproc --stringparam lang sk --nodtdattr xslt/events-to-rdf.xslt $< > $@

html/en/news.rdf: etc/events.xml tt/dtd/events-1.0.dtd xslt/events-to-rdf.xslt
	xmllint --valid --noout $<
	xsltproc --stringparam lang en --nodtdattr xslt/events-to-rdf.xslt $< > $@


tt/presentation/perl-dbus-presensation.tar.gz: tt/presentation/dbus/*
	tar -zcf $@ -C tt/presentation/ dbus --exclude=.svn


tt/presentation/perl-gtk2-presensation.tar.gz: tt/presentation/gtk2/*
	tar -zcf $@ -C tt/presentation/ gtk2 --exclude=.svn

tt/events.tt2: etc/events.xml xslt/events-to-html.xslt tt/dtd/events-1.0.dtd
	xmllint --valid --noout $<
	xsltproc --stringparam lang sk --nodtdattr xslt/events-to-html.xslt $< > $@

tt/events.tt2-en: etc/events.xml xslt/events-to-html.xslt tt/dtd/events-1.0.dtd
	xmllint --valid --noout $<
	xsltproc --stringparam lang en --nodtdattr xslt/events-to-html.xslt $< > $@

tt/who.tt2: etc/who.xml xslt/who-to-html.xslt
	xmllint --valid --noout $<
	xsltproc --nodtdattr xslt/who-to-html.xslt $< > $@

src/js/06_mongers.js: etc/who.xml xslt/who-to-js.xslt
	xmllint --valid --noout $<
	xsltproc --nodtdattr xslt/who-to-js.xslt $< > $@

html/js/jsloc-sk.js: po/jsloc-sk.po
	echo -n 'var locale_data =' `script/po2json $<` | ${YUICOMPRESSOR} --type js --charset UTF-8 -o $@

html/js/jsloc-en.js: po/jsloc-en.po
	echo -n 'var locale_data =' `script/po2json $<` | ${YUICOMPRESSOR} --type js --charset UTF-8 -o $@

po/jsloc-sk.po: ${JS_i18n_FILES}
	${XGETTEXT_JS} --output $@ $<

po/jsloc-en.po: ${JS_i18n_FILES}
	${XGETTEXT_JS} --output $@ $<

html/js/script.js: ${JS_FILES_TO_MINIFY}
	cat ${JS_FILES_TO_MINIFY} | ${YUICOMPRESSOR} --type js --charset UTF-8 -o $@.tmp
	mv $@.tmp $@

html/js/google-calendar.js: src/js-standalone/google-calendar.js
	cp $< $@

html/stylesheets/style.css: ${CSS_FILES_TO_MINIFY}
	cat ${CSS_FILES_TO_MINIFY} | ${YUICOMPRESSOR} --type css --charset UTF-8 -o $@

.PHONY: html/sitemap.xml
html/sitemap.xml:
	script/gen-sitemap

.PHONY: test
test:
	script/vxml --ignore "${IGNORE_FOR_VALIDATION}" html
