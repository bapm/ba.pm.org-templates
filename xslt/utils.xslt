<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>

<!-- Used to copy the elements without namespace -->
<xsl:template mode="copy-without-namespaces" match="*">
	<xsl:element name="{local-name()}">
		
		<xsl:copy-of select="@*"/>
		<xsl:apply-templates mode="copy-without-namespaces"/>

	</xsl:element>
</xsl:template>


<!-- Add some spacing with a comment, ideal for new sections -->
<xsl:template name="comment-header">

	<xsl:param name="comment" />

	<!-- A few empty lines -->
	<xsl:text>&#10;&#10;</xsl:text>

	<!-- A nice HTML comment -->
	<xsl:comment>
		<xsl:value-of select="concat(' ', $comment, ' ')"/>
	</xsl:comment>

	<!-- One extra line -->
	<xsl:text>&#10;</xsl:text>
</xsl:template>


</xsl:stylesheet>
