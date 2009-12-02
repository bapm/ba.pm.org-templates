/*
Pure Javascript implementation of Uniforum message translation.
Copyright (C) 2008 Joshua I. Miller <unrtst@cpan.org>, all rights reserved

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU Library General Public License as published
by the Free Software Foundation; either version 2, or (at your option)
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Library General Public License for more details.

You should have received a copy of the GNU Library General Public
License along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307,
USA.

=head1 NAME

Javascript Gettext - Javascript implemenation of GNU Gettext API.

=head1 SYNOPSIS

 // //////////////////////////////////////////////////////////
 // Optimum caching way
 <script language="javascript" src="/path/LC_MESSAGES/myDomain.json"></script>
 <script language="javascript" src="/path/Gettext.js'></script>

 // assuming myDomain.json defines variable json_locale_data
 var params = {  "domain" : "myDomain",
                 "locale_data" : json_locale_data
              };
 var gt = new Gettext(params);
 // create a shortcut if you'd like
 function _ (msgid) { return gt.gettext(msgid); }
 alert(_("some string"));
 // or use fully named method
 alert(gt.gettext("some string"));
 // change to use a different "domain"
 gt.textdomain("anotherDomain");
 alert(gt.gettext("some string"));


 // //////////////////////////////////////////////////////////
 // The other way to load the language lookup is a "link" tag
 // Downside is that the data won't be cached
 // Upside is that it's easy to specify multiple files
 <link rel="gettext" uri="/path/LC_MESSAGES/myDomain.json" />
 <script language="javascript" src="/path/Gettext.js'></script>

 var gt = new Gettext({ "domain" : "myDomain" });
 // rest is the same


 // //////////////////////////////////////////////////////////
 // The reson the shortcuts aren't exported by default is because they'd be
 // glued to the single domain you created. So, if you're adding i18n support
 // to some js library, you should use it as so:

 if (typeof(MyNamespace) == 'undefined') MyNamespace = {};
 MyNamespace.MyClass = function () {
     var gtParms = { "domain" : 'MyNamespace_MyClass' };
     this.gt = new Gettext(gtParams);
     return this;
 };
 MyNamespace.MyClass.prototype._ = function (msgid) {
     return this.gt.gettext(msgid);
 };
 MyNamespace.MyClass.prototype.something = function () {
     var myString = this._("this will get translated");
 };

 // //////////////////////////////////////////////////////////
 // Adding the shortcuts to a global scope is easier. If that's
 // ok in your app, this is certainly easier.
 var myGettext = new Gettext({ 'domain' : 'myDomain' });
 function _ (msgid) {
     return myGettext.gettext(msgid);
 }
 alert( _("text") );

 // //////////////////////////////////////////////////////////
 // Data structure of the json data
 // NOTE: if you're loading via the <script> tag, you can only
 // load one file, but it can contain multiple domains.
 var json_locale_data = {
     "MyDomain" : {
         "" : {
             "header_key" : "header value",
             "header_key" : "header value",
         "msgid" : [ "msgid_plural", "msgstr", "msgstr_plural", "msgstr_pluralN" ],
         "msgctxt\004msgid" : [ "", "msgstr" ],
         },
     "AnotherDomain" : {
         },
     }

=head1 DESCRIPTION

This is a javascript implementation of GNU Gettext, providing internationalization support for javascript. It differs from existing javascript implementations in that it will support all current Gettext features (ex. plural and context support), and will also support loading language catalogs from .mo, .po, or preprocessed json files (converter included).

The locale initialization differs from that of GNU Gettext / POSIX. Rather than setting the category, domain, and paths, and letting the libs find the right file, you must explicitly load the file at some point. The "domain" will still be honored. Future versions may be expanded to include support for set_locale like features.


=head1 INSTALL

To install this module, simply copy the file lib/Gettext.js to a web accessable location, and reference it from your application.


=head1 CONFIGURATION

Configure in one of two ways:

=over

=item 1. Optimal. Load language definition from statically defined json data.

    <script language="javascript" src="/path/locale/domain.json"></script>

    // in domain.json
    json_locale_data = {
        "mydomain" : {
            // po header fields
            "" : {
                "plural-forms" : "...",
                "lang" : "en",
                },
            // all the msgid strings and translations
            "msgid" : [ "msgid_plural", "translation", "plural_translation" ],
        },
    };
    // please see the included po2json script for the details on this format

This method also allows you to use unsupported file formats, so long as you can parse them into the above format.

=item 2. Use AJAX to load language file.

Use XMLHttpRequest (actually, SJAX - syncronous) to load an external resource.

Supported external formats are:

=over

=item * Javascript Object Notation (.json)

(see po2json)

    type=application/json

=item * Machine Object (compiled .po) (.mo)

(see GNU Gettext's msgfmt)

    type=application/x-mo

=item * Uniforum Portable Object (.po)

(see GNU Gettext's xgettext)

    type=application/x-po

=back

=back

=head1 METHODS

The following methods are implemented:

    new Gettext(args)
    textdomain
    gettext
    dgettext
    dcgettext
    ngettext
    dngettext
    dcngettext
    pgettext
    dpgettext
    dcpgettext
    npgettext
    dnpgettext
    dcnpgettext


=head2 new Gettext (args)

Several methods of loading locale data are included. You may specify a plugin or alternative method of loading data by passing the data in as the "locale_data" option. For example:

    var get_locale_data = function () {
        // plugin does whatever to populate locale_data
        return locale_data;
    };
    var gt = new Gettext( 'domain' : 'messages',
                          'locale_data' : get_locale_data() );

The above can also be used if locale data is specified in a statically included <SCRIPT> tag. Just specify the variable name in the call to new. Ex:

    var gt = new Gettext( 'domain' : 'messages',
                          'locale_data' : json_locale_data_variable );

Finally, you may load the locale data by referencing it in a <LINK> tag. Simply exclude the 'locale_data' option, and all <LINK rel="gettext" ...> items will be tried. The <LINK> should be specified as:

    <link rel="gettext" type="application/json" url="/path/to/file.json">
    <link rel="gettext" type="text/javascript"  url="/path/to/file.json">
    <link rel="gettext" type="application/x-po" url="/path/to/file.po">
    <link rel="gettext" type="application/x-mo" url="/path/to/file.mo">

args:

=over

=item domain

The Gettext domain, not www.whatev.com. It's usually your applications basename. If the .po file was "myapp.po", this would be "myapp".

=item locale_data

Raw locale data (in json structure). If specified, from_link data will be ignored.

=back

=cut

*/

