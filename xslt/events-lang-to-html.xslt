<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:ba="http://bratislava.pm.org/dtd/events-1.1.dtd"
	
	xmlns:exsl="http://exslt.org/common"

	exclude-result-prefixes="ba html"
	extension-element-prefixes="exsl"
>

<xsl:output 
	method="html"
	indent="yes"
	omit-xml-declaration="yes"
/>


<!-- Import our nice utilities -->
<xsl:include href="utils.xslt"/>

<!-- Override this value from the command line. -->
<xsl:param name="LANG" value="'sk'"/>



<xsl:template match="/ba:events">

	<div>
		<xsl:apply-templates select="ba:event">
			<xsl:sort select="ba:date" order="descending"/>
		</xsl:apply-templates>
	</div>

</xsl:template>



<xsl:template match="ba:event">
	
	<!-- Find the proper title from the list of translations. -->
	<xsl:variable name="title">
		<xsl:call-template name="get-i18n">
			<xsl:with-param name="node" select="ba:title"/>
		</xsl:call-template>
	</xsl:variable>
<xsl:message>title is of type <xsl:copy-of select="exsl:object-type($title)"/></xsl:message>
<xsl:message>title is <xsl:copy-of select="$title"/></xsl:message>
	
	<!-- Add some spacing between the events -->
	<xsl:call-template name="comment-header">
		<xsl:with-param name="comment" select="$title"/>
	</xsl:call-template>

	
	<xsl:if test="string-length(ba:id)">
		<a name="{ba:id}">
			<!-- Hack, with this we get <a name=""></a> intead of <a name=""/> -->
			<xsl:comment/>
		</a>
	</xsl:if>


	<h1><xsl:value-of select="$title"/></h1>
<!--		<xsl:value-of select="ba:title/ba:i18n[lang($LANG)] | ba:title"/>   -->

	<!-- Find the proper title from the list of translations. -->
	<xsl:variable name="description">
		<xsl:call-template name="get-i18n">
			<xsl:with-param name="node" select="ba:description"/>
		</xsl:call-template>
	</xsl:variable>

<xsl:comment> FIRST </xsl:comment>
  <xsl:apply-templates mode="copy-without-namespaces" select="exsl:node-set($description)"/>

<!--
<xsl:comment> SECOND </xsl:comment>
  <xsl:apply-templates mode="copy-without-namespaces" select="ba:description/html:*"/>
<xsl:comment> END </xsl:comment>
-->

</xsl:template>



<!--
	Returns a translated value from the list of translations available in the 
	given node. This template assumes that the language is set in the global
	variable $LANG.
	
	Each node is expected to be in the format:
	<ba:node>
		<ba:i18n xml:lang="sk">Slovencina</ba:i18n>
		<ba:i18n xml:lang="en">English</ba:i18n>
		<ba:i18n>Default</ba:i18n> // used if no language matches
	</ba:node>
	
	or
	
	<ba:node>Default</ba:node> // always displayed
	
-->
<xsl:template name="get-i18n">

	<!-- The node to inspect -->
	<xsl:param name="node" />


	<xsl:choose>
		<xsl:when test="$node/ba:i18n[lang($LANG)]">
			<xsl:message>Got an i18n title with language [<xsl:value-of select="$LANG"/>] -- <xsl:value-of select="$node/ba:i18n[lang($LANG)]"/></xsl:message>
			<xsl:copy-of select="$node/ba:i18n[lang($LANG)]/child::node()"/>
		</xsl:when>

		<!-- Default language, if none matches -->
		<xsl:when test="$node/ba:i18n[not(@xml:lang)]">
			<xsl:message>Got a default i18n title without language</xsl:message>
			<xsl:copy-of select="$node/ba:i18n[not(@xml:lang)]/child::node()"/>
		</xsl:when>

		<!-- No i18n, but field has a language -->
		<xsl:when test="$node[not(ba:i18n)] and $node[lang($LANG)]">
			<xsl:message>Got a title with language</xsl:message>
			<xsl:copy-of select="$node/child::node()"/>
		</xsl:when>
		
		<!-- No language, copy the node as it is -->
		<xsl:otherwise>
			<xsl:message>Got a plain title (no i18n, no language) -- <xsl:value-of select="$node"/></xsl:message>
			<xsl:copy-of select="$node/child::node()"/>
		</xsl:otherwise>
	</xsl:choose>

</xsl:template>


</xsl:stylesheet>
