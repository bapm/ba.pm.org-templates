<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:ba="http://bratislava.pm.org/dtd/events-1.1.dtd"
	
	exclude-result-prefixes="ba html"
>

<xsl:output 
	method="xml"
	indent="yes"
	omit-xml-declaration="yes"
/>

<xsl:param name="lang"/>

<xsl:preserve-space elements="description"/>

<!-- Import our nice utilities -->
<xsl:include href="utils.xslt"/>



<xsl:template match="/ba:events">

	[%
	META title       = "Events";
	META description = "Past and future Bratislava Perl Monger group events";
	META keywords    = "Perl, Bratislava, events";
	%]

	<script src="[% content_root %]js/google-calendar.js" type="text/javascript">&#160;</script>

	<div>
		<xsl:apply-templates select="ba:event">
			<xsl:sort select="ba:date" order="descending"/>
		</xsl:apply-templates>
	</div>

</xsl:template>



<xsl:template match="ba:event">
	
	<!-- Add some spacing between the events -->
	<xsl:call-template name="comment-header">
		<xsl:with-param name="comment" select="ba:title"/>
	</xsl:call-template>

	
	<xsl:if test="string-length(ba:id)">
		<a name="{ba:id}">
			<!-- Hack, with this we get <a name=""></a> intead of <a name=""/> -->
			<xsl:comment/>
		</a>
	</xsl:if>


	<h1><xsl:value-of select="ba:title[not(@lang) or @lang = $lang]"/></h1>

  <xsl:apply-templates mode="copy-without-namespaces" select="ba:description[not(@lang) or @lang = $lang]/html:*"/>

</xsl:template>

</xsl:stylesheet>