Gettext = function (args) {
    this.domain         = 'messages';
    // locale_data will be populated from <link...> if not specified in args
    this.locale_data    = undefined;

    // set options
    var options = [ "domain", "locale_data" ];
    if (typeof(args) == "object") {
        for (var i in args) {
            for (var j=0; j<options.length; j++) {
                if (i == options[j]) {
                    this[i] = args[i];
                }
            }
        }
    }


    // try to load the lang file from somewhere
    this.try_load_lang();

    return this;
}

Gettext.context_glue = "\004";
Gettext._locale_data = {};

Gettext.prototype.try_load_lang = function() {
    // check to see if language is statically included
    if (typeof(this.locale_data) != 'undefined') {
        // we're going to reformat it, and overwrite the variable
        var locale_copy = this.locale_data;
        this.locale_data = undefined;
        this.parse_locale_data(locale_copy);

        if (typeof(Gettext._locale_data[this.domain]) == 'undefined') {
            throw new Error("Error: Gettext 'locale_data' does not contain the domain '"+this.domain+"'");
        }
    }


    // try loading from JSON
    // get lang links
    var lang_link = this.get_lang_refs();

    if (typeof(lang_link) == 'object' && lang_link.length > 0) {
        // NOTE: there will be a delay here, as this is async.
        // So, any i18n calls made right after page load may not
        // get translated.
        // XXX: we may want to see if we can "fix" this behavior
        for (var i=0; i<lang_link.length; i++) {
            var link = lang_link[i];
            if (link.type == 'application/json') {
                if (! this.try_load_lang_json(link.href) ) {
                    throw new Error("Error: Gettext 'try_load_lang_json' failed. Unable to exec xmlhttprequest for link ["+link.href+"]");
                }
            } else if (link.type == 'application/x-po') {
                if (! this.try_load_lang_po(link.href) ) {
                    throw new Error("Error: Gettext 'try_load_lang_po' failed. Unable to exec xmlhttprequest for link ["+link.href+"]");
                }
            } else {
                // TODO: implement the other types (mo)
                throw new Error("TODO: link type ["+link.type+"] found, and support is planned, but not implemented at this time.");
            }
        }
    }
};

