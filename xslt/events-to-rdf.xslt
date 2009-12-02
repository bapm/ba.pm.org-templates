<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:date="http://exslt.org/dates-and-times"

	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns="http://purl.org/rss/1.0/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:syn="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:admin="http://webns.net/mvcb/"
	xmlns:html="http://www.w3.org/1999/xhtml"

	xmlns:ba="http://bratislava.pm.org/dtd/events-1.1.dtd"
	
	extension-element-prefixes="date"
	exclude-result-prefixes="ba"
>

<xsl:output 
	method="xml"
	version="1.0"
	encoding="UTF-8"
	
	doctype-public="-//BRATISLAVA.PM.ORG//RDF 1.0//EN"
	doctype-system="http://bratislava.pm.org/dtd/rdf-1.0.dtd"

	cdata-section-elements="description"
	indent="yes"
/>

<xsl:param name="lang"/>

<xsl:template match="/ba:events">
	<rdf:RDF>

		<channel>
			<xsl:choose>
				<xsl:when test="$lang = 'en'">
					<xsl:attribute name="rdf:about">http://bratislava.pm.org/en/</xsl:attribute>
					<title>Bratislava Perl Mongers</title>
					<link>http://bratislava.pm.org/en/</link>
					<description>Perl fans from Bratislava</description>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="rdf:about">http://bratislava.pm.org/</xsl:attribute>
					<title>Bratislava Perl Mongers</title>
					<link>http://bratislava.pm.org/</link>
					<description>Priatelia programovacieho jazyka Perl v Bratislave</description>
				</xsl:otherwise>
			</xsl:choose>
			<dc:date>
				
				<!-- 
				  The time is in the format 2008-09-26T19:32:57+01:00 and just want the
					following format: 2008-09-26T19:32:57
				-->
				<xsl:variable name="now" select="date:date-time()"/>

				<xsl:choose>
					<xsl:when test="contains($now, '+')">
						<xsl:value-of select="substring-before($now, '+')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$now"/>
					</xsl:otherwise>
				</xsl:choose>

			</dc:date>
			<dc:subject>Perl</dc:subject>
			
			<items>
				<rdf:Seq>
					<xsl:for-each select="ba:event">
						<xsl:sort select="ba:date" order="ascending"/>
						<rdf:li rdf:resource="{ba:link}"/>
					</xsl:for-each>
				</rdf:Seq>

			</items>
		</channel>

		<xsl:apply-templates select="ba:event" />

	</rdf:RDF>
</xsl:template>


<xsl:template match="ba:event">
	
		
	<item rdf:about="{ba:link}">
		
		<title><xsl:value-of select="ba:title[not(@lang) or @lang = $lang]"/></title>
		<link><xsl:value-of select="ba:link"/></link>

		<description>
			<xsl:apply-templates mode="escape-xml" select="ba:description[not(@lang) or @lang = $lang]/html:*"/>
		</description>

		<dc:creator><xsl:value-of select="ba:creator"/></dc:creator>
		<dc:date><xsl:value-of select="ba:date"/></dc:date>
		<dc:subject><xsl:value-of select="ba:subject"/></dc:subject>

	</item>
</xsl:template>


<!--
Hack provided by pepl.

This will ensure that all the HTML is encoded with entities. This is because an
RSS feed can include HTML but only if it's encoded with entities.

NOTE: Whitespace here is important! In order to control it, the best is to
      render all output through <xsl:text> and other <xsl:*> tags.

-->	
<xsl:template mode="escape-xml" match="*">

	<xsl:variable name="quote">"</xsl:variable>

	<!-- Element start -->
	<xsl:text>&lt;</xsl:text>

		<xsl:value-of select="name()"/>

		<!-- Element's attributes -->
		<xsl:for-each select="@*">
			<xsl:value-of select='concat(" ", name(), "=", $quote, ., $quote)'/>
		</xsl:for-each>
		
	<xsl:text>&gt;</xsl:text>

		
	<!-- Element's content -->
	<xsl:apply-templates mode="escape-xml"/>
	
	<!-- Element's end -->
	<xsl:value-of select='concat("&lt;/", name(), "&gt;")'/>

</xsl:template>

</xsl:stylesheet>
