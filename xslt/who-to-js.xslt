<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:ba="http://bratislava.pm.org/dtd/who-1.2.dtd"
>

<xsl:output 
	method="text"
	indent="yes"
	omit-xml-declaration="yes"
/>


<xsl:template match="/ba:who">

if (typeof(GLatLng) != 'undefined') {
	
var MONGERS = {

	<xsl:for-each select="ba:monger">
	
		<xsl:if test="ba:geo">
			"<xsl:value-of select="ba:id"/>": {
				id:   "<xsl:value-of select="ba:id"/>",
				name: "<xsl:value-of select="ba:name"/>",
				nick: "<xsl:value-of select="ba:nick"/>",
				cpan: "<xsl:value-of select="ba:cpan"/>",
				location: new GLatLng(<xsl:value-of select="ba:geo/ba:latitude"/>, <xsl:value-of select="ba:geo/ba:longitude"/>),
				picture:
					<xsl:choose>
						<xsl:when test="ba:picture">
							"<xsl:value-of select="ba:picture"/>",
						</xsl:when>
						<xsl:otherwise>"http://search.cpan.org/s/img/who.jpg",</xsl:otherwise>
					</xsl:choose>
				marker: null,
				is_shown: false
			},
		</xsl:if>

	</xsl:for-each>
	
	fake: null
};

}

</xsl:template>

</xsl:stylesheet>