// This takes the po2json'd data, and moves it into an internal form
// for use in our lib, and puts it in our object as:
//  Gettext._locale_data = {
//      domain : {
//          head : { headfield : headvalue },
//          msgs : {
//              msgid : [ msgid_plural, msgstr, msgstr_plural ],
//          },
Gettext.prototype.parse_locale_data = function(locale_data) {
    if (typeof(Gettext._locale_data) == 'undefined') {
        Gettext._locale_data = { };
    }

    // suck in every domain defined in the supplied data
    for (var domain in locale_data) {
        // skip empty specs
        if (typeof(locale_data[domain]) == 'undefined') continue;
        // skip if it has no msgid's
        var has_msgids = false;
        for (var msgid in locale_data[domain]) {
            has_msgids = true;
            break;
        }
        if (! has_msgids) continue;

        // grab shortcut to data
        var data = locale_data[domain];

        // if they specifcy a blank domain, default to "messages"
        if (domain == "") domain = "messages";
        // init the data structure
        if (typeof(Gettext._locale_data[domain]) == 'undefined') {
            Gettext._locale_data[domain] = { };
        }
        if (typeof(Gettext._locale_data[domain].head) == 'undefined')
            Gettext._locale_data[domain].head = { };
        if (typeof(Gettext._locale_data[domain].msgs) == 'undefined')
            Gettext._locale_data[domain].msgs = { };

        for (var key in data) {
            if (key == "") {
                var header = data[key];
                for (var head in header) {
                    var h = head.toLowerCase();
                    Gettext._locale_data[domain].head[h] = header[head];
                }
            } else {
                Gettext._locale_data[domain].msgs[key] = data[key];
            }
        }
    }

    // build the plural forms function
    for (var domain in Gettext._locale_data) {
        if (typeof(Gettext._locale_data[domain].head['plural-forms']) != 'undefined' &&
            typeof(Gettext._locale_data[domain].head.plural_func) == 'undefined') {
            // untaint data
            var plural_forms = Gettext._locale_data[domain].head['plural-forms'];
            var pf_re = new RegExp('^(\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;a-zA-Z0-9_\(\)])+)', 'm');
            if (pf_re.test(plural_forms)) {
                //ex english: "Plural-Forms: nplurals=2; plural=(n != 1);\n"
                //pf = "nplurals=2; plural=(n != 1);";
                //ex russian: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10< =4 && (n%100<10 or n%100>=20) ? 1 : 2)
                //pf = "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)";

                var pf = Gettext._locale_data[domain].head['plural-forms'];
                if (! /;\s*$/.test(pf)) pf = pf.concat(';');
                /* We used to use eval, but it seems IE has issues with it.
                 * We now use "new Function", though it carries a slightly
                 * bigger performance hit.
                var code = 'function (n) { var plural; var nplurals; '+pf+' return { "nplural" : nplurals, "plural" : (plural === true ? 1 : plural ? plural : 0) }; };';
                Gettext._locale_data[domain].head.plural_func = eval("("+code+")");
                */
                var code = 'var plural; var nplurals; '+pf+' return { "nplural" : nplurals, "plural" : (plural === true ? 1 : plural ? plural : 0) };';
                Gettext._locale_data[domain].head.plural_func = new Function("n", code);
            } else {
                throw new Error("Syntax error in language file. Plural-Forms header is invalid ["+plural_forms+"]");
            }   

        // default to english plural form
        } else if (typeof(Gettext._locale_data[domain].head.plural_func) == 'undefined') {
            Gettext._locale_data[domain].head.plural_func = function (n) {
                var p = (n != 1) ? 1 : 0;
                return { 'nplural' : 2, 'plural' : p };
                };
        } // else, plural_func already created
    }

    return;
};


// try_load_lang_po : do an ajaxy call to load in the .po lang defs
Gettext.prototype.try_load_lang_po = function(uri) {
    var data = this.sjax(uri);
    if (! data) return;

    var domain = this.uri_basename(uri);
    var parsed = this.parse_po(data);

    var rv = {};
    // munge domain into/outof header
    if (parsed) {
        if (! parsed[""]) parsed[""] = {};
        if (! parsed[""]["domain"]) parsed[""]["domain"] = domain;
        domain = parsed[""]["domain"];
        rv[domain] = parsed;

        this.parse_locale_data(rv);
    }

    return 1;
};

Gettext.prototype.uri_basename = function(uri) {
    var rv;
    if (rv = uri.match(/^(.*\/)?(.*)/)) {
        var ext_strip;
        if (ext_strip = rv[2].match(/^(.*)\..+$/))
            return ext_strip[1];
        else
            return rv[2];
    } else {
        return "";
    }
};

Gettext.prototype.parse_po = function(data) {
    var rv = {};
    var buffer = {};
    var lastbuffer = "";
    var errors = [];
    var lines = data.split("\n");
    for (var i=0; i<lines.length; i++) {
        // chomp
        lines[i] = lines[i].replace(/(\n|\r)+$/, '');

        var match;

        // Empty line / End of an entry.
        if (/^$/.test(lines[i])) {
            if (typeof(buffer['msgid']) != 'undefined') {
                var msg_ctxt_id = (typeof(buffer['msgctxt']) != 'undefined' && buffer['msgctxt'].length) ? buffer['msgctxt']+Gettext.context_glue+buffer['msgid'] : buffer['msgid'];
                var msgid_plural = (typeof(buffer['msgid_plural']) != 'undefined' && buffer['msgid_plural'].length) ? buffer['msgid_plural'] : undefined;

                // find msgstr_* translations and push them on
                var trans = [];
                for (var str in buffer) {
                    var match;
                    if (match = str.match(/^msgstr_(\d+)/))
                        trans[parseInt(match[1])] = buffer[str];
                }
                trans.unshift(msgid_plural);

                // only add it if we've got a translation
                // NOTE: this doesn't conform to msgfmt specs
                if (trans.length) rv[msg_ctxt_id] = trans;

                buffer = {};
                lastbuffer = "";
            }

        // comments
        } else if (/^#/.test(lines[i])) {
            continue;

        // msgctxt
        } else if (match = lines[i].match(/^msgctxt\s+(.*)/)) {
            lastbuffer = 'msgctxt';
            buffer[lastbuffer] = this.parse_po_dequote(match[1]);

        // msgid
        } else if (match = lines[i].match(/^msgid\s+(.*)/)) {
            lastbuffer = 'msgid';
            buffer[lastbuffer] = this.parse_po_dequote(match[1]);

        // msgid_plural
        } else if (match = lines[i].match(/^msgid_plural\s+(.*)/)) {
            lastbuffer = 'msgid_plural';
            buffer[lastbuffer] = this.parse_po_dequote(match[1]);

        // msgstr
        } else if (match = lines[i].match(/^msgstr\s+(.*)/)) {
            lastbuffer = 'msgstr_0';
            buffer[lastbuffer] = this.parse_po_dequote(match[1]);

        // msgstr[0] (treak like msgstr)
        } else if (match = lines[i].match(/^msgstr\[0\]\s+(.*)/)) {
            lastbuffer = 'msgstr_0';
            buffer[lastbuffer] = this.parse_po_dequote(match[1]);

        // msgstr[n]
        } else if (match = lines[i].match(/^msgstr\[(\d+)\]\s+(.*)/)) {
            lastbuffer = 'msgstr_'+match[1];
            buffer[lastbuffer] = this.parse_po_dequote(match[2]);

        // continued string
        } else if (/^"/.test(lines[i])) {
            buffer[lastbuffer] += this.parse_po_dequote(lines[i]);

        // something strange
        } else {
            errors.push("Strange line ["+i+"] : "+lines[i]);
        }
    }


    if (buffer['msgid'] && buffer['msgid'].length) {
        var msg_ctxt_id = (typeof(buffer['msgctxt']) != 'undefined' && buffer['msgctxt'].length) ? buffer['msgctxt']+Gettext.context_glue+buffer['msgid'] : buffer['msgid'];
        var msgid_plural = (typeof(buffer['msgid_plural']) != 'undefined' && buffer['msgid_plural'].length) ? buffer['msgid_plural'] : undefined;

        // find msgstr_* translations and push them on
        var trans = [];
        for (var str in buffer) {
            var match;
            if (match = str.match(/^msgstr_(\d+)/))
                trans[parseInt(match[1])] = buffer[str];
        }
        trans.unshift(msgid_plural);

        // only add it if we've got a translation
        // NOTE: this doesn't conform to msgfmt specs
        if (trans.length) rv[msg_ctxt_id] = trans;

        buffer = {};
        lastbuffer = "";
    }


    // parse out the header
    if (rv[""] && rv[""][1]) {
        var cur = {};
        var hlines = rv[""][1].split(/\\n/);
        for (var i=0; i<hlines.length; i++) {
            if (! hlines.length) continue;

            var pos = hlines[i].indexOf(':', 0);
            if (pos != -1) {
                var key = hlines[i].substring(0, pos);
                var val = hlines[i].substring(pos +1);
                var keylow = key.toLowerCase();

                if (cur[keylow] && cur[keylow].length) {
                    errors.push("SKIPPING DUPLICATE HEADER LINE: "+hlines[i]);
                } else if (/#-#-#-#-#/.test(keylow)) {
                    errors.push("SKIPPING ERROR MARKER IN HEADER: "+hlines[i]);
                } else {
                    // remove begining spaces if any
                    val = val.replace(/^\s+/, '');
                    cur[keylow] = val;
                }

            } else {
                errors.push("PROBLEM LINE IN HEADER: "+hlines[i]);
                cur[hlines[i]] = '';
            }
        }

        // replace header string with assoc array
        rv[""] = cur;
    } else {
        rv[""] = {};
    }

    return rv;
};


Gettext.prototype.parse_po_dequote = function(str) {
    var match;
    if (match = str.match(/^"(.*)"/)) {
        str = match[1];
    }
    str = str.replace(/\\"/, "");
    return str;
};


// try_load_lang_json : do an ajaxy call to load in the lang defs
Gettext.prototype.try_load_lang_json = function(uri) {
    var data = this.sjax(uri);
    if (! data) return;

    var rv = this.JSON(data);
    this.parse_locale_data(rv);

    return 1;
};

// this finds all <link> tags, filters out ones that match our
// specs, and returns a list of hashes of those
Gettext.prototype.get_lang_refs = function() {
    var langs = new Array();
    var links = document.getElementsByTagName("link");
    // find all <link> tags in dom; filter ours
    for (var i=0; i<links.length; i++) {
        if (links[i].rel == 'gettext' && links[i].href) {
            if (typeof(links[i].type) == 'undefined' ||
                links[i].type == '') {
                if (/\.json$/i.test(links[i].href)) {
                    links[i].type = 'application/json';
                } else if (/\.js$/i.test(links[i].href)) {
                    links[i].type = 'application/json';
                } else if (/\.po$/i.test(links[i].href)) {
                    links[i].type = 'application/x-po';
                } else if (/\.mo$/i.test(links[i].href)) {
                    links[i].type = 'application/x-mo';
                } else {
                    throw new Error("LINK tag with rel=gettext found, but the type and extension are unrecognized.");
                }
            }

            links[i].type = links[i].type.toLowerCase();
            if (links[i].type == 'application/json') {
                links[i].type = 'application/json';
            } else if (links[i].type == 'text/javascript') {
                links[i].type = 'application/json';
            } else if (links[i].type == 'application/x-po') {
                links[i].type = 'application/x-po';
            } else if (links[i].type == 'application/x-mo') {
                links[i].type = 'application/x-mo';
            } else {
                throw new Error("LINK tag with rel=gettext found, but the type attribute ["+links[i].type+"] is unrecognized.");
            }

            langs.push(links[i]);
        }
    }
    return langs;
};


/*

=head2 textdomain( domain )

Set domain for future gettext() calls

A  message  domain  is  a  set of translatable msgid messages. Usually,
every software package has its own message domain. The domain  name  is
used to determine the message catalog where a translation is looked up;
it must be a non-empty string.

The current message domain is used by the gettext, ngettext, pgettext,
npgettext functions, and by the dgettext, dcgettext, dngettext, dcngettext,
dpgettext, dcpgettext, dnpgettext and dcnpgettext functions when called
with a NULL domainname argument.

If domainname is not NULL, the current message domain is set to domain‐
name.

If domainname is undefined, null, or empty string, the function returns
the current message domain.

If  successful,  the  textdomain  function  returns the current message
domain, after possibly changing it. (ie. if you set a new domain, the 
value returned will NOT be the previous domain).

=cut

*/
Gettext.prototype.textdomain = function (domain) {
    if (domain && domain.length) this.domain = domain;
    return this.domain;
}

// gettext
Gettext.prototype.gettext = function (msgid) {
    var msgctxt;
    var msgid_plural;
    var n;
    var category;
    return this.dcnpgettext(undefined, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dgettext = function (domain, msgid) {
    var msgctxt;
    var msgid_plural;
    var n;
    var category;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dcgettext = function (domain, msgid, category) {
    var msgctxt;
    var msgid_plural;
    var n;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

// ngettext
Gettext.prototype.ngettext = function (msgid, msgid_plural, n) {
    var msgctxt;
    var category;
    return this.dcnpgettext(undefined, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dngettext = function (domain, msgid, msgid_plural, n) {
    var msgctxt;
    var category;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dcngettext = function (domain, msgid, msgid_plural, n, category) {
    var msgctxt;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category, category);
};

// pgettext
Gettext.prototype.pgettext = function (msgctxt, msgid) {
    var msgid_plural;
    var n;
    var category;
    return this.dcnpgettext(undefined, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dpgettext = function (domain, msgctxt, msgid) {
    var msgid_plural;
    var n;
    var category;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dcpgettext = function (domain, msgctxt, msgid, category) {
    var msgid_plural;
    var n;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

// npgettext
Gettext.prototype.npgettext = function (msgctxt, msgid, msgid_plural, n) {
    var category;
    return this.dcnpgettext(undefined, msgctxt, msgid, msgid_plural, n, category);
};

Gettext.prototype.dnpgettext = function (domain, msgctxt, msgid, msgid_plural, n) {
    var category;
    return this.dcnpgettext(domain, msgctxt, msgid, msgid_plural, n, category);
};

// this has all the options, so we use it for all of them.
Gettext.prototype.dcnpgettext = function (domain, msgctxt, msgid, msgid_plural, n, category) {
    if (typeof(msgid) == 'undefined') return '';

    var plural = (typeof(msgid_plural) == 'undefined') ? false : true;
    var msg_ctxt_id = (typeof(msgctxt) == 'undefined') ? msgid :
                                msgctxt+Gettext.context_glue+msgid;

    var domainname = (typeof(domain) != 'undefined')      ? domain :
                     (typeof(this.domain) != 'undefined') ? this.domain :
                                                            'messages';

    // category is always LC_MESSAGES. We ignore all else
    var category_name = 'LC_MESSAGES';
    var category = 5;

    var locale_data = new Array();
    if (typeof(Gettext._locale_data) != 'undefined' &&
        typeof(Gettext._locale_data[domainname]) != 'undefined') {
        locale_data.push( Gettext._locale_data[domainname] );

    } else {
        // didn't find domain we're looking for. Search all of them.
        for (var dom in Gettext._locale_data) {
            locale_data.push( Gettext._locale_data[dom] );
        }
    }

    var trans = [];
    var found = false;
    var domain_used; // so we can find plural-forms if needed
    if (locale_data.length) {
        for (var i=0; i<locale_data.length; i++) {
            var locale = locale_data[i];
            if (typeof(locale.msgs[msg_ctxt_id]) != 'undefined') {
                // make copy of that array (cause we'll be destructive)
                for (var j=0; j<locale.msgs[msg_ctxt_id].length; j++) {
                    trans[j] = locale.msgs[msg_ctxt_id][j];
                }
                trans.shift(); // throw away the msgid_plural
                domain_used = locale;
                found = true;
                break;
            }
        }
    }

    // default to english if we lack a match
    if (! trans.length) {
        trans = [ msgid, msgid_plural ];
    }

    var translation = trans[0];
    if (plural) {
        var p;
        if (found) {
            var rv = domain_used.head.plural_func(n);
            if (! rv.plural) rv.plural = 0;
            if (! rv.nplural) rv.nplural = 0;
            // if plurals returned is out of bound for total plural forms
            if (rv.nplural <= rv.plural) rv.plural = 0;
            p = rv.plural;
        } else {
            p = (n != 1) ? 1 : 0;
        }
        if (typeof(trans[p]) != 'undefined')
            translation = trans[p];
    }

    return translation;
};


/* verify that something is an array */
Gettext.prototype.isArray = function (thisObject) {
    return this.isValidObject(thisObject) && thisObject.constructor == Array;
};

Gettext.prototype.sjax = function (uri) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (navigator.userAgent.toLowerCase().indexOf('msie 5') != -1) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }

    if (! xmlhttp)
        throw new Error("Your browser doesn't do Ajax. Unable to support external language files.");

    xmlhttp.open('GET', uri, false);
    try { xmlhttp.send(null); }
    catch (e) { return; }

    // we consider status 200 and 0 as ok.
    // 0 happens when we request local file, allowing this to run on local files
    var sjax_status = xmlhttp.status;
    if (sjax_status == 200 || sjax_status == 0) {
        return xmlhttp.responseText;
    } else {
        var error = xmlhttp.statusText + " (Error " + xmlhttp.status + ")";
        if (xmlhttp.responseText.length) {
            error += "\n" + xmlhttp.responseText;
        }
        alert(error);
        return;
    }
}

Gettext.prototype.JSON = function (data) {
    return eval('(' + data + ')');
}


/*

=head1 NOTES

These are some notes on the internals

=over

=item LOCALE CACHING

Loaded locale data is currently cached class-wide. This means that if two scripts are both using Gettext.js, and both share the same gettext domain, that domain will only be loaded once. This will allow you to grab a new object many times from different places, utilize the same domain, and share a single translation file. The downside is that a domain won't be RE-loaded if a new object is instantiated on a domain that had already been instantiated.

=back

=head1 BUGS / TODO

=over

=item error handling

Currently, there are several places that throw errors. In GNU Gettext, there are no fatal errors, which allows text to still be displayed regardless of how broken the environment becomes. We should evaluate and determine where we want to stand on that issue.

=item syncronous only support (no ajax support)

Currently, fetching language data is done purely syncronous, which means the page will halt while those files are fetched/loaded.

This is often what you want, as then following translation requests will actually be translated. However, if all your calls are done dynamically (ie. error handling only or something), loading in the background may be more adventagous.

It's still recommended to use the statically defined <script ...> method, which should have the same delay, but it will cache the result.

=item domain support

domain support. We need to figure out how we're going to handle that across the board.

In CCMS, with the i18n calls, they currently do nothing to distinguish between domains. For that, saying "hey, it's all 'ccms'" may be ok (though zoneinfo would be nice to separate out).

In javascript, we run into a problem, because the namespace is essentially global. If we create a new i18n object, and use that, then that'd be ok... but that means a different calling convention than everthing else. The problem really lies with making the shortcuts ( _("str") or i18n("str") ).

Maybe we can force our apps to do:
    this.i18n("str")

In our i18n wrapper lib, we could do the API like this:

    // in some other .js file that needs i18n
    this.i18nObj = new i18n;
    this.i18n = this.i18nObj.init('domain');

This really goes back to the crazy setup stuff that happens in all of these, and I'm basically trying to reinvent the wheel so it fits in javascript.


=item encoding

May want to add encoding/reencoding stuff.

=back


=head1 COMPATABILITY

This has been tested on the following browsers. It may work on others, but these are all those to which I have access.

    FF1.5, FF2, FF3, IE6, IE7, Opera9, Opera10, Safari3.1, Chrome

    *FF = Firefox
    *IE = Internet Explorer


=head1 REQUIRES

po2json requires perl, and the perl modules Locale::PO and JSON.

=head1 SEE ALSO

Locale::gettext_pp(3pm), POSIX(3pm), gettext(1), gettext(3),
examples/normal/index.html,
examples/wrapper/i18n.html, examples/wrapper/i18n.js,
L<http://jsgettext.berlios.de/>

=head1 AUTHOR

Copyright (C) 2008, Joshua I. Miller E<lt>unrtst@cpan.orgE<gt>, all rights reserved. See the source code for details.

=cut

*/

